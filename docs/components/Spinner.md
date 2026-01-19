# Spinner

Animated dot spinner with configurable size and speed.

## Usage

```vue
<script setup>
import { Spinner } from 'spire-ui'
</script>

<template>
  <Spinner />
  <Spinner size="lg" />
  <Spinner :speed="0.5" />

  <!-- Color inherits from parent -->
  <span style="color: blue">
    <Spinner />
  </span>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Spinner size |
| `speed` | `number` | `1` | Animation speed multiplier (lower = slower) |
| `label` | `string` | `'Loading'` | Accessible label for screen readers |

## Size Scale

| Size | Value |
|------|-------|
| `xs` | 0.75rem |
| `sm` | 1rem |
| `md` | 1.25rem |
| `lg` | 1.5rem |
| `xl` | 2rem |

## Notes

- 8-dot circular spinner with staggered fade animation
- Color inherited via `currentColor`
- Hidden from screen readers with `aria-hidden`, uses `role="status"` with label
