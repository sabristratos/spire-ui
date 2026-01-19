# Radio

Radio button with scale animation for the inner dot. Group radios by sharing the same `name` and `v-model`.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Radio } from 'spire-ui'

const selected = ref('option1')
</script>

<template>
  <Radio v-model="selected" value="option1" name="options" label="Option 1" />
  <Radio v-model="selected" value="option2" name="options" label="Option 2" />
  <Radio v-model="selected" value="option3" name="options" label="Option 3" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| boolean` | — | Selected value (v-model) - shared across radio group |
| `value` | `string \| number \| boolean` | **required** | Value of this radio option |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Radio size |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Visible label text |
| `description` | `string` | — | Description text below label |
| `name` | `string` | — | HTML name for radio group (required for native behavior) |
| `id` | `string` | Auto-generated | HTML id attribute |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number \| boolean` | Selection changed |
| `change` | `string \| number \| boolean` | Selection changed (same as update) |

## Size Scale

| Size | Circle | Dot |
|------|--------|-----|
| `sm` | 16px | 8px |
| `md` | 20px | 10px |
| `lg` | 24px | 12px |

## With Descriptions

Common for payment or shipping method selection:

```vue
<Radio
  v-model="payment"
  value="credit"
  name="payment"
  label="Credit card"
  description="Pay with Visa, Mastercard, or American Express"
/>
<Radio
  v-model="payment"
  value="paypal"
  name="payment"
  label="PayPal"
  description="Pay with your PayPal account"
/>
```

## Value Types

Supports string, number, and boolean values:

```vue
<!-- String values -->
<Radio v-model="size" value="small" name="size" label="Small" />
<Radio v-model="size" value="large" name="size" label="Large" />

<!-- Number values -->
<Radio v-model="quantity" :value="1" name="qty" label="1 item" />
<Radio v-model="quantity" :value="5" name="qty" label="5 items" />

<!-- Boolean values -->
<Radio v-model="enabled" :value="true" name="toggle" label="Yes" />
<Radio v-model="enabled" :value="false" name="toggle" label="No" />
```

## Accessibility

- Uses native `<input type="radio">` for screen reader compatibility
- Hidden input is visually hidden but accessible
- Auto-generates unique id for label association
- `name` attribute groups radios for keyboard navigation
- Keyboard: Arrow keys move between radios in same group
- Focus ring on the circle when focused

## Animation

**Inner Dot:**
- Scale animation from 0 to 1 (0.15s `ease-out-back`)
- Spring overshoot gives satisfying "pop" effect

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--radio-bg` | Circle background |
| `--radio-border` | Border color |
| `--radio-border-hover` | Border on hover |
| `--radio-checked` | Selected border and dot color |
| `--radio-checked-hover` | Selected hover color |
| `--radio-label` | Label text color |
| `--radio-description` | Description text color |
