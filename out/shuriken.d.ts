declare namespace Shuriken {
    class ButtonListener {
        private buttonDownState;
        private buttonPressedState;
        constructor(canvas: HTMLCanvasElement, keyboardReceiver: EventTarget);
        update(): void;
        isDown(button: number): boolean;
        isPressed(button: number): boolean;
        private _down(buttonId);
        private _up(buttonId);
        private _getMouseButton(e);
    }
}
declare namespace Shuriken {
    class Collider {
        private shuriken;
        private currentCollisionPairs;
        constructor(shuriken: Shuriken);
        update(): void;
        createEntity(entity: IEntity): void;
        destroyEntity(entity: IEntity): void;
        isColliding(obj1: IEntity, obj2: IEntity): boolean;
        isIntersecting(obj1: IEntity, obj2: IEntity): boolean;
        private isSetupForCollisions(obj);
        private collision(entity1, entity2);
        private getBoundingBox(obj);
        private notifyEntityOfCollision(entity, other);
    }
}
declare namespace Shuriken {
    enum ColliderShape {
        RECTANGLE = 0,
        CIRCLE = 1,
    }
}
declare namespace Shuriken {
    class Entities {
        private shuriken;
        private game;
        private entities;
        constructor(shuriken: Shuriken, game: any);
        update(interval: number): void;
        all(Constructor?: FunctionConstructor): IEntity[];
        create(Constructor: new (...args: any[]) => IEntity, settings: any): IEntity;
        destroy(entity: IEntity): void;
    }
}
declare namespace Shuriken {
    interface IPoint {
        x: number;
        y: number;
    }
    interface ISize {
        width: number;
        height: number;
    }
    interface IMinMax {
        min: number;
        max: number;
    }
    interface IEntityShape {
        center: IPoint;
        size: ISize;
        angle?: number;
        boundingBox?: ColliderShape;
    }
    interface IEntity extends IEntityShape {
        zindex?: number;
        update(timeSinceLastTick: number): void;
        draw(canvasCtx: CanvasRenderingContext2D): void;
        collision(other: IEntity): void;
    }
}
declare namespace Shuriken {
    class Inputter {
        private buttonListener;
        private mouseMoveListener;
        constructor(shuriken: Shuriken, canvas: HTMLCanvasElement, autoFocus: boolean);
        update(): void;
        isDown(button: number): boolean;
        isPressed(button: number): boolean;
        getMousePosition(): IPoint;
        bindMouseMove(fn: Function): void;
        unbindMouseMove(fn: Function): void;
        private connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);
    }
}
declare namespace Shuriken {
    enum MouseClick {
        LEFT_MOUSE = 0,
        RIGHT_MOUSE = 1,
    }
    enum KeyboardButton {
        BACKSPACE = 8,
        TAB = 9,
        ENTER = 13,
        SHIFT = 16,
        CTRL = 17,
        ALT = 18,
        PAUSE = 19,
        CAPS_LOCK = 20,
        ESC = 27,
        SPACE = 32,
        PAGE_UP = 33,
        PAGE_DOWN = 34,
        END = 35,
        HOME = 36,
        LEFT_ARROW = 37,
        UP_ARROW = 38,
        RIGHT_ARROW = 39,
        DOWN_ARROW = 40,
        INSERT = 45,
        DELETE = 46,
        ZERO = 48,
        ONE = 49,
        TWO = 50,
        THREE = 51,
        FOUR = 52,
        FIVE = 53,
        SIX = 54,
        SEVEN = 55,
        EIGHT = 56,
        NINE = 57,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        NUM_LOCK = 144,
        SCROLL_LOCK = 145,
        SEMI_COLON = 186,
        EQUALS = 187,
        COMMA = 188,
        DASH = 189,
        PERIOD = 190,
        FORWARD_SLASH = 191,
        GRAVE_ACCENT = 192,
        OPEN_SQUARE_BRACKET = 219,
        BACK_SLASH = 220,
        CLOSE_SQUARE_BRACKET = 221,
        SINGLE_QUOTE = 222,
    }
}
declare namespace Shuriken {
    class Shuriken {
        readonly inputter: Inputter;
        readonly entities: Entities;
        readonly collider: Collider;
        private renderer;
        private runner;
        private ticker;
        constructor(game: any, canvasId: string, width: number, height: number, backgroundColor: string, autoFocus: boolean);
    }
}
declare namespace Shuriken {
    class Maths {
        static readonly RADIANS_TO_DEGREES: number;
        static circlesIntersecting(obj1: IEntity, obj2: IEntity): boolean;
        static rectanglesIntersecting(obj1: IEntityShape, obj2: IEntityShape): boolean;
        static circleAndRectangleIntersecting(circleObj: IEntity, rectangleObj: IEntity): boolean;
        static unrotatedRectanglesIntersecting(obj1: IEntityShape, obj2: IEntityShape): boolean;
        static rotatedRectanglesIntersecting(obj1: IEntityShape, obj2: IEntityShape): boolean;
        static pointInsideObj(point: IPoint, obj: IEntity): boolean;
        static pointInsideRectangle(point: IPoint, obj: IEntity): boolean;
        static pointInsideCircle(point: IPoint, obj: IEntity): boolean;
        static distance(point1: IPoint, point2: IPoint): number;
        static vectorTo(start: IPoint, end: IPoint): {
            x: number;
            y: number;
        };
        static magnitude(vector: IPoint): number;
        static leftNormalizedNormal(vector: IPoint): {
            x: number;
            y: number;
        };
        static dotProduct(vector1: IPoint, vector2: IPoint): number;
        static unitVector(vector: IPoint): {
            x: number;
            y: number;
        };
        static projectionsSeparate(proj1: IMinMax, proj2: IMinMax): boolean;
        static getMinMaxProjection(objCorners: IPoint[], normal: IPoint): {
            min: number;
            max: number;
        };
        static rectangleCorners(obj: IEntityShape): {
            x: number;
            y: number;
        }[];
        static rectangleSideVectors(obj: IEntityShape): {
            x: number;
            y: number;
        }[];
        static rectanglePerpendicularNormals(obj: IEntityShape): {
            x: number;
            y: number;
        }[];
        private static rotated(obj);
        private static getAngle(obj);
        private static getBoundingBox(obj);
    }
}
declare namespace Shuriken {
    class MouseMoveListener {
        private bindings;
        private mousePosition;
        constructor(canvas: HTMLCanvasElement);
        bind(fn: Function): void;
        unbind(fn: Function): void;
        getMousePosition(): IPoint;
        private _getAbsoluteMousePosition(e);
        private getWindow(document);
        private getElementPosition(element);
    }
}
declare namespace Shuriken {
    class Renderer {
        readonly context: CanvasRenderingContext2D;
        readonly viewSize: ISize;
        viewCenter: IPoint;
        backgroundColor: string;
        private shuriken;
        private game;
        constructor(shuriken: Shuriken, game: any, canvas: HTMLCanvasElement, wView: number, hView: number, backgroundColor: string);
        update(interval: number): void;
        onScreen(obj: IEntityShape): boolean;
        private viewOffset(viewCenter, viewSize);
        private zindexSort(a, b);
    }
}
declare namespace Shuriken {
    class Runner {
        private shuriken;
        private runs;
        constructor(shuriken: Shuriken);
        update(): void;
        add(obj: any, fn: Function): void;
        private run();
    }
}
declare namespace Shuriken {
    class Ticker {
        private nextTickFn;
        private gameLoop;
        constructor(shuriken: Shuriken, gameLoop: Function);
        private start();
        private stop();
        private setupRequestAnimationFrame();
    }
}
