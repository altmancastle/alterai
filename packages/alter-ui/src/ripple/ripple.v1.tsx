import { useEffect, useMemo, useRef, useState } from "react";
import { RippleAnimationConfig, RippleConfig, RippleRef } from "./ripple-ref";
import { RippleRenderer } from "./ripple-renderer";

export interface RippleProps {
  color?: string;
  unbounded?: boolean;
  centered?: boolean;
  radius?: number;
  disabled: boolean;
  animation?: RippleAnimationConfig;
  terminateOnPointerUp?: boolean
}

export function useRipple(props: RippleProps) {

  const {
    color,
    centered,
    radius,
    animation,
    disabled,
    terminateOnPointerUp
  } = props;

  const [_disabled, set_Disabled] = useState(false);
  const parentRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const rippleRenderer = useRef<RippleRenderer>(null);

  useEffect(() => {
    if (!disabled && parentRef.current) {
      // 在 triggerRef.current 第一个子子元素的同级添加一个dom元素 宽高等于 triggerRef.current 并进行绝对定位
      const rippleContainer = document.createElement('div');
      rippleContainer.classList.add('mat-ripple');
      rippleContainer.style.position = 'absolute';
      rippleContainer.style.top = '0';
      rippleContainer.style.left = '0';
      rippleContainer.style.width = '100%';
      rippleContainer.style.height = '100%';
      rippleContainer.style.overflow = 'hidden';
      rippleContainer.style.pointerEvents = 'none';
      rippleContainer.style.borderRadius = 'inherit';
      rippleContainer.style.transform = 'translateZ(0)';
      const firstChild = parentRef.current.firstElementChild;
      if (firstChild) {
        parentRef.current.insertBefore(rippleContainer, firstChild);
      } else {
        parentRef.current.appendChild(rippleContainer);
      }
      triggerRef.current = rippleContainer;

      console.log(rippleContainer)

      rippleRenderer.current = new RippleRenderer({
        rippleConfig: {
            centered: centered,
            radius: radius,
            color: color,
            animation: {
              ...animation,
            },
            terminateOnPointerUp: terminateOnPointerUp,
        },
        rippleDisabled: disabled,
      }, triggerRef.current);
      rippleRenderer.current.setupTriggerEvents(triggerRef.current);
    }
    return () => {
      if(rippleRenderer.current) {
        rippleRenderer.current._removeTriggerEvents();
      }
    }
  }, [animation, centered, color, disabled, radius, terminateOnPointerUp]);

  return useMemo(()=>{

    /** Fades out all currently showing ripple elements. */
    function fadeOutAll() {
      if(rippleRenderer.current) {
        rippleRenderer.current.fadeOutAll();
      }
    }
  
    /** Fades out all currently showing non-persistent ripple elements. */
    function fadeOutAllNonPersistent() {
      if(rippleRenderer.current) {
        rippleRenderer.current.fadeOutAllNonPersistent();
      }
    }

    function setupTriggerEventsIfEnabled() {
      if (!_disabled && triggerRef.current && rippleRenderer.current) {
        rippleRenderer.current.setupTriggerEvents(triggerRef.current);
      }
    }
    function setTrigger(trigger: HTMLElement) {
      triggerRef.current = trigger;
      setupTriggerEventsIfEnabled();
    }
  
    function getDisabled() {
      return _disabled;
    }

    function setDisabled(value: boolean) {
      set_Disabled(value);
    }

    function rippleConfig(): RippleConfig {
      return {
        centered: centered,
        radius: radius,
        color: color,
        animation: {
          ...animation,
        },
        terminateOnPointerUp: terminateOnPointerUp,
      }
    }
    function getRippleDisabled(): boolean {
      return disabled;
    }

    function launch(configOrX: number | RippleConfig, y: number = 0, config?: RippleConfig): RippleRef | undefined {
      if(rippleRenderer.current) {
        if (typeof configOrX === 'number') {
          return rippleRenderer.current.fadeInRipple(configOrX, y, {...rippleConfig(), ...config});
        } else {
          return rippleRenderer.current.fadeInRipple(0, 0, {...rippleConfig(), ...configOrX});
        }
      }
      return undefined
    }
    
    return {
      triggerRef,
      getDisabled,
      setDisabled,
      setTrigger,
      rippleConfig,
      getRippleDisabled,
      fadeOutAll,
      fadeOutAllNonPersistent,
      launch,
    }
  }, [_disabled, triggerRef, animation, centered, color, disabled, radius, terminateOnPointerUp])

}












