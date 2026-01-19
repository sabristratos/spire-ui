# Tooltip

Accessible tooltip component for displaying supplementary information on hover or focus.

## Usage

```vue
<script setup>
import { Tooltip } from 'spire-ui'
</script>

<template>
  <Tooltip text="Save your changes">
    <button>Save</button>
  </Tooltip>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — | Tooltip content (required) |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Preferred position |
| `delay` | `number` | `200` | Show delay in ms |
| `offset` | `number` | `8` | Gap between trigger and tooltip |
| `disabled` | `boolean` | `false` | Disable the tooltip |

## Placement

```vue
<Tooltip text="Above" placement="top">
  <button>Top</button>
</Tooltip>

<Tooltip text="Below" placement="bottom">
  <button>Bottom</button>
</Tooltip>

<Tooltip text="Left side" placement="left">
  <button>Left</button>
</Tooltip>

<Tooltip text="Right side" placement="right">
  <button>Right</button>
</Tooltip>
```

### Collision Detection

The tooltip automatically flips to the opposite side when near viewport edges. If `placement="top"` but there's no room above, it flips to `"bottom"`.

## Delay

The `delay` prop prevents flicker when rapidly moving across triggers:

```vue
<!-- Instant (0ms delay) -->
<Tooltip text="Quick" :delay="0">
  <button>Hover</button>
</Tooltip>

<!-- Longer delay for less important hints -->
<Tooltip text="Slow" :delay="500">
  <button>Hover</button>
</Tooltip>
```

## With Icons

Perfect for icon-only buttons that need labels:

```vue
<Tooltip text="Delete item">
  <button aria-label="Delete">
    <Icon :name="Delete02Icon" />
  </button>
</Tooltip>
```

## With Avatars

```vue
<Tooltip text="John Doe - Online">
  <Avatar name="John Doe" />
</Tooltip>
```

## Disabled State

```vue
<Tooltip text="Won't show" disabled>
  <button>Disabled tooltip</button>
</Tooltip>
```

## Accessibility

- `role="tooltip"` on the tooltip element
- `aria-describedby` links trigger to tooltip when visible
- Escape key dismisses the tooltip
- Shows on focus (keyboard accessible)
- Unique IDs for multiple tooltip instances

## Technical Notes

- Uses Vue Teleport to render in `<body>` (escapes `overflow: hidden`)
- `pointer-events: none` on tooltip prevents interaction blocking
- CSS transitions for smooth fade in/out
- Scroll and resize listeners update position dynamically
- Timers cleaned up on unmount to prevent memory leaks

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--tooltip-bg` | Background color |
| `--tooltip-text` | Text color |
| `--z-tooltip` | Z-index layer |
