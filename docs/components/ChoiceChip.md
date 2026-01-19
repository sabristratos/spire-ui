# ChoiceChip

Badge-like filter pill that expands with a check icon when selected. Use for filtering interfaces.

## Usage

### Standalone (Boolean)

```vue
<script setup>
import { ref } from 'vue'
import { ChoiceChip } from 'spire-ui'

const isFeatured = ref(false)
</script>

<template>
  <ChoiceChip v-model="isFeatured" label="Featured" />
</template>
```

### In a ChoiceChipGroup

```vue
<script setup>
import { ref } from 'vue'
import { ChoiceChip, ChoiceChipGroup } from 'spire-ui'

const filters = ref(['price', 'rating'])
</script>

<template>
  <ChoiceChipGroup v-model="filters" type="multiple" label="Filter by">
    <ChoiceChip value="price" label="Price" />
    <ChoiceChip value="rating" label="Rating" />
    <ChoiceChip value="date" label="Date" />
    <ChoiceChip value="location" label="Location" />
  </ChoiceChipGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Selected state for standalone usage (v-model) |
| `value` | `string \| number` | — | Value for group usage |
| `label` | `string` | **required** | Chip label text |
| `icon` | `IconInput` | — | Optional leading icon |
| `disabled` | `boolean` | `false` | Disabled state |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Selection changed (standalone) |
| `change` | `boolean` | Selection changed |

## Visual States

| State | Appearance |
|-------|------------|
| **Unselected** | Transparent background, gray border |
| **Hover** | Light gray background |
| **Active** | Darker gray background (pressed feedback) |
| **Selected** | Brand background, brand border, check icon visible |
| **Selected + Hover** | Slightly darker brand background |
| **Selected + Active** | Darkest brand background |

## The Expanding Animation

When selected, the chip smoothly expands to accommodate the check icon:

1. Check container animates `width: 0` → `width: 1rem`
2. Check icon fades in with `scale(0.5)` → `scale(1)` (spring easing)

```css
.ui-choice-chip__check {
  width: 0;
  overflow: hidden;
  transition: width var(--duration-fast) var(--ease-out-expo);
}

.ui-choice-chip--selected .ui-choice-chip__check {
  width: 1rem;
}
```

## With Leading Icon

For feature filters (amenities, categories, etc.):

```vue
<ChoiceChip value="wifi" label="WiFi" :icon="WifiIcon" />
<ChoiceChip value="parking" label="Parking" :icon="ParkingIcon" />
```

The leading icon appears before the label (after the check icon when selected).

## Accessibility

- Hidden native `<input type="checkbox">` for screen reader compatibility
- Label wraps the input for full click area
- Focus ring on the entire chip when focused
- Check icon is `aria-hidden`

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--chip-bg` | Default background (transparent) |
| `--chip-bg-hover` | Hover background |
| `--chip-bg-active` | Active/pressed background |
| `--chip-bg-selected` | Selected background |
| `--chip-bg-selected-hover` | Selected + hover background |
| `--chip-bg-selected-active` | Selected + active background |
| `--chip-border` | Default border |
| `--chip-border-hover` | Hover border |
| `--chip-border-active` | Active/pressed border |
| `--chip-border-selected` | Selected border (brand color) |
| `--chip-border-selected-hover` | Selected + hover border |
| `--chip-border-selected-active` | Selected + active border |
| `--chip-text` | Default text color |
| `--chip-text-selected` | Selected text color (brand) |
