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
  enterDuration: 350,
  exitDuration: 400,
  enterTimingFunction: 'cubic-bezier(0.35, 0, 0.2, 1)',
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

export function useRipple<T extends HTMLElement>(target: RippleTarget) {
  const [ripple, setRipple] = useState<RippleRef | null>(null);
  const containerRef = useRef<T>(null);
  const ignoreMouseEvents = useRef(false);
  const lastTouchStartEvent = useRef(0);
  const isPointerDown = useRef(false);
  const containerRect = useRef<DOMRect | null>(null);
  const lastRippleTime = useRef(0);

  const fadeOutRipple = useCallback((ripple: RippleRef) => {
    ripple.state = RippleState.FADING_OUT;
    setRipple(null);
    ripple.element.style.transition = `opacity ${ripple.config.animation?.exitDuration || defaultRippleAnimationConfig.exitDuration}ms ${ripple.config.animation?.exitTimingFunction || defaultRippleAnimationConfig.exitTimingFunction}`;
    ripple.element.style.opacity = '0';
    setTimeout(() => {
      ripple.state = RippleState.HIDDEN;
      ripple.element.remove();
    }, ripple.config.animation?.exitDuration || defaultRippleAnimationConfig.exitDuration);
  }, []);

  const createRipple = useCallback((event: MouseEvent | TouchEvent) => {
    const now = Date.now();
    if (now - lastRippleTime.current < 100) return;
    lastRippleTime.current = now;
    
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
    const radius = target.rippleConfig.radius || Math.sqrt(width * width + height * height);
    const rippleElement = document.createElement('div');
    rippleElement.style.position = 'absolute';
    rippleElement.style.width = `${radius * 2}px`;
    rippleElement.style.height = `${radius * 2}px`;
    rippleElement.style.left = `${x - radius}px`;
    rippleElement.style.top = `${y - radius}px`;
    rippleElement.style.borderRadius = '50%';
    rippleElement.style.opacity = "0";
    rippleElement.style.pointerEvents = "none";
    rippleElement.style.backgroundColor = target.rippleConfig.color || 'rgba(0, 0, 0, 0.3)';
    rippleElement.style.transform = 'scale(0)';
    rippleElement.style.transitionDuration = `${target.rippleConfig.animation?.enterDuration || defaultRippleAnimationConfig.enterDuration}ms`;
    container.appendChild(rippleElement);

    enforceStyleRecalculation(rippleElement);
    rippleElement.style.transform = 'scale(1)';

    container.style.position = "relative";
    container.style.overflow = "hidden";

    const rippleRef = new RippleRef({ fadeOutRipple }, rippleElement, target.rippleConfig);
    rippleRef.state = RippleState.FADING_IN;
    setRipple(rippleRef);
    setTimeout(() => {
      rippleElement.style.opacity = "0.5";
      rippleElement.style.transform = 'scale(1)';
      rippleRef.state = RippleState.VISIBLE;
    }, 0);

    if (!target.rippleConfig.persistent) {
      setTimeout(() => {
        rippleRef.fadeOut();
      }, target.rippleConfig.animation?.enterDuration || defaultRippleAnimationConfig.enterDuration);
    }
  }, [target.rippleDisabled, target.rippleConfig, fadeOutRipple]);

  const handlePointerUp = useCallback(() => {
    if (target.rippleConfig.terminateOnPointerUp && ripple) {
      ripple.fadeOut();
    }
    isPointerDown.current = false;
  }, [target.rippleConfig.terminateOnPointerUp, ripple]);

  const handlePointerDown = useCallback((event: MouseEvent | TouchEvent) => {
    if (event.type === 'mousedown' && ignoreMouseEvents.current) return;
    if (ripple) {
      ripple.fadeOut();
    }
    isPointerDown.current = true;
    createRipple(event);

    if (event.type === 'touchstart') {
      lastTouchStartEvent.current = Date.now();
      ignoreMouseEvents.current = true;
      setTimeout(() => {
        ignoreMouseEvents.current = false;
      }, ignoreMouseEventsTimeout);
    }
  }, [createRipple, ripple]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerDownWrapper = (event: Event) => handlePointerDown(event as MouseEvent | TouchEvent);
    const handlePointerUpWrapper = () => handlePointerUp();

    pointerDownEvents.forEach((event) => {
      container.addEventListener(event, handlePointerDownWrapper, { passive: true});
    });

      pointerUpEvents.forEach((event) => {
        container.addEventListener(event, handlePointerUpWrapper, { passive: true});
      });

    return () => {
      pointerDownEvents.forEach((event) => {
        container.removeEventListener(event, handlePointerDownWrapper);
      });

      pointerUpEvents.forEach((event) => {
        container.removeEventListener(event, handlePointerUpWrapper);
      });
    };
  }, [handlePointerDown, handlePointerUp]);

  return {
    ripple,
    containerRef,
  };
};

/** Enforces a style recalculation of a DOM element by computing its styles. */
function enforceStyleRecalculation(element: HTMLElement) {
  // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
  // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
  // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
  window.getComputedStyle(element).getPropertyValue('opacity');
}
