import Tool from "./Tool";

export default class Brush extends Tool {
    private mouseDown: boolean = false;

    constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string | null) {
        super(canvas, socket, id);
        this.listen();
    }

    private listen(): void {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    private mouseUpHandler(e: MouseEvent): void {
        this.mouseDown = false;

        if (this.socket && this.id) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'finish',
                }
            }));
        }
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDown = true;
        const target = e.target as HTMLElement;

        this.ctx.beginPath();
        this.ctx.moveTo(
            e.pageX - target.offsetLeft,
            e.pageY - target.offsetTop
        );
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.mouseDown && this.socket && this.id) {
            const target = e.target as HTMLElement;

            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - target.offsetLeft,
                    y: e.pageY - target.offsetTop
                }
            }));
        }
    }

    static draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}