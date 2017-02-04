/// <reference path="../../out/shuriken.d.ts" />
var spiningShapes;
(function (spiningShapes) {
    var GOLDEN_RATIO = 1.61803398875;
    var Game = (function () {
        function Game() {
            var autoFocus = false;
            this.shuriken = new Shuriken.Shuriken(this, "spinning-shapes-canvas", 1500, 1500 / GOLDEN_RATIO, "white", autoFocus);
            this.dragger = new Dragger(this.shuriken); // controls dragging of shapes with mouse
        }
        Game.prototype.update = function (interval) {
            var fpsDiv = document.getElementById("fps");
            fpsDiv.textContent = Math.round(1000 / interval).toString();
            this.dragger.update();
            var viewSize = this.shuriken.renderer.viewSize;
            var viewCenter = this.shuriken.renderer.viewCenter;
            if (this.shuriken.entities.all().length < 150) {
                var dirFromCenter = this.randomDirection();
                var Shape = Math.random() > 0.5 ? Rectangle : Circle;
                this.shuriken.entities.create(Shape, {
                    center: this.offscreenPosition(dirFromCenter, viewSize, viewCenter),
                    vec: this.movingOnscreenVec(dirFromCenter),
                });
            }
            // destroy entities that are off screen
            var entities = this.shuriken.entities.all();
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity = entities_1[_i];
                if (this.isOutOfView(entity, viewSize, viewCenter)) {
                    this.shuriken.entities.destroy(entity);
                }
            }
        };
        Game.prototype.randomDirection = function () {
            return Shuriken.Maths.unitVector({ x: Math.random() - .5, y: Math.random() - .5 });
        };
        ;
        Game.prototype.movingOnscreenVec = function (dirFromCenter) {
            return { x: -dirFromCenter.x * 3 * Math.random(), y: -dirFromCenter.y * 3 * Math.random() };
        };
        ;
        Game.prototype.offscreenPosition = function (dirFromCenter, viewSize, viewCenter) {
            return {
                x: viewCenter.x + dirFromCenter.x * viewSize.width,
                y: viewCenter.y + dirFromCenter.y * viewSize.height,
            };
        };
        Game.prototype.isOutOfView = function (obj, viewSize, viewCenter) {
            return Shuriken.Maths.distance(obj.center, viewCenter) >
                Math.max(viewSize.width, viewSize.height);
        };
        ;
        return Game;
    }());
    spiningShapes.Game = Game;
    ;
    var Rectangle = (function () {
        function Rectangle(game, settings) {
            this.shuriken = game.shuriken;
            this.angle = Math.random() * 360;
            this.center = settings.center;
            this.size = { width: 70, height: 70 / GOLDEN_RATIO };
            this.vec = settings.vec;
            this.turnSpeed = 2 * Math.random() - 1;
            this.collisionCounter = new CollisionCounter(game.shuriken.collider, this);
        }
        ;
        Rectangle.prototype.update = function () {
            this.collisionCounter.update();
            // move
            this.center.x += this.vec.x;
            this.center.y += this.vec.y;
            this.angle += this.turnSpeed; // turn
        };
        Rectangle.prototype.draw = function (ctx) {
            if (this.collisionCounter.colliders.length > 0) {
                ctx.lineWidth = 2;
            }
            else {
                ctx.lineWidth = 1;
            }
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.center.x - this.size.width / 2, this.center.y - this.size.height / 2, this.size.width, this.size.height);
        };
        Rectangle.prototype.collision = function (other) {
            this.collisionCounter.collision(other);
        };
        Rectangle.prototype.startDrag = function () {
            this.vec = { x: 0, y: 0 };
            this.turnSpeed = 0;
        };
        return Rectangle;
    }());
    spiningShapes.Rectangle = Rectangle;
    var Circle = (function () {
        function Circle(game, settings) {
            this.boundingBox = Shuriken.ColliderShape.CIRCLE;
            this.shuriken = game.shuriken;
            this.center = settings.center;
            this.size = { width: 55, height: 55 };
            this.vec = settings.vec;
            this.collisionCounter = new CollisionCounter(game.shuriken.collider, this);
        }
        ;
        Circle.prototype.update = function () {
            this.collisionCounter.update();
            // move
            this.center.x += this.vec.x;
            this.center.y += this.vec.y;
        };
        Circle.prototype.draw = function (ctx) {
            if (this.collisionCounter.colliders.length > 0) {
                ctx.lineWidth = 2;
            }
            else {
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.size.width / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.strokeStyle = "black";
            ctx.stroke();
        };
        Circle.prototype.collision = function (other) {
            this.collisionCounter.collision(other);
        };
        Circle.prototype.startDrag = function () {
            this.vec = { x: 0, y: 0 };
        };
        return Circle;
    }());
    spiningShapes.Circle = Circle;
    var Dragger = (function () {
        function Dragger(shuriken) {
            var _this = this;
            this.shuriken = shuriken;
            shuriken.inputter.bindMouseMove(function (e) {
                if (shuriken.inputter.isDown(Shuriken.MouseClick.LEFT_MOUSE)) {
                    if (_this.isDragging()) {
                        _this.currentDrag.target.center = {
                            x: e.x + _this.currentDrag.centerOffset.x,
                            y: e.y + _this.currentDrag.centerOffset.y,
                        };
                    }
                }
            });
        }
        Dragger.prototype.update = function () {
            if (this.shuriken.inputter.isDown(Shuriken.MouseClick.LEFT_MOUSE)) {
                if (!this.isDragging()) {
                    var mousePosition = this.shuriken.inputter.getMousePosition();
                    var target = this.getTarget(this.shuriken.entities.all(), mousePosition);
                    if (target !== undefined) {
                        this.startDrag(target, mousePosition);
                    }
                }
            }
            else {
                this.stopDrag();
            }
        };
        Dragger.prototype.isDragging = function () {
            return this.currentDrag !== undefined;
        };
        Dragger.prototype.getTarget = function (targets, e) {
            for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
                var target = targets_1[_i];
                if (Shuriken.Maths.pointInsideObj(e, target)) {
                    return target;
                }
            }
        };
        Dragger.prototype.startDrag = function (target, e) {
            this.currentDrag = {
                target: target,
                centerOffset: {
                    x: target.center.x - e.x,
                    y: target.center.y - e.y,
                },
            };
            if (target.startDrag !== undefined) {
                target.startDrag();
            }
        };
        Dragger.prototype.stopDrag = function () {
            if (this.isDragging()) {
                if (this.currentDrag.target.stopDrag !== undefined) {
                    this.currentDrag.target.stopDrag();
                }
                this.currentDrag = undefined;
            }
        };
        return Dragger;
    }());
    spiningShapes.Dragger = Dragger;
    var CollisionCounter = (function () {
        function CollisionCounter(collider, entity) {
            this.colliders = [];
            this.entity = entity;
            this.collider = collider;
        }
        CollisionCounter.prototype.update = function () {
            var _this = this;
            this.colliders = this.colliders
                .filter(function (c) { return _this.collider.isColliding(_this.entity, c); });
        };
        ;
        CollisionCounter.prototype.collision = function (other) {
            if (this.colliders.indexOf(other) === -1) {
                this.colliders.push(other);
            }
        };
        ;
        return CollisionCounter;
    }());
    spiningShapes.CollisionCounter = CollisionCounter;
})(spiningShapes || (spiningShapes = {}));
//# sourceMappingURL=game.js.map