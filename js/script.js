/**
 Voices Jam
 @author Nicolas Morales-Sanabria
 
 This is a template. You must fill in the title,
 author, and this description to match your project!
 */

"use strict";
let voice = new p5.Speech();
let game;
let needToSpeak = false;
let clownImage;
let mostrecentword;
let goUp = false;
let goDown = false;
let myVoice = new p5.Speech();
let myVoiceRec = new p5.SpeechRec('en-US', parseResult);
let botSelected = 0;

let myBots = [{
    name: `Gary`,
    lang: `Google UK English Male`,
    pitch: 0.4,
    msgGreeting: `Hi there`,
    msgWonGame: `I win`,
    msgLostGame: `Good game`,
}, {
    name: `Camille`,
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
    name: `Xi`,
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


/**
Description of preload
*/
function preload() {
    clownImage = loadImage('assets/images/clown.png');
}


/**
Description of setup
*/
function setup() {
    width = windowWidth * 0.98;
    height = windowHeight * 0.92;
    myVoiceRec.continuous = true; // do continuous recognition
    myVoiceRec.interimResults = true; // allow partial recognition (faster, less accurate)
    game = new Clong();
    game.setup();
    createCanvas(width, height);
    myVoiceRec.start();
    strokeWeight(10);
    myVoice.setPitch(1);
    myVoice.setVoice(myBots[botSelected].lang);
    console.log(myBots[botSelected].lang)
    console.log(myVoice.listVoices());
}


/**
Description of draw()
*/
function draw() {
    game.run();
    if (!keyIsDown(SHIFT)) {
        game.shiftReleased = true;
    }
}


function mousePressed() {
    // myVoice.speak("Haha, I beat you");
}


function parseResult() {
    // recognition system will often append words into phrases.
    // so hack here is to only use the last word:
    mostrecentword = myVoiceRec.resultString.split(' ').pop();
    if (mostrecentword.indexOf("up") !== -1) {
        goUp = true;
        goDown = false;
    }
    else if (mostrecentword.indexOf("down") !== -1) {
        goDown = true;
        goUp = false;
    } else if (mostrecentword.indexOf("stop") !== -1) {
        goUp = goDown = false;
    }
    console.log(mostrecentword);
}