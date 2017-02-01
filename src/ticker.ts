namespace Shuriken {
    // const interval = 16;

    export class Ticker {

        private nextTickFn: FrameRequestCallback;
        private gameLoop: Function;

        constructor(shuriken: Shuriken, gameLoop: Function) {
            this.setupRequestAnimationFrame();
            this.gameLoop = gameLoop;

            this.start();
        }

        private start() {
            let prev = Date.now();
            const tick = () => {
                const now = Date.now();
                const interval = now - prev;
                prev = now;
                this.gameLoop(interval);
                window.requestAnimationFrame(this.nextTickFn);
            };

            this.nextTickFn = tick;
            requestAnimationFrame(this.nextTickFn);
        };

        private stop() {
            this.nextTickFn = () => null; ;
        }

        private setupRequestAnimationFrame() {
            const lastTime = 0;
            const vendors = ["ms", "moz", "webkit", "o"];
            const win = window as any;
            for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = win[vendors[x] + "RequestAnimationFrame"];
                window.cancelAnimationFrame = win[vendors[x] + "CancelAnimationFrame"]
                    || win[vendors[x] + "CancelRequestAnimationFrame"];
            }
        };
    }
}
