# Select

A custom select dropdown with full keyboard navigation, accessibility support, and visual parity with the Input component. Uses the `aria-activedescendant` pattern for screen reader compatibility.

## Usage

### Basic

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'spire-ui'

const value = ref(null)
const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
]
</script>

<template>
  <Select v-model="value" :options="options" />
</template>
```

### With Label and Hint

```vue
<template>
  <Select
    v-model="value"
    :options="options"
    label="Choose a fruit"
    hint="Pick your favorite"
    placeholder="Select..."
  />
</template>
```

### With Error

```vue
<template>
  <Select
    v-model="value"
    :options="options"
    label="Fruit"
    error="Please select a fruit"
  />
</template>
```

### Disabled Options

```vue
<script setup>
const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Out of Stock', value: 'cherry', disabled: true }
]
</script>
```

### Sizes

```vue
<template>
  <Select :options="options" size="xs" />
  <Select :options="options" size="sm" />
  <Select :options="options" size="md" />  <!-- Default -->
  <Select :options="options" size="lg" />
  <Select :options="options" size="xl" />
</template>
```

### Full Width

```vue
<template>
  <Select :options="options" block />
</template>
```

### Form Submission

When a `name` prop is provided, a hidden native `<select>` is rendered for form submission:

```vue
<template>
  <form @submit="handleSubmit">
    <Select
      v-model="value"
      :options="options"
      name="fruit"
      required
    />
    <button type="submit">Submit</button>
  </form>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| null` | `null` | Selected value (v-model) |
| `options` | `SelectOption[]` | — | Available options |
| `label` | `string` | — | Label text above select |
| `placeholder` | `string` | `'Select an option'` | Placeholder when no selection |
| `hint` | `string` | — | Helper text below select |
| `error` | `string` | — | Error message (also sets error state) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Select size (matches Input heights) |
| `disabled` | `boolean` | `false` | Disabled state |
| `required` | `boolean` | `false` | Required field |
| `block` | `boolean` | `false` | Full-width select |
| `id` | `string` | auto-generated | HTML id attribute |
| `name` | `string` | — | HTML name attribute (enables hidden native select) |

### SelectOption

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text shown to user |
| `value` | `string \| number` | Value stored in v-model |
| `disabled` | `boolean` | Disable this option |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number \| null` | Emitted when selection changes |
| `change` | `string \| number \| null` | Emitted after selection changes |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open dropdown, or select highlighted option |
| `ArrowDown` | Open dropdown, or move highlight down |
| `ArrowUp` | Open dropdown, or move highlight up |
| `Home` | Move highlight to first option |
| `End` | Move highlight to last option |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

Disabled options are skipped during keyboard navigation.

## Accessibility

The component implements the WAI-ARIA combobox pattern with `aria-activedescendant`:

- Trigger has `role="combobox"` with `aria-haspopup="listbox"`
- Listbox has `role="listbox"` with `aria-labelledby`
- Options have `role="option"` with `aria-selected` and `aria-disabled`
- Focus stays on trigger, `aria-activedescendant` announces highlighted option
- `aria-expanded` indicates open/closed state
- `aria-invalid` set when error exists
- `aria-describedby` links to hint or error text
- Label properly associated via `for` attribute

### Why `aria-activedescendant`?

This pattern keeps DOM focus on the trigger button while the screen reader announces the currently highlighted option. Benefits:

1. No focus jumping between trigger and listbox
2. Escape key always works (focus never lost)
3. More natural for screen reader users
4. Easier to implement click-outside behavior

## Visual Parity with Input

Select intentionally matches the Input component:

- Same height values per size
- Same border colors and transitions
- Same focus ring style
- Same label, hint, and error typography
- Same disabled styling

This ensures consistent form layouts when mixing inputs and selects.

## Menu Positioning

The dropdown menu:

- Teleports to `<body>` to escape overflow containers
- Positions below the trigger with `position: fixed`
- Matches trigger width (minimum)
- Auto-scrolls to show highlighted option
- Closes on scroll/resize (repositions on scroll)
- Has `max-height: 256px` with scroll

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--select-menu-bg` | Dropdown background |
| `--select-menu-border` | Dropdown border color |
| `--select-option-text` | Option text color |
| `--select-option-hover` | Highlighted option background |
| `--select-option-selected` | Selected option text/check color |

The trigger uses Input tokens for visual consistency:

| Token | Description |
|-------|-------------|
| `--input-bg` | Trigger background |
| `--input-border` | Trigger border |
| `--input-border-hover` | Trigger hover border |
| `--input-border-focus` | Trigger focus border |
| `--input-text` | Selected value text |
| `--input-placeholder` | Placeholder text |
| `--input-label` | Label text |
| `--input-hint` | Hint text |
| `--input-error` | Error text and border |
| `--input-ring` | Focus ring color |
| `--input-ring-error` | Error state focus ring |

## Design Guidelines

### When to Use Select

| Scenario | Use Select? |
|----------|-------------|
| 5+ options | Yes |
| 2-4 mutually exclusive options | Consider SegmentedControl |
| Filterable/searchable list | No (use Combobox) |
| Multi-select | No (use Checkbox group or MultiSelect) |
| Toggle between 2 states | No (use Switch) |

### Select vs SegmentedControl

| Feature | Select | SegmentedControl |
|---------|--------|------------------|
| Many options | Yes | No (max 4-5) |
| Space efficient | Yes | No |
| All options visible | No | Yes |
| Keyboard navigation | Dropdown | Immediate |

### Placeholder Best Practices

- Use action-oriented text: "Select a country" not "Country"
- Keep placeholder text shorter than options
- Don't use placeholder as a label (always provide `label` prop)

## Example: Complete Form

```vue
<script setup>
import { ref } from 'vue'
import { Select, Input, Button } from 'spire-ui'

const form = ref({
  name: '',
  country: null,
  plan: null
})

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' }
]

const plans = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' }
]
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Input
      v-model="form.name"
      label="Full Name"
      required
    />

    <Select
      v-model="form.country"
      :options="countries"
      label="Country"
      placeholder="Select your country"
      required
    />

    <Select
      v-model="form.plan"
      :options="plans"
      label="Subscription Plan"
      hint="You can change this later"
    />

    <Button type="submit">Sign Up</Button>
  </form>
</template>
```
