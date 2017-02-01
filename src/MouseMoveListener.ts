namespace Shuriken {

    export class MouseMoveListener {

        private bindings: Function[] = [];
        private mousePosition: IPoint;

        constructor(canvas: HTMLCanvasElement) {
            canvas.addEventListener("mousemove", (e) => {
                const absoluteMousePosition = this._getAbsoluteMousePosition(e);
                const elementPosition = this.getElementPosition(canvas);
                this.mousePosition = {
                    x: absoluteMousePosition.x - elementPosition.x,
                    y: absoluteMousePosition.y - elementPosition.y,
                };
            }, false);

            canvas.addEventListener("mousemove", (e) => {
                for (const binding of this.bindings) {
                    binding(this.getMousePosition());
                }
            }, false);
        }

        public bind(fn: Function) {
            this.bindings.push(fn);
        }

        public unbind(fn: Function) {
            for (let i = 0; i < this.bindings.length; i++) {
                if (this.bindings[i] === fn) {
                    this.bindings.splice(i, 1);
                    return;
                }
            }
            throw new Error("Function to unbind from mouse moves was never bound");
        }

        public getMousePosition() {
            return this.mousePosition;
        }

        private _getAbsoluteMousePosition(e: MouseEvent) {
            if (e.pageX) {
                return { x: e.pageX, y: e.pageY };
            } else if (e.clientX) {
                return { x: e.clientX, y: e.clientY };
            }
        }

        private getWindow(document: Document) {
            return document.defaultView;
        }

        private getElementPosition(element: HTMLCanvasElement) {
            const rect = element.getBoundingClientRect();
            const document = element.ownerDocument;
            const body = document.body;
            const window = this.getWindow(document);
            return {
                x: rect.left + (window.pageXOffset || body.scrollLeft) - (body.clientLeft || 0),
                y: rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0),
            };
        };

    }
}
