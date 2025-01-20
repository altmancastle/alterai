import { useRef, useState, useEffect, useCallback } from 'react';

type RippleConfig = {
  color?: string;
  centered?: boolean;
  radius?: number;
  persistent?: boolean;
  disabled?: boolean;
  animation?: {
    enterDuration?: number;
    exitDuration?: number;
  };
  terminateOnPointerUp?: boolean;
};

type RippleState = 'FADING_IN' | 'VISIBLE' | 'FADING_OUT' | 'HIDDEN';

type RippleRef = {
  element: HTMLElement | SVGCircleElement;
  config: RippleConfig;
  state: RippleState;
  fadeOut: () => void;
};

const defaultRippleAnimationConfig = {
  enterDuration: 225,
  exitDuration: 150,
};

function distanceToFurthestCorner(x: number, y: number, rect: DOMRect) {
  const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
  const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
  return Math.sqrt(distX * distX + distY * distY);
}

export function useRipple<T extends HTMLElement | SVGSVGElement>(config: RippleConfig = {}) {
  const containerRef = useRef<T>(null);
  const [ripples, setRipples] = useState<RippleRef[]>([]);
  const isPointerDown = useRef(false);
  const lastTouchStart = useRef(0);
  const ignoreMouseTimeout = 800;

  const fadeOutRipple = useCallback((ripple: RippleRef) => {
    setRipples(prev => prev.filter(r => r !== ripple));
    ripple.element.remove();
  }, []);

  const createRipple = useCallback((x: number, y: number, rippleConfig: RippleConfig = {}) => {
    if (!containerRef.current || rippleConfig.disabled) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mergedConfig = { ...config, ...rippleConfig };
    const animationConfig = { ...defaultRippleAnimationConfig, ...mergedConfig.animation };

    if (mergedConfig.centered) {
      x = containerRect.left + containerRect.width / 2;
      y = containerRect.top + containerRect.height / 2;
    }

    const radius = mergedConfig.radius || distanceToFurthestCorner(x, y, containerRect);

    const offsetX = x - containerRect.left;
    const offsetY = y - containerRect.top;

    const container = containerRef.current;

    const rippleElement = container instanceof SVGSVGElement ? document.createElementNS('http://www.w3.org/2000/svg', 'circle') : document.createElement('div');

    if (container instanceof SVGSVGElement) {
      rippleElement.setAttribute('cx', `${offsetX}`);
      rippleElement.setAttribute('cy', `${offsetY}`);
      rippleElement.setAttribute('r', '0');
      rippleElement.style.pointerEvents = 'none';
      if (mergedConfig.color) {
        rippleElement.setAttribute('fill', mergedConfig.color);
      }
      rippleElement.style.transition = `r ${animationConfig.enterDuration}ms cubic-bezier(0, 0, 0.2, 1)`;
      rippleElement.style.opacity = '1';
    } else {
      rippleElement.style.position = 'absolute';
      rippleElement.style.borderRadius = '50%';
      rippleElement.style.pointerEvents = 'none';
      rippleElement.style.transition = 'opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1)';
      rippleElement.style.transform = 'scale(0)';
      rippleElement.style.left = `${offsetX - radius}px`;
      rippleElement.style.top = `${offsetY - radius}px`;
      rippleElement.style.width = `${radius * 2}px`;
      rippleElement.style.height = `${radius * 2}px`;
      if (mergedConfig.color) {
        rippleElement.style.backgroundColor = mergedConfig.color;
      }
    }
  
    rippleElement.style.transitionDuration = `${animationConfig.enterDuration}ms`;

    containerRef.current.appendChild(rippleElement);
    window.getComputedStyle(rippleElement).getPropertyValue('opacity');

    if (container instanceof SVGSVGElement) {
      rippleElement.setAttribute('r', `${radius}`);
    } else {
    rippleElement.style.transform = 'scale(1)';
    }

    const rippleRef: RippleRef = {
      element: rippleElement,
      config: mergedConfig,
      state: 'FADING_IN',
      fadeOut: () => {
        rippleRef.state = 'FADING_OUT';
        rippleElement.style.transitionDuration = `${animationConfig.exitDuration}ms`;
        rippleElement.style.opacity = '0';
        setTimeout(() => fadeOutRipple(rippleRef), animationConfig.exitDuration);
      }
    };

    setRipples(prev => [...prev, rippleRef]);

    setTimeout(() => {
      rippleRef.state = 'VISIBLE';
      if (!mergedConfig.persistent && (!isPointerDown.current || mergedConfig.terminateOnPointerUp)) {
        rippleRef.fadeOut();
      }
    }, animationConfig.enterDuration);

    return rippleRef;
  }, [config, fadeOutRipple]);

  const handlePointerDown = useCallback((event: Event) => {
    if (event instanceof TouchEvent) {
      lastTouchStart.current = Date.now();
    } else if (Date.now() - lastTouchStart.current < ignoreMouseTimeout) {
      return;
    }
    isPointerDown.current = true;
    if(event instanceof MouseEvent) {
      const clientX = event.clientX;
      const clientY = event.clientY;
      createRipple(clientX, clientY);
    } else if(event instanceof TouchEvent) {
      const clientX = event.touches[0].clientX;
      const clientY = event.touches[0].clientY;
      createRipple(clientX, clientY);
    }
  }, [createRipple]);

  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false;
      ripples.forEach(ripple => {
      if (!ripple.config.persistent && 
          (ripple.state === 'VISIBLE' || 
           (ripple.config.terminateOnPointerUp && ripple.state === 'FADING_IN'))) {
        ripple.fadeOut();
}
    });
  }, [ripples]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const events = ['mousedown', 'touchstart'];
    events.forEach(event => container.addEventListener(event, handlePointerDown));

    return () => {
      events.forEach(event => container.removeEventListener(event, handlePointerDown));
    };
  }, [handlePointerDown]);

  useEffect(() => {
    const events = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];
    events.forEach(event => window.addEventListener(event, handlePointerUp));

    return () => {
      events.forEach(event => window.removeEventListener(event, handlePointerUp));
    };
  }, [handlePointerUp]);

  return {
    containerRef,
    launch: (x: number, y: number, config?: RippleConfig) => createRipple(x, y, config),
    fadeOutAll: () => ripples.forEach(ripple => ripple.fadeOut()),
    fadeOutAllNonPersistent: () => 
      ripples.forEach(ripple => {
        if (!ripple.config.persistent) ripple.fadeOut();
      })
  };
}