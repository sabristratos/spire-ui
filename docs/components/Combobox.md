# Combobox

Searchable dropdown with keyboard navigation, filtering, and custom rendering.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Combobox } from 'spire-ui'

const selected = ref('')

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Combobox
    v-model="selected"
    :options="options"
    label="Select a fruit"
    placeholder="Search fruits..."
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| null` | — | Selected value (v-model) |
| `options` | `ComboboxOption[]` | `[]` | Available options |
| `label` | `string` | — | Label text |
| `placeholder` | `string` | — | Placeholder text |
| `hint` | `string` | — | Hint text below input |
| `error` | `string` | — | Error message |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `required` | `boolean` | `false` | Required field |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `block` | `boolean` | `false` | Full width |
| `clearable` | `boolean` | `false` | Show clear button |
| `id` | `string` | Auto-generated | HTML id attribute |
| `name` | `string` | — | HTML name attribute |

## Option Interface

```typescript
interface ComboboxOption {
  value: string | number
  label: string
  disabled?: boolean
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number \| null` | Selection changed |
| `search` | `string` | Search query changed |
| `focus` | `FocusEvent` | Input focused |
| `blur` | `FocusEvent` | Input blurred |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowDown` | Move to next option / Open dropdown |
| `ArrowUp` | Move to previous option |
| `Enter` | Select highlighted option |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

## Filtering

Options are filtered automatically as user types:

```vue
<Combobox
  v-model="selected"
  :options="countries"
  placeholder="Type to search..."
/>
```

Filtering is case-insensitive and matches from start of label.

## With Loading State

For async option loading:

```vue
<script setup>
const loading = ref(false)
const options = ref([])

async function handleSearch(query: string) {
  loading.value = true
  options.value = await fetchOptions(query)
  loading.value = false
}
</script>

<template>
  <Combobox
    v-model="selected"
    :options="options"
    :loading="loading"
    @search="handleSearch"
  />
</template>
```

## Clearable

Show a clear button when value is selected:

```vue
<Combobox
  v-model="selected"
  :options="options"
  clearable
/>
```

## Disabled Options

Individual options can be disabled:

```vue
const options = [
  { value: 'free', label: 'Free Plan' },
  { value: 'pro', label: 'Pro Plan', disabled: true },
  { value: 'enterprise', label: 'Enterprise' },
]
```

## Validation

```vue
<!-- Error state -->
<Combobox
  v-model="selected"
  :options="options"
  error="Please select an option"
/>

<!-- With hint -->
<Combobox
  v-model="selected"
  :options="options"
  hint="Choose your preferred option"
/>
```

## States

```vue
<!-- Disabled -->
<Combobox disabled :options="options" />

<!-- Read-only (shows value, no dropdown) -->
<Combobox readonly v-model="selected" :options="options" />

<!-- Required -->
<Combobox required label="Category" :options="options" />
```

## Accessibility

- Uses `role="combobox"` with proper ARIA attributes
- `aria-expanded` indicates dropdown state
- `aria-activedescendant` tracks highlighted option
- Options have `role="option"` with `aria-selected`
- Keyboard fully navigable
- Label linked via `aria-labelledby`

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--combobox-bg` | Input background |
| `--combobox-text` | Text color |
| `--combobox-placeholder` | Placeholder color |
| `--combobox-border` | Border color |
| `--combobox-border-focus` | Focus border |
| `--combobox-border-error` | Error border |
| `--combobox-dropdown-bg` | Dropdown background |
| `--combobox-dropdown-border` | Dropdown border |
| `--combobox-option-hover` | Option hover background |
| `--combobox-option-selected` | Selected option background |
| `--combobox-option-selected-text` | Selected option text |
| `--combobox-empty-text` | "No results" text color |
