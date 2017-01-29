namespace shuriken {
    const interval = 16;

    export class Ticker {

        private _nextTickFn: FrameRequestCallback;
        private _gameLoop;

        constructor(shuriken: Shuriken, gameLoop) {
            this.setupRequestAnimationFrame();
            this._gameLoop = gameLoop;

            this.start();
        }

        private start() {
            let prev = Date.now();
            let tick = () => {
                var now = Date.now();
                var interval = now - prev;
                prev = now;
                this._gameLoop(interval);
                window.requestAnimationFrame(this._nextTickFn);
            };

            this._nextTickFn = tick;
            requestAnimationFrame(this._nextTickFn);
        };

        private stop = function () {
            this.nextTickFn = function () { };
        }

        private setupRequestAnimationFrame() {
            let lastTime = 0;
            let vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                    || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

        };
    }
}


