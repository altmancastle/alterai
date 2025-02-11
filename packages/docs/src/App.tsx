import './App.css';
import { useRipple, Ripple } from '@alterai/ripple';
import { Button } from "@alterai/components";

function App() {
  const ripple = useRipple({
    color: "rgba(0,0,0, .1)",
    centered: false,
    animation: {
      enterDuration: 300,
      exitDuration: 200
    }
  });

  const svgRipple = useRipple<SVGSVGElement>({
    color: "rgba(0,0,0, .1)",
    centered: false,
    animation: {
      enterDuration: 300,
      exitDuration: 200
    }
  });

  return (
    <div className="App">
      <h1>Ripple Component Examples</h1>

      <Button></Button>

      <svg ref={svgRipple.containerRef} width={300} height={300} style={{position: "relative"}}> 
        <rect width="100%" height="100%" fill="#f8f8f8"></rect>
      </svg>
      
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
          unbounded
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