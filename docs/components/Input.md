# Input

Form input field with wrapper pattern for flexible layout, icons, and validation states.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Input } from 'spire-ui'

const email = ref('')
</script>

<template>
  <Input
    v-model="email"
    type="email"
    label="Email"
    placeholder="you@example.com"
    hint="We'll never share your email"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Input value (v-model) |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'number'` | `'text'` | Input type |
| `label` | `string` | — | Label text above input |
| `placeholder` | `string` | — | Placeholder text |
| `hint` | `string` | — | Helper text below input |
| `error` | `string` | — | Error message (sets error state) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Input size |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `required` | `boolean` | `false` | Required field |
| `iconLeft` | `IconInput` | — | Left icon |
| `iconRight` | `IconInput` | — | Right icon |
| `id` | `string` | Auto-generated | HTML id attribute |
| `name` | `string` | — | HTML name attribute |
| `autocomplete` | `string` | — | Autocomplete attribute |
| `block` | `boolean` | `false` | Full width |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Value changed |
| `focus` | `FocusEvent` | Input focused |
| `blur` | `FocusEvent` | Input blurred |

## Slots

| Slot | Description |
|------|-------------|
| `left` | Custom left addon (replaces iconLeft) |
| `right` | Custom right addon (replaces iconRight) |

## Size Scale

Matches Button heights for perfect alignment in toolbars:

| Size | Height |
|------|--------|
| `xs` | 28px |
| `sm` | 32px |
| `md` | 36px |
| `lg` | 40px |
| `xl` | 44px |

## With Icons

```vue
<Input placeholder="Search..." :icon-left="SearchIcon" />
<Input type="email" placeholder="Email" :icon-right="CheckIcon" />
```

## Validation States

```vue
<!-- Error state -->
<Input
  label="Email"
  error="Please enter a valid email"
  placeholder="you@example.com"
/>

<!-- With hint (shown when no error) -->
<Input
  label="Password"
  hint="Must be at least 8 characters"
  type="password"
/>
```

## Loading State

```vue
<Input
  placeholder="Searching..."
  :loading="isSearching"
  :icon-left="SearchIcon"
/>
```

## Custom Addons

Use slots for custom prefixes/suffixes:

```vue
<!-- Currency input -->
<Input placeholder="0.00">
  <template #left>$</template>
</Input>

<!-- With validation icon -->
<Input placeholder="Username">
  <template #left>@</template>
  <template #right>
    <Icon :icon="CheckIcon" class="text-success" />
  </template>
</Input>
```

## Button Alignment

Input and Button heights match for side-by-side layouts:

```vue
<div style="display: flex; gap: 8px;">
  <Input size="md" placeholder="Search..." />
  <Button size="md">Search</Button>
</div>
```

## Accessibility

- Auto-generates unique `id` if not provided
- `label` uses `for` attribute linked to input `id`
- `hint` linked via `aria-describedby`
- `error` linked via `aria-describedby` with `role="alert"`
- `aria-invalid="true"` when error exists
- Required indicator (`*`) is `aria-hidden`

## Architecture

The component uses a **wrapper pattern**:

1. **Field Container** - Label + Input + Message stack
2. **Input Wrapper** - The visual box with border/background
3. **Native Input** - Transparent, fills remaining space
4. **Addons** - Flexbox-aligned icons/slots

Benefits:
- `:focus-within` on wrapper lights up the entire box
- Icons flow naturally without padding calculations
- Consistent heights across all sizes

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--input-bg` | Background color |
| `--input-text` | Text color |
| `--input-placeholder` | Placeholder color |
| `--input-border` | Border color |
| `--input-border-focus` | Focus border color |
| `--input-border-error` | Error border color |
| `--input-ring` | Focus ring color |
| `--input-ring-error` | Error focus ring |
| `--input-label` | Label text color |
| `--input-hint` | Hint text color |
| `--input-error` | Error text color |
