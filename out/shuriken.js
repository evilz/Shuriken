var shuriken;
(function (shuriken) {
    var ButtonListener = (function () {
        function ButtonListener(canvas, keyboardReceiver) {
            var _this = this;
            this._buttonDownState = {};
            this._buttonPressedState = {};
            keyboardReceiver.addEventListener('keydown', function (e) {
                _this._down(e.keyCode);
            }, false);
            keyboardReceiver.addEventListener('keyup', function (e) {
                _this._up(e.keyCode);
            }, false);
            canvas.addEventListener('mousedown', function (e) {
                _this._down(_this._getMouseButton(e));
            }, false);
            canvas.addEventListener('mouseup', function (e) {
                _this._up(_this._getMouseButton(e));
            }, false);
        }
        ButtonListener.prototype.update = function () {
            for (var i in this._buttonPressedState) {
                if (this._buttonPressedState[i] === true) {
                    this._buttonPressedState[i] = false;
                }
            }
        };
        ButtonListener.prototype._down = function (buttonId) {
            this._buttonDownState[buttonId] = true;
            if (this._buttonPressedState[buttonId] === undefined) {
                this._buttonPressedState[buttonId] = true;
            }
        };
        ButtonListener.prototype._up = function (buttonId) {
            this._buttonDownState[buttonId] = false;
            if (this._buttonPressedState[buttonId] === false) {
                this._buttonPressedState[buttonId] = undefined;
            }
        };
        ButtonListener.prototype.isDown = function (button) {
            return this._buttonDownState[button] || false;
        };
        ButtonListener.prototype.isPressed = function (button) {
            return this._buttonPressedState[button] || false;
        };
        ButtonListener.prototype._getMouseButton = function (e) {
            if (e.which !== undefined || e.button !== undefined) {
                if (e.which === 3 || e.button === 2) {
                    return shuriken.MouseClick.RIGHT_MOUSE;
                }
                else if (e.which === 1 || e.button === 0 || e.button === 1) {
                    return shuriken.MouseClick.LEFT_MOUSE;
                }
            }
            throw "Cannot judge button pressed on passed mouse button event";
        };
        return ButtonListener;
    }());
    shuriken.ButtonListener = ButtonListener;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken_1) {
    var Collider = (function () {
        function Collider(shuriken) {
            this._currentCollisionPairs = [];
            this._shuriken = shuriken;
        }
        Collider.prototype.isSetupForCollisions = function (obj) {
            return obj.center !== undefined && obj.size !== undefined;
        };
        Collider.prototype.update = function () {
            this._currentCollisionPairs = [];
            var ent = this._shuriken.entities.all();
            for (var i = 0; i < ent.length; i++) {
                for (var j = i + 1; j < ent.length; j++) {
                    this._currentCollisionPairs.push([ent[i], ent[j]]);
                }
            }
            // test collisions
            while (this._currentCollisionPairs.length > 0) {
                var pair = this._currentCollisionPairs.shift();
                if (this.isColliding(pair[0], pair[1])) {
                    this.collision(pair[0], pair[1]);
                }
            }
        };
        Collider.prototype.collision = function (entity1, entity2) {
            this.notifyEntityOfCollision(entity1, entity2);
            this.notifyEntityOfCollision(entity2, entity1);
        };
        Collider.prototype.createEntity = function (entity) {
            var ent = this._shuriken.entities.all();
            for (var i = 0, len = ent.length; i < len; i++) {
                if (ent[i] !== entity) {
                    this._currentCollisionPairs.push([ent[i], entity]);
                }
            }
        };
        Collider.prototype.destroyEntity = function (entity) {
            // if coll detection happening, remove any pairs that include entity
            for (var i = this._currentCollisionPairs.length - 1; i >= 0; i--) {
                if (this._currentCollisionPairs[i][0] === entity ||
                    this._currentCollisionPairs[i][1] === entity) {
                    this._currentCollisionPairs.splice(i, 1);
                }
            }
        };
        Collider.prototype.isColliding = function (obj1, obj2) {
            return obj1 !== obj2 &&
                this.isSetupForCollisions(obj1) &&
                this.isSetupForCollisions(obj2) &&
                this.isIntersecting(obj1, obj2);
        };
        Collider.prototype.isIntersecting = function (obj1, obj2) {
            var obj1BoundingBox = this.getBoundingBox(obj1);
            var obj2BoundingBox = this.getBoundingBox(obj2);
            if (obj1BoundingBox === Collider.RECTANGLE && obj2BoundingBox === Collider.RECTANGLE) {
                return shuriken_1.Maths.rectanglesIntersecting(obj1, obj2);
            }
            else if (obj1BoundingBox === Collider.CIRCLE && obj2BoundingBox === Collider.RECTANGLE) {
                return shuriken_1.Maths.circleAndRectangleIntersecting(obj1, obj2);
            }
            else if (obj1BoundingBox === Collider.RECTANGLE && obj2BoundingBox === Collider.CIRCLE) {
                return shuriken_1.Maths.circleAndRectangleIntersecting(obj2, obj1);
            }
            else if (obj1BoundingBox === Collider.CIRCLE && obj2BoundingBox === Collider.CIRCLE) {
                return shuriken_1.Maths.circlesIntersecting(obj1, obj2);
            }
            else {
                throw "Objects being collision tested have unsupported bounding box types.";
            }
        };
        Collider.prototype.getBoundingBox = function (obj) {
            return obj.boundingBox || Collider.RECTANGLE;
        };
        Collider.prototype.notifyEntityOfCollision = function (entity, other) {
            if (entity.collision !== undefined) {
                entity.collision(other);
            }
        };
        return Collider;
    }());
    Collider.RECTANGLE = 0;
    Collider.CIRCLE = 1;
    shuriken_1.Collider = Collider;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken_2) {
    var Entities = (function () {
        function Entities(shuriken, game) {
            this._entities = [];
            this._shuriken = shuriken;
            this._game = game;
        }
        Entities.prototype.update = function (interval) {
            var entities = this.all();
            for (var i = 0, len = entities.length; i < len; i++) {
                if (entities[i].update !== undefined) {
                    entities[i].update(interval);
                }
            }
        };
        Entities.prototype.all = function (Constructor) {
            if (Constructor === undefined) {
                return this._entities.slice(); // return shallow copy of array
            }
            else {
                var entities = [];
                for (var i = 0; i < this._entities.length; i++) {
                    if (this._entities[i] instanceof Constructor) {
                        entities.push(this._entities[i]);
                    }
                }
                return entities;
            }
        };
        Entities.prototype.create = function (Constructor, settings) {
            var entity = new Constructor(this._game, settings || {});
            this._shuriken.collider.createEntity(entity);
            this._entities.push(entity);
            return entity;
        };
        Entities.prototype.destroy = function (entity) {
            for (var i = 0; i < this._entities.length; i++) {
                if (this._entities[i] === entity) {
                    this._shuriken.collider.destroyEntity(entity);
                    this._entities.splice(i, 1);
                    break;
                }
            }
        };
        return Entities;
    }());
    shuriken_2.Entities = Entities;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken_3) {
    var Inputter = (function () {
        function Inputter(shuriken, canvas, autoFocus) {
            var keyboardReceiver = autoFocus === false ? canvas : window;
            this.connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);
            this._buttonListener = new shuriken_3.ButtonListener(canvas, keyboardReceiver);
            this._mouseMoveListener = new shuriken_3.MouseMoveListener(canvas);
        }
        Inputter.prototype.update = function () {
            this._buttonListener.update();
        };
        Inputter.prototype.isDown = function (button) {
            return this._buttonListener.isDown(button);
        };
        Inputter.prototype.isPressed = function (button) {
            return this._buttonListener.isPressed(button);
        };
        Inputter.prototype.getMousePosition = function () {
            return this._mouseMoveListener.getMousePosition();
        };
        Inputter.prototype.bindMouseMove = function (fn) {
            return this._mouseMoveListener.bind(fn);
        };
        Inputter.prototype.unbindMouseMove = function (fn) {
            return this._mouseMoveListener.unbind(fn);
        };
        Inputter.prototype.connectReceiverToKeyboard = function (keyboardReceiver, window, autoFocus) {
            if (autoFocus === false) {
                keyboardReceiver.contentEditable = true; // lets canvas get focus and get key events
            }
            else {
                var suppressedKeys = [
                    shuriken_3.KeyboardButton.SPACE,
                    shuriken_3.KeyboardButton.LEFT_ARROW,
                    shuriken_3.KeyboardButton.UP_ARROW,
                    shuriken_3.KeyboardButton.RIGHT_ARROW,
                    shuriken_3.KeyboardButton.DOWN_ARROW
                ];
                // suppress scrolling
                window.addEventListener("keydown", function (e) {
                    for (var i = 0; i < suppressedKeys.length; i++) {
                        if (suppressedKeys[i] === e.keyCode) {
                            e.preventDefault();
                            return;
                        }
                    }
                }, false);
            }
        };
        ;
        return Inputter;
    }());
    shuriken_3.Inputter = Inputter;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken) {
    var MouseClick;
    (function (MouseClick) {
        MouseClick[MouseClick["LEFT_MOUSE"] = 0] = "LEFT_MOUSE";
        MouseClick[MouseClick["RIGHT_MOUSE"] = 1] = "RIGHT_MOUSE"; //= "RIGHT_MOUSE",
    })(MouseClick = shuriken.MouseClick || (shuriken.MouseClick = {}));
    var KeyboardButton;
    (function (KeyboardButton) {
        KeyboardButton[KeyboardButton["BACKSPACE"] = 8] = "BACKSPACE";
        KeyboardButton[KeyboardButton["TAB"] = 9] = "TAB";
        KeyboardButton[KeyboardButton["ENTER"] = 13] = "ENTER";
        KeyboardButton[KeyboardButton["SHIFT"] = 16] = "SHIFT";
        KeyboardButton[KeyboardButton["CTRL"] = 17] = "CTRL";
        KeyboardButton[KeyboardButton["ALT"] = 18] = "ALT";
        KeyboardButton[KeyboardButton["PAUSE"] = 19] = "PAUSE";
        KeyboardButton[KeyboardButton["CAPS_LOCK"] = 20] = "CAPS_LOCK";
        KeyboardButton[KeyboardButton["ESC"] = 27] = "ESC";
        KeyboardButton[KeyboardButton["SPACE"] = 32] = "SPACE";
        KeyboardButton[KeyboardButton["PAGE_UP"] = 33] = "PAGE_UP";
        KeyboardButton[KeyboardButton["PAGE_DOWN"] = 34] = "PAGE_DOWN";
        KeyboardButton[KeyboardButton["END"] = 35] = "END";
        KeyboardButton[KeyboardButton["HOME"] = 36] = "HOME";
        KeyboardButton[KeyboardButton["LEFT_ARROW"] = 37] = "LEFT_ARROW";
        KeyboardButton[KeyboardButton["UP_ARROW"] = 38] = "UP_ARROW";
        KeyboardButton[KeyboardButton["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
        KeyboardButton[KeyboardButton["DOWN_ARROW"] = 40] = "DOWN_ARROW";
        KeyboardButton[KeyboardButton["INSERT"] = 45] = "INSERT";
        KeyboardButton[KeyboardButton["DELETE"] = 46] = "DELETE";
        KeyboardButton[KeyboardButton["ZERO"] = 48] = "ZERO";
        KeyboardButton[KeyboardButton["ONE"] = 49] = "ONE";
        KeyboardButton[KeyboardButton["TWO"] = 50] = "TWO";
        KeyboardButton[KeyboardButton["THREE"] = 51] = "THREE";
        KeyboardButton[KeyboardButton["FOUR"] = 52] = "FOUR";
        KeyboardButton[KeyboardButton["FIVE"] = 53] = "FIVE";
        KeyboardButton[KeyboardButton["SIX"] = 54] = "SIX";
        KeyboardButton[KeyboardButton["SEVEN"] = 55] = "SEVEN";
        KeyboardButton[KeyboardButton["EIGHT"] = 56] = "EIGHT";
        KeyboardButton[KeyboardButton["NINE"] = 57] = "NINE";
        KeyboardButton[KeyboardButton["A"] = 65] = "A";
        KeyboardButton[KeyboardButton["B"] = 66] = "B";
        KeyboardButton[KeyboardButton["C"] = 67] = "C";
        KeyboardButton[KeyboardButton["D"] = 68] = "D";
        KeyboardButton[KeyboardButton["E"] = 69] = "E";
        KeyboardButton[KeyboardButton["F"] = 70] = "F";
        KeyboardButton[KeyboardButton["G"] = 71] = "G";
        KeyboardButton[KeyboardButton["H"] = 72] = "H";
        KeyboardButton[KeyboardButton["I"] = 73] = "I";
        KeyboardButton[KeyboardButton["J"] = 74] = "J";
        KeyboardButton[KeyboardButton["K"] = 75] = "K";
        KeyboardButton[KeyboardButton["L"] = 76] = "L";
        KeyboardButton[KeyboardButton["M"] = 77] = "M";
        KeyboardButton[KeyboardButton["N"] = 78] = "N";
        KeyboardButton[KeyboardButton["O"] = 79] = "O";
        KeyboardButton[KeyboardButton["P"] = 80] = "P";
        KeyboardButton[KeyboardButton["Q"] = 81] = "Q";
        KeyboardButton[KeyboardButton["R"] = 82] = "R";
        KeyboardButton[KeyboardButton["S"] = 83] = "S";
        KeyboardButton[KeyboardButton["T"] = 84] = "T";
        KeyboardButton[KeyboardButton["U"] = 85] = "U";
        KeyboardButton[KeyboardButton["V"] = 86] = "V";
        KeyboardButton[KeyboardButton["W"] = 87] = "W";
        KeyboardButton[KeyboardButton["X"] = 88] = "X";
        KeyboardButton[KeyboardButton["Y"] = 89] = "Y";
        KeyboardButton[KeyboardButton["Z"] = 90] = "Z";
        KeyboardButton[KeyboardButton["F1"] = 112] = "F1";
        KeyboardButton[KeyboardButton["F2"] = 113] = "F2";
        KeyboardButton[KeyboardButton["F3"] = 114] = "F3";
        KeyboardButton[KeyboardButton["F4"] = 115] = "F4";
        KeyboardButton[KeyboardButton["F5"] = 116] = "F5";
        KeyboardButton[KeyboardButton["F6"] = 117] = "F6";
        KeyboardButton[KeyboardButton["F7"] = 118] = "F7";
        KeyboardButton[KeyboardButton["F8"] = 119] = "F8";
        KeyboardButton[KeyboardButton["F9"] = 120] = "F9";
        KeyboardButton[KeyboardButton["F10"] = 121] = "F10";
        KeyboardButton[KeyboardButton["F11"] = 122] = "F11";
        KeyboardButton[KeyboardButton["F12"] = 123] = "F12";
        KeyboardButton[KeyboardButton["NUM_LOCK"] = 144] = "NUM_LOCK";
        KeyboardButton[KeyboardButton["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
        KeyboardButton[KeyboardButton["SEMI_COLON"] = 186] = "SEMI_COLON";
        KeyboardButton[KeyboardButton["EQUALS"] = 187] = "EQUALS";
        KeyboardButton[KeyboardButton["COMMA"] = 188] = "COMMA";
        KeyboardButton[KeyboardButton["DASH"] = 189] = "DASH";
        KeyboardButton[KeyboardButton["PERIOD"] = 190] = "PERIOD";
        KeyboardButton[KeyboardButton["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
        KeyboardButton[KeyboardButton["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
        KeyboardButton[KeyboardButton["OPEN_SQUARE_BRACKET"] = 219] = "OPEN_SQUARE_BRACKET";
        KeyboardButton[KeyboardButton["BACK_SLASH"] = 220] = "BACK_SLASH";
        KeyboardButton[KeyboardButton["CLOSE_SQUARE_BRACKET"] = 221] = "CLOSE_SQUARE_BRACKET";
        KeyboardButton[KeyboardButton["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
    })(KeyboardButton = shuriken.KeyboardButton || (shuriken.KeyboardButton = {}));
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken) {
    var Shuriken = (function () {
        function Shuriken(game, canvasId, width, height, backgroundColor, autoFocus) {
            var _this = this;
            var canvas = document.getElementById(canvasId);
            this._renderer = new shuriken.Renderer(this, game, canvas, width, height, backgroundColor);
            this._inputter = new shuriken.Inputter(this, canvas, autoFocus);
            this._entities = new shuriken.Entities(this, game);
            this._runner = new shuriken.Runner(this);
            this._collider = new shuriken.Collider(this);
            this._ticker = new shuriken.Ticker(this, function (interval) {
                _this._runner.update();
                if (game.update !== undefined) {
                    game.update(interval);
                }
                _this._entities.update(interval);
                _this._collider.update();
                _this._renderer.update(interval);
                _this._inputter.update();
            });
        }
        Object.defineProperty(Shuriken.prototype, "entities", {
            get: function () {
                return this._entities;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shuriken.prototype, "collider", {
            get: function () {
                return this._collider;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shuriken.prototype, "inputter", {
            get: function () {
                return this._inputter;
            },
            enumerable: true,
            configurable: true
        });
        return Shuriken;
    }());
    shuriken.Shuriken = Shuriken;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken) {
    var Maths = (function () {
        function Maths() {
        }
        Maths.circlesIntersecting = function (obj1, obj2) {
            return Maths.distance(obj1.center, obj2.center) <
                obj1.size.x / 2 + obj2.size.x / 2;
        };
        Maths.rectanglesIntersecting = function (obj1, obj2) {
            if (!Maths.rotated(obj1) && !Maths.rotated(obj2)) {
                return this.unrotatedRectanglesIntersecting(obj1, obj2); // faster
            }
            else {
                return this.rotatedRectanglesIntersecting(obj1, obj2); // slower
            }
        };
        Maths.circleAndRectangleIntersecting = function (circleObj, rectangleObj) {
            var rectangleObjAngleRad = -Maths.getAngle(rectangleObj) * Maths.RADIANS_TO_DEGREES;
            var unrotatedCircleCenter = {
                x: Math.cos(rectangleObjAngleRad) *
                    (circleObj.center.x - rectangleObj.center.x) -
                    Math.sin(rectangleObjAngleRad) *
                        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.x,
                y: Math.sin(rectangleObjAngleRad) *
                    (circleObj.center.x - rectangleObj.center.x) +
                    Math.cos(rectangleObjAngleRad) *
                        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.y
            };
            var closest = { x: 0, y: 0 };
            if (unrotatedCircleCenter.x < rectangleObj.center.x - rectangleObj.size.x / 2) {
                closest.x = rectangleObj.center.x - rectangleObj.size.x / 2;
            }
            else if (unrotatedCircleCenter.x > rectangleObj.center.x + rectangleObj.size.x / 2) {
                closest.x = rectangleObj.center.x + rectangleObj.size.x / 2;
            }
            else {
                closest.x = unrotatedCircleCenter.x;
            }
            if (unrotatedCircleCenter.y < rectangleObj.center.y - rectangleObj.size.y / 2) {
                closest.y = rectangleObj.center.y - rectangleObj.size.y / 2;
            }
            else if (unrotatedCircleCenter.y > rectangleObj.center.y + rectangleObj.size.y / 2) {
                closest.y = rectangleObj.center.y + rectangleObj.size.y / 2;
            }
            else {
                closest.y = unrotatedCircleCenter.y;
            }
            return this.distance(unrotatedCircleCenter, closest) < circleObj.size.x / 2;
        };
        Maths.unrotatedRectanglesIntersecting = function (obj1, obj2) {
            if (obj1.center.x + obj1.size.x / 2 < obj2.center.x - obj2.size.x / 2) {
                return false;
            }
            else if (obj1.center.x - obj1.size.x / 2 > obj2.center.x + obj2.size.x / 2) {
                return false;
            }
            else if (obj1.center.y - obj1.size.y / 2 > obj2.center.y + obj2.size.y / 2) {
                return false;
            }
            else if (obj1.center.y + obj1.size.y / 2 < obj2.center.y - obj2.size.y / 2) {
                return false;
            }
            else {
                return true;
            }
        };
        Maths.rotatedRectanglesIntersecting = function (obj1, obj2) {
            var obj1Normals = this.rectanglePerpendicularNormals(obj1);
            var obj2Normals = this.rectanglePerpendicularNormals(obj2);
            var obj1Corners = this.rectangleCorners(obj1);
            var obj2Corners = this.rectangleCorners(obj2);
            if (this.projectionsSeparate(this.getMinMaxProjection(obj1Corners, obj1Normals[1]), this.getMinMaxProjection(obj2Corners, obj1Normals[1]))) {
                return false;
            }
            else if (this.projectionsSeparate(this.getMinMaxProjection(obj1Corners, obj1Normals[0]), this.getMinMaxProjection(obj2Corners, obj1Normals[0]))) {
                return false;
            }
            else if (this.projectionsSeparate(this.getMinMaxProjection(obj1Corners, obj2Normals[1]), this.getMinMaxProjection(obj2Corners, obj2Normals[1]))) {
                return false;
            }
            else if (this.projectionsSeparate(this.getMinMaxProjection(obj1Corners, obj2Normals[0]), this.getMinMaxProjection(obj2Corners, obj2Normals[0]))) {
                return false;
            }
            else {
                return true;
            }
        };
        Maths.pointInsideObj = function (point, obj) {
            var objBoundingBox = Maths.getBoundingBox(obj);
            if (objBoundingBox === shuriken.Collider.RECTANGLE) {
                return this.pointInsideRectangle(point, obj);
            }
            else if (objBoundingBox === shuriken.Collider.CIRCLE) {
                return this.pointInsideCircle(point, obj);
            }
            else {
                throw "Tried to see if point inside object with unsupported bounding box.";
            }
        };
        Maths.pointInsideRectangle = function (point, obj) {
            var c = Math.cos(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);
            var s = Math.sin(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);
            var rotatedX = obj.center.x + c *
                (point.x - obj.center.x) - s * (point.y - obj.center.y);
            var rotatedY = obj.center.y + s *
                (point.x - obj.center.x) + c * (point.y - obj.center.y);
            var leftX = obj.center.x - obj.size.x / 2;
            var rightX = obj.center.x + obj.size.x / 2;
            var topY = obj.center.y - obj.size.y / 2;
            var bottomY = obj.center.y + obj.size.y / 2;
            return leftX <= rotatedX && rotatedX <= rightX &&
                topY <= rotatedY && rotatedY <= bottomY;
        };
        Maths.pointInsideCircle = function (point, obj) {
            return this.distance(point, obj.center) <= obj.size.x / 2;
        };
        Maths.distance = function (point1, point2) {
            var x = point1.x - point2.x;
            var y = point1.y - point2.y;
            return Math.sqrt((x * x) + (y * y));
        };
        Maths.vectorTo = function (start, end) {
            return {
                x: end.x - start.x,
                y: end.y - start.y
            };
        };
        Maths.magnitude = function (vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        };
        Maths.leftNormalizedNormal = function (vector) {
            return {
                x: -vector.y,
                y: vector.x
            };
        };
        Maths.dotProduct = function (vector1, vector2) {
            return vector1.x * vector2.x + vector1.y * vector2.y;
        };
        Maths.unitVector = function (vector) {
            return {
                x: vector.x / Maths.magnitude(vector),
                y: vector.y / Maths.magnitude(vector)
            };
        };
        Maths.projectionsSeparate = function (proj1, proj2) {
            return proj1.max < proj2.min || proj2.max < proj1.min;
        };
        Maths.getMinMaxProjection = function (objCorners, normal) {
            var min = Maths.dotProduct(objCorners[0], normal);
            var max = Maths.dotProduct(objCorners[0], normal);
            for (var i = 1; i < objCorners.length; i++) {
                var current = Maths.dotProduct(objCorners[i], normal);
                if (min > current) {
                    min = current;
                }
                if (current > max) {
                    max = current;
                }
            }
            return { min: min, max: max };
        };
        Maths.rectangleCorners = function (obj) {
            var corners = [
                { x: obj.center.x - obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
                { x: obj.center.x + obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
                { x: obj.center.x + obj.size.x / 2, y: obj.center.y + obj.size.y / 2 },
                { x: obj.center.x - obj.size.x / 2, y: obj.center.y + obj.size.y / 2 }
            ];
            var angle = Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES;
            for (var i = 0; i < corners.length; i++) {
                var xOffset = corners[i].x - obj.center.x;
                var yOffset = corners[i].y - obj.center.y;
                corners[i].x = obj.center.x +
                    xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
                corners[i].y = obj.center.y +
                    xOffset * Math.sin(angle) + yOffset * Math.cos(angle);
            }
            return corners;
        };
        Maths.rectangleSideVectors = function (obj) {
            var corners = this.rectangleCorners(obj);
            return [
                { x: corners[0].x - corners[1].x, y: corners[0].y - corners[1].y },
                { x: corners[1].x - corners[2].x, y: corners[1].y - corners[2].y },
                { x: corners[2].x - corners[3].x, y: corners[2].y - corners[3].y },
                { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y }
            ];
        };
        Maths.rectanglePerpendicularNormals = function (obj) {
            var sides = this.rectangleSideVectors(obj);
            return [
                Maths.leftNormalizedNormal(sides[0]),
                Maths.leftNormalizedNormal(sides[1])
            ];
        };
        Maths.rotated = function (obj) {
            return obj.angle !== undefined && obj.angle !== 0;
        };
        Maths.getBoundingBox = function (obj) {
            return obj.boundingBox || shuriken.Collider.RECTANGLE;
        };
        return Maths;
    }());
    Maths.getAngle = function (obj) {
        return obj.angle === undefined ? 0 : obj.angle;
    };
    Maths.RADIANS_TO_DEGREES = 0.01745;
    shuriken.Maths = Maths;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken) {
    var MouseMoveListener = (function () {
        function MouseMoveListener(canvas) {
            var _this = this;
            this._bindings = [];
            this.getWindow = function (document) {
                return document.parentWindow || document.defaultView;
            };
            canvas.addEventListener('mousemove', function (e) {
                var absoluteMousePosition = _this._getAbsoluteMousePosition(e);
                var elementPosition = _this.getElementPosition(canvas);
                _this._mousePosition = {
                    x: absoluteMousePosition.x - elementPosition.x,
                    y: absoluteMousePosition.y - elementPosition.y
                };
            }, false);
            canvas.addEventListener('mousemove', function (e) {
                for (var i = 0; i < _this._bindings.length; i++) {
                    _this._bindings[i](_this.getMousePosition());
                }
            }, false);
        }
        MouseMoveListener.prototype.bind = function (fn) {
            this._bindings.push(fn);
        };
        MouseMoveListener.prototype.unbind = function (fn) {
            for (var i = 0; i < this._bindings.length; i++) {
                if (this._bindings[i] === fn) {
                    this._bindings.splice(i, 1);
                    return;
                }
            }
            throw "Function to unbind from mouse moves was never bound";
        };
        MouseMoveListener.prototype.getMousePosition = function () {
            return this._mousePosition;
        };
        MouseMoveListener.prototype._getAbsoluteMousePosition = function (e) {
            if (e.pageX) {
                return { x: e.pageX, y: e.pageY };
            }
            else if (e.clientX) {
                return { x: e.clientX, y: e.clientY };
            }
        };
        MouseMoveListener.prototype.getElementPosition = function (element) {
            var rect = element.getBoundingClientRect();
            var document = element.ownerDocument;
            var body = document.body;
            var window = this.getWindow(document);
            return {
                x: rect.left + (window.pageXOffset || body.scrollLeft) - (body.clientLeft || 0),
                y: rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0)
            };
        };
        ;
        return MouseMoveListener;
    }());
    shuriken.MouseMoveListener = MouseMoveListener;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken_4) {
    var Renderer = (function () {
        /**
         *
         */
        function Renderer(shuriken, game, canvas, wView, hView, backgroundColor) {
            this._shuriken = shuriken;
            this._game = game;
            canvas.style.outline = "none";
            canvas.style.cursor = "default";
            this._context = canvas.getContext('2d');
            this._backgroundColor = backgroundColor;
            canvas.width = wView;
            canvas.height = hView;
            this._viewSize = { x: wView, y: hView };
            this._viewCenter = { x: this.viewSize.x / 2, y: this.viewSize.y / 2 };
        }
        Object.defineProperty(Renderer.prototype, "context", {
            get: function () {
                return this._context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "viewSize", {
            get: function () {
                return this._viewSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "viewCenter", {
            get: function () {
                return this._viewCenter;
            },
            set: function (value) {
                this._viewCenter = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "background", {
            set: function (color) {
                this._backgroundColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Renderer.prototype.update = function (interval) {
            var context = this.context;
            var viewTranslate = this.viewOffset(this._viewCenter, this._viewSize);
            context.translate(viewTranslate.x, viewTranslate.y);
            // draw background
            var viewArgs = [
                this._viewCenter.x - this._viewSize.x / 2,
                this._viewCenter.y - this._viewSize.y / 2,
                this._viewSize.x,
                this._viewSize.y
            ];
            if (this._backgroundColor !== undefined) {
                context.fillStyle = this._backgroundColor;
                context.fillRect.apply(context, viewArgs);
            }
            else {
                context.clearRect.apply(context, viewArgs);
            }
            // draw game and entities
            var drawables = [this._game]
                .concat(this._shuriken.entities.all().sort(this.zindexSort));
            for (var i = 0, len = drawables.length; i < len; i++) {
                if (drawables[i].draw !== undefined) {
                    var drawable = drawables[i];
                    context.save();
                    if (drawable.center !== undefined && drawable.angle !== undefined) {
                        context.translate(drawable.center.x, drawable.center.y);
                        context.rotate(drawable.angle * shuriken_4.Maths.RADIANS_TO_DEGREES);
                        context.translate(-drawable.center.x, -drawable.center.y);
                    }
                    drawables[i].draw(context);
                    context.restore();
                }
            }
            context.translate(-viewTranslate.x, -viewTranslate.y);
        };
        Renderer.prototype.onScreen = function (obj) {
            return shuriken_4.Maths.rectanglesIntersecting(obj, {
                size: this._viewSize,
                center: {
                    x: this._viewCenter.x,
                    y: this._viewCenter.y
                }
            });
        };
        Renderer.prototype.viewOffset = function (viewCenter, viewSize) {
            return {
                x: -(viewCenter.x - viewSize.x / 2),
                y: -(viewCenter.y - viewSize.y / 2),
            };
        };
        Renderer.prototype.zindexSort = function (a, b) {
            return (a.zindex || 0) < (b.zindex || 0) ? -1 : 1;
        };
        return Renderer;
    }());
    shuriken_4.Renderer = Renderer;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken_5) {
    var Runner = (function () {
        function Runner(shuriken) {
            this._runs = [];
            this._shuriken = shuriken;
        }
        Runner.prototype.update = function () {
            this.run();
        };
        Runner.prototype.run = function () {
            while (this._runs.length > 0) {
                var run = this._runs.shift();
                run.fn(run.ojb);
            }
        };
        Runner.prototype.add = function (obj, fn) {
            this._runs.push({
                obj: obj,
                fn: fn
            });
        };
        return Runner;
    }());
    shuriken_5.Runner = Runner;
})(shuriken || (shuriken = {}));
var shuriken;
(function (shuriken_6) {
    var interval = 16;
    var Ticker = (function () {
        function Ticker(shuriken, gameLoop) {
            this.stop = function () {
                this.nextTickFn = function () { };
            };
            this.setupRequestAnimationFrame();
            this._gameLoop = gameLoop;
            this.start();
        }
        Ticker.prototype.start = function () {
            var _this = this;
            var prev = Date.now();
            var tick = function () {
                var now = Date.now();
                var interval = now - prev;
                prev = now;
                _this._gameLoop(interval);
                window.requestAnimationFrame(_this._nextTickFn);
            };
            this._nextTickFn = tick;
            requestAnimationFrame(this._nextTickFn);
        };
        ;
        Ticker.prototype.setupRequestAnimationFrame = function () {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                    || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
        };
        ;
        return Ticker;
    }());
    shuriken_6.Ticker = Ticker;
})(shuriken || (shuriken = {}));
