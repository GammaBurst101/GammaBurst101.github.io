var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); //The actual tool to create the graphics

var x = canvas.width/2;
var y = canvas.height - 30;
var ballRadius = 10;
var dx = 2; 
var dy = -2;

//Paddle properties
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

//Registering event listeners
document.addEventListener ("keydown", keyDownHandler, false);
document.addEventListener ("keyup", keyUpHandler, false);

//Event Listeners
function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

function drawBall () {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect (paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	
	drawBall();
	drawPaddle();
	
	//Collision detection
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) { // Right and left wall
		dx = -dx;
	}
	if (y + dy < ballRadius) { //Top wall
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) { 
	
		if ( (x > paddleX) && (x < paddleX + paddleWidth) ) { // If the ball touches the paddleHeight
			dy = -dy;
		} else { // If it user misses the ball then reset the game
			x = canvas.width/2;
			y = canvas.height - 30;
			paddleX = (canvas.width - paddleWidth) / 2;
		}
	}
	
	//Moving the paddle around if the appropriate key is pressed
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}	
	
	x += dx;
	y += dy;;
	
	requestAnimationFrame(draw);
}

draw();