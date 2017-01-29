declare namespace shuriken {
    class ButtonListener {
        private _buttonDownState;
        private _buttonPressedState;
        constructor(canvas: any, keyboardReceiver: any);
        update(): void;
        private _down(buttonId);
        private _up(buttonId);
        isDown(button: any): boolean;
        isPressed(button: any): boolean;
        private _getMouseButton(e);
    }
}
declare namespace shuriken {
    class Collider {
        static readonly RECTANGLE: number;
        static readonly CIRCLE: number;
        private _shuriken;
        private _currentCollisionPairs;
        constructor(shuriken: Shuriken);
        private isSetupForCollisions(obj);
        update(): void;
        private collision(entity1, entity2);
        createEntity(entity: any): void;
        destroyEntity(entity: any): void;
        isColliding(obj1: any, obj2: any): boolean;
        isIntersecting(obj1: any, obj2: any): boolean;
        private getBoundingBox(obj);
        private notifyEntityOfCollision(entity, other);
    }
}
declare namespace shuriken {
    class Entities {
        private _shuriken;
        private _game;
        private _entities;
        constructor(shuriken: Shuriken, game: any);
        update(interval: number): void;
        all(Constructor?: any): any[];
        create(Constructor: any, settings: any): any;
        destroy(entity: any): void;
    }
}
declare namespace shuriken {
    class Inputter {
        private _buttonListener;
        private _mouseMoveListener;
        constructor(shuriken: Shuriken, canvas: any, autoFocus: any);
        update(): void;
        isDown(button: any): any;
        isPressed(button: any): any;
        getMousePosition(): any;
        bindMouseMove(fn: any): any;
        unbindMouseMove(fn: any): any;
        private connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);
    }
}
declare namespace shuriken {
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
declare namespace shuriken {
    class Shuriken {
        private _renderer;
        private _inputter;
        private _entities;
        private _runner;
        private _collider;
        private _ticker;
        constructor(game: any, canvasId: any, width: any, height: any, backgroundColor: any, autoFocus: any);
        readonly entities: Entities;
        readonly collider: Collider;
        readonly inputter: Inputter;
    }
}
declare namespace shuriken {
    class Maths {
        static circlesIntersecting(obj1: any, obj2: any): boolean;
        static rectanglesIntersecting(obj1: any, obj2: any): boolean;
        static circleAndRectangleIntersecting(circleObj: any, rectangleObj: any): boolean;
        static unrotatedRectanglesIntersecting(obj1: any, obj2: any): boolean;
        static rotatedRectanglesIntersecting(obj1: any, obj2: any): boolean;
        static pointInsideObj(point: any, obj: any): boolean;
        static pointInsideRectangle(point: any, obj: any): boolean;
        static pointInsideCircle(point: any, obj: any): boolean;
        static distance(point1: any, point2: any): number;
        static vectorTo(start: any, end: any): {
            x: number;
            y: number;
        };
        static magnitude(vector: any): number;
        static leftNormalizedNormal(vector: any): {
            x: number;
            y: any;
        };
        static dotProduct(vector1: any, vector2: any): number;
        static unitVector(vector: any): {
            x: number;
            y: number;
        };
        static projectionsSeparate(proj1: any, proj2: any): boolean;
        static getMinMaxProjection(objCorners: any, normal: any): {
            min: number;
            max: number;
        };
        static rectangleCorners(obj: any): {
            x: any;
            y: any;
        }[];
        static rectangleSideVectors(obj: any): {
            x: number;
            y: number;
        }[];
        static rectanglePerpendicularNormals(obj: any): {
            x: number;
            y: any;
        }[];
        private static rotated(obj);
        private static getAngle;
        static getBoundingBox(obj: any): any;
        static readonly RADIANS_TO_DEGREES: number;
    }
}
declare namespace shuriken {
    class MouseMoveListener {
        private _bindings;
        private _mousePosition;
        constructor(canvas: HTMLCanvasElement);
        bind(fn: any): void;
        unbind(fn: any): void;
        getMousePosition(): any;
        private _getAbsoluteMousePosition(e);
        private getWindow;
        private getElementPosition(element);
    }
}
declare namespace shuriken {
    class Renderer {
        private _shuriken;
        private _game;
        private _context;
        private _backgroundColor;
        private _viewSize;
        private _viewCenter;
        /**
         *
         */
        constructor(shuriken: any, game: any, canvas: HTMLCanvasElement, wView: any, hView: any, backgroundColor: any);
        readonly context: CanvasRenderingContext2D;
        readonly viewSize: any;
        viewCenter: any;
        background: any;
        update(interval: number): void;
        onScreen(obj: any): boolean;
        private viewOffset(viewCenter, viewSize);
        private zindexSort(a, b);
    }
}
declare namespace shuriken {
    class Runner {
        private _shuriken;
        private _runs;
        constructor(shuriken: Shuriken);
        update(): void;
        private run();
        add(obj: any, fn: any): void;
    }
}
declare namespace shuriken {
    class Ticker {
        private _nextTickFn;
        private _gameLoop;
        constructor(shuriken: Shuriken, gameLoop: any);
        private start();
        private stop;
        private setupRequestAnimationFrame();
    }
}
