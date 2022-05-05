// Canvas 
class Canvas {
    protected canvas: HTMLCanvasElement;

    constructor(private id: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(id);
        this.canvas.width = document.body.getElementsByTagName("canvas")[0].clientWidth;
        this.canvas.height = document.body.getElementsByTagName("canvas")[0].clientHeight
    }

    // 캔버스 엘리먼트 반환
    public getElment(): HTMLCanvasElement {
        return <HTMLCanvasElement> this.canvas;
    }

    // 2D 엔더링 컨텍스트 반환
    public getContext(): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D> this.canvas.getContext("2d");
    }
}


// Ball
interface Loopable {
    draw(): void;
    move(ball_list: Ball[]): void;
}


class Ball implements Loopable {
    // 자신이 그려질 캔버스
    protected canvas: Canvas;
    // x 좌표
    protected x: number;
    // y 좌표
    protected y: number;
    // X 방향으로의 움직임
    protected velX: number;
    // Y 방향으로의 움직임
    protected velY: number;
    // 볼 색상
    protected color: string;
    // 볼 반지름
    protected size: number;
    // 몇번째 볼인지 
    protected idx: number;

    constructor(canvas: Canvas, x: number, y: number, velX: number, velY: number, color: string, size: number, idx:number) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.idx = idx;
    }

    // 볼 그리기
    public draw(): void {
        let context = this.canvas.getContext();

        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    }

    // 볼 움직임
    public move(ball_list:Ball[]): void {
        // 캔버스 벽에 부딪혔을 때 로직 Start
        if((this.x + this.size) > this.canvas.getElment().width || (this.x + this.velX) < this.size) {
            this.velX = -(this.velX);
        }

        if((this.y + this.size) > this.canvas.getElment().height || (this.y + this.velY) < this.size) {
            this.velY = -(this.velY);
        }

        // 캔버스 벽에 부딪혔을 때 로직 End

        // 다른 공과 부딪혔을 때 로직 Start
        for(let ball of ball_list){
            if(this.idx != ball.idx){
                let distancX:number = Math.pow(this.x-ball.x,2);
                let distancY:number = Math.pow(this.y-ball.y,2);

                let move_obj = {
                    MoveBetween : Math.sqrt(distancX + distancY),
                    Between : this.size + ball.size
                }

                if(move_obj.MoveBetween <= move_obj.Between){
                    let changeX = this.velX;
                    let changeY = this.velY;
                    
                    this.velX = ball.velX;
                    this.velY = ball.velY;
                    ball.velX = changeX;
                    ball.velY = changeY;
                }
            }
        }
        // 다른 공과 부딪혔을 때 로직 End

        this.x += this.velX;
        this.y += this.velY;
    }
}

class Loop {
    protected canvas: Canvas;
    protected ballGenerator: BallGenerator;

    constructor(canvas: Canvas, ballGenerator: BallGenerator) {
        this.canvas = canvas;
        this.ballGenerator = ballGenerator;
    }

    // 설정한 볼 갯수 만큼 반복문 돌면서 캔버스에 볼 그림
    public start(): void {
        this.canvas.getContext().fillStyle = "rgba(255,255,255,0.7)";
        this.canvas.getContext().fillRect(0,0, this.canvas.getElment().width, this.canvas.getElment().height);

        let ball_list = this.ballGenerator.getAll();

        for(let ball of ball_list) {
            ball.draw();
            ball.move(ball_list);
        }

        requestAnimationFrame(this.start.bind(this));
    }
}

class BallGenerator {
    protected canvas: Canvas;
    protected balls: Ball[] = [];
    protected numberOfBalls: number;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.numberOfBalls = this.random(10, 20);
    }

    public generate(): BallGenerator {
        for(let i = 0; i < this.numberOfBalls; i++) {
            let velocityX: number = this.getRandomVelocity();
            let velocityY: number = this.getRandomVelocity();

            let size: number = this.getRandomSize();

            let x:number = this.getRandomX(size);
            let y:number = this.getRandomY(size);

            // 이미 그려진 볼과 겹치지 않기 위한 로직
            for(let ball of this.balls){
                if( i != ball["idx"]){
                    let distancX:number = Math.pow(x-ball["x"],2);
                    let distancY:number = Math.pow(y-ball["y"],2);

                    let ball_obj = {
                        MoveBetween : Math.sqrt(distancX + distancY),
                        Between : size + ball["size"]
                    }
                    
                    if(ball_obj.MoveBetween <= ball_obj.Between){
                        x = this.getRandomX(size);
                        y = this.getRandomY(size);
                    }
                }
            }

            let ball = new Ball(this.canvas, x, y, velocityX, velocityY, "#000000", size, i);
            this.add(ball);
        }

        return this;
    }

    // 볼 배열에 새로운 볼 넣기
    protected add(ball: Ball): void {
        this.balls.push(ball);
    }

    // 볼 배열 전부 가져오기
    public getAll(): Ball[] {
        return this.balls;
    }

    // 이동 방향 및 속도
    protected getRandomVelocity(): number {
        // 200px/s ~ 400px/s
        let velocity = this.random(Math.sqrt(50/9), Math.sqrt(200/9));
        let sign = this.random(-1, 1) === 0 ? 1 : -1; 
        return velocity*sign;
    }

    // 랜던 사이즈
    protected getRandomSize(): number {
        return this.random(10, 20);
    }

    // 첫 X 좌표
    protected getRandomX(size: number): number {
        return this.random(size, this.canvas.getElment().width - size);
    }

    // 첫 Y 좌표
    protected getRandomY(size: number): number {
        return this.random(size, this.canvas.getElment().height - size);
    }

    // 최소값 최대값 사이의 랜던값 얻기
    protected random(min: number, max: number): number {
        return Math.floor( Math.random() * (max - min) ) + min;
    }
}

function init(): void {
    let canvas = new Canvas("canvas");
    let ballGenerator = new BallGenerator(canvas);
    let loop = new Loop(canvas, ballGenerator.generate());
    loop.start();
}