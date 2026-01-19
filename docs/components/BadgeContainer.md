# BadgeContainer

Positioning wrapper for overlaying badges on buttons, avatars, or any content.

## Usage

```vue
<script setup>
import { Badge, BadgeContainer, Button } from 'spire-ui'
import { BellIcon } from '@hugeicons/core-free-icons'
</script>

<template>
  <!-- Notification dot on icon button -->
  <BadgeContainer>
    <Button variant="ghost" :icon-left="BellIcon" />
    <template #badge>
      <Badge variant="danger" dot pulse />
    </template>
  </BadgeContainer>

  <!-- Count badge on button -->
  <BadgeContainer>
    <Button variant="outline" :icon-left="MailIcon" />
    <template #badge>
      <Badge variant="info" :value="5" label="5 unread" />
    </template>
  </BadgeContainer>

  <!-- With cutout effect -->
  <BadgeContainer cutout>
    <Avatar :src="user.avatar" />
    <template #badge>
      <Badge variant="success" dot />
    </template>
  </BadgeContainer>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Badge corner position |
| `offsetX` | `string` | `'0px'` | Horizontal offset adjustment |
| `offsetY` | `string` | `'0px'` | Vertical offset adjustment |
| `cutout` | `boolean` | `false` | Add border matching background for visual separation |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The content to wrap (Button, Avatar, etc.) |
| `badge` | The Badge component to overlay |

## Positioning

The badge is centered on the corner by default using `transform: translate(50%, -50%)`.

```vue
<!-- All four corners -->
<BadgeContainer position="top-right">...</BadgeContainer>
<BadgeContainer position="top-left">...</BadgeContainer>
<BadgeContainer position="bottom-right">...</BadgeContainer>
<BadgeContainer position="bottom-left">...</BadgeContainer>
```

## Offset Adjustment

Fine-tune badge position for different content shapes:

```vue
<!-- Shift badge inward for circular buttons -->
<BadgeContainer offset-x="-4px" offset-y="4px">
  <Button class="rounded-full" :icon-left="BellIcon" />
  <template #badge>
    <Badge variant="danger" dot />
  </template>
</BadgeContainer>
```

## Cutout Effect

Creates visual separation between badge and content (like iOS notifications):

```vue
<BadgeContainer cutout>
  <Avatar :src="user.avatar" />
  <template #badge>
    <Badge variant="success" dot />
  </template>
</BadgeContainer>
```

The cutout adds a 2px border matching `--bg-primary` around the badge.

## Design Decisions

- **Separation of concerns**: Badge stays simple (just styling), container handles positioning
- **Composition**: Works with any content—buttons, avatars, divs, images
- **Pointer events**: Badge overlay is `pointer-events: none`, clicks pass through to content
- **Z-index**: Badge uses `z-index: 10` to stay above content without global conflicts

## Notes

- Container uses `display: inline-flex` for proper inline alignment
- Badge position uses CSS transforms for sub-pixel precision
- The `#badge` slot wrapper only renders when slot content is provided
