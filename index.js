// Canvas 
var Canvas = /** @class */ (function () {
    function Canvas(id) {
        this.id = id;
        this.canvas = document.getElementById(id);
        this.canvas.width = document.body.getElementsByTagName("canvas")[0].clientWidth;
        this.canvas.height = document.body.getElementsByTagName("canvas")[0].clientHeight;
    }
    // 캔버스 엘리먼트 반환
    Canvas.prototype.getEl = function () {
        return this.canvas;
    };
    // 2D 엔더링 컨텍스트 반환
    Canvas.prototype.getContext = function () {
        return this.canvas.getContext("2d");
    };
    return Canvas;
}());
var Ball = /** @class */ (function () {
    function Ball(canvas, x, y, velX, velY, color, size, idx) {
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
    Ball.prototype.draw = function () {
        var context = this.canvas.getContext();
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    };
    // 볼 움직임
    Ball.prototype.move = function (ball_list) {
        // 캔버스 벽에 부딪혔을 때 로직 Start
        if ((this.x + this.size) > this.canvas.getEl().width || (this.x + this.velX) < this.size) {
            this.velX = -(this.velX);
        }
        if ((this.y + this.size) > this.canvas.getEl().height || (this.y + this.velY) < this.size) {
            this.velY = -(this.velY);
        }
        // 캔버스 벽에 부딪혔을 때 로직 End
        // 다른 공과 부딪혔을 때 로직 Start
        for (var _i = 0, ball_list_1 = ball_list; _i < ball_list_1.length; _i++) {
            var ball = ball_list_1[_i];
            if (this.idx != ball.idx) {
                var distancX = Math.pow(this.x - ball.x, 2);
                var distancY = Math.pow(this.y - ball.y, 2);
                var move_obj = {
                    MoveBetween: Math.sqrt(distancX + distancY),
                    Between: this.size + ball.size
                };
                if (move_obj.MoveBetween <= move_obj.Between) {
                    var changeX = this.velX;
                    var changeY = this.velY;
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
    };
    return Ball;
}());
var Loop = /** @class */ (function () {
    function Loop(canvas, ballGenerator) {
        this.canvas = canvas;
        this.ballGenerator = ballGenerator;
    }
    // 설정한 볼 갯수 만큼 반복문 돌면서 캔버스에 볼 그림
    Loop.prototype.start = function () {
        this.canvas.getContext().fillStyle = "rgba(255,255,255,0.7)";
        this.canvas.getContext().fillRect(0, 0, this.canvas.getEl().width, this.canvas.getEl().height);
        var ball_list = this.ballGenerator.getAll();
        for (var _i = 0, ball_list_2 = ball_list; _i < ball_list_2.length; _i++) {
            var ball = ball_list_2[_i];
            ball.draw();
            ball.move(ball_list);
        }
        requestAnimationFrame(this.start.bind(this));
    };
    return Loop;
}());
var BallGenerator = /** @class */ (function () {
    function BallGenerator(canvas) {
        this.balls = [];
        this.canvas = canvas;
        this.numberOfBalls = this.random(10, 20);
    }
    BallGenerator.prototype.generate = function () {
        for (var i = 0; i < this.numberOfBalls; i++) {
            var velocityX = this.getRandomVelocity();
            var velocityY = this.getRandomVelocity();
            var size = this.getRandomSize();
            var x = this.getRandomX(size);
            var y = this.getRandomY(size);
            // 이미 그려진 볼과 겹치지 않기 위한 로직
            for (var _i = 0, _a = this.balls; _i < _a.length; _i++) {
                var ball_1 = _a[_i];
                if (i != ball_1["idx"]) {
                    var distancX = Math.pow(x - ball_1["x"], 2);
                    var distancY = Math.pow(y - ball_1["y"], 2);
                    var ball_obj = {
                        MoveBetween: Math.sqrt(distancX + distancY),
                        Between: size + ball_1["size"]
                    };
                    if (ball_obj.MoveBetween <= ball_obj.Between) {
                        x = this.getRandomX(size);
                        y = this.getRandomY(size);
                    }
                }
            }
            var ball = new Ball(this.canvas, x, y, velocityX, velocityY, "#000000", size, i);
            this.add(ball);
        }
        return this;
    };
    // 볼 배열에 새로운 볼 넣기
    BallGenerator.prototype.add = function (ball) {
        this.balls.push(ball);
    };
    // 볼 배열 전부 가져오기
    BallGenerator.prototype.getAll = function () {
        return this.balls;
    };
    // 이동 방향 및 속도
    BallGenerator.prototype.getRandomVelocity = function () {
        // 200px/s ~ 400px/s
        var velocity = this.random(Math.sqrt(50 / 9), Math.sqrt(200 / 9));
        var sign = this.random(-1, 1) === 0 ? 1 : -1;
        return velocity * sign;
    };
    // 랜던 사이즈
    BallGenerator.prototype.getRandomSize = function () {
        return this.random(10, 20);
    };
    // 첫 X 좌표
    BallGenerator.prototype.getRandomX = function (size) {
        return this.random(size, this.canvas.getEl().width - size);
    };
    // 첫 Y 좌표
    BallGenerator.prototype.getRandomY = function (size) {
        return this.random(size, this.canvas.getEl().height - size);
    };
    // 최소값 최대값 사이의 랜던값 얻기
    BallGenerator.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    return BallGenerator;
}());
function init() {
    var canvas = new Canvas("canvas");
    var ballGenerator = new BallGenerator(canvas);
    var loop = new Loop(canvas, ballGenerator.generate());
    loop.start();
}
