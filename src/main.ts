namespace shuriken {

    export class Shuriken {

        private _renderer: Renderer;
        private _inputter: Inputter;
        private _entities: Entities;
        private _runner: Runner;
        private _collider: Collider;
        private _ticker: Ticker;

        constructor(game, canvasId, width, height, backgroundColor, autoFocus) {
            let canvas = document.getElementById(canvasId) as HTMLCanvasElement;

            this._renderer = new Renderer(this, game, canvas, width, height, backgroundColor);
            this._inputter = new Inputter(this, canvas, autoFocus);
            this._entities = new Entities(this, game);
            this._runner = new Runner(this);
            this._collider = new Collider(this);
            this._ticker = new Ticker(this, (interval)=> {
                this._runner.update();
                if (game.update !== undefined) {
                    game.update(interval);
                }

                this._entities.update(interval);
                this._collider.update();
                this._renderer.update(interval);
                this._inputter.update();
            })
        }

        get entities(): Entities {
            return this._entities;
        }

        get collider(): Collider {
            return this._collider;
        }

         get inputter(): Inputter {
            return this._inputter;
        }
    }
}