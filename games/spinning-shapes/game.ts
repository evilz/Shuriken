/// <reference path="../../out/shuriken.d.ts" />

namespace spiningShapes {

    const GOLDEN_RATIO = 1.61803398875;

    export interface IDraggableEntity extends Shuriken.IEntity {
        startDrag: Function;
    }

    export class Game {

        public shuriken: Shuriken.Shuriken;
        private dragger: Dragger;

        constructor() {
            const autoFocus = false;
            this.shuriken = new Shuriken.Shuriken(this, "spinning-shapes-canvas",
                1500, 1500 / GOLDEN_RATIO, "white", autoFocus);
            this.dragger = new Dragger(this.shuriken); // controls dragging of shapes with mouse
        }

        public update(interval: number) {
            const fpsDiv = document.getElementById("fps") as HTMLCanvasElement
            fpsDiv.textContent = Math.round(1000 / interval).toString();

            this.dragger.update();
            const viewSize = this.shuriken.renderer.viewSize;
            const viewCenter = this.shuriken.renderer.viewCenter;

            if (this.shuriken.entities.all().length < 150) { // not enough shapes
                const dirFromCenter = this.randomDirection();
                const Shape = Math.random() > 0.5 ? Rectangle : Circle;
                this.shuriken.entities.create(Shape, { // make one
                    center: this.offscreenPosition(dirFromCenter, viewSize, viewCenter),
                    vec: this.movingOnscreenVec(dirFromCenter),
                });
            }

            // destroy entities that are off screen
            const entities = this.shuriken.entities.all();
            for (const entity of entities) {
                if (this.isOutOfView(entity, viewSize, viewCenter)) {
                    this.shuriken.entities.destroy(entity);
                }
            }
        }

        private randomDirection() {
            return Shuriken.Maths.unitVector({ x: Math.random() - .5, y: Math.random() - .5 });
        };

        private movingOnscreenVec(dirFromCenter: Shuriken.IPoint) {
            return { x: -dirFromCenter.x * 3 * Math.random(), y: -dirFromCenter.y * 3 * Math.random() };
        };

        private offscreenPosition(
            dirFromCenter: Shuriken.IPoint,
            viewSize: Shuriken.ISize,
            viewCenter: Shuriken.IPoint) {
            return {
                x: viewCenter.x + dirFromCenter.x * viewSize.width,
                y: viewCenter.y + dirFromCenter.y * viewSize.height,
            };
        }

        private isOutOfView(obj: Shuriken.IEntity, viewSize: Shuriken.ISize, viewCenter: Shuriken.IPoint) {
            return Shuriken.Maths.distance(obj.center, viewCenter) >
                Math.max(viewSize.width, viewSize.height);
        };
    };

    export class Rectangle implements IDraggableEntity {

        public angle: number;
        public center: Shuriken.IPoint;
        public size: Shuriken.ISize;

        private shuriken: Shuriken.Shuriken;
        private vec: any;
        private turnSpeed: number;
        private collisionCounter: CollisionCounter;

        constructor(game: Game, settings: any) {
            this.shuriken = game.shuriken;
            this.angle = Math.random() * 360;
            this.center = settings.center;
            this.size = { width: 70, height: 70 / GOLDEN_RATIO };
            this.vec = settings.vec;
            this.turnSpeed = 2 * Math.random() - 1;

            this.collisionCounter = new CollisionCounter(game.shuriken.collider, this);
        };

        public update() {
            this.collisionCounter.update();

            // move
            this.center.x += this.vec.x;
            this.center.y += this.vec.y;

            this.angle += this.turnSpeed; // turn
        }

        public draw(ctx: CanvasRenderingContext2D) {
            if (this.collisionCounter.colliders.length > 0) {
                ctx.lineWidth = 2;
            } else {
                ctx.lineWidth = 1;
            }

            ctx.strokeStyle = "black";
            ctx.strokeRect(this.center.x - this.size.width / 2, this.center.y - this.size.height / 2,
                this.size.width, this.size.height);
        }

