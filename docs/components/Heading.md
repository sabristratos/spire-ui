# Heading

Polymorphic heading component for display typography.

## Usage

```vue
<script setup>
import { Heading } from 'spire-ui'
</script>

<template>
  <!-- Basic usage -->
  <Heading>Default h2, 2xl size</Heading>

  <!-- Explicit semantic + visual -->
  <Heading as="h1" size="4xl">Page Title</Heading>
  <Heading as="h2" size="xl">Section Title</Heading>

  <!-- Polymorphism: visual h1 style, semantic h3 -->
  <Heading as="h3" size="3xl">Looks big, is h3</Heading>

  <!-- Non-heading element with heading style -->
  <Heading as="span" size="lg">Styled span</Heading>

  <!-- Truncation -->
  <Heading truncate>Very long title that truncates...</Heading>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div' \| 'span'` | `'h2'` | Rendered HTML element |
| `size` | `'4xl' \| '3xl' \| '2xl' \| 'xl' \| 'lg' \| 'md'` | `'2xl'` | Visual size |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `truncate` | `boolean` | `false` | Truncate with ellipsis |

## Size Scale

| Size | Value |
|------|-------|
| `4xl` | 3rem (48px) |
| `3xl` | 2.25rem (36px) |
| `2xl` | 1.875rem (30px) |
| `xl` | 1.5rem (24px) |
| `lg` | 1.25rem (20px) |
| `md` | 1rem (16px) |

## Notes

- `font-weight: 700`, `line-height: 1.2`, `letter-spacing: -0.02em`
- Decouples semantic HTML from visual style (SEO/a11y friendly)
