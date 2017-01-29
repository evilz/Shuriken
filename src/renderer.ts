namespace shuriken {

    export class Renderer {

        private _shuriken: Shuriken;
        private _game;
        private _context: CanvasRenderingContext2D;
        private _backgroundColor;

        private _viewSize;
        private _viewCenter;
        /**
         *
         */
        constructor(shuriken, game, canvas: HTMLCanvasElement, wView, hView, backgroundColor) {
            this._shuriken = shuriken;
            this._game = game;

            canvas.style.outline = "none";
            canvas.style.cursor = "default";

            this._context = canvas.getContext('2d');
            this._backgroundColor = backgroundColor;

            canvas.width = wView;
            canvas.height = hView;

            this._viewSize = { x: wView, y: hView };
            this._viewCenter = { x: this.viewSize.x / 2, y: this.viewSize.y / 2 };
        }

        get context() {
            return this._context;
        }

        get viewSize() {
            return this._viewSize;
        }

        get viewCenter() {
            return this._viewCenter;
        }

        set viewCenter(value) {
            this._viewCenter = value;
        }

        set background(color) {
            this._backgroundColor = color;
        }

        public update(interval: number) {
            let context = this.context;
            let viewTranslate = this.viewOffset(this._viewCenter, this._viewSize);

            context.translate(viewTranslate.x, viewTranslate.y);

            // draw background
            let viewArgs = [
                this._viewCenter.x - this._viewSize.x / 2,
                this._viewCenter.y - this._viewSize.y / 2,
                this._viewSize.x,
                this._viewSize.y
            ];

            if (this._backgroundColor !== undefined) {
                context.fillStyle = this._backgroundColor;
                context.fillRect.apply(context, viewArgs);
            }
            else {
                context.clearRect.apply(context, viewArgs);
            }

            // draw game and entities
            let drawables = [this._game]
                .concat(this._shuriken.entities.all().sort(this.zindexSort));

            for (var i = 0, len = drawables.length; i < len; i++) {
                if (drawables[i].draw !== undefined) {
                    let drawable = drawables[i];

                    context.save();

                    if (drawable.center !== undefined && drawable.angle !== undefined) {
                        context.translate(drawable.center.x, drawable.center.y);
                        context.rotate(drawable.angle * Maths.RADIANS_TO_DEGREES);
                        context.translate(-drawable.center.x, -drawable.center.y);
                    }

                    drawables[i].draw(context);

                    context.restore();
                }
            }
            context.translate(-viewTranslate.x, -viewTranslate.y);
        }

        public onScreen(obj) {
            return Maths.rectanglesIntersecting(obj, {
                size: this._viewSize,
                center: {
                    x: this._viewCenter.x,
                    y: this._viewCenter.y
                }
            });
        }

        private viewOffset(viewCenter, viewSize) {
            return {
                x: -(viewCenter.x - viewSize.x / 2),
                y: -(viewCenter.y - viewSize.y / 2),
            };
        }

        private zindexSort(a, b) {
            return (a.zindex || 0) < (b.zindex || 0) ? -1 : 1;
        }
    }
}