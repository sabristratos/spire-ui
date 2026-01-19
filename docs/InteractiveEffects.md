# Interactive Effects

Composables for adding rich, animated interactions to your components.

## Overview

Spire UI provides four effect composables that work with any element:

| Composable | Effect | Use Case |
|------------|--------|----------|
| `useMagnetic` | Element follows cursor on hover | Buttons, CTAs, floating elements |
| `useRipple` | Expanding circle on click | Buttons, cards, list items |
| `useHoverReveal` | Radial gradient spotlight | Cards, panels, interactive areas |
| `useStagger` | Sequential list animation | Menus, lists, grids |

All composables handle deferred elements (tabs, modals, v-if) automatically.

---

## useMagnetic

Creates a subtle magnetic effect where the element follows the cursor.

```vue
<script setup>
import { ref } from 'vue'
import { useMagnetic } from 'spire-ui'

const buttonRef = ref(null)
const { style } = useMagnetic(buttonRef, {
  strength: 0.3,
  radius: 120
})
</script>

<template>
  <button ref="buttonRef" :style="style">
    Hover me
  </button>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strength` | `number` | `0.2` | How much the element moves (0-1) |
| `radius` | `number` | `100` | Detection radius in pixels |
| `ease` | `number` | `0.15` | Animation smoothing factor |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `style` | `Ref<CSSProperties>` | Bind to element's `:style` |
| `x` | `Ref<number>` | Current X offset |
| `y` | `Ref<number>` | Current Y offset |
| `isHovering` | `Ref<boolean>` | Whether cursor is in radius |

---

## useRipple

Creates a Material-style ripple effect on click.

```vue
<script setup>
import { ref } from 'vue'
import { useRipple } from 'spire-ui'

const buttonRef = ref(null)
useRipple(buttonRef, {
  color: 'white',
  opacity: 0.3
})
</script>

<template>
  <button ref="buttonRef" class="my-button">
    Click me
  </button>
</template>

<style>
.my-button {
  position: relative;
  overflow: hidden;
}
</style>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | `string` | `'white'` | Ripple color (CSS value) |
| `opacity` | `number` | `0.25` | Peak opacity |
| `duration` | `number` | `800` | Animation duration in ms |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable effect |

### Styling Notes

The target element needs `position: relative` and `overflow: hidden` for the ripple to be contained. The composable sets these automatically, but you may want to set them explicitly.

---

## useHoverReveal

Creates a radial gradient spotlight that follows the cursor.

```vue
<script setup>
import { ref } from 'vue'
import { useHoverReveal } from 'spire-ui'

const cardRef = ref(null)
useHoverReveal(cardRef, {
  size: 200,
  opacity: 0.1
})
</script>

<template>
  <div ref="cardRef" class="card">
    Hover over this card
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `number` | CSS default | Spotlight diameter in pixels |
| `opacity` | `number` | CSS default | Spotlight opacity |

### CSS Customization

The effect uses CSS custom properties that you can override:

```css
[data-hover-reveal] {
  --effect-hover-reveal-size: 150px;
  --effect-hover-reveal-opacity: 0.08;
}

/* Dark mode gets higher opacity automatically */
[data-theme='dark'] [data-hover-reveal] {
  --effect-hover-reveal-opacity: 0.18;
}
```

---

## useStagger

Animates list items sequentially with a cascading effect.

```vue
<script setup>
import { ref } from 'vue'
import { useStagger } from 'spire-ui'

const listRef = ref(null)
const { animate, isAnimating } = useStagger(listRef, '.list-item', {
  delay: 80,
  duration: 400
})

const items = ['Dashboard', 'Analytics', 'Settings', 'Users']
</script>

<template>
  <button @click="animate" :disabled="isAnimating">
    Animate List
  </button>

  <ul ref="listRef">
    <li v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </li>
  </ul>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `80` | Delay between items (ms) |
| `duration` | `number` | `400` | Animation duration per item (ms) |
| `easing` | `string` | `cubic-bezier(0.16, 1, 0.3, 1)` | CSS easing function |
| `from` | `object` | `{ opacity: 0, transform: 'translateY(16px)' }` | Initial state |
| `to` | `object` | `{ opacity: 1, transform: 'translateY(0)' }` | Final state |
| `animateOnVisible` | `boolean` | `false` | Auto-animate when container appears |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `animate` | `() => Promise<void>` | Trigger the animation |
| `reset` | `() => void` | Reset to initial state |
| `isAnimating` | `Ref<boolean>` | Animation in progress |

### Auto-Animate on Tab/Modal

For elements inside tabs or modals, use `animateOnVisible`:

```vue
<script setup>
import { ref } from 'vue'
import { useStagger } from 'spire-ui'

const listRef = ref(null)
const { isAnimating } = useStagger(listRef, '.item', {
  animateOnVisible: true  // Animates when element enters DOM
})
</script>
```

### CSS-Only Alternative

For simpler cases, use `getStaggerStyle` with CSS animations:

```vue
<script setup>
import { getStaggerStyle } from 'spire-ui'

const items = ['One', 'Two', 'Three']
</script>

<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="item"
      :style="getStaggerStyle(index, { delay: 80 })"
      class="stagger-item"
    >
      {{ item }}
    </li>
  </ul>
</template>

<style>
@keyframes stagger-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  animation: stagger-in 400ms ease-out both;
  animation-delay: var(--stagger-delay);
}
</style>
```

---

## Combining Effects

Effects can be combined on the same element:

```vue
<script setup>
import { ref } from 'vue'
import { useMagnetic, useRipple } from 'spire-ui'

const buttonRef = ref(null)
const { style } = useMagnetic(buttonRef, { strength: 0.2 })
useRipple(buttonRef, { color: 'white' })
</script>

<template>
  <button ref="buttonRef" :style="style" class="fancy-button">
    Magnetic + Ripple
  </button>
</template>
```

---

## Working with Conditional Elements

All composables automatically handle elements that appear later (tabs, modals, v-if). No special setup needed:

```vue
<script setup>
import { ref } from 'vue'
import { useMagnetic } from 'spire-ui'

const showButton = ref(false)
const buttonRef = ref(null)
const { style } = useMagnetic(buttonRef)  // Works even though element doesn't exist yet
</script>

<template>
  <button @click="showButton = true">Show Button</button>

  <button v-if="showButton" ref="buttonRef" :style="style">
    I appeared later!
  </button>
</template>
```

---

## Performance

- Effects use `requestAnimationFrame` for smooth animations
- Event listeners are automatically cleaned up on unmount
- Magnetic effect only runs animation loop while cursor is nearby
- Ripple elements are removed from DOM after animation completes
