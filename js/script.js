/**
Voices Jam
@author Nicolas Morales-Sanabria

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";
let voice = new p5.Speech();
let game = new Game();

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    width = windowWidth * 0.98;
    height = windowHeight * 0.92;
    createCanvas(width, height);

}


/**
Description of draw()
*/
function draw() {
    game.run();
}


function mousePressed() {
    voice.speak("what up, bro");
}