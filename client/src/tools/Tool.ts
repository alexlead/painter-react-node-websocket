export default class Tool {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected socket: WebSocket | null;
    protected id: string | null;

    constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string | null) {
        this.canvas = canvas;
        this.socket = socket;
        this.id = id;

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error("Could not get 2D context from canvas");
        }
        this.ctx = context;

        this.destroyEvents();
    }

    set fillColor(color: string) {
        this.ctx.fillStyle = color;
    }

    set strokeColor(color: string) {
        this.ctx.strokeStyle = color;
    }

    set lineWidth(width: number) {
        this.ctx.lineWidth = width;
    }

    destroyEvents(): void {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}