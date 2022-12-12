import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import { initialize } from './lib/tetris';


function App() {

  useEffect(() =>{
    initialize();
  }, []);


  return (
    <div>
      <h1 id="title" class="text">Evolutionary Tetris</h1>
      <div id="output" class="text"></div> 
      <div id="score" class="text"></div> 
      <div id="instructions" class="text"><br/><b>[Key Commands]</b><br/>Load Fully Evolved Parameters: [SHIFT]<br/>Inspect Move Selection: [F]<br/>Speed Up: [E]<br/>
      Slow Down: [D]<br/>Toggle AI: [A]<br/>Move Shape: [Arrow Keys]<br/>Rotate Shape: [Up Arrow]<br/>Drop Shape: [Down Arrow]<br/>Save State: [Q]<br/>
      Load State: [W]<br/>Get Archive: [G]<br/>Load Archive: [R]</div>
    </div>
  );
}

export default App;
