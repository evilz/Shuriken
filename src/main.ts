namespace Shuriken {

    export class Shuriken {

        public readonly inputter: Inputter;
        public readonly entities: Entities;
        public readonly collider: Collider;

        private renderer: Renderer;
        private runner: Runner;
        private ticker: Ticker;

        constructor(game: any,
                    canvasId: string,
                    width: number,
                    height: number,
                    backgroundColor: string,
                    autoFocus: boolean) {

            const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

            this.renderer = new Renderer(this, game, canvas, width, height, backgroundColor);
            this.inputter = new Inputter(this, canvas, autoFocus);
            this.entities = new Entities(this, game);
            this.runner = new Runner(this);
            this.collider = new Collider(this);
            this.ticker = new Ticker(this, (interval: number) => {
                this.runner.update();
                if (game.update !== undefined) {
                    game.update(interval);
                }

                this.entities.update(interval);
                this.collider.update();
                this.renderer.update(interval);
                this.inputter.update();
            });
        }
    }
}
