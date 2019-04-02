var game = new Phaser.Game(480 * 1.5, 320 * 1.5, Phaser.CANVAS, null, {preload: preload, create: create, update: update});
var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var textStyle = { font: '18px Arial', fill: '#0095DD' };
var playing = false;
var startButton;

function preload(){
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.stage.backgroundColor = "#eee";

	//Load the assets required for the game
	game.load.image('ball', 'images/ball.png');
	game.load.image('paddle', 'images/paddle.png');
	game.load.image('brick', 'images/brick.png');
	game.load.spritesheet('ball', 'images/wobble.png', 20, 20);
	game.load.spritesheet('button', 'images/button.png', 120, 40);
}
function create() {
	//Ball
	game.physics.startSystem(Phaser.Physics.ARCADE);
	ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
	ball.scale.setTo(1.3);
	ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
	ball.anchor.set(0.5);
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);

	game.physics.arcade.checkCollision.down = false;
	ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add (ballLeaveScreen, this);

	//Paddle
	paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
	paddle.scale.setTo(1.3);
	paddle.anchor.set(0.5, 1);
	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.immovable = true;

	initBricks();

	//Labels
	scoreText = game.add.text( 5, 5, 'Points: 0', textStyle);
	livesText = game.add.text(game.world.width - 5, 5, 'Lives: '+lives, textStyle);
	livesText.anchor.set(1, 0);
	lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Life lost, click to continue', textStyle);
	lifeLostText.anchor.set(0.5);
	lifeLostText.visible = false;

	//Start Button
	startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
	startButton.anchor.set(0.5);
}

function update() {
	game.physics.arcade.collide(ball, paddle, ballHitPaddle);
	game.physics.arcade.collide(ball, bricks, ballHitBrick);

	if (playing)
		paddle.x = game.input.x || game.world.width*0.5;
}

function initBricks() {
	brickInfo = {
		width: 50,
		height: 20,
		count: {
			row: 3,
			col: 7
		},
		offset: {
			top: 50,
			left: 60
		},
		padding: 30
	};

	bricks = game.add.group();

	for (c = 0; c < brickInfo.count.col; c++) {
		for (r = 0; r < brickInfo.count.row; r++) {
			brickX = ( c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
			brickY = ( r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
			newBrick = game.add.sprite(brickX, brickY, 'brick');
			newBrick.scale.setTo(1.3);
			game.physics.enable(newBrick, Phaser.Physics.ARCADE);
			newBrick.body.immovable = true;
			newBrick.anchor.set(0.5);
			bricks.add(newBrick);
		}
	}
}

function ballHitBrick (ball, brick) {
	//Tweening the bricks to ease out
	var killTween = game.add.tween(brick.scale);
	killTween.to({x: 0, y: 0}, 200, Phaser.Easing.Linear.None);
	killTween.onComplete.addOnce( function () {
		brick.kill();
	}, this);
	killTween.start();

	score += 10;
	scoreText.setText('Points: '+score);

	//As of 11.13.19, the following code counts 1 extra brick every time so the initial brick count is set to -1 (temp fix)
	var bricksLeft = -1;
	for (i = 0; i < bricks.children.length; i++) {
		if (bricks.children[i].alive == true)
			bricksLeft ++;
	}

	if (bricksLeft == 0) {
		alert('You won the game, congratulations!');
		location.reload();
	}
}

function ballLeaveScreen() {
	lives--;
	if (lives >= 0) {
		livesText.setText('Lives: '+lives);
		lifeLostText.visible = true;
		ball.reset(game.world.width*0.5, game.world.height - 25);
		paddle.reset(game.world.width*0.5, game.world.height - 5);
		game.input.onDown.addOnce(function() {
			lifeLostText.visible = false;
			ball.body.velocity.set(150, -150);
		}, this);
	} else {
		alert('You lost, game over!');
		location.reload();
	}
}

//Function to animate the ball wobbling when it hits the paddle
function ballHitPaddle(ball, paddle) {
	ball.animations.play('wobble');
}

//Function to start the game when the startButton is clicked
function startGame() {
	startButton.destroy();
	ball.body.velocity.set(150, -150);
	playing = true;
}
