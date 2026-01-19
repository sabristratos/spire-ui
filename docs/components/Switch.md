# Switch

Toggle switch with spring physics animation. Uses `<button role="switch">` for full styling control.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Switch } from 'spire-ui'

const enabled = ref(false)
</script>

<template>
  <Switch v-model="enabled" label="Enable notifications" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Checked state (v-model) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state (shows spinner) |
| `label` | `string` | — | Accessible label (required if no visible label) |
| `name` | `string` | — | Form field name (enables hidden checkbox) |
| `id` | `string` | Auto-generated | HTML id attribute |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Value changed |
| `change` | `boolean` | Value changed (same as update) |

## Size Scale

| Size | Track | Thumb |
|------|-------|-------|
| `sm` | 32×18px | 14px |
| `md` | 40×22px | 18px |
| `lg` | 48×26px | 22px |

## With Visible Label

```vue
<label class="flex items-center gap-2">
  <Switch v-model="darkMode" label="Dark mode" />
  <span>Dark mode</span>
</label>
```

## Loading State (Async)

For API calls, show loading while waiting for confirmation:

```vue
<script setup>
const saving = ref(false)
const enabled = ref(false)

async function handleChange() {
  saving.value = true
  try {
    await api.updateSetting({ enabled: !enabled.value })
    enabled.value = !enabled.value
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Switch
    :model-value="enabled"
    :loading="saving"
    label="Enable feature"
    @change="handleChange"
  />
</template>
```

The spinner appears inside the thumb, and the switch becomes non-interactive until loading completes.

## Form Submission

Add `name` prop to include a hidden checkbox for native form submission:

```vue
<form>
  <Switch v-model="terms" name="accept_terms" label="Accept terms" />
  <button type="submit">Submit</button>
</form>
```

## Accessibility

- Uses `<button role="switch">` for screen reader compatibility
- `aria-checked` reflects current state
- `aria-label` from `label` prop
- Keyboard: Space (native button) and Enter toggle the switch
- Focus ring on the track when focused

## Architecture

**Why `<button>` instead of `<input type="checkbox">`?**

Styling native checkboxes fights browser defaults. Using a button gives complete control over layout and animation without hacks.

**Components:**
1. **Track** - The pill-shaped background that changes color
2. **Thumb** - The circular knob that slides with spring animation

**Animation:**
- Uses `--ease-out-back` (spring overshoot) for satisfying snap
- Only animates `transform: translateX()` (GPU-accelerated)
- Never animates `left`, `margin`, or layout properties

**Hit Target:**
- Invisible `::after` pseudo-element expands touch area to 44px+ for mobile

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--switch-track-off` | Track color when off |
| `--switch-track-on` | Track color when on |
| `--switch-thumb` | Thumb (knob) color |
| `--switch-spinner` | Loading spinner color |
