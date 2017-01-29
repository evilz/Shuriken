namespace shuriken{

export class ButtonListener {

    private _buttonDownState = {};
    private _buttonPressedState = {};

    constructor(canvas, keyboardReceiver) {
        keyboardReceiver.addEventListener('keydown', (e) => {
            this._down(e.keyCode);
        }, false);

        keyboardReceiver.addEventListener('keyup', (e) => {
            this._up(e.keyCode);
        }, false);

        canvas.addEventListener('mousedown', (e) => {
            this._down(this._getMouseButton(e));
        }, false);

        canvas.addEventListener('mouseup', (e) => {
            this._up(this._getMouseButton(e));
        }, false);
    }

    public update() {
        for (var i in this._buttonPressedState) {
            if (this._buttonPressedState[i] === true) {
                this._buttonPressedState[i] = false;
            }
        }
    }

    private _down(buttonId) {
        this._buttonDownState[buttonId] = true;
        if (this._buttonPressedState[buttonId] === undefined) {
            this._buttonPressedState[buttonId] = true;
        }
    }

    private _up(buttonId) {
        this._buttonDownState[buttonId] = false;
        if (this._buttonPressedState[buttonId] === false) {
            this._buttonPressedState[buttonId] = undefined;
        }
    }

    public isDown(button): boolean {
        return this._buttonDownState[button] || false;
    }

    public isPressed(button): boolean {
        return this._buttonPressedState[button] || false;
    }

    private _getMouseButton(e) {
        if (e.which !== undefined || e.button !== undefined) {
            if (e.which === 3 || e.button === 2) {
                return MouseClick.RIGHT_MOUSE;
            } else if (e.which === 1 || e.button === 0 || e.button === 1) {
                return MouseClick.LEFT_MOUSE;
            }
        }
          throw "Cannot judge button pressed on passed mouse button event";
    }

  }
}
