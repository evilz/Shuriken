namespace shuriken {

    export class MouseMoveListener {

        private _bindings = [];
        private _mousePosition;

        constructor(canvas: HTMLCanvasElement) {
            canvas.addEventListener('mousemove', (e) => {
                let absoluteMousePosition = this._getAbsoluteMousePosition(e);
                let elementPosition = this.getElementPosition(canvas);
                this._mousePosition = {
                    x: absoluteMousePosition.x - elementPosition.x,
                    y: absoluteMousePosition.y - elementPosition.y
                };
            }, false);

            canvas.addEventListener('mousemove', (e) => {
                for (var i = 0; i < this._bindings.length; i++) {
                    this._bindings[i](this.getMousePosition());
                }
            }, false);

        }

        public bind(fn) {
            this._bindings.push(fn);
        }

        public unbind(fn) {
            for (var i = 0; i < this._bindings.length; i++) {
                if (this._bindings[i] === fn) {
                    this._bindings.splice(i, 1);
                    return;
                }
            }
            throw "Function to unbind from mouse moves was never bound";
        }

        public getMousePosition() {
            return this._mousePosition;
        }

        private _getAbsoluteMousePosition(e) {
            if (e.pageX) {
                return { x: e.pageX, y: e.pageY };
            } else if (e.clientX) {
                return { x: e.clientX, y: e.clientY };
            }
        }

        private getWindow = function (document) {
            return document.parentWindow || document.defaultView;
        }

        private getElementPosition(element) {
            var rect = element.getBoundingClientRect();
            var document = element.ownerDocument;
            var body = document.body;
            var window = this.getWindow(document);
            return {
                x: rect.left + (window.pageXOffset || body.scrollLeft) - (body.clientLeft || 0),
                y: rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0)
            };
        };

    }
}