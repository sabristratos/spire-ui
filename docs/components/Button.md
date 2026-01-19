# Button

Polymorphic button with realistic light simulation and loading states.

## Usage

```vue
<script setup>
import { Button } from 'spire-ui'
import { Download01Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="destructive">Delete</Button>
  <Button :icon-left="Download01Icon">Download</Button>
  <Button :loading="true">Saving...</Button>
  <Button as="a" href="/page">Link Button</Button>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'ghost' \| 'outline'` | `'primary'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `as` | `string \| Component` | `'button'` | Rendered element (e.g., `'a'`, `RouterLink`) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type attribute |
| `disabled` | `boolean` | `false` | Disable interactions |
| `loading` | `boolean` | `false` | Show spinner, disable interactions |
| `iconLeft` | `IconInput` | — | Icon before text |
| `iconRight` | `IconInput` | — | Icon after text |
| `block` | `boolean` | `false` | Full width |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Fired on click (not when disabled/loading) |

## Notes

- Loading state uses overlay pattern (no layout shift)
- Icon-only buttons become square when no slot content
- Supports any icon format via `Icon` component
