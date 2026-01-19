# Checkbox

Checkbox with SVG stroke-draw animation for the checkmark. Supports indeterminate state for partial selections.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Checkbox } from 'spire-ui'

const accepted = ref(false)
</script>

<template>
  <Checkbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Checked state (v-model) |
| `indeterminate` | `boolean` | `false` | Indeterminate state (partial selection) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Checkbox size |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Visible label text |
| `description` | `string` | — | Description text below label |
| `name` | `string` | — | HTML name for form submission |
| `value` | `string` | — | Value attribute for form submission |
| `id` | `string` | Auto-generated | HTML id attribute |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Value changed |
| `change` | `boolean` | Value changed (same as update) |

## Size Scale

| Size | Box | Icon |
|------|-----|------|
| `sm` | 16px | 12px |
| `md` | 20px | 16px |
| `lg` | 24px | 20px |

## With Label and Description

```vue
<Checkbox
  v-model="newsletter"
  label="Subscribe to newsletter"
  description="Get weekly updates about new features"
/>
```

## Indeterminate State

For "select all" scenarios with partial selection:

```vue
<script setup>
const selectAll = ref(false)
const isIndeterminate = computed(() =>
  selectedItems.value.length > 0 &&
  selectedItems.value.length < allItems.length
)
</script>

<template>
  <Checkbox
    v-model="selectAll"
    :indeterminate="isIndeterminate"
    label="Select all"
  />
</template>
```

The indeterminate state displays a horizontal dash instead of a checkmark.

## Form Submission

Add `name` and `value` props for native form submission:

```vue
<form>
  <Checkbox v-model="terms" name="accept_terms" value="yes" label="Accept terms" />
  <button type="submit">Submit</button>
</form>
```

## Accessibility

- Uses native `<input type="checkbox">` for screen reader compatibility
- Hidden input is visually hidden but accessible
- Auto-generates unique id for label association
- Keyboard: Space toggles the checkbox
- Focus ring on the box when focused

## Animation

**Checkmark:**
- SVG path with `stroke-dasharray` animation
- Draws from left to right (0.2s `ease-out-expo`)

**Indeterminate:**
- Horizontal dash fades in with stroke animation (0.15s)

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--checkbox-bg` | Unchecked background |
| `--checkbox-border` | Border color |
| `--checkbox-border-hover` | Border on hover |
| `--checkbox-checked-bg` | Checked background |
| `--checkbox-checked-hover` | Checked hover background |
| `--checkbox-check` | Checkmark color |
| `--checkbox-label` | Label text color |
| `--checkbox-description` | Description text color |
