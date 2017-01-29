namespace shuriken {
    export class Runner {

        private _shuriken: Shuriken;
        private _runs = [];

        constructor(shuriken: Shuriken) {
            this._shuriken = shuriken;
        }

        public update() {
            this.run();
        }

        private run() {
            while (this._runs.length > 0) {
                let run = this._runs.shift();
                run.fn(run.ojb);
            }
        }

        public add(obj, fn) {
            this._runs.push({
                obj: obj,
                fn: fn
            });
        }
    }
}