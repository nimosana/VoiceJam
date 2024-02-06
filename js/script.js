/**
 Voices Jam
 @author Nicolas Morales-Sanabria
 
 This is a template. You must fill in the title,
 author, and this description to match your project!
 */

"use strict";
let backgroundPos = 0;
setInterval(moveBackground, 50);

let game;
let clownImage;
// movement booleans
let goUp = false;
let goDown = false;
//p5.speech voice synthesizer/recognizer
let myVoice = new p5.Speech();
let myVoiceRec = new p5.SpeechRec('en-US', parseResult);
let mostrecentword;
// bot selection
let botSelected = 0;
let cooldown = 0;
/** the different voices/opponents available in game */
let myBots = [{
    name: `Gary`,
    lang: `Google UK English Male`,
    pitch: 0.4,
    msgGreeting: `Hi there`,
    msgWonGame: `I win`,
    msgLostGame: `Good game`,
}, {
    name: `Louise`,
    lang: `Google français`,
    pitch: 1.1,
    msgGreeting: `Bonjour`,
    msgWonGame: `J'ai gagné`,
    msgLostGame: `Mes félicitations`,
}, {
    name: `Jesus`,
    lang: `Google español`,
    pitch: 0.8,
    msgGreeting: `Hola`,
    msgWonGame: `Jaja, gané`,
    msgLostGame: `buena partida`,
}, {
    name: `Anna`,
    lang: `Google 普通话（中国大陆）`,
    pitch: 1,
    msgGreeting: `你好`,
    msgWonGame: `我贏了`,
    msgLostGame: `恭喜`,
}, {
    name: `Svetlana`,
    lang: `Google русский`,
    pitch: 1.3,
    msgGreeting: `Привет!`,
    msgWonGame: `хаха я выиграл!`,
    msgLostGame: `поздравления`,

}, {
    name: `Kelly`,
    lang: `Google हिन्दी`,
    pitch: 1.3,
    msgGreeting: `नमस्ते`,
    msgWonGame: `मैं जीता`,
    msgLostGame: `आप जीतते हैं`,
}, {
    name: `Pika`,
    lang: `Google 日本語`,
    pitch: 2,
    msgGreeting: `こんにちは`,
    msgWonGame: `ハハ、私が勝ちます`,
    msgLostGame: `おめでとう`,
}, {
    name: `Johannes`,
    lang: `Google Nederlands`,
    pitch: 1.3,
    msgGreeting: `Hallo`,
    msgWonGame: `Ik ben overwinnaar`,
    msgLostGame: `gefeliciteerd`,
}];


/** loads the necessary assets */
function preload() {
    clownImage = loadImage('assets/images/clown.png');
}


/**
Sets up the canvas, voice speech & recognition, then loads default voice*/
function setup() {
    width = windowWidth * 0.98;
    height = windowHeight * 0.92;
    myVoiceRec.continuous = true;
    myVoiceRec.interimResults = true;
    game = new Clong();
    game.setup();
    createCanvas(width, height);
    strokeWeight(10);
    myVoiceRec.start();
    myVoice.setPitch(1);
    myVoice.setVoice(myBots[botSelected].lang);
    // console.log(myBots[botSelected].lang)
    // console.log(myVoice.listVoices());
}


/** runs the game and avoids duplicate actions */
function draw() {
    game.run();
    cooldown++;
    if (!keyIsDown(SHIFT)) {
        game.shiftReleased = true;
    }
}

/** Analyzes speech recognition input and performs necessary actions depending on the last word
 * Manages: up,down,stop,start and the names */
function parseResult() {
    mostrecentword = myVoiceRec.resultString.split(' ').pop();
    if (cooldown > 30) {
        switch (true) {
            case mostrecentword === `up`:
                goUp = true;
                goDown = false;
                break;
            case mostrecentword === `down`:
                goDown = true;
                goUp = false;
                break;
            case mostrecentword === `stop`:
                goUp = goDown = false;
                break;
            case mostrecentword === `start`:
                if (game.state === 'title' || game.state === 'endGame' || game.state === 'waiting') {
                    game.state = 'gameplay';
                    myVoiceRec.continuous = true;
                    myVoiceRec.interimResults = true;
                    if (game.state === `title`) {
                        myVoice.speak(`${myBots[botSelected].msgGreeting}`);
                    }
                }
                break;
            case (mostrecentword === `Gary` || mostrecentword === `Louise` || mostrecentword === `Jesus` || mostrecentword === `Anna` ||
                mostrecentword === `Svetlana` || mostrecentword === `Kelly` || mostrecentword === `pika` || mostrecentword === `pica` || mostrecentword === `Johannes`):
                // console.log(`testing for ${mostrecentword}`)
                cooldown = 0;
                if (mostrecentword === `pica`) { // the word "pika" is tough for the recognition so fix it if its wrong
                    mostrecentword = `Pika`;
                }
                for (let i = 0; i < myBots.length; i++) {
                    if (myBots[i].name === mostrecentword) {
                        botSelected = i;
                        game.setVoice(botSelected);
                    }
                }
                break;
        }
        console.log(mostrecentword);
    }
}

function moveBackground() {
    backgroundPos++;
    document.getElementById("body").style.backgroundPosition = `${backgroundPos}px ${backgroundPos}px`
}