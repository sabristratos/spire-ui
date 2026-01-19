# SegmentedControl

Radio group alternative with a sliding glider animation. The white background physically slides between options rather than teleporting.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { SegmentedControl } from 'spire-ui'

const timeRange = ref('week')
</script>

<template>
  <SegmentedControl
    v-model="timeRange"
    :options="[
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' }
    ]"
    label="Select time range"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SegmentedOption[]` | **required** | Array of options to display |
| `modelValue` | `string \| number` | — | Selected value (v-model) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Accessible label for screen readers |
| `name` | `string` | — | Form field name (enables hidden input) |
| `id` | `string` | Auto-generated | HTML id attribute |

### SegmentedOption

```typescript
interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Selection changed |
| `change` | `string \| number` | Selection changed (same as update) |

## Size Scale

| Size | Height | Font |
|------|--------|------|
| `sm` | 32px | xs |
| `md` | 40px | sm |
| `lg` | 48px | md |

## Why Options Array (Not Slots)?

Using an `options` prop instead of slots allows the component to:

1. **Calculate glider position** - Knows exactly which item is selected and its dimensions
2. **Animate width** - Glider width matches the selected item precisely
3. **Handle resize** - Can recalculate on options change

Slots would require complex ref management and couldn't guarantee consistent layout.

## Disabled Options

Disable individual options while keeping others interactive:

```vue
<SegmentedControl
  v-model="selected"
  :options="[
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro', disabled: true },
    { label: 'Enterprise', value: 'enterprise' }
  ]"
/>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowDown` | Next option (wraps) |
| `ArrowLeft` / `ArrowUp` | Previous option (wraps) |
| `Home` | First option |
| `End` | Last option |

Keyboard navigation skips disabled options.

## Form Submission

Add `name` prop to include a hidden input:

```vue
<form>
  <SegmentedControl
    v-model="period"
    name="billing_period"
    :options="[
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' }
    ]"
  />
</form>
```

## Accessibility

- Container: `role="radiogroup"` with `aria-label`
- Items: `role="radio"` with `aria-checked`
- `tabindex`: Only selected item is `0`, others are `-1`
- Glider: `aria-hidden="true"` (decorative)

## The Glider Animation

The key visual feature is the **sliding glider** - a white background that physically moves between options:

1. Single `<div>` with `position: absolute`
2. `transform: translateX()` animates horizontal position
3. `width` animates to match selected item
4. Uses `ease-out-back` for spring overshoot effect

This is why options use toggled `bg-white` classes - the glider provides the background.

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--segmented-bg` | Container background (gray pill) |
| `--segmented-glider` | Glider background (white card) |
| `--segmented-text` | Default text color |
| `--segmented-text-hover` | Hover text color |
| `--segmented-text-active` | Selected text color |
