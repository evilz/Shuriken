namespace Shuriken {

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface ISize {
        width: number;
        height: number;
    }

    export interface IMinMax {
        min: number;
        max: number;
    }

    export interface IEntityShape {
        center: IPoint;
        size: ISize;
        angle?: number;
        boundingBox?: ColliderShape;
    }

    export interface IEntity extends IEntityShape {
        zindex?: number;
        update(timeSinceLastTick: number): void;
        draw(canvasCtx: CanvasRenderingContext2D): void;
        collision(other: IEntity): void;
    }
}
