import React, { useRef, useState, useCallback, useEffect } from 'react';

export const enum RippleState {
  FADING_IN,
  VISIBLE,
  FADING_OUT,
  HIDDEN,
}

export type RippleConfig = {
  color?: string;
  centered?: boolean;
  radius?: number;
  persistent?: boolean;
  animation?: RippleAnimationConfig;
  terminateOnPointerUp?: boolean;
};

export interface RippleAnimationConfig {
  enterDuration?: number;
  exitDuration?: number;
  enterTimingFunction?: string;
  exitTimingFunction?: string;
}

export interface RippleTarget {
  rippleConfig: RippleConfig;
  rippleDisabled: boolean;
}

export const defaultRippleAnimationConfig = {
  enterDuration: 225,
  exitDuration: 150,
  enterTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  exitTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

const ignoreMouseEventsTimeout = 800;

const pointerDownEvents = ['mousedown', 'touchstart'];
const pointerUpEvents = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];

export class RippleRef {
  state: RippleState = RippleState.HIDDEN;

  constructor(
    private _renderer: { fadeOutRipple(ref: RippleRef): void },
    public element: HTMLElement,
    public config: RippleConfig,
  ) {}

  fadeOut() {
    this._renderer.fadeOutRipple(this);
  }
}

export const useRipple = (target: RippleTarget) => {
  const [ripples, setRipples] = useState<RippleRef[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);
  const ignoreMouseEvents = useRef(false);

  // New state variables
  const isPointerDown = useRef(false);
  const activeRipples = useRef(new Set<RippleRef>());
  const mostRecentTransientRipple = useRef<RippleRef | null>(null);
  const lastTouchStartEvent = useRef<number>(0);
  const pointerUpEventsRegistered = useRef(false);
  const containerRect = useRef<ClientRect | null>(null);

  const fadeOutRipple = useCallback((ripple: RippleRef) => {
    ripple.state = RippleState.FADING_OUT;
    setRipples((prevRipples) => [...prevRipples]);

    ripple.element.style.transition = `opacity ${ripple.config.animation?.exitDuration || defaultRippleAnimationConfig.exitDuration}ms ${ripple.config.animation?.exitTimingFunction || defaultRippleAnimationConfig.exitTimingFunction}`;
    ripple.element.style.opacity = '0';
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((r) => r !== ripple));
      ripple.element.remove();
      activeRipples.current.delete(ripple);
      if (mostRecentTransientRipple.current === ripple) {
        mostRecentTransientRipple.current = null;
      }
    }, ripple.config.animation?.exitDuration || defaultRippleAnimationConfig.exitDuration);
  }, []);

  const createRipple = useCallback((event: MouseEvent | TouchEvent) => {
    if (target.rippleDisabled || !containerRef.current) return;
    const container = containerRef.current;
    if (!containerRect.current) {
      containerRect.current = container.getBoundingClientRect();
    }
    const { width, height, left, top } = containerRect.current;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const x = target.rippleConfig.centered ? width / 2 + left : clientX - left;
    const y = target.rippleConfig.centered ? height / 2 + top : clientY - top;
    const radius = Math.max(width, height) * Math.SQRT2;
    const rippleElement = document.createElement('div');
    rippleElement.style.position = 'absolute';
    rippleElement.style.width = `${radius * 2}px`;
    rippleElement.style.height = `${radius * 2}px`;
    rippleElement.style.left = `${x - radius}px`;
    rippleElement.style.top = `${y - radius}px`;
    rippleElement.style.borderRadius = '50%';
    rippleElement.style.opacity = "0";
    rippleElement.style.backgroundColor = target.rippleConfig.color || 'rgba(0, 0, 0, 0.3)';
    rippleElement.style.transform = 'scale(0)';
    rippleElement.style.transition = `transform ${target.rippleConfig.animation?.enterDuration || defaultRippleAnimationConfig.enterDuration}ms ${target.rippleConfig.animation?.enterTimingFunction || defaultRippleAnimationConfig.enterTimingFunction}, opacity ${target.rippleConfig.animation?.enterDuration || defaultRippleAnimationConfig.enterDuration}ms ${target.rippleConfig.animation?.enterTimingFunction || defaultRippleAnimationConfig.enterTimingFunction}`;

    container.appendChild(rippleElement);
    container.style.position = "relative";
    container.style.overflow = "hidden";

    const rippleRef = new RippleRef({ fadeOutRipple }, rippleElement, target.rippleConfig);
    rippleRef.state = RippleState.FADING_IN;
    setRipples((prevRipples) => [...prevRipples, rippleRef]);
    activeRipples.current.add(rippleRef);

    if (!target.rippleConfig.persistent) {
      mostRecentTransientRipple.current = rippleRef;
    }

    setTimeout(() => {
      rippleElement.style.opacity = "0.5";
      rippleElement.style.transform = 'scale(1)';
      rippleRef.state = RippleState.VISIBLE;
    }, 10);

    if (!target.rippleConfig.persistent) {
      setTimeout(() => {
        rippleRef.fadeOut();
      }, target.rippleConfig.animation?.enterDuration || defaultRippleAnimationConfig.enterDuration);
    }
  }, [target.rippleDisabled, target.rippleConfig, fadeOutRipple]);

  const handlePointerUp = useCallback(() => {
    if (target.rippleConfig.terminateOnPointerUp) {
      activeRipples.current.forEach((ripple) => ripple.fadeOut());
    }
    isPointerDown.current = false;
  }, [target.rippleConfig.terminateOnPointerUp]);

  const handlePointerDown = useCallback((event: MouseEvent | TouchEvent) => {
    if (event.type === 'mousedown' && ignoreMouseEvents.current) return;
    isPointerDown.current = true;
    createRipple(event);

    if (event.type === 'touchstart') {
      lastTouchStartEvent.current = Date.now();
      ignoreMouseEvents.current = true;
      setTimeout(() => {
        ignoreMouseEvents.current = false;
      }, ignoreMouseEventsTimeout);
    }
  }, [createRipple]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerDownWrapper = (event: Event) => handlePointerDown(event as MouseEvent | TouchEvent);
    const handlePointerUpWrapper = () => handlePointerUp();

    pointerDownEvents.forEach((event) => {
      container.addEventListener(event, handlePointerDownWrapper, { passive: true});
    });

    if (!pointerUpEventsRegistered.current) {
      pointerUpEvents.forEach((event) => {
        container.addEventListener(event, handlePointerUpWrapper, { passive: true});
      });
      pointerUpEventsRegistered.current = true;
    }

    return () => {
      pointerDownEvents.forEach((event) => {
        container.removeEventListener(event, handlePointerDownWrapper);
      });

      pointerUpEvents.forEach((event) => {
        container.removeEventListener(event, handlePointerUpWrapper);
      });
      pointerUpEventsRegistered.current = false;
    };
  }, [handlePointerDown, handlePointerUp]);

  return {
    ripples,
    containerRef,
  };
};