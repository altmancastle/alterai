import { useState } from 'react'
import './App.css'
import { useRipple } from './useRipple';

function App() {
  const [count, setCount] = useState(0);

  const ripple = useRipple({
    rippleConfig: {
      color: "rgba(0,0,0,.2)",
    },
    rippleDisabled: false,
  });

  return (
    <>
     
      <h1>Vite + React</h1>
      <div className="card" ref={ripple.containerRef}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
