// constants
const MINIMUM_NUMBER_OF_CELLS = 10;
const MINIMUM_CELL_SIZE_IN_PIXELS = 12;
const PADDING_IN_PIXELS = 20;

// html elements
let canvas, context, xSize, lxSize, ySize, lySize, cellSize, lCellSize, delay, lDelay;

// global elements
let fieldWidthInCells, fieldHeightInCells;
let fieldWidthInPixels, fieldHeightInPixels;
let cellSideInPixels;
let playingField;
let timerId = null;

// initializer
window.onload = function () {
    canvas = document.getElementById('game'); //сделать белый фон
    context = canvas.getContext("2d");
    xSize = document.getElementById('xSize');
    lxSize = document.getElementById('lxSize');
    ySize = document.getElementById('ySize');
    lySize = document.getElementById('lySize');
    cellSize = document.getElementById('cellSize');
    lCellSize = document.getElementById('lCellSize');
    delay= document.getElementById('delay');
    lDelay = document.getElementById('lDelay');
    initializeAll();
    canvas.onclick = function(event) {
        changeCellStatus( event);
    }
}

// full initialization is only necessary at startup or when resetting parameters
function initializeAll() {
    this.updateAvailableCanvasSizes();
    this.updateWidthHeightLimits();
    this.initializeGridSizes();
    this.updateSpeed();
}

// this initialization is required when resizing the grid
function initializeGridSizes() {
    this.stopTimer();
    this.updateWidthHeightValues();
    this.initializeArray();
    this.updateInputCellSizeLimit();
    this.initializeCellSizes();
}

// this initialization is required when changing the cell size
function initializeCellSizes() {
    this.updateCellSizeValues();
    this.updateCanvasesSize();
    this.drawGrid();
    this.drawLifeFromPlayingField();
}

// Available Sizes
function updateAvailableCanvasSizes() {
    fieldWidthInPixels = document.documentElement.clientWidth - PADDING_IN_PIXELS;
    fieldHeightInPixels = document.documentElement.clientHeight - canvas.offsetTop - PADDING_IN_PIXELS;
}

// Width and Height
function updateWidthHeightLimits() {
    xSize.value = ySize.value = xSize.min = ySize.min = MINIMUM_NUMBER_OF_CELLS;

    xSize.max = Math.floor(fieldWidthInPixels / MINIMUM_CELL_SIZE_IN_PIXELS);
    ySize.max =  Math.floor(fieldHeightInPixels / MINIMUM_CELL_SIZE_IN_PIXELS);
}

function updateWidthHeightValues() {
    fieldWidthInCells = Number(xSize.value);
    fieldHeightInCells = Number(ySize.value);

    lxSize.innerHTML = fieldWidthInCells + " cells";
    lySize.innerHTML = fieldHeightInCells + " cells";
}

// Cell Size
function updateInputCellSizeLimit(){
    cellSize.min = MINIMUM_CELL_SIZE_IN_PIXELS;

    let maximumPossibleWidth = Math.floor(fieldWidthInPixels / fieldWidthInCells);
    let maximumPossibleHeight = Math.floor(fieldHeightInPixels / fieldHeightInCells);

    cellSize.max = (maximumPossibleWidth < maximumPossibleHeight) ? maximumPossibleWidth : maximumPossibleHeight;
}

function updateCellSizeValues() {
    cellSideInPixels = Number(cellSize.value);
    lCellSize.innerHTML = cellSideInPixels + " px";
}

// Canvas and Array
function updateCanvasesSize() {
    canvas.width = fieldWidthInCells * cellSideInPixels;
    canvas.height = fieldHeightInCells * cellSideInPixels;
}

function initializeArray() {
    playingField = [];
    for (let i = 0; i < fieldWidthInCells; i++) {
        playingField[i] = [];
        for (let j = 0; j < fieldHeightInCells; j++) {
            playingField[i][j] = false;
        }
    }
}

function drawRandomField() {
    initializeGridSizes();
    for (let i = 0; i < fieldWidthInCells; i++) {
        for (let j = 0; j < fieldHeightInCells; j++) {
            playingField[i][j] = Math.random() < 0.5;
        }
    }
    drawLifeFromPlayingField();
}

