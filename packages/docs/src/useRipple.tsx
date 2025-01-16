import React, { useState, useRef, useEffect, ReactNode } from 'react';

const ignoreMouseEventsTimeout = 800;
const throttleDelay = 100;

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<number | null>(null);
  const lastRippleTime = useRef<number>(0);
  const ignoreMouseEvents = useRef(false);

  const createRipple = React.useCallback((event: MouseEvent | TouchEvent) => {
    if (!ref.current) return;

    const now = Date.now();
    if (now - lastRippleTime.current < throttleDelay) {
      return;
    }
    lastRippleTime.current = now;

    const element = ref.current;
    const rect = element.getBoundingClientRect();
    
    let x: number, y: number;
    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }

    // 计算ripple大小，取较长的边的2倍作为直径
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple = {
      id: now,
      x,
      y,
      size,
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    timer.current = setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  }, []);

  const handleMouseDown = React.useCallback((event: MouseEvent) => {
    if (!ignoreMouseEvents.current) {
      createRipple(event);
    }
  }, [createRipple]);

  const handleTouchStart = React.useCallback((event: TouchEvent) => {
    ignoreMouseEvents.current = true;
    createRipple(event);
    setTimeout(() => {
      ignoreMouseEvents.current = false;
    }, ignoreMouseEventsTimeout);
  }, [createRipple]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('touchstart', handleTouchStart);

      return () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [handleMouseDown, handleTouchStart]);

  return { ref, ripples };
};

export const RippleButton = ({ children }: {children: ReactNode}) => {
  const { ref, ripples } = useRipple();

  return (
    <div
      ref={ref}
      style={{
        height: "100px",
        width: "100px",
        position: 'relative',
        overflow: 'hidden',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        color: '#333333',
        cursor: 'pointer',
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: 'absolute',
            top: ripple.y - ripple.size / 2,
            left: ripple.x - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            transform: 'scale(0)',
            animation: 'ripple 600ms linear',
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};
