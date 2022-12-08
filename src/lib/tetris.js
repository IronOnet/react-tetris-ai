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

let genomes = []; 

let currentGenome = -1;

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


// Key options 
window.onkeydown = function(event){
    let characterPressed = String.fromCharCode(event.keyCode); 
    switch(event.keyCode){
        case 38: 
            rotateShape();
            break; 
        case 40: 
            moveDown(); 
            break; 
        case 37: 
            moveLeft(); 
            break; 
        case 39:
            moveRight(); 
            break; 

        case 16: 
            loadArchive("weights.js");
            break;  
        default:
            console.log("Uknown key pressed")
    }

    switch(characterPressed.toUpperCase()){
        case "Q": 
            saveState = getState(); 
            break; 
        case "W": 
            loadState(saveState); 
            break 
        case "D": 
            speedIndex--; 
            if(speedIndex < 0){
                speedIndex = speeds.length - 1;
            }
            speed = speeds[speedIndex]; 
            changeSpeed = true; 
            break; 
        case "E": 
            // speed up 
            speedIndex++; 
            if(speedIndex >= speeds.length){
                speedIndex = 0; 
            }

            // adjust the speed index 
            speed = speeds[speedIndex]; 
            changeSpeed = true; 
            break; 
        
        case "A": 
            ai = !ai; 
            break; 

        case "R": 
            loadArchive(prompt("Insert Weights:")); 
            break; 
        case "G": 
            if(localStorage.getItem("weights") === null){
                alert("No archive saved. Archives are saved after a generation has passed");
            } else{
                prompt("Archive from last generation (including from last session):");
            }
            break;

        case "F":
            inspectMoveSelection = !inspectMoveSelection; 
            break; 
        default: 
            return true;
    } 

    // Outputs game state to the screen (post key press) 
    output(); 
    return false; 
}; 

/**
 * Creates the initial population of genomes, each with random genes.
 */

function createInitialPopulation(){
    let genomes = []; 

    for(let i = 0; i < populationSize; i++){
        let genome = {
            // The unique identifier of the genome
            id: Math.random(), 
            // The weight of each row cleared by the given move. the more row 
            // that are cleared, the more this weight increases 
            rowsCleared : Math.random() - 0.5, 
            // The absolute height of the highest column to the power of 1.5 
            // added so that the algorithm can be able to detect if the blo
            weightedHeight: Math.random() - 0.5, 

            relativeHeight : Math.random() - 0.5, 
            holes: Math.random() * 0.5, 
            roughness : Math.random() - 0.5, 
        }; 

        genomes.push(genome);
    }

    evaluateNextGenome(); 
}

function evaluateNextGenome(){
    currentGenome++;
    // If there is none, evolves the population 
    if(currentGenome == genomes.length){
        evolve(); 
    }

    // load current gamestate 
    loadState(roundState); 
    movesTaken = À; 
    makeNextMove(); 
}

function evolve(){
    console.log("Generation " + generation + "evaluated."); 

    // reset current genome for new generation 
    currentGenome = 0; 
    // increment generation 
    generation++; 
    // reset the game 
    reset(); 

    // gets the current game state 
    roundState = getState(); 
    // sorts genomes in decreasing order of fitness values 
    genomes.sort(function(a, b){
        return b.fitness - a.fitness;
    }); 

    archive.elites.push(clone(genomes[0])); 
    console.log("Elite's fitness: " + genomes[0].fitness); 

    while(genomes.length > populationSize / 2){
        genomes.push(); 
    }

    let totalFitness = 0; 
    for(let i= 0; i < genomes.length; i++){
        totalFitness += genomes[i].fitness;
    }

    function getRandomGenome(){
        return genomes[randomWeightedNumBetween(0, genomes.length - 1)]; 
    }

    let children = []; 

    children.push(clone(genomes[0])); 
    // add population sized amount of children 
    while(children.length < populationSize){
        children.push(makeChild(getRandomGenome(), getRandomGenome()));
    }

    // Create new genome array 
    genomes = []; 

    // to start all the children in 
    genomes = genomes.concat(children); 
    // stores this in our archive 
    archives.genomes = clone(genomes); 
    // and set current gen 
    archive.currentGeneration = clone(generation); 
    console.log(JSON.stringify(archive)); 

    localStorage.setItem("archive", JSON.stringify(archive)); 
}

