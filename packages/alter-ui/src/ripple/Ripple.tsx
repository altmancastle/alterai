import React, { forwardRef, JSX } from 'react';
import { useRipple } from './useRipple';

const rippleStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  transform: "translateZ(0)",
};
const rippleUnboundedStyle: React.CSSProperties = {
  overflow: "visible",
};

type RippleProps<T extends keyof JSX.IntrinsicElements> = Omit<JSX.IntrinsicElements[T], keyof React.HTMLAttributes<HTMLElement>> & React.HTMLAttributes<HTMLElement> & {
  as?: T;
  color?: string;
  centered?: boolean;
  radius?: number;
  disabled?: boolean;
  unbounded?: boolean;
  animation?: {
    enterDuration?: number;
    exitDuration?: number;
  };
  terminateOnPointerUp?: boolean;
};

export const Ripple = forwardRef<HTMLElement | SVGSVGElement, RippleProps<keyof JSX.IntrinsicElements>>((props, ref) => {
  const {
    as: Component = 'div',
    color,
    centered,
    radius,
    disabled,
    unbounded,
    animation,
    terminateOnPointerUp,
    children,
    ...rest
  } = props;

  const { containerRef } = useRipple<HTMLElement | SVGSVGElement>({
    color,
    centered,
    radius,
    animation,
    terminateOnPointerUp,
    disabled
  });

  const componentProps = {
    ...rest,
    ref: (node: HTMLElement | SVGSVGElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<HTMLElement | SVGSVGElement | null>).current = node;
      }
    },
    style: { 
      ...rippleStyle, 
      ...rest.style,
      ...(unbounded && rippleUnboundedStyle),
    },
    children
  };

  return React.createElement(Component, componentProps);
});