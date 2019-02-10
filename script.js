var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;

//x and y coordinates of the ball
var x = canvas.width/2;
var y = canvas.height-30;

//speeds of the ball
var dx = 2;
var dy = -2;

//Increase in speed every time the ball hits the paddle
var acceleration = 0.4;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2; // start at the middle

//Brick properties
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//Points for destroying bricks
var score = 0;

var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0 , status: 1};
	}
}

var rightPressed = false;
var leftPressed = false;

//Registering event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			
			if (b.status == 1) {
				if ( (x > b.x) && (x < b.x + brickWidth) && (y > b.y) && (y < b.y + brickHeight) ) {
					dy = -dy;
					b.status = 0;
					score++;
					
					if (score == brickColumnCount * brickRowCount) {
						alert ("You win, Congratulations! \n Your score was: "+score);
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore () {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText ("Lives: "+lives, canvas.width - 65, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			
			if (bricks[c][r].status == 1) {
				var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = ( r * (brickHeight + brickPadding) ) + brickOffsetTop;
				
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				
				ctx.beginPath();
				ctx.rect (brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}			
		}
	}
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
    drawBall();
    drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {//Bouncing off the top wall
	
        dy = -dy;
		
    } else if (y + dy > canvas.height - ballRadius) {
		
		if ( (x > paddleX) && (x < paddleX + paddleWidth) ) {//If the ball has hit the paddle
		
			//Increasing the ball's velocity
			if (dx < 0) {
				dx -= acceleration;
			} else {
				dx += acceleration;
			}
			dy += acceleration;
		
			//Making the ball go back up
			dy = -dy;
			
			
		} else {//If it hits the bottom wall then the game ends
			
			if (lives == 0) {
				alert("GAME OVER \n Your score: "+score);
				document.location.reload();
			} else {
				lives --;
				acceleration += 0.2; // Make the game tougher
				
				//Resetting the game
				x = canvas.width / 2;
				y = canvas.height-30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width - paddleWidth ) / 2;
			}
		}
	}
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
	
	requestAnimationFrame(draw);
}

draw();