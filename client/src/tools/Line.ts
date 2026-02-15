import Tool from "./Tool";

export default class Line extends Tool {
    private mouseDown: boolean = false;
    private currentX: number = 0;
    private currentY: number = 0;
    private saved: string = "";

    constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string | null) {
        super(canvas, socket, id);
        this.listen();
    }

    private listen(): void {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDown = true;
        const target = e.target as HTMLElement;
        this.currentX = e.pageX - target.offsetLeft;
        this.currentY = e.pageY - target.offsetTop;

        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY);
        this.saved = this.canvas.toDataURL();
    }

    private mouseUpHandler(e: MouseEvent): void {
        this.mouseDown = false;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.mouseDown) {
            const target = e.target as HTMLElement;
            this.draw(e.pageX - target.offsetLeft, e.pageY - target.offsetTop);
        }
    }

    private draw(x: number, y: number): void {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentX, this.currentY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        };
    }
}