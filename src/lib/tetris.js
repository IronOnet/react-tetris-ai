let grid = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    ];


let shapes = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], 
    J: [[2, 0, 0], [2, 2, 2], [0, 0, 0]], 
    L: [[0, 0, 3], [3, 3, 3], [0, 0, 0]], 
    O: [[4, 4], [4, 4]], 
    S: [[0, 5, 5], [5, 5, 0], [0, 0, 0]], 
    T: [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    Z: [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
}; 

// Block colors 
let colors = ["F92338", "C973FF", "1C76BC", "FEE356", "53D504", "36E0FF", "F8931D"];

// Used to help create a seed generated random number for choosing shapes. makes result
let randomSeed = 1;

// BLock shapes 
let currentShape = { x: 0, y: 0, shape: undefined }
// Store shape for the upcomming block 
let upcomingShape; 

let bag = []; 

let bagIndex = 0; 

let score = 0; 

let changeSpeed = false; 

let saveState; 

let speeds = [500, 100, 1, 0]; 

let speedIndex = 0; 

let speed = speeds[speedIndex]; 

// Turn AI on or off 
let ai = true; 

let draw = true; 

let movesTaken = 0; 

let moveLimit = 500; 

let moveAlgorithm = {}; 

let inspectMoveSelection = false; 

let populationSize = 50;  

let generation = 0; 

let archive = {
    populationSize: 0, 
    currentGeneration: 0, 
    elites: [], 
    genomes: []
}

let mutationRate = 0.005; 

let mutationStep = 0.2; 

function initialize(){
    archive.populationSize = populationSize; 

    //Get the next available shape from the bag 
    nextShape(); 
    // applies the shape to the grid 
    applyShape(); 
    // set both save state and current state from the game 
    saveState = getState(); 
    roundState = getState(); 
    // Create an initial population of genomes 
    createInitialPopulation(); 

    let loop = function(){
        if(changeSpeed){
            // restart the clock 
            // stop time 
            clearInterval(interval); 
            // set time, like a digital watch 
            interval = setInterval(loop, speed); 
            // and don't change it 
            changeInterval = false; 

            if(speed === 0){
                // no need to draw on screen elemnts 
                draw = false; 
                // updates the game (updates fitness, make a move, evaluate next mode) 
                update(); 
                update(); 
                update(); 
            } else{
                // Draw the elements 
                draw = true;
            }

            // Update regardless 
            update(); 
            if(speed === 0){
                // now draw elements 
                draw = true; 
                // now update the score 
                updateScore(); 
            }
        }; 

        let interval = setInterval(loop, speed);
    }

    document.onload = initialize(); 
}


