/**
 Voices Jam
 @author Nicolas Morales-Sanabria
 
 This is a template. You must fill in the title,
 author, and this description to match your project!
 */

"use strict";
//html stuff
let backgroundPos = 0;
setInterval(moveBackground, 50);
//game and assets
let game;
let clownImage;
// movement booleans
let goUp = false;
let goDown = false;
//p5.speech voice synthesizer/recognizer & eliza
let eliza = new ElizaBot();
let myVoice = new p5.Speech();
let myVoiceRec = new p5.SpeechRec('en-US', parseResult);
let mostRecentWord;
let cleanPhrase;
let cooldown = 0;
/** the different voices/opponents available in game */
let botSelected = 0;
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
let taunts = ["Calm down", "chill", "chillax", "chill out", "easy there",
    "why so angry", "buddy", "ok bud", "bud", "why u mad", "relax", "breathe", "loosen up", "womp womp"];


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
 * Manages: up,down,stop,start and the names 
 * Also detects naughty phrases and replies an annoying eliza message*/
function parseResult() {
    //naughty phrase detector! 
    if (myVoiceRec.resultValue && myVoiceRec.resultString.indexOf("*") !== -1 && myVoiceRec.resultConfidence > 0.7) {
        cleanPhrase = myVoiceRec.resultString;
        console.log("latest phrase: " + myVoiceRec.resultString)
        while (cleanPhrase.indexOf("*") !== -1) {
            cleanPhrase = cleanPhrase.replace("*", "");
            // console.log("aschek: " + cleanPhrase)
        }
        myVoice.speak(`${taunts[Math.floor(Math.random() * taunts.length)]}, ${(eliza.transform(cleanPhrase))}`);
    }
    //general commands voice control
    mostRecentWord = myVoiceRec.resultString.split(' ').pop();
    if (cooldown > 30) {
        switch (true) {
            case mostRecentWord === `up`:
                goUp = true;
                goDown = false;
                break;
            case mostRecentWord === `down`:
                goDown = true;
                goUp = false;
                break;
            case mostRecentWord === `stop`:
                goUp = goDown = false;
                break;
            case mostRecentWord === `start`:
                if (game.state === 'title' || game.state === 'endGame' || game.state === 'waiting') {
                    game.state = 'gameplay';
                    myVoiceRec.continuous = true;
                    myVoiceRec.interimResults = true;
                    if (game.state === `title`) {
                        myVoice.speak(`${myBots[botSelected].msgGreeting}`);
                    }
                }
                break;
            case (mostRecentWord === `Gary` || mostRecentWord === `Louise` || mostRecentWord === `Jesus` || mostRecentWord === `Anna` ||
                mostRecentWord === `Svetlana` || mostRecentWord === `Kelly` || mostRecentWord === `pika` || mostRecentWord === `pica` || mostRecentWord === `Johannes`):
                // console.log(`testing for ${mostRecentWord}`)
                cooldown = 0;
                if (mostRecentWord === `pica`) { // the word "pika" is tough for the recognition so fix it if its wrong
                    mostRecentWord = `Pika`;
                }
                for (let i = 0; i < myBots.length; i++) {
                    if (myBots[i].name === mostRecentWord) {
                        botSelected = i;
                        game.setVoice(botSelected);
                    }
                }
                break;
        }
        console.log(mostRecentWord);
    }
}

/** restart the voice recognition on click, since it always crashes */
function mousePressed() {
    myVoiceRec.start();
}

/** move the background of the html site */
function moveBackground() {
    backgroundPos++;
    document.getElementById("body").style.backgroundPosition = `${backgroundPos}px ${backgroundPos}px`
}