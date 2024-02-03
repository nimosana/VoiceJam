/** Clong class
 * @author Nicolas Morales-Sanabria
 * 
 * Allows the creation of simulations/instances of the clong game,
 * contains every function necessary to run the game
 * Note: the original version was made for exercise 5*/
class Clong {
    /** Creates a runnable instance of the clong game */
    constructor() {
        this.state = `title`;
        //players round scores 
        this.score1 = 0;
        this.score2 = 0;
        //players game scores
        this.wins1 = 0;
        this.wins2 = 0;
        //end of round variables
        this.lastRoundWinner;
        this.roundEnded = false;
        //ball & paddles
        this.ball = new Ball(width / 2, height / 2);
        this.paddles = [new Paddle(width * 0.01565, height * 0.22779, 1), new Paddle(width * 0.01565, height * 0.22779, 2)];
        this.shiftReleased = true;
    }

    setup() {
        textSize(width * 0.03);
    }

    /** runs the correct part of clong according to the state of the instance*/
    run() {
        if (this.state === `title`) {
            this.title();
        } else if (this.state === `gameplay`) {
            this.gameplay();
        } else if (this.state === `waiting`) {
            this.waiting();
        } else if (this.state === `endGame`) {
            this.endGame();
        }
    }

    /** displays the title of the game, instructions,ball & paddles, allows the movement of paddles */
    title() {
        background(0);
        //display text
        fill("white");
        textAlign(CENTER, CENTER);
        text(`Clong\nClick to start`, width / 2, height / 4);
        fill("cyan");
        textAlign(LEFT, CENTER);
        text(`Player 1:\nW - Up\nS - Down`, width * 0.02, height / 2);
        fill("red");
        textAlign(RIGHT, CENTER);
        text(`Player 2:\nUp arrow\nDown arrow`, width * 0.98, height / 2);
        //display ball/paddles and move paddles
        displayObjAsImage(this.ball, 2, clownImage)
        for (let paddle of this.paddles) {
            paddle.move();
            paddle.display();
        }
        if (mouseIsPressed) {
            this.state = `gameplay`;
            myVoiceRec.continuous = true;
            myVoiceRec.interimResults = true;
            myVoice.speak(`${myBots[botSelected].msgGreeting}`);
        }
        this.switchVoice();

    }

    /** displays the gameplay,score and handles the movement/display of the ball & paddles*/
    gameplay() {
        background(0);
        for (let paddle of this.paddles) {
            paddle.move();
            paddle.display();
        }
        this.ball.move();
        for (let paddle of this.paddles) {
            this.ball.bounce(paddle);
        }
        displayObjAsImage(this.ball, 2, clownImage);
        this.displayScores();
    }

    /** displays the state of the game after a player scored 3 points */
    endGame() {
        background(0);
        // reset ball & paddles if not done yet

        // display the game's winner & option to rematch
        textAlign(CENTER, CENTER);
        if (this.lastRoundWinner === 1) {
            fill('cyan');
            text(`Player 1 won the game\n${this.wins1} : ${this.wins2}\nClick to rematch, ESC to leave`, width / 2, height / 4);
            if (this.roundEnded) {
                myVoice.speak(myBots[botSelected].msgLostGame);
            }
        } else if (this.lastRoundWinner === 2) {
            fill('red');
            text(`Player 2 won the game\n${this.wins1} : ${this.wins2}\nClick to rematch, ESC to leave`, width / 2, height / 4);
            if (this.roundEnded) {
                myVoice.speak(myBots[botSelected].msgWonGame);
            }
        }
        if (this.roundEnded) {
            this.resetForNextRound();
            this.roundEnded = false;
        }
        // display paddles & ball, allow paddle movement for fun
        for (let paddle of this.paddles) {
            paddle.move();
            paddle.display();
        }
        displayObjAsImage(this.ball, 2, clownImage);
        if (mouseIsPressed) {
            this.state = `gameplay`;
        }
        this.switchVoice();
    }

    /** waiting/end state between rounds */
    waiting() {
        background(0);
        // reset ball & paddles if not done yet
        if (this.roundEnded) {
            this.resetForNextRound();
            this.roundEnded = false;
        }
        // display paddles & ball, allow paddle movement for fun
        for (let paddle of this.paddles) {
            paddle.display();
            paddle.move();
        }
        displayObjAsImage(this.ball, 2, clownImage);
        // display scores and text according to last round's winner 
        this.displayScores();
        textAlign(CENTER, CENTER);
        if (this.lastRoundWinner === 1) {
            fill(`cyan`);
            text(`Player 1 won the round\nClick to continue`, width / 2, height / 4);
        } else if (this.lastRoundWinner === 2) {
            fill(`red`);
            text(`Player 2 won the round\nClick to continue`, width / 2, height / 4);
        }
        if (mouseIsPressed) {
            this.state = `gameplay`;
        }
        this.switchVoice();
    }

    /** resets the paddle and the ball for the next round */
    resetForNextRound() {
        background(0);
        this.ball.x = width / 2;
        this.ball.y = height / 2;
        this.ball.vy = 0;
        if (this.lastRoundWinner === 1) {
            this.ball.vx = (width * 2.3474E-3);
            if (this.score1 != 0) {
                this.tellScore();
            }
        } else if (this.lastRoundWinner === 2) {
            this.ball.vx = -(width * 2.3474E-3);
            if (this.score2 != 0) {
                this.tellScore();
            }
        }
        for (let paddle of this.paddles) {
            paddle.y = height / 2 - paddle.height / 2;
            paddle.vy = 0;
        }
    }

    /** displays the scores of the current game */
    displayScores() {
        textAlign(LEFT, TOP);
        fill(`Cyan`);
        text(this.score1, width * 0.02, 0);
        textAlign(RIGHT, TOP);
        fill(`Red`);
        text(this.score2, width * 0.98, 0);
    }


    switchVoice() {
        push();
        fill(255);
        textAlign(CENTER, CENTER);
        text(`playing against: \n${myBots[botSelected].name}\nSHIFT to switch`, width / 2, height * 0.8);
        pop();
        if (keyIsDown(SHIFT) && this.shiftReleased) {
            botSelected++;
            if (botSelected >= myBots.length) {
                botSelected = 0;
            }
            myVoice.setPitch(myBots[botSelected].pitch);
            myVoice.setVoice(myBots[botSelected].lang);
            // myVoice.cancel();
            myVoice.speak(myBots[botSelected].msgGreeting);
            console.log(`bot selected: ${myBots[botSelected].lang} (${myBots[botSelected].name})`);
            this.shiftReleased = false;
        }
    }


    tellScore() {
        if (this.score1 < this.score2) {
            myVoice.speak(`${this.score2} - ${this.score1}`);
        } else {
            myVoice.speak(`${this.score1} - ${this.score2}`);
        }
    }
} 