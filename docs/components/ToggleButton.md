# ToggleButton

Pressed button with inset shadow for on/off states. Use standalone or within a ToggleGroup for toolbars.

## Usage

### Standalone (Boolean)

```vue
<script setup>
import { ref } from 'vue'
import { ToggleButton } from 'spire-ui'
import { Bold } from 'lucide-vue-next'

const isBold = ref(false)
</script>

<template>
  <ToggleButton v-model="isBold" :icon="Bold" label="Bold" />
</template>
```

### In a ToggleGroup

```vue
<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleGroup } from 'spire-ui'
import { Bold, Italic, Underline } from 'lucide-vue-next'

const formatting = ref(['bold'])
</script>

<template>
  <ToggleGroup v-model="formatting" type="multiple">
    <ToggleButton value="bold" :icon="Bold" label="Bold" />
    <ToggleButton value="italic" :icon="Italic" label="Italic" />
    <ToggleButton value="underline" :icon="Underline" label="Underline" />
  </ToggleGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Pressed state for standalone usage (v-model) |
| `value` | `string \| number` | — | Value for group usage |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `IconInput` | — | Icon to display |
| `label` | `string` | — | Accessible label (required for icon-only) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Pressed state changed (standalone) |
| `change` | `boolean` | Pressed state changed |

## Size Scale

| Size | Height | Icon |
|------|--------|------|
| `sm` | 32px | 16px |
| `md` | 36px | 18px |
| `lg` | 44px | 20px |

## The Pressed State

The key visual feature is the **inset shadow** when pressed:

```css
.ui-toggle-button--pressed {
  background: var(--toggle-bg-pressed);
  box-shadow: inset 0 2px 4px var(--toggle-inset-shadow);
}
```

This creates the appearance of a physically depressed button.

## Accessibility

- Uses `aria-pressed` to indicate toggle state
- `aria-label` automatically set for icon-only buttons
- Full keyboard support (Space/Enter to toggle)

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--toggle-bg` | Default background |
| `--toggle-bg-hover` | Hover background |
| `--toggle-bg-pressed` | Pressed background |
| `--toggle-bg-pressed-hover` | Pressed + hover background |
| `--toggle-border` | Default border |
| `--toggle-border-pressed` | Pressed border |
| `--toggle-text` | Default text/icon color |
| `--toggle-text-pressed` | Pressed text/icon color |
| `--toggle-inset-shadow` | Inset shadow color |
