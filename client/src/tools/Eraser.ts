import Brush from "./Brush";

export default class Eraser extends Brush {
    constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string | null) {
        super(canvas, socket, id);
    }

    static draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        const previousColor = ctx.strokeStyle;

        ctx.strokeStyle = "white";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.strokeStyle = previousColor;
    }
}