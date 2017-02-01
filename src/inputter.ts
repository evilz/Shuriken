namespace Shuriken {

  type keyboardReceiver = Window | HTMLCanvasElement;

  export class Inputter {

    private buttonListener: ButtonListener;
    private mouseMoveListener: MouseMoveListener;

    constructor(shuriken: Shuriken, canvas: HTMLCanvasElement, autoFocus: boolean) {
      const keyboardReceiver = autoFocus === false ? canvas : window;
      this.connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);

      this.buttonListener = new ButtonListener(canvas, keyboardReceiver);
      this.mouseMoveListener = new MouseMoveListener(canvas);

    }

    public update() {
      this.buttonListener.update();
    }

    public isDown(button: number) {
      return this.buttonListener.isDown(button);
    }

    public isPressed(button: number) {
      return this.buttonListener.isPressed(button);
    }

    public getMousePosition() {
      return this.mouseMoveListener.getMousePosition();
    }

    public bindMouseMove(fn: Function) {
      return this.mouseMoveListener.bind(fn);
    }

    public unbindMouseMove(fn: Function) {
      return this.mouseMoveListener.unbind(fn);
    }

    private connectReceiverToKeyboard(keyboardReceiver: keyboardReceiver, window: Window, autoFocus: boolean) {
      if (autoFocus === false) {
        if ((keyboardReceiver as HTMLCanvasElement).contentEditable) {
          (keyboardReceiver as HTMLCanvasElement).contentEditable = "true";
        }
      } else {
        const suppressedKeys = [
          KeyboardButton.SPACE,
          KeyboardButton.LEFT_ARROW,
          KeyboardButton.UP_ARROW,
          KeyboardButton.RIGHT_ARROW,
          KeyboardButton.DOWN_ARROW,
        ];

        // suppress scrolling
        window.addEventListener("keydown", (e) => {
          for (const suppressedKey of suppressedKeys) {
            if (suppressedKey === e.keyCode) {
              e.preventDefault();
              return;
            }
          }
        }, false);
      }
    };
  }
}
