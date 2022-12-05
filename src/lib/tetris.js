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

let ins