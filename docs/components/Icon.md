# Icon

Adapter component for rendering any SVG icon with consistent sizing and color inheritance.

## Usage

```vue
<script setup>
import { Icon } from 'spire-ui'
import { Home01Icon, Settings02Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <Icon :icon="Home01Icon" />
  <Icon :icon="Settings02Icon" size="lg" />
  <Icon :icon="Home01Icon" size="2rem" />

  <!-- Color inherits from parent -->
  <span style="color: red">
    <Icon :icon="Home01Icon" />
  </span>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Component \| HugeIconData` | **required** | Icon component or HugeIcons data array |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Predefined size or custom CSS value |
| `strokeWidth` | `number \| string` | `1.5` | Stroke width (for Lucide, HugeIcons, etc.) |
| `label` | `string` | — | Accessible label (sets `aria-label`) |

## Size Scale

| Size | Value |
|------|-------|
| `xs` | 0.75rem (12px) |
| `sm` | 1rem (16px) |
| `md` | 1.25rem (20px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |

## Stroke Width

```vue
<!-- Lucide default is 2 -->
<Icon :icon="Heart" :stroke-width="1" />   <!-- Thin -->
<Icon :icon="Heart" :stroke-width="1.5" /> <!-- Light -->
<Icon :icon="Heart" :stroke-width="2" />   <!-- Regular -->
<Icon :icon="Heart" :stroke-width="2.5" /> <!-- Medium -->
<Icon :icon="Heart" :stroke-width="3" />   <!-- Bold -->
```

## Notes

- Supports Vue components (Lucide, Heroicons) and HugeIcons data array format
- Color inherited via `currentColor`
- `strokeWidth` works with stroke-based icon libraries
- Add `label` prop for standalone icons (accessibility)
