# Textarea

Multi-line text input with auto-grow, character count, and visual parity with the Input component.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Textarea } from 'spire-ui'

const bio = ref('')
</script>

<template>
  <Textarea
    v-model="bio"
    label="Bio"
    placeholder="Tell us about yourself..."
    hint="Max 500 characters"
    :max-length="500"
    show-count
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | Textarea value (v-model) |
| `label` | `string` | — | Label text above textarea |
| `placeholder` | `string` | — | Placeholder text |
| `hint` | `string` | — | Helper text below textarea |
| `error` | `string` | — | Error message (sets error state) |
| `rows` | `number` | `3` | Number of visible rows |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `required` | `boolean` | `false` | Required field |
| `autosize` | `boolean` | `false` | Auto-grow as user types |
| `maxHeight` | `number` | — | Maximum height in pixels (for autosize) |
| `maxLength` | `number` | — | Maximum character count |
| `showCount` | `boolean` | `false` | Show character counter |
| `iconLeft` | `IconInput` | — | Left icon (top-aligned) |
| `id` | `string` | Auto-generated | HTML id attribute |
| `name` | `string` | — | HTML name attribute |
| `block` | `boolean` | `false` | Full width |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Value changed |
| `focus` | `FocusEvent` | Textarea focused |
| `blur` | `FocusEvent` | Textarea blurred |

## Slots

| Slot | Description |
|------|-------------|
| `left` | Custom left addon (replaces iconLeft) |

## Exposed Methods

| Method | Description |
|--------|-------------|
| `focus()` | Focus the textarea |
| `blur()` | Blur the textarea |
| `select()` | Select all text |

## Auto-grow

Textarea automatically expands as the user types:

```vue
<Textarea
  v-model="content"
  autosize
  placeholder="Start typing..."
/>

<!-- With max height constraint -->
<Textarea
  v-model="content"
  autosize
  :max-height="300"
  placeholder="Won't grow beyond 300px"
/>
```

When `autosize` is enabled:
- Manual resize handle is disabled
- Height adjusts on every input
- If `maxHeight` is set, scrollbar appears when exceeded

## Character Count

Show character usage with optional limit:

```vue
<!-- Just show count -->
<Textarea v-model="text" show-count />

<!-- With limit -->
<Textarea
  v-model="bio"
  :max-length="280"
  show-count
/>
```

Counter states:
- **Default**: Normal hint color
- **Warning**: Yellow at 90% of limit
- **Error**: Red when over limit

The `maxlength` attribute is set on the native textarea, but the error state is also applied visually when exceeded (for programmatic value updates).

## Validation States

```vue
<!-- Error state -->
<Textarea
  label="Description"
  error="Description is required"
  placeholder="Enter description..."
/>

<!-- With hint (shown when no error) -->
<Textarea
  label="Notes"
  hint="Optional - add any additional notes"
  placeholder="Notes..."
/>
```

## With Icons

Icons are top-aligned to match the first line of text:

```vue
<Textarea
  placeholder="Write your message..."
  :icon-left="MessageIcon"
/>
```

## Resize Behavior

| Condition | Resize |
|-----------|--------|
| Default | Vertical only |
| `autosize` | None (auto-adjusts) |
| `disabled` | None |

## Accessibility

- Auto-generates unique `id` if not provided
- `label` uses `for` attribute linked to textarea `id`
- `hint` linked via `aria-describedby`
- `error` linked via `aria-describedby` with `role="alert"`
- `aria-invalid="true"` when error exists or over character limit
- Character counter linked via `aria-describedby` with `aria-live="polite"`
- Required indicator (`*`) is `aria-hidden`

## Architecture

Uses the same **wrapper pattern** as Input for visual consistency:

1. **Field Container** - Label + Textarea + Footer stack
2. **Textarea Wrapper** - The visual box with border/background
3. **Native Textarea** - Transparent, fills remaining space
4. **Addons** - Top-aligned icons (unlike Input's centered icons)

Key difference from Input:
- Icons use `align-items: flex-start` to align with first line of text
- Footer contains both message and counter side-by-side

## CSS Tokens

Uses the same tokens as Input for consistency:

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
| `--status-warning` | Warning counter color |
