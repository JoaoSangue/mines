var fieldSize = 500;
var bombs = 10;
var tilesPerSide = 8;
var tilesSize = fieldSize/tilesPerSide;
var flagPNG;
var bombPNG;
var canvas;
var field = new Field(tilesPerSide, tilesSize, bombs);
var remainingTiles;
var endGame = false;
var startTime;
var elapsedTime;
var interval;

function preload() {
    flagPNG = loadImage('flag.png');
    bombPNG = loadImage('bomb.png');
}

function setup() {
    interval = setInterval(Timer, 1000);
    remainingTiles = tilesPerSide*tilesPerSide - bombs;
    canvas = createCanvas(fieldSize + 100,fieldSize + 100);
    canvas.parent("canvasDiv");
    background(40);
    field.createField();
    textAlign(CENTER, CENTER);
    textSize(tilesSize/2);
    fill(grey);
    rect(width*0.25, 5, width*0.5, 40);
}

function draw() {
    if (remainingTiles === 0) {
        endGame = true;
    }
    if (endGame) {
        fill(grey, 130);
        rect(50, 50, fieldSize, fieldSize);
        field.revealAll();
        clearTimeout(interval);
        noLoop();
        fill(yellow);
        if(remainingTiles === 0) victory();
        text("Press ENTER to play again.", width/2, height*0.5);
    }
}

function mouseReleased() {
    if (endGame) return;
    for (let i = 0; i < tilesPerSide; i++) {
        for (let j = 0; j < tilesPerSide; j++) {
            if(field.tiles[i][j].clicked(mouseX, mouseY, mouseButton)) {
                return;
            }
        }
    }
}

function keyPressed() {
    if (!endGame) return;
    if (keyCode === ENTER || keyCode === RETURN) {
        endGame = false;
        setup();
        loop();
    }
}

function victory() {
    fill(yellow);
    text("VICTORY\nTime: " + elapsedTime, width/2, height*0.3);
}

function Timer() {
    let timePassed = new Date() - startTime;
    timePassed = parseInt(timePassed/1000);
    fill(grey);
    rect(width*0.25, 5, width*0.5, 40);
    fill(white);
    elapsedTime = parser(timePassed);
    text(elapsedTime, width*0.5, 25);
}

function parser(time){
    let hours = 0, minutes = 0, seconds = 0;
    let parsedTime;
    if (time < 3600) {
        minutes = parseInt(time/60);
        seconds = parseInt(time%60);
    } else if (time < 216000) {
        hours = parseInt(time/60);
        minutes = parseInt(hours/60);
        seconds = parseInt(time%60);
    }
    parsedTime = hours + " : " + minutes + " : " + seconds;
    return parsedTime;
}
