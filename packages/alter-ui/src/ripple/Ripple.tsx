import React, { forwardRef } from 'react';
import { useRipple } from './useRipple';

const rippleStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  transform: "translateZ(0)",
};
const rippleUnboundedStyle: React.CSSProperties = {
  overflow: "visible",
};


type RippleProps = React.HTMLAttributes<HTMLDivElement> & {
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

export const Ripple = forwardRef<HTMLDivElement, RippleProps>((props, ref) => {
  const {
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

  const { containerRef } = useRipple({
    color,
    centered,
    radius,
    animation,
    terminateOnPointerUp,
    disabled
  });

  return (
    <div
      {...rest}
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      style={{ 
        ...rippleStyle, 
        ...rest.style,
        ...(unbounded && rippleUnboundedStyle),
      }}
    >
      {children}
    </div>
  );
});