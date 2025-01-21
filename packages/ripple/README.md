# Ripple Component and useRipple Hook Documentation

## Overview

The `Ripple` component and `useRipple` hook are used to create a material design ripple effect, which is a visual feedback mechanism for user interactions. The ripple effect is commonly used in buttons, cards, and other interactive elements.

## Ripple Component

### Props

- **`as`**: (Optional) The HTML element or SVG element to render as the container for the ripple effect. Defaults to `'div'`.
- **`color`**: (Optional) The color of the ripple effect. Can be any valid CSS color value.
- **`centered`**: (Optional) If `true`, the ripple effect will originate from the center of the container. Defaults to `false`.
- **`radius`**: (Optional) The radius of the ripple effect. If not provided, the ripple will expand to the furthest corner of the container.
- **`disabled`**: (Optional) If `true`, the ripple effect will be disabled. Defaults to `false`.
- **`unbounded`**: (Optional) If `true`, the ripple effect will not be constrained by the container's boundaries. Defaults to `false`.
- **`animation`**: (Optional) Configuration for the ripple animation.
  - **`enterDuration`**: (Optional) The duration of the ripple's enter animation in milliseconds. Defaults to `225`.
  - **`exitDuration`**: (Optional) The duration of the ripple's exit animation in milliseconds. Defaults to `150`.
- **`terminateOnPointerUp`**: (Optional) If `true`, the ripple effect will terminate when the pointer is released. Defaults to `false`.

### Usage

```jsx
import React from 'react';
import { Ripple } from '@alter-ui/ripple';

function MyButton() {
  return (
    <Ripple color="rgba(0, 0, 0, 0.1)" centered>
      <button>Click Me</button>
    </Ripple>
  );
}

export default MyButton;
```

## useRipple Hook

### Parameters

- **`config`**: (Optional) Configuration object for the ripple effect.
  - **`color`**: (Optional) The color of the ripple effect. Can be any valid CSS color value.
  - **`centered`**: (Optional) If `true`, the ripple effect will originate from the center of the container. Defaults to `false`.
  - **`radius`**: (Optional) The radius of the ripple effect. If not provided, the ripple will expand to the furthest corner of the container.
  - **`persistent`**: (Optional) If `true`, the ripple effect will persist until manually faded out. Defaults to `false`.
  - **`disabled`**: (Optional) If `true`, the ripple effect will be disabled. Defaults to `false`.
  - **`animation`**: (Optional) Configuration for the ripple animation.
    - **`enterDuration`**: (Optional) The duration of the ripple's enter animation in milliseconds. Defaults to `225`.
    - **`exitDuration`**: (Optional) The duration of the ripple's exit animation in milliseconds. Defaults to `150`.
  - **`terminateOnPointerUp`**: (Optional) If `true`, the ripple effect will terminate when the pointer is released. Defaults to `false`.

### Return Value

- **`containerRef`**: A ref that should be attached to the container element where the ripple effect will be applied.
- **`launch`**: A function to manually trigger a ripple effect at a specific coordinate.
  - **Parameters**:
    - **`x`**: The x-coordinate of the ripple's origin.
    - **`y`**: The y-coordinate of the ripple's origin.
    - **`config`**: (Optional) Configuration object for the ripple effect.
- **`fadeOutAll`**: A function to fade out all active ripples.
- **`fadeOutAllNonPersistent`**: A function to fade out all non-persistent ripples.

### Usage

```jsx
import React, { useRef } from 'react';
import { useRipple } from '@alter-ui/ripple';

function MyButton() {
  const { containerRef, launch } = useRipple({ color: 'rgba(0, 0, 0, 0.1)', centered: true });

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    launch(x, y);
  };

  return (
    <button ref={containerRef} onClick={handleClick}>
      Click Me
    </button>
  );
}

export default MyButton;
```

## Examples

### Centered Ripple

```jsx
<Ripple as="button" color="rgba(0, 0, 0, 0.1)" centered>
  Centered Ripple
</Ripple>
```

### Custom Radius Ripple

```jsx
<Ripple as="button" color="rgba(0, 0, 0, 0.1)" radius={50}>
  Custom Radius Ripple
</Ripple>
```

### Persistent Ripple

```jsx
<Ripple as="button" color="rgba(0, 0, 0, 0.1)" persistent>
  Persistent Ripple
</Ripple>
```

### Unbounded Ripple

```jsx
<Ripple as="button" color="rgba(0, 0, 0, 0.1)" unbounded>
  Unbounded Ripple
</Ripple>
```

### Custom Animation Duration

```jsx
<Ripple as="button" color="rgba(0, 0, 0, 0.1)" animation={{ enterDuration: 500, exitDuration: 300 }}>
  Custom Animation Duration
</Ripple>
```

## Notes

- The `Ripple` component is a wrapper that automatically handles the ripple effect for its children.
- The `useRipple` hook provides more control and can be used in custom components where the `Ripple` component might not be suitable.
- The ripple effect is designed to work with both HTML elements and SVG elements.