# Badge

Status indicator for labels, counts, and binary states.

## Usage

```vue
<script setup>
import { Badge } from 'spire-ui'
</script>

<template>
  <!-- Text badge -->
  <Badge>New</Badge>
  <Badge variant="success">Active</Badge>

  <!-- Count badge -->
  <Badge :value="5" label="5 notifications" />
  <Badge :value="150" label="150 unread" />  <!-- Shows "99+" -->

  <!-- Dot indicator -->
  <Badge variant="success" dot />
  <Badge variant="danger" dot pulse />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Color variant |
| `dot` | `boolean` | `false` | Render as dot indicator |
| `pulse` | `boolean` | `false` | Add pulse animation (dot mode only) |
| `value` | `number` | — | Numeric value for count badges |
| `max` | `number` | `99` | Maximum before showing "+" |
| `label` | `string` | — | Accessible label (recommended for counts) |

## Variants

All variants use subtle high-contrast pairing (tinted background + deep text):

| Variant | Use Case |
|---------|----------|
| `default` | Neutral metadata |
| `success` | Positive status (Active, Paid, Complete) |
| `warning` | Attention needed (Pending, Expiring) |
| `danger` | Negative status (Failed, Overdue, Inactive) |
| `info` | Informational (Beta, Updated) |

## Dot Mode

Compact indicator for binary states:

```vue
<!-- Explicit dot -->
<Badge variant="success" dot />

<!-- Auto-dot (no content) -->
<Badge variant="danger" />

<!-- Pulsing for attention -->
<Badge variant="info" dot pulse />
```

## Count Badges

For notification counts, use `value` prop with `label` for accessibility:

```vue
<!-- Screen reader announces "42 unread messages" -->
<Badge :value="42" label="42 unread messages" />

<!-- Truncates at max (default 99) -->
<Badge :value="500" label="500 notifications" />  <!-- Shows "99+" -->

<!-- Custom max -->
<Badge :value="15" :max="10" label="15 items" />  <!-- Shows "10+" -->
```

## Positioning

Badge is a static inline element. For positioned badges (e.g., on avatars), wrap with a container:

```vue
<div class="relative">
  <Avatar :src="user.avatar" />
  <Badge
    variant="danger"
    dot
    class="absolute -top-1 -right-1"
  />
</div>
```

## Notes

- Uses `font-variant-numeric: tabular-nums` for stable width with changing numbers
- `user-select: none` prevents accidental text selection
- For dismissible badges, use a separate Tag/Chip component (not implemented here)