        public collision(other: Shuriken.IEntity) {
            this.collisionCounter.collision(other);
        }

        public startDrag() {
            this.vec = { x: 0, y: 0 };
            this.turnSpeed = 0;
        }
    }

    export class Circle implements IDraggableEntity {

        public angle: number;
        public center: Shuriken.IPoint;
        public size: Shuriken.ISize;
        public boundingBox = Shuriken.ColliderShape.CIRCLE;

        private shuriken: Shuriken.Shuriken;
        private vec: any;
        private turnSpeed: number;
        private collisionCounter: CollisionCounter;

        constructor(game: Game, settings: any) {
            this.shuriken = game.shuriken;
            this.center = settings.center;
            this.size = { width: 55, height: 55 };
            this.vec = settings.vec;

            this.collisionCounter = new CollisionCounter(game.shuriken.collider, this);
        };

        public update() {
            this.collisionCounter.update();

            // move
            this.center.x += this.vec.x;
            this.center.y += this.vec.y;
        }

        public draw(ctx: CanvasRenderingContext2D) {
            if (this.collisionCounter.colliders.length > 0) {
                ctx.lineWidth = 2;
            } else {
                ctx.lineWidth = 1;
            }

            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.size.width / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.strokeStyle = "black";
            ctx.stroke();
        }

        public collision(other: Shuriken.IEntity) {
            this.collisionCounter.collision(other);
        }

        public startDrag() {
            this.vec = { x: 0, y: 0 };
        }
    }

    export class Dragger {

        private shuriken: Shuriken.Shuriken;
        private currentDrag: any;

        constructor(shuriken: Shuriken.Shuriken) {
            this.shuriken = shuriken;

            shuriken.inputter.bindMouseMove((e: MouseEvent) => {
                if (shuriken.inputter.isDown(Shuriken.MouseClick.LEFT_MOUSE)) {
                    if (this.isDragging()) {
                        this.currentDrag.target.center = {
                            x: e.x + this.currentDrag.centerOffset.x,
                            y: e.y + this.currentDrag.centerOffset.y,
                        };
                    }
                }
            });
        }

        public update() {
            if (this.shuriken.inputter.isDown(Shuriken.MouseClick.LEFT_MOUSE)) {
                if (!this.isDragging()) {
                    const mousePosition = this.shuriken.inputter.getMousePosition();
                    const target = this.getTarget(this.shuriken.entities.all(), mousePosition);
                    if (target !== undefined) {
                        this.startDrag(target, mousePosition);
                    }
                }
            } else {
                this.stopDrag();
            }
        }

        private isDragging() {
            return this.currentDrag !== undefined;
        }

        private getTarget(targets: Shuriken.IEntity[], e: Shuriken.IPoint) {
            for (const target of targets) {
                if (Shuriken.Maths.pointInsideObj(e, target)) {
                    return target as IDraggableEntity;
                }
            }
        }

        private startDrag(target: IDraggableEntity, e: Shuriken.IPoint) {
            this.currentDrag = {
                target,
                centerOffset: {
                    x: target.center.x - e.x,
                    y: target.center.y - e.y,
                },
            };

            if (target.startDrag !== undefined) {
                target.startDrag();
            }
        }

        private stopDrag() {
            if (this.isDragging()) {
                if (this.currentDrag.target.stopDrag !== undefined) {
                    this.currentDrag.target.stopDrag();
                }

                this.currentDrag = undefined;
            }
        }
    }

    export class CollisionCounter {

        public colliders: Shuriken.IEntity[] = [];
        private entity: Shuriken.IEntity;
        private collider: Shuriken.Collider;

        constructor(collider: Shuriken.Collider, entity: Shuriken.IEntity) {
            this.entity = entity;
            this.collider = collider;
        }

        public update() {
            this.colliders = this.colliders
                .filter((c) => this.collider.isColliding(this.entity, c));
        };

        public collision(other: Shuriken.IEntity) {
            if (this.colliders.indexOf(other) === -1) {
                this.colliders.push(other);
            }
        };
    }
}
