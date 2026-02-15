import Tool from "./Tool";

export default class Rect extends Tool {
    private mouseDown: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private saved: string = "";
    private width: number = 0;
    private height: number = 0;

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
                    type: 'rect',
                    x: this.startX,
                    y: this.startY,
                    width: this.width,
                    height: this.height,
                    color: this.ctx.fillStyle
                }
            }));
        }
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.mouseDown = true;
        const target = e.target as HTMLElement;
        this.ctx.beginPath();
        this.startX = e.pageX - target.offsetLeft;
        this.startY = e.pageY - target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.mouseDown) {
            const target = e.target as HTMLElement;
            let currentX = e.pageX - target.offsetLeft;
            let currentY = e.pageY - target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    private draw(x: number, y: number, w: number, h: number): void {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.rect(x, y, w, h);
            this.ctx.fill();
            this.ctx.stroke();
        };
    }

    static staticDraw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        color: string | CanvasGradient | CanvasPattern
    ): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.stroke();
    }
}