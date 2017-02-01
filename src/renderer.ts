namespace Shuriken {

    export class Renderer {

        public readonly context: CanvasRenderingContext2D;
        public readonly viewSize: ISize;
        public viewCenter: IPoint;
        public backgroundColor: string;

        private shuriken: Shuriken;
        private game: any;

        constructor(shuriken: Shuriken,
                    game: any,
                    canvas: HTMLCanvasElement,
                    wView: number,
                    hView: number,
                    backgroundColor: string) {

            this.shuriken = shuriken;
            this.game = game;

            canvas.style.outline = "none";
            canvas.style.cursor = "default";

            this.context = canvas.getContext("2d");
            this.backgroundColor = backgroundColor;

            canvas.width = wView;
            canvas.height = hView;

            this.viewSize = { width: wView, height: hView };
            this.viewCenter = { x: this.viewSize.width / 2, y: this.viewSize.height / 2 };
        }

        public update(interval: number) {
            const context = this.context;
            const viewTranslate = this.viewOffset(this.viewCenter, this.viewSize);

            context.translate(viewTranslate.x, viewTranslate.y);

            // draw background
            const viewArgs = [
                this.viewCenter.x - this.viewSize.width / 2,
                this.viewCenter.y - this.viewSize.height / 2,
                this.viewSize.width,
                this.viewSize.height,
            ];

            if (this.backgroundColor !== undefined) {
                context.fillStyle = this.backgroundColor;
                context.fillRect.apply(context, viewArgs);
            } else {
                context.clearRect.apply(context, viewArgs);
            }

            // draw game and entities
            const drawables = [this.game]
                .concat(this.shuriken.entities.all().sort(this.zindexSort));

            for (const drawable of drawables) {
                if (drawable.draw !== undefined) {

                    context.save();

                    if (drawable.center !== undefined && drawable.angle !== undefined) {
                        context.translate(drawable.center.x, drawable.center.y);
                        context.rotate(drawable.angle * Maths.RADIANS_TO_DEGREES);
                        context.translate(-drawable.center.x, -drawable.center.y);
                    }

                    drawable.draw(context);

                    context.restore();
                }
            }
            context.translate(-viewTranslate.x, -viewTranslate.y);
        }

        public onScreen(obj: IEntityShape) {
            return Maths.rectanglesIntersecting(obj, {
                center: {
                    x: this.viewCenter.x,
                    y: this.viewCenter.y,
                },
                size: this.viewSize,
            });
        }

        private viewOffset(viewCenter: IPoint, viewSize: ISize) {
            return {
                x: -(viewCenter.x - viewSize.width / 2),
                y: -(viewCenter.y - viewSize.height / 2),
            };
        }

        private zindexSort(a: IEntity, b: IEntity) {
            return (a.zindex || 0) < (b.zindex || 0) ? -1 : 1;
        }
    }
}
