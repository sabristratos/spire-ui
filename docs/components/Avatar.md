# Avatar

User avatar with automatic fallback hierarchy: Image → Initials → Generic Icon.

## Usage

```vue
<script setup>
import { Avatar } from 'spire-ui'
</script>

<template>
  <!-- With image -->
  <Avatar src="https://example.com/photo.jpg" name="John Doe" />

  <!-- Initials fallback (no src or image error) -->
  <Avatar name="Jane Smith" />

  <!-- Generic icon fallback (no name) -->
  <Avatar />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `name` | `string` | — | User name (for alt text and initials) |
| `alt` | `string` | — | Override alt text (defaults to name) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square'` | `'circle'` | Avatar shape |
| `variant` | `'neutral' \| 'primary' \| 'soft'` | `'soft'` | Background variant for initials/icon |
| `bordered` | `boolean` | `false` | Add cutout border (for groups) |

## Size Scale

| Size | Dimensions |
|------|------------|
| `xs` | 24×24px |
| `sm` | 32×32px |
| `md` | 40×40px |
| `lg` | 48×48px |
| `xl` | 64×64px |

## Fallback Hierarchy

The component tries to display content in this order:

1. **Image** (`src`) - Shown if provided and loads successfully
2. **Initials** (`name`) - Shown if image fails or no src provided
3. **Icon** - Generic user silhouette if no name provided

```vue
<!-- All three states -->
<Avatar src="photo.jpg" name="John" />  <!-- Shows image -->
<Avatar name="John Doe" />               <!-- Shows "JD" -->
<Avatar />                               <!-- Shows icon -->
```

## Initials Logic

The `getInitials()` utility extracts initials intelligently:

```ts
getInitials("John Doe")      // "JD"
getInitials("Madonna")       // "MA" (first 2 chars)
getInitials("John von Doe")  // "JD" (first + last)
```

## With BadgeContainer

Combine with `BadgeContainer` for status indicators:

```vue
<BadgeContainer>
  <Avatar name="Online User" />
  <template #badge>
    <Badge variant="success" dot />
  </template>
</BadgeContainer>
```

## Avatar Groups

Use the `ui-avatar-group` utility class for overlapping avatars:

```vue
<div class="ui-avatar-group">
  <Avatar src="..." name="User 1" bordered />
  <Avatar src="..." name="User 2" bordered />
  <Avatar src="..." name="User 3" bordered />
  <Avatar name="+5" variant="neutral" bordered />
</div>
```

The `bordered` prop adds a cutout effect using `box-shadow` (doesn't affect layout).

## Accessibility

- `role="img"` on the container
- `aria-label` from `alt` prop, falls back to `name`, then "Avatar"
- `alt` attribute on the `<img>` element

## Notes

- Uses `object-fit: cover` to prevent image distortion
- Error state resets when `src` changes (component recycling)
- Variants only visible when showing initials or icon (not image)
