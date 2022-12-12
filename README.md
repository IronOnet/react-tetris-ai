# An Evolutionary Tetris Game built with React. 

This is an a tetris game implemented with javascript that uses evolutionary algorithms 
to improve its gameplay. the frontend is done using React., this is a reimplementation 
of the original work done by [Mzmousa](https://github.com/mzmousa/tetris-ai). 

## How it Works 

This AI uses genetic programming / evolutionary techniques to improve over time. Through selection, crossover, and mutation, the AI will learn to get the highest score in as few moves as possible (we'll aim for 500 moves).

Genetic algorithms work by creating a population of "genomes" that have multiple "genes", representing parameters for the algorithm. Each of these individuals in the population is evaluated and a "fitness" score for each genome is produced. The fittest individuals would reproduce and pass favourable genes down to the next generation. Mutation also occurs where genes are randomly modified in hopes of creating more beneficial features.


![25th Generation AI](https://github.com/iron-onet/tetris-ai/blob/master/tetris_gameplay.gif?raw=true)

## Roadmap 
    - add user registration and login  
    - add a manual gameplay experience
    - add multiple agorithms  
    - add a scoreboard
    - add a dual challenge between human and AI

## License: 
    => This project is under an MIT License