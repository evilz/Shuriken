namespace shuriken {

  export class Inputter {

    private _buttonListener;
    private _mouseMoveListener;

    constructor(shuriken: Shuriken, canvas, autoFocus) {
      let keyboardReceiver = autoFocus === false ? canvas : window;
      this.connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);

      this._buttonListener = new ButtonListener(canvas, keyboardReceiver);
      this._mouseMoveListener = new MouseMoveListener(canvas);

    }

    public update() {
      this._buttonListener.update();
    }

    public isDown(button) {
      return this._buttonListener.isDown(button);
    }

    public isPressed(button) {
      return this._buttonListener.isPressed(button);
    }

    public getMousePosition() {
      return this._mouseMoveListener.getMousePosition();
    }

    public bindMouseMove(fn) {
      return this._mouseMoveListener.bind(fn);
    }

    public unbindMouseMove(fn) {
      return this._mouseMoveListener.unbind(fn);
    }

    private connectReceiverToKeyboard(keyboardReceiver, window, autoFocus) {
      if (autoFocus === false) {
        keyboardReceiver.contentEditable = true; // lets canvas get focus and get key events
      } else {
        var suppressedKeys = [
          KeyboardButton.SPACE,
          KeyboardButton.LEFT_ARROW,
          KeyboardButton.UP_ARROW,
          KeyboardButton.RIGHT_ARROW,
          KeyboardButton.DOWN_ARROW
        ];

        // suppress scrolling
        window.addEventListener("keydown", function (e) {
          for (var i = 0; i < suppressedKeys.length; i++) {
            if (suppressedKeys[i] === e.keyCode) {
              e.preventDefault();
              return;
            }
          }
        }, false);
      }
    };
  }
}