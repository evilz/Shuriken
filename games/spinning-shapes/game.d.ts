/// <reference path="../../out/shuriken.d.ts" />
declare namespace spiningShapes {
    interface IDraggableEntity extends Shuriken.IEntity {
        startDrag: Function;
    }
    class Game {
        shuriken: Shuriken.Shuriken;
        private dragger;
        constructor();
        update(interval: number): void;
        private randomDirection();
        private movingOnscreenVec(dirFromCenter);
        private offscreenPosition(dirFromCenter, viewSize, viewCenter);
        private isOutOfView(obj, viewSize, viewCenter);
    }
    class Rectangle implements IDraggableEntity {
        angle: number;
        center: Shuriken.IPoint;
        size: Shuriken.ISize;
        private shuriken;
        private vec;
        private turnSpeed;
        private collisionCounter;
        constructor(game: Game, settings: any);
        update(): void;
        draw(ctx: CanvasRenderingContext2D): void;
        collision(other: Shuriken.IEntity): void;
        startDrag(): void;
    }
    class Circle implements IDraggableEntity {
        angle: number;
        center: Shuriken.IPoint;
        size: Shuriken.ISize;
        boundingBox: Shuriken.ColliderShape;
        private shuriken;
        private vec;
        private turnSpeed;
        private collisionCounter;
        constructor(game: Game, settings: any);
        update(): void;
        draw(ctx: CanvasRenderingContext2D): void;
        collision(other: Shuriken.IEntity): void;
        startDrag(): void;
    }
    class Dragger {
        private shuriken;
        private currentDrag;
        constructor(shuriken: Shuriken.Shuriken);
        update(): void;
        private isDragging();
        private getTarget(targets, e);
        private startDrag(target, e);
        private stopDrag();
    }
    class CollisionCounter {
        colliders: Shuriken.IEntity[];
        private entity;
        private collider;
        constructor(collider: Shuriken.Collider, entity: Shuriken.IEntity);
        update(): void;
        collision(other: Shuriken.IEntity): void;
    }
}
