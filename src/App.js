// App.js
import React, { useState } from 'react';
//import './App.css';
import SkillMapping from './Skillmapping'; // Ensure this path is correct
import Home from './home'; // Ensure this path is correct

function App() {
  const [showComponent, setShowComponent] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
      
    
        <button onClick={() => setShowComponent('home')}>Home</button>
        <br></br>
        <br></br>
        <button onClick={() => setShowComponent('skillMapping')}>Skill Mapping</button>
        
        {showComponent === 'home' && <Home />}
        {showComponent === 'skillMapping' && <SkillMapping />}
      </header>
    </div>
  );
}

export default App;
