/**
 * 
 */
class Game {


    constructor() {
        this.state = `mainMenu`;
    }


    run() {
        if (this.state === `mainMenu`) {
            this.mainMenu();
        } else if (this.state === `inGame`) {
            this.inGame();
        }
    }


    mainMenu() {
        background(0);
        textAlign(CENTER, CENTER);
        fill(`red`);
        text(`Welcome to the game\nClick to start`, width / 2, height / 2);
        if (mouseIsPressed) {
            this.state = `inGame`;
        }
    }


    inGame() {
        background(100);
        fill(`white`);
        text(`we in da game`, width / 2, height / 2);
    }
}