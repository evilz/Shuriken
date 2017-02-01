var Shuriken;
(function (Shuriken) {
    var ButtonListener = (function () {
        function ButtonListener(canvas, keyboardReceiver) {
            var _this = this;
            this.buttonDownState = {};
            this.buttonPressedState = {};
            keyboardReceiver.addEventListener("keydown", function (e) { return _this._down(e.keyCode); }, false);
            keyboardReceiver.addEventListener("keyup", function (e) { return _this._up(e.keyCode); }, false);
            canvas.addEventListener("mousedown", function (e) { return _this._down(_this._getMouseButton(e)); }, false);
            canvas.addEventListener("mouseup", function (e) { return _this._up(_this._getMouseButton(e)); }, false);
        }
        ButtonListener.prototype.update = function () {
            for (var i in this.buttonPressedState) {
                if (this.buttonPressedState[i] === true) {
                    this.buttonPressedState[i] = false;
                }
            }
        };
        ButtonListener.prototype.isDown = function (button) {
            return this.buttonDownState[button] || false;
        };
        ButtonListener.prototype.isPressed = function (button) {
            return this.buttonPressedState[button] || false;
        };
        ButtonListener.prototype._down = function (buttonId) {
            this.buttonDownState[buttonId] = true;
            if (this.buttonPressedState[buttonId] === undefined) {
                this.buttonPressedState[buttonId] = true;
            }
        };
        ButtonListener.prototype._up = function (buttonId) {
            this.buttonDownState[buttonId] = false;
            if (this.buttonPressedState[buttonId] === false) {
                this.buttonPressedState[buttonId] = undefined;
            }
        };
        ButtonListener.prototype._getMouseButton = function (e) {
            if (e.which !== undefined || e.button !== undefined) {
                if (e.which === 3 || e.button === 2) {
                    return Shuriken.MouseClick.RIGHT_MOUSE;
                }
                else if (e.which === 1 || e.button === 0 || e.button === 1) {
                    return Shuriken.MouseClick.LEFT_MOUSE;
                }
            }
            throw new Error("Cannot judge button pressed on passed mouse button event");
        };
        return ButtonListener;
    }());
    Shuriken.ButtonListener = ButtonListener;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var Collider = (function () {
        function Collider(shuriken) {
            this.currentCollisionPairs = [];
            this.shuriken = shuriken;
        }
        Collider.prototype.update = function () {
            this.currentCollisionPairs = [];
            var ent = this.shuriken.entities.all();
            for (var i = 0; i < ent.length; i++) {
                for (var j = i + 1; j < ent.length; j++) {
                    this.currentCollisionPairs.push([ent[i], ent[j]]);
                }
            }
            // test collisions
            while (this.currentCollisionPairs.length > 0) {
                var pair = this.currentCollisionPairs.shift();
                if (this.isColliding(pair[0], pair[1])) {
                    this.collision(pair[0], pair[1]);
                }
            }
        };
        Collider.prototype.createEntity = function (entity) {
            var allEntities = this.shuriken.entities.all();
            for (var _i = 0, allEntities_1 = allEntities; _i < allEntities_1.length; _i++) {
                var e = allEntities_1[_i];
                if (e !== entity) {
                    this.currentCollisionPairs.push([e, entity]);
                }
            }
        };
        Collider.prototype.destroyEntity = function (entity) {
            // if coll detection happening, remove any pairs that include entity
            for (var i = this.currentCollisionPairs.length - 1; i >= 0; i--) {
                if (this.currentCollisionPairs[i][0] === entity ||
                    this.currentCollisionPairs[i][1] === entity) {
                    this.currentCollisionPairs.splice(i, 1);
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
            if (obj1BoundingBox === Shuriken.ColliderShape.RECTANGLE && obj2BoundingBox === Shuriken.ColliderShape.RECTANGLE) {
                return Shuriken.Maths.rectanglesIntersecting(obj1, obj2);
            }
            else if (obj1BoundingBox === Shuriken.ColliderShape.CIRCLE && obj2BoundingBox === Shuriken.ColliderShape.RECTANGLE) {
                return Shuriken.Maths.circleAndRectangleIntersecting(obj1, obj2);
            }
            else if (obj1BoundingBox === Shuriken.ColliderShape.RECTANGLE && obj2BoundingBox === Shuriken.ColliderShape.CIRCLE) {
                return Shuriken.Maths.circleAndRectangleIntersecting(obj2, obj1);
            }
            else if (obj1BoundingBox === Shuriken.ColliderShape.CIRCLE && obj2BoundingBox === Shuriken.ColliderShape.CIRCLE) {
                return Shuriken.Maths.circlesIntersecting(obj1, obj2);
            }
            else {
                throw new Error("Objects being collision tested have unsupported bounding box types.");
            }
        };
        Collider.prototype.isSetupForCollisions = function (obj) {
            return obj.center !== undefined && obj.size !== undefined;
        };
        Collider.prototype.collision = function (entity1, entity2) {
            this.notifyEntityOfCollision(entity1, entity2);
            this.notifyEntityOfCollision(entity2, entity1);
        };
        // todo move on entity ??
        Collider.prototype.getBoundingBox = function (obj) {
            return obj.boundingBox || Shuriken.ColliderShape.RECTANGLE;
        };
        Collider.prototype.notifyEntityOfCollision = function (entity, other) {
            if (entity.collision !== undefined) {
                entity.collision(other);
            }
        };
        return Collider;
    }());
    Shuriken.Collider = Collider;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var ColliderShape;
    (function (ColliderShape) {
        ColliderShape[ColliderShape["RECTANGLE"] = 0] = "RECTANGLE";
        ColliderShape[ColliderShape["CIRCLE"] = 1] = "CIRCLE";
    })(ColliderShape = Shuriken.ColliderShape || (Shuriken.ColliderShape = {}));
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var Entities = (function () {
        function Entities(shuriken, game) {
            this.entities = [];
            this.shuriken = shuriken;
            this.game = game;
        }
        Entities.prototype.update = function (interval) {
            var entities = this.all();
            for (var _i = 0, _a = entities.filter(function (x) { return x.update != null; }); _i < _a.length; _i++) {
                var entity = _a[_i];
                entity.update(interval);
            }
        };
        Entities.prototype.all = function (Constructor) {
            if (Constructor != null) {
                var entities = [];
                for (var _i = 0, _a = this.entities.filter(function (x) { return x instanceof Constructor; }); _i < _a.length; _i++) {
                    var entity = _a[_i];
                    entities.push(entity);
                }
                return entities;
            }
            else {
                return this.entities.slice(); // return shallow copy of array
            }
        };
        Entities.prototype.create = function (Constructor, settings) {
            var entity = new Constructor(this.game, settings || {});
            this.shuriken.collider.createEntity(entity);
            this.entities.push(entity);
            return entity;
        };
        Entities.prototype.destroy = function (entity) {
            for (var i = 0; i < this.entities.length; i++) {
                if (this.entities[i] === entity) {
                    this.shuriken.collider.destroyEntity(entity);
                    this.entities.splice(i, 1);
                    break;
                }
            }
        };
        return Entities;
    }());
    Shuriken.Entities = Entities;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var Inputter = (function () {
        function Inputter(shuriken, canvas, autoFocus) {
            var keyboardReceiver = autoFocus === false ? canvas : window;
            this.connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);
            this.buttonListener = new Shuriken.ButtonListener(canvas, keyboardReceiver);
            this.mouseMoveListener = new Shuriken.MouseMoveListener(canvas);
        }
        Inputter.prototype.update = function () {
            this.buttonListener.update();
        };
        Inputter.prototype.isDown = function (button) {
            return this.buttonListener.isDown(button);
        };
        Inputter.prototype.isPressed = function (button) {
            return this.buttonListener.isPressed(button);
        };
        Inputter.prototype.getMousePosition = function () {
            return this.mouseMoveListener.getMousePosition();
        };
        Inputter.prototype.bindMouseMove = function (fn) {
            return this.mouseMoveListener.bind(fn);
        };
        Inputter.prototype.unbindMouseMove = function (fn) {
            return this.mouseMoveListener.unbind(fn);
        };
        Inputter.prototype.connectReceiverToKeyboard = function (keyboardReceiver, window, autoFocus) {
            if (autoFocus === false) {
                if (keyboardReceiver.contentEditable) {
                    keyboardReceiver.contentEditable = "true";
                }
            }
            else {
                var suppressedKeys_1 = [
                    Shuriken.KeyboardButton.SPACE,
                    Shuriken.KeyboardButton.LEFT_ARROW,
                    Shuriken.KeyboardButton.UP_ARROW,
                    Shuriken.KeyboardButton.RIGHT_ARROW,
                    Shuriken.KeyboardButton.DOWN_ARROW,
                ];
                // suppress scrolling
                window.addEventListener("keydown", function (e) {
                    for (var _i = 0, suppressedKeys_2 = suppressedKeys_1; _i < suppressedKeys_2.length; _i++) {
                        var suppressedKey = suppressedKeys_2[_i];
                        if (suppressedKey === e.keyCode) {
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
    Shuriken.Inputter = Inputter;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var MouseClick;
    (function (MouseClick) {
        MouseClick[MouseClick["LEFT_MOUSE"] = 0] = "LEFT_MOUSE";
        MouseClick[MouseClick["RIGHT_MOUSE"] = 1] = "RIGHT_MOUSE"; //= "RIGHT_MOUSE",
    })(MouseClick = Shuriken.MouseClick || (Shuriken.MouseClick = {}));
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
    })(KeyboardButton = Shuriken.KeyboardButton || (Shuriken.KeyboardButton = {}));
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken_1) {
    var Shuriken = (function () {
        function Shuriken(game, canvasId, width, height, backgroundColor, autoFocus) {
            var _this = this;
            var canvas = document.getElementById(canvasId);
            this.renderer = new Shuriken_1.Renderer(this, game, canvas, width, height, backgroundColor);
            this.inputter = new Shuriken_1.Inputter(this, canvas, autoFocus);
            this.entities = new Shuriken_1.Entities(this, game);
            this.runner = new Shuriken_1.Runner(this);
            this.collider = new Shuriken_1.Collider(this);
            this.ticker = new Shuriken_1.Ticker(this, function (interval) {
                _this.runner.update();
                if (game.update !== undefined) {
                    game.update(interval);
                }
                _this.entities.update(interval);
                _this.collider.update();
                _this.renderer.update(interval);
                _this.inputter.update();
            });
        }
        return Shuriken;
    }());
    Shuriken_1.Shuriken = Shuriken;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var Maths = (function () {
        function Maths() {
        }
        Maths.circlesIntersecting = function (obj1, obj2) {
            return Maths.distance(obj1.center, obj2.center) <
                obj1.size.width / 2 + obj2.size.width / 2;
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
                        (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.y,
            };
            var closest = { x: 0, y: 0 };
            if (unrotatedCircleCenter.x < rectangleObj.center.x - rectangleObj.size.width / 2) {
                closest.x = rectangleObj.center.x - rectangleObj.size.width / 2;
            }
            else if (unrotatedCircleCenter.x > rectangleObj.center.x + rectangleObj.size.width / 2) {
                closest.x = rectangleObj.center.x + rectangleObj.size.width / 2;
            }
            else {
                closest.x = unrotatedCircleCenter.x;
            }
            if (unrotatedCircleCenter.y < rectangleObj.center.y - rectangleObj.size.height / 2) {
                closest.y = rectangleObj.center.y - rectangleObj.size.height / 2;
            }
            else if (unrotatedCircleCenter.y > rectangleObj.center.y + rectangleObj.size.height / 2) {
                closest.y = rectangleObj.center.y + rectangleObj.size.height / 2;
            }
            else {
                closest.y = unrotatedCircleCenter.y;
            }
            return this.distance(unrotatedCircleCenter, closest) < circleObj.size.width / 2;
        };
        Maths.unrotatedRectanglesIntersecting = function (obj1, obj2) {
            if (obj1.center.x + obj1.size.width / 2 < obj2.center.x - obj2.size.width / 2) {
                return false;
            }
            else if (obj1.center.x - obj1.size.width / 2 > obj2.center.x + obj2.size.width / 2) {
                return false;
            }
            else if (obj1.center.y - obj1.size.height / 2 > obj2.center.y + obj2.size.height / 2) {
                return false;
            }
            else if (obj1.center.y + obj1.size.height / 2 < obj2.center.y - obj2.size.height / 2) {
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
            if (objBoundingBox === Shuriken.ColliderShape.RECTANGLE) {
                return this.pointInsideRectangle(point, obj);
            }
            else if (objBoundingBox === Shuriken.ColliderShape.CIRCLE) {
                return this.pointInsideCircle(point, obj);
            }
            else {
                throw new Error("Tried to see if point inside object with unsupported bounding box.");
            }
        };
        Maths.pointInsideRectangle = function (point, obj) {
            var c = Math.cos(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);
            var s = Math.sin(-Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES);
            var rotatedX = obj.center.x + c *
                (point.x - obj.center.x) - s * (point.y - obj.center.y);
            var rotatedY = obj.center.y + s *
                (point.x - obj.center.x) + c * (point.y - obj.center.y);
            var leftX = obj.center.x - obj.size.width / 2;
            var rightX = obj.center.x + obj.size.width / 2;
            var topY = obj.center.y - obj.size.height / 2;
            var bottomY = obj.center.y + obj.size.height / 2;
            return leftX <= rotatedX && rotatedX <= rightX &&
                topY <= rotatedY && rotatedY <= bottomY;
        };
        Maths.pointInsideCircle = function (point, obj) {
            return this.distance(point, obj.center) <= obj.size.width / 2;
        };
        Maths.distance = function (point1, point2) {
            var x = point1.x - point2.x;
            var y = point1.y - point2.y;
            return Math.sqrt((x * x) + (y * y));
        };
        Maths.vectorTo = function (start, end) {
            return {
                x: end.x - start.x,
                y: end.y - start.y,
            };
        };
        Maths.magnitude = function (vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        };
        Maths.leftNormalizedNormal = function (vector) {
            return {
                x: -vector.y,
                y: vector.x,
            };
        };
        Maths.dotProduct = function (vector1, vector2) {
            return vector1.x * vector2.x + vector1.y * vector2.y;
        };
        Maths.unitVector = function (vector) {
            return {
                x: vector.x / Maths.magnitude(vector),
                y: vector.y / Maths.magnitude(vector),
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
                { x: obj.center.x - obj.size.width / 2, y: obj.center.y - obj.size.height / 2 },
                { x: obj.center.x + obj.size.width / 2, y: obj.center.y - obj.size.height / 2 },
                { x: obj.center.x + obj.size.width / 2, y: obj.center.y + obj.size.height / 2 },
                { x: obj.center.x - obj.size.width / 2, y: obj.center.y + obj.size.height / 2 },
            ];
            var angle = Maths.getAngle(obj) * Maths.RADIANS_TO_DEGREES;
            for (var _i = 0, corners_1 = corners; _i < corners_1.length; _i++) {
                var corner = corners_1[_i];
                var xOffset = corner.x - obj.center.x;
                var yOffset = corner.y - obj.center.y;
                corner.x = obj.center.x +
                    xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
                corner.y = obj.center.y +
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
                { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y },
            ];
        };
        Maths.rectanglePerpendicularNormals = function (obj) {
            var sides = this.rectangleSideVectors(obj);
            return [
                Maths.leftNormalizedNormal(sides[0]),
                Maths.leftNormalizedNormal(sides[1]),
            ];
        };
        Maths.rotated = function (obj) {
            return obj.angle !== undefined && obj.angle !== 0;
        };
        Maths.getAngle = function (obj) {
            return obj.angle === undefined ? 0 : obj.angle;
        };
        Maths.getBoundingBox = function (obj) {
            return obj.boundingBox || Shuriken.ColliderShape.RECTANGLE;
        };
        return Maths;
    }());
    Maths.RADIANS_TO_DEGREES = 0.01745;
    Shuriken.Maths = Maths;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var MouseMoveListener = (function () {
        function MouseMoveListener(canvas) {
            var _this = this;
            this.bindings = [];
            canvas.addEventListener("mousemove", function (e) {
                var absoluteMousePosition = _this._getAbsoluteMousePosition(e);
                var elementPosition = _this.getElementPosition(canvas);
                _this.mousePosition = {
                    x: absoluteMousePosition.x - elementPosition.x,
                    y: absoluteMousePosition.y - elementPosition.y,
                };
            }, false);
            canvas.addEventListener("mousemove", function (e) {
                for (var _i = 0, _a = _this.bindings; _i < _a.length; _i++) {
                    var binding = _a[_i];
                    binding(_this.getMousePosition());
                }
            }, false);
        }
        MouseMoveListener.prototype.bind = function (fn) {
            this.bindings.push(fn);
        };
        MouseMoveListener.prototype.unbind = function (fn) {
            for (var i = 0; i < this.bindings.length; i++) {
                if (this.bindings[i] === fn) {
                    this.bindings.splice(i, 1);
                    return;
                }
            }
            throw new Error("Function to unbind from mouse moves was never bound");
        };
        MouseMoveListener.prototype.getMousePosition = function () {
            return this.mousePosition;
        };
        MouseMoveListener.prototype._getAbsoluteMousePosition = function (e) {
            if (e.pageX) {
                return { x: e.pageX, y: e.pageY };
            }
            else if (e.clientX) {
                return { x: e.clientX, y: e.clientY };
            }
        };
        MouseMoveListener.prototype.getWindow = function (document) {
            return document.defaultView;
        };
        MouseMoveListener.prototype.getElementPosition = function (element) {
            var rect = element.getBoundingClientRect();
            var document = element.ownerDocument;
            var body = document.body;
            var window = this.getWindow(document);
            return {
                x: rect.left + (window.pageXOffset || body.scrollLeft) - (body.clientLeft || 0),
                y: rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0),
            };
        };
        ;
        return MouseMoveListener;
    }());
    Shuriken.MouseMoveListener = MouseMoveListener;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var Renderer = (function () {
        function Renderer(shuriken, game, canvas, wView, hView, backgroundColor) {
            this.shuriken = shuriken;
            this.game = game;
            canvas.style.outline = "none";
            canvas.style.cursor = "default";
            this.context = canvas.getContext("2d");
            this.backgroundColor = backgroundColor;
            canvas.width = wView;
            canvas.height = hView;
            this.viewSize = { width: wView, height: hView };
            this.viewCenter = { x: this.viewSize.width / 2, y: this.viewSize.height / 2 };
        }
        Renderer.prototype.update = function (interval) {
            var context = this.context;
            var viewTranslate = this.viewOffset(this.viewCenter, this.viewSize);
            context.translate(viewTranslate.x, viewTranslate.y);
            // draw background
            var viewArgs = [
                this.viewCenter.x - this.viewSize.width / 2,
                this.viewCenter.y - this.viewSize.height / 2,
                this.viewSize.width,
                this.viewSize.height,
            ];
            if (this.backgroundColor !== undefined) {
                context.fillStyle = this.backgroundColor;
                context.fillRect.apply(context, viewArgs);
            }
            else {
                context.clearRect.apply(context, viewArgs);
            }
            // draw game and entities
            var drawables = [this.game]
                .concat(this.shuriken.entities.all().sort(this.zindexSort));
            for (var _i = 0, drawables_1 = drawables; _i < drawables_1.length; _i++) {
                var drawable = drawables_1[_i];
                if (drawable.draw !== undefined) {
                    context.save();
                    if (drawable.center !== undefined && drawable.angle !== undefined) {
                        context.translate(drawable.center.x, drawable.center.y);
                        context.rotate(drawable.angle * Shuriken.Maths.RADIANS_TO_DEGREES);
                        context.translate(-drawable.center.x, -drawable.center.y);
                    }
                    drawable.draw(context);
                    context.restore();
                }
            }
            context.translate(-viewTranslate.x, -viewTranslate.y);
        };
        Renderer.prototype.onScreen = function (obj) {
            return Shuriken.Maths.rectanglesIntersecting(obj, {
                center: {
                    x: this.viewCenter.x,
                    y: this.viewCenter.y,
                },
                size: this.viewSize,
            });
        };
        Renderer.prototype.viewOffset = function (viewCenter, viewSize) {
            return {
                x: -(viewCenter.x - viewSize.width / 2),
                y: -(viewCenter.y - viewSize.height / 2),
            };
        };
        Renderer.prototype.zindexSort = function (a, b) {
            return (a.zindex || 0) < (b.zindex || 0) ? -1 : 1;
        };
        return Renderer;
    }());
    Shuriken.Renderer = Renderer;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    var Runner = (function () {
        function Runner(shuriken) {
            this.runs = [];
            this.shuriken = shuriken;
        }
        Runner.prototype.update = function () {
            this.run();
        };
        Runner.prototype.add = function (obj, fn) {
            this.runs.push({ obj: obj, fn: fn });
        };
        Runner.prototype.run = function () {
            while (this.runs.length > 0) {
                var run_1 = this.runs.shift();
                run_1.fn(run_1.obj);
            }
        };
        return Runner;
    }());
    Shuriken.Runner = Runner;
})(Shuriken || (Shuriken = {}));
var Shuriken;
(function (Shuriken) {
    // const interval = 16;
    var Ticker = (function () {
        function Ticker(shuriken, gameLoop) {
            this.setupRequestAnimationFrame();
            this.gameLoop = gameLoop;
            this.start();
        }
        Ticker.prototype.start = function () {
            var _this = this;
            var prev = Date.now();
            var tick = function () {
                var now = Date.now();
                var interval = now - prev;
                prev = now;
                _this.gameLoop(interval);
                window.requestAnimationFrame(_this.nextTickFn);
            };
            this.nextTickFn = tick;
            requestAnimationFrame(this.nextTickFn);
        };
        ;
        Ticker.prototype.stop = function () {
            this.nextTickFn = function () { return null; };
            ;
        };
        Ticker.prototype.setupRequestAnimationFrame = function () {
            var lastTime = 0;
            var vendors = ["ms", "moz", "webkit", "o"];
            var win = window;
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = win[vendors[x] + "RequestAnimationFrame"];
                window.cancelAnimationFrame = win[vendors[x] + "CancelAnimationFrame"]
                    || win[vendors[x] + "CancelRequestAnimationFrame"];
            }
        };
        ;
        return Ticker;
    }());
    Shuriken.Ticker = Ticker;
})(Shuriken || (Shuriken = {}));
//# sourceMappingURL=shuriken.js.map