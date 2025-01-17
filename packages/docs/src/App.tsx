import './App.css'
import { useRipple } from './useRipple';

function App() {

  const ripple = useRipple<HTMLDivElement>({
    rippleConfig: {
      color: "rgba(0,0,0,0.5)",
    },
    rippleDisabled: false,
  });

  return (
    <>
      <div className="card" ref={ripple.containerRef}>1</div>
    </>
  )
}

export default App
