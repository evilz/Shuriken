namespace Shuriken {

    interface IRun {
        obj: any;
        fn: Function;
    }

    export class Runner {

        private shuriken: Shuriken;
        private runs: IRun[] = [];

        constructor(shuriken: Shuriken) {
            this.shuriken = shuriken;
        }

        public update() {
            this.run();
        }

        public add(obj: any, fn: Function) {
            this.runs.push({ obj, fn });
        }

        private run() {
            while (this.runs.length > 0) {
                const run = this.runs.shift();
                run.fn(run.obj);
            }
        }
    }
}
