import React, { forwardRef } from 'react';
import { useRipple } from './useRipple';

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
      className={`mat-ripple ${unbounded ? 'mat-ripple-unbounded' : ''}`}
      style={{ position: 'relative', overflow: 'hidden', ...rest.style }}
    >
      {children}
    </div>
  );
});