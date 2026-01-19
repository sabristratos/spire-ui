# ToggleGroup

Container for ToggleButtons that manages selection state. Buttons connect visually with shared borders.

## Usage

### Multiple Selection (Checkboxes)

```vue
<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleGroup } from 'spire-ui'
import { Bold, Italic, Underline, Strikethrough } from 'lucide-vue-next'

const formatting = ref(['bold', 'italic'])
</script>

<template>
  <ToggleGroup v-model="formatting" type="multiple" label="Text formatting">
    <ToggleButton value="bold" :icon="Bold" label="Bold" />
    <ToggleButton value="italic" :icon="Italic" label="Italic" />
    <ToggleButton value="underline" :icon="Underline" label="Underline" />
    <ToggleButton value="strike" :icon="Strikethrough" label="Strikethrough" />
  </ToggleGroup>
</template>
```

### Single Selection (Radio)

```vue
<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleGroup } from 'spire-ui'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-vue-next'

const alignment = ref('left')
</script>

<template>
  <ToggleGroup v-model="alignment" type="single" label="Text alignment">
    <ToggleButton value="left" :icon="AlignLeft" label="Align left" />
    <ToggleButton value="center" :icon="AlignCenter" label="Align center" />
    <ToggleButton value="right" :icon="AlignRight" label="Align right" />
  </ToggleGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| array` | — | Selected value(s) |
| `type` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size for all buttons |
| `disabled` | `boolean` | `false` | Disable all buttons |
| `label` | `string` | — | Accessible label for group |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `value \| array \| undefined` | Selection changed |
| `change` | `value \| array \| undefined` | Selection changed |

## Selection Behavior

### Single Mode (`type="single"`)
- Only one value can be selected
- Clicking selected value toggles it off (emits `undefined`)
- Clicking different value switches selection

### Multiple Mode (`type="multiple"`)
- Multiple values can be selected simultaneously
- `modelValue` is always an array
- Clicking toggles value in/out of array

## Vertical Orientation

```vue
<ToggleGroup orientation="vertical" type="single">
  <ToggleButton value="a" :icon="AlignLeft" label="A" />
  <ToggleButton value="b" :icon="AlignCenter" label="B" />
  <ToggleButton value="c" :icon="AlignRight" label="C" />
</ToggleGroup>
```

Buttons stack vertically with connected top/bottom borders.

## Connected Button Styling

ToggleGroup removes intermediate border-radii so buttons appear connected:

```css
/* First button: rounded left */
/* Middle buttons: no radius */
/* Last button: rounded right */
```

Pressed buttons get `z-index: 1` to ensure their border appears above siblings.

## Accessibility

- `role="radiogroup"` for single selection
- `role="group"` for multiple selection
- `aria-label` from `label` prop
- `aria-orientation` reflects layout

## Context Injection

ToggleGroup provides context to child ToggleButtons via Vue's provide/inject:

```typescript
provide('toggleGroup', {
  modelValue,    // Current selection
  toggle,        // Function to toggle a value
  type,          // 'single' | 'multiple'
  size,          // Inherited size
  disabled       // Inherited disabled state
})
```

ToggleButtons detect this context automatically and switch from standalone boolean mode to group mode.