function changeCellStatus(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    let cellX = Math.floor(x / cellSideInPixels);
    let cellY = Math.floor(y / cellSideInPixels);

    if (cellX >= 0 && cellY >= 0){
        if (!playingField[cellX][cellY]){
            playingField[cellX][cellY] = true;
            drawLife(cellX, cellY);
        }
        else if (playingField[cellX][cellY]){
            playingField[cellX][cellY] = false;
            eraseLife(cellX, cellY);
        }
    }
}

// grid drawing and life in cells
function drawGrid() {
    context.fillStyle = "white";
    for (let x = 0; x < fieldWidthInPixels; x += cellSideInPixels) {
        context.moveTo(x, 0);
        context.lineTo(x, fieldHeightInPixels);
    }

    for (let y = 0; y < fieldHeightInPixels; y += cellSideInPixels) {
        context.moveTo(0, y);
        context.lineTo(fieldWidthInPixels, y);
    }

    context.strokeStyle = "#000000";
    context.stroke();
}

function getCellCenter(cellX, cellY) {
    let x = (cellX * cellSideInPixels) + Math.floor(cellSideInPixels / 2);
    let y = (cellY * cellSideInPixels) + Math.floor(cellSideInPixels / 2);
    return {x, y};
}

function drawLife(cellX, cellY) {
    let coords = getCellCenter(cellX, cellY);
    context.beginPath();
    let radius = Math.floor(cellSideInPixels / 2);
    context.arc(coords.x, coords.y, radius-2, 0, 2*Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
}

function eraseLife(cellX, cellY) {
    let coords = getCellCenter(cellX, cellY);
    context.beginPath();
    let radius = Math.floor(cellSideInPixels / 2);
    context.arc(coords.x, coords.y, radius-1, 0, 2*Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
}

function drawLifeFromPlayingField() {
    for (let i = 0; i < fieldWidthInCells; i++) {
        for (let j = 0; j < fieldHeightInCells; j++) {
            if (playingField[i][j]) {
                drawLife(i, j);
            }
        }
    }
}

// game
function nextStep() {
    let lastLocation = playingField;
    initializeArray();
    for (let i = 0; i < fieldWidthInCells; i++) {
        for (let j = 0; j < fieldHeightInCells; j++) {
            let neighbours = numberOfLivingCellsAround(lastLocation, i, j);

            // if 3 living cells are adjacent to a dead cell, then life is born in it
            if (neighbours === 3 && !lastLocation[i][j]) {
                playingField[i][j] = true;
                drawLife(i, j);
                continue;
            }
            if ((neighbours < 2 || neighbours > 3)  && lastLocation[i][j]) {
                playingField[i][j] = false;
                eraseLife(i, j);
                continue;
            }
            // If a living cell has 2 or 3 neighbors, then it continues to live
            if ((neighbours === 2 || neighbours === 3)  && lastLocation[i][j]) {
                playingField[i][j] = true;
            }
        }
    }
}

function numberOfLivingCellsAround(mass, x, y){
    let counter = 0;
    for (let i = x-1; i <= x+1; i++) {
        for (let j = y-1; j <= y+1; j++) {
            let w = i;
            let h = j;

            if (i === x && j === y)
                continue;

            if (i < 0){
                w = fieldWidthInCells + i;
            }
            if (i > fieldWidthInCells - 1){
                w =  i - fieldWidthInCells;
            }

            if (j < 0){
                h = fieldHeightInCells + j;
            }
            if (j > fieldHeightInCells - 1){
                h = h - fieldHeightInCells;
            }

            if (mass[w][h]) {
                counter++;
            }

        }
    }
    return counter;
}

// autoplay
function startTimer() {
    if (timerId === null){
        timerId = setInterval(nextStep, Number(delay.value));
    }
}

function stopTimer() {
    clearTimeout(timerId);
    timerId = null;
}

function updateSpeed() {
    let value = Number(delay.value);

    if (timerId){
        clearTimeout(timerId);
        timerId = setInterval(nextStep, value);
    }

    lDelay.innerHTML = value + " ms";
}