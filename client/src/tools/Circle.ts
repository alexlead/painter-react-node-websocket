import Tool from "./Tool";

export default class Circle extends Tool {
    private mouseDown: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private saved: string = "";

    constructor(canvas: HTMLCanvasElement, socket: WebSocket | null, id: string | null) {
        super(canvas, socket, id);
        this.listen();
    }

    private listen(): void {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDown = true;
        const target = e.target as HTMLElement;
        this.ctx.beginPath();
        this.startX = e.pageX - target.offsetLeft;
        this.startY = e.pageY - target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }

    private mouseUpHandler(e: MouseEvent): void {
        this.mouseDown = false;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.mouseDown) {
            const target = e.target as HTMLElement;
            let currentX = e.pageX - target.offsetLeft;
            let currentY = e.pageY - target.offsetTop;

            let width = currentX - this.startX;
            let height = currentY - this.startY;

            let r = Math.sqrt(width ** 2 + height ** 2);

            this.draw(this.startX, this.startY, r);
        }
    }

    private draw(x: number, y: number, r: number): void {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        };
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}