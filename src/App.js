import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import { initialize } from './lib/tetris';

const handleKeyDown = (event) =>{
  var characterPressed = String.fromCharCode(event.keyCode);
        if (event.keyCode == 38) {
            rotateShape();
        } else if (event.keyCode == 40) {
            moveDown();
        } else if (event.keyCode == 37) {
            moveLeft();
        } else if (event.keyCode == 39) {
            moveRight();
        } else if (characterPressed.toUpperCase() == "Q") {
            saveState = getState();
        } else if (characterPressed.toUpperCase() == "W") {
            loadState(saveState);
        } else if (characterPressed.toUpperCase() == "D") {
            //slow down
            speedIndex--;
            if (speedIndex < 0) {
                speedIndex = speeds.length - 1;
            }
            speed = speeds[speedIndex];
            changeSpeed = true;
        } else if (characterPressed.toUpperCase() == "E") {
            //speed up
            speedIndex++;
            if (speedIndex >= speeds.length) {
                speedIndex = 0;
            }
            //adjust speed index
            speed = speeds[speedIndex];
            changeSpeed = true;
            //Turn on/off AI
        } else if (characterPressed.toUpperCase() == "A") {
            ai = !ai;
        } else if (event.keyCode == 16) { // shift
            loadArchive("archive.js")
        } else if (characterPressed.toUpperCase() == "R") {
            //load saved generation values
            loadArchive(prompt("Insert archive:"));
        } else if (characterPressed.toUpperCase() == "G") {
            if (localStorage.getItem("archive") === null) {
                alert("No archive saved. Archives are saved after a generation has passed, and remain across sessions. Try again once a generation has passed");
            } else {
                prompt("Archive from last generation (including from last session):", localStorage.getItem("archive"));
            }
        } else if (characterPressed.toUpperCase() == "F") {
            //?
            inspectMoveSelection = !inspectMoveSelection;
        } else {
            return true;
        }
        //outputs game state to the screen (post key press)
        output();
        return false;
}

function App() {

  useEffect(() =>{
    initialize();
  }, []);


  return (
    <div>
      <h1>Evolutionary Tetris</h1>
      <div id="output" class="text"></div> 
      <div id="score" class="text"></div> 
      <div id="instructions" class="text"><br/><b>[Key Commands]</b><br/>Load Fully Evolved Parameters: [SHIFT]<br/>Inspect Move Selection: [F]<br/>Speed Up: [E]<br/>
      Slow Down: [D]<br/>Toggle AI: [A]<br/>Move Shape: [Arrow Keys]<br/>Rotate Shape: [Up Arrow]<br/>Drop Shape: [Down Arrow]<br/>Save State: [Q]<br/>
      Load State: [W]<br/>Get Archive: [G]<br/>Load Archive: [R]</div>
    </div>
  );
}

export default App;
