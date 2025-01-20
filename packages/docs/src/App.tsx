import React from 'react';
import { Ripple } from './ripple/Ripple';
import './App.css';
import { useRipple } from './ripple/useRipple';

function App() {
  const ripple = useRipple<HTMLDivElement>({
    color: "rgba(0,0,0,.2)",
    centered: false,
    animation: {
      enterDuration: 300,
      exitDuration: 200
    }
  });

  return (
    <div className="App">
      <h1>Ripple Component Examples</h1>
      
      <div style={{ margin: '20px 0' }}>
        <h2>useRipple Hook Example</h2>
        <div 
          style={{ 
            padding: '20px', 
            border: '1px solid #ccc',
            width: '200px',
            height: '100px',
            margin: '0 auto',
            position: "relative",
            overflow: "hidden"
          }} 
          ref={ripple.containerRef}
        >
          Click me (useRipple)
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Ripple Component Example</h2>
        <Ripple 
          color="rgba(0,0,0,.2)"
          centered
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            width: '200px',
            height: '100px',
            margin: '0 auto'
          }}
        >
          Click me (Ripple)
        </Ripple>
      </div>
    </div>
  )
}


export default App