/**
 * Creates a child genome from given parent genomes, and then attemps to 
 */

function makeChild(mum, dad){
    let child = {
        id: Math.random(), 
        rowsCleared: randomChoice(mum.rowsCleared, dad.rowsCleared), 
        weightedHeight: randomChoice(mum.weightedHeight, dad.weightedHeight), 
        cumulativeHeight: randomChoice(mum.cumulativeHeight, dad.cumulativeHeight), 
        relativeHeight : randomChoice(mum.relativeHeight, dad.relativeHeight),
        holes: randomChoice(mum.holes, dad.holes), 
        roughness: randomChoice(mum.roughness, dad.roughness), 
        fitness: -1
    }; 

    if(Math.random() < mutationRate){
        child.rowsCleared = child.rowsCleared + Math.random() * mutationStep * 2 -mutationStep;
        child.weightedHeight = child.weightedHeight + Math.random() * mutationStep * 2 - mutationStep;
        child.cumulativeHeight = child.cumulativeHeight + Math.random() * mutationStep * 2 - mutationStep;
        child.relativeHeight = child.relativeHeight + Math.random() * mutationStep * 2 - mutationStep;
        child.holes = child.holes + Math.random() * mutationStep * 2 - mutationStep; 
        child.roughness = child.roughness + Math.random() * mutationStep * 2 - mutationStep;
    }
    return child; 
    
}

/**
 * Returns an array of all possible moves that could occur in the current state, rated 
 * by the parameters of the current genome.
 * @return {Array}
 */
function getAllPossibleMoves(){
    let lastState = getState(); 
    let possibleMoves = [];
    let possibleMoveRatings = [];
    let iterations = 0;

    for(let rots = 0; rots < 4; rots++){
        
        let oldX = [];
        for(let t = -5; t <= 5; t++){
            iterations++; 
            loadState(lastState);
            // rotate shape
            for(let j = 0; j < rots; j++){
                rotateShape();
            }

            // move left 
            if(t < 0){
                for(let l = 0; l < Math.abs(t); l++){
                    moveLeft();
                }
            }
            // move right 
            else if(t > 0){
                for(let r = 0; r < t; r++){
                    moveRight();
                }
            }
            // if the shape has moved at all 
            if(!contains(oldX, currentShape.x)){
                let moveDownResults = moveDown(); 
                while(moveDownResults.moved){
                    moveDownResults = moveDown();
                }
                // set the 7 parameters of the genome
                let algorithm = {
                    rowsCleared: moveDownResults.rowsCleared, 
                    weightedHeight: Math.pow(getHeight(), 1.5), 
                    cumulativeHeight: getCumulativeHeight(), 
                    relativeHeight: getRelativeHeight(), 
                    holes: getHoles(), 
                    roughness: getRoughness()
                };

                // rate each move 
                let rating = 0; 
                rating += algorithm.rowsCleared * genomes[currentGenome].rowsCleared;
                rating += algorithm.weightedHeight * genomes[currentGenome].weightedHeight; 
                rating += algorithm.cumulativeHeight * genomes[currentGenome].cumulativeHeight; 
                rating += algorithm.relativeHeight * genomes[currentGenome].relativeHeight; 
                rating += algorithm.holes * genomes[currentGenome].holes; 
                rating += algorithm.roughness * genomes[currentGenome].roughness;
                // if the move losses the game lower its rating 
                if(moveDownResults.lose){
                    rating -= 500;
                }

                // push all the possible moves and their associated ratings to an array 
                possibleMoves.push({rotations: rots, translations: t, rating: rating, algorithm: algorithm}); 
                //update the possible position of oldX value
                oldX.push(currentShape.x);
            }
        }
    }

    // get last state 
    loadState(lastState);
    return possibleMoves;
}

/**
 * Returns the highest rated move in the given array of moves 
 * @param {Array} moves An array of possible moves 
 * @return {Move} THe highest rated move from the moveset
 */

function getHighestRatedMove(moves){
    
}