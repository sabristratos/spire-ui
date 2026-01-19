# Text

Polymorphic text component for body copy with muted variant and clamping.

## Usage

```vue
<script setup>
import { Text } from 'spire-ui'
</script>

<template>
  <!-- Basic usage -->
  <Text>Default paragraph text</Text>

  <!-- Sizes -->
  <Text size="lg">Large intro text</Text>
  <Text size="sm">Small text</Text>
  <Text size="xs">Caption text</Text>

  <!-- Weights -->
  <Text weight="bold">Bold text</Text>
  <Text weight="semibold">Semibold text</Text>

  <!-- Muted (secondary color) -->
  <Text muted>Helper text in secondary color</Text>
  <Text size="sm" muted>Field description</Text>

  <!-- Polymorphism -->
  <Text as="span">Inline text</Text>
  <Text as="label">Form label</Text>

  <!-- Truncation -->
  <Text truncate>Single line truncated...</Text>
  <Text :clamp="2">Multi-line text clamped to 2 lines...</Text>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'p' \| 'span' \| 'div' \| 'label' \| 'li'` | `'p'` | Rendered HTML element |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Font size |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold'` | `'regular'` | Font weight |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Text alignment |
| `muted` | `boolean` | `false` | Use secondary text color |
| `truncate` | `boolean` | `false` | Single-line truncation |
| `clamp` | `number` | — | Multi-line clamping (number of lines) |

## Size Scale

| Size | Value |
|------|-------|
| `xs` | 0.75rem (12px) |
| `sm` | 0.875rem (14px) |
| `md` | 1rem (16px) |
| `lg` | 1.125rem (18px) |
| `xl` | 1.25rem (20px) |

## Notes

- `line-height: 1.5` for readability (1.4 for xs/sm/xl)
- `muted` uses `--text-secondary` token
- `clamp` takes precedence over `truncate`
