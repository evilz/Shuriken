namespace Shuriken {

    export class ButtonListener {

        private buttonDownState: any = {};
        private buttonPressedState: any = {};

        constructor(canvas: HTMLCanvasElement, keyboardReceiver: EventTarget) {
            keyboardReceiver.addEventListener("keydown", (e: KeyboardEvent) => this._down(e.keyCode), false);

            keyboardReceiver.addEventListener("keyup", (e: KeyboardEvent) => this._up(e.keyCode), false);

            canvas.addEventListener("mousedown", (e) => this._down(this._getMouseButton(e)), false);

            canvas.addEventListener("mouseup", (e) => this._up(this._getMouseButton(e)), false);
        }

        public update() {
            for (const i in this.buttonPressedState) {
                if (this.buttonPressedState[i] === true) {
                    this.buttonPressedState[i] = false;
                }
            }
        }

        public isDown(button: number): boolean {
            return this.buttonDownState[button] || false;
        }

        public isPressed(button: number): boolean {
            return this.buttonPressedState[button] || false;
        }

        private _down(buttonId: number) {
            this.buttonDownState[buttonId] = true;
            if (this.buttonPressedState[buttonId] === undefined) {
                this.buttonPressedState[buttonId] = true;
            }
        }

        private _up(buttonId: number) {
            this.buttonDownState[buttonId] = false;
            if (this.buttonPressedState[buttonId] === false) {
                this.buttonPressedState[buttonId] = undefined;
            }

        }



        private _getMouseButton(e: MouseEvent) {
            if (e.which !== undefined || e.button !== undefined) {
                if (e.which === 3 || e.button === 2) {
                    return MouseClick.RIGHT_MOUSE;
                } else if (e.which === 1 || e.button === 0 || e.button === 1) {
                    return MouseClick.LEFT_MOUSE;
                }
            }
            throw new Error("Cannot judge button pressed on passed mouse button event");
        }

    }
}
