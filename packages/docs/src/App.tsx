import { useState } from 'react'
import { useRipple } from "alter-ui";
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const { triggerRef } = useRipple({
    disabled: false,
    color: "#f8f8f8"
  })

  return (
    <>
      <div className='ripple' ref={triggerRef}>
        测试
      </div>
      <h1>Vite + React</h1>
      <div className="card">
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
