import './App.css'
import { useRipple } from './useRipple';

function App() {

  const ripple = useRipple<HTMLDivElement>({
    rippleConfig: {
      color: "rgba(209, 47, 47, 0.5)",
      centered: true,
    },
    rippleDisabled: false,
  });

  return (
    <>
      <div className="card" ref={ripple.containerRef}>1</div>
      <div className="card" ref={ripple.containerRef}>2</div>
      <div className="card" ref={ripple.containerRef}>3</div>
      <div className="card" ref={ripple.containerRef}>4</div>
      <div className="card" ref={ripple.containerRef}>5</div>
      <div className="card" ref={ripple.containerRef}>6</div>
      <div className="card" ref={ripple.containerRef}>7</div>
      <div className="card" ref={ripple.containerRef}>8</div>
    </>
  )
}

export default App
