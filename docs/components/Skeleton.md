# Skeleton

Placeholder loading component with shimmer animation. Use to indicate content is loading while preserving layout structure.

## Usage

```vue
<script setup>
import { Skeleton } from 'spire-ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <Skeleton width="100%" :height="16" />
    <Skeleton width="85%" :height="16" />
    <Skeleton width="70%" :height="16" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'text'` | Shape variant |
| `width` | `string \| number` | — | Width (px number or CSS value) |
| `height` | `string \| number` | — | Height (px number or CSS value) |
| `animation` | `'shimmer' \| 'pulse' \| 'none'` | `'shimmer'` | Animation style |

## Variants

| Variant | Border Radius | Use Case |
|---------|---------------|----------|
| `text` | Small (4px) | Text lines, paragraphs |
| `circle` | 50% | Avatars, icons |
| `rect` | Medium (8px) | Images, cards, thumbnails |

```vue
<!-- Text placeholder -->
<Skeleton variant="text" width="200" height="16" />

<!-- Avatar placeholder -->
<Skeleton variant="circle" :width="48" :height="48" />

<!-- Image placeholder -->
<Skeleton variant="rect" width="100%" :height="200" />
```

## Animation Types

**Shimmer (default, recommended):**
- Light beam moves across the skeleton
- Psychologically feels faster than pulse
- Uses CSS gradient animation

**Pulse:**
- Opacity fades 100% → 50% → 100%
- Simpler, lower visual noise

**None:**
- Static placeholder, no animation

```vue
<Skeleton animation="shimmer" width="200" height="16" />
<Skeleton animation="pulse" width="200" height="16" />
<Skeleton animation="none" width="200" height="16" />
```

## Sizing

Width and height accept:
- **Numbers** — Interpreted as pixels (`48` → `48px`)
- **Strings** — Used as-is (`"50%"`, `"2rem"`, `"100px"`)

```vue
<!-- Number = pixels -->
<Skeleton :width="200" :height="16" />

<!-- String with units -->
<Skeleton width="50%" height="1rem" />

<!-- Mixed -->
<Skeleton width="100%" :height="120" />
```

## Composition Patterns

### User Card

```vue
<Card variant="outline">
  <CardContent>
    <div style="display: flex; gap: 1rem;">
      <Skeleton variant="circle" :width="48" :height="48" />
      <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
        <Skeleton width="70%" :height="16" />
        <Skeleton width="50%" :height="14" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Article Card

```vue
<Card variant="outline">
  <Skeleton variant="rect" width="100%" :height="160" />
  <CardContent>
    <Skeleton width="80%" :height="20" />
    <Skeleton width="100%" :height="14" style="margin-top: 0.5rem;" />
    <Skeleton width="60%" :height="14" style="margin-top: 0.25rem;" />
  </CardContent>
</Card>
```

### Table Row

DataTable uses Skeleton internally with organic widths:

```vue
<tr>
  <td><Skeleton width="75%" :height="16" /></td>
  <td><Skeleton width="60%" :height="16" /></td>
  <td><Skeleton width="85%" :height="16" /></td>
</tr>
```

## Organic Widths

For natural appearance in lists/tables, vary skeleton widths:

```vue
<script setup>
const widths = ['60%', '75%', '90%', '70%', '85%']
</script>

<template>
  <div v-for="(w, i) in widths" :key="i">
    <Skeleton :width="w" :height="16" />
  </div>
</template>
```

## Accessibility

- `aria-hidden="true"` is set automatically
- Screen readers ignore skeleton content
- Parent container should handle loading announcements via `aria-busy="true"`

```vue
<div :aria-busy="loading">
  <template v-if="loading">
    <Skeleton width="100%" :height="16" />
  </template>
  <template v-else>
    {{ content }}
  </template>
</div>
```

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--skeleton-base` | Base background color |
| `--skeleton-highlight` | Shimmer highlight color |

### Light Mode
```css
--skeleton-base: var(--color-stone-200);
--skeleton-highlight: var(--color-stone-100);
```

### Dark Mode
```css
--skeleton-base: var(--color-stone-700);
--skeleton-highlight: var(--color-stone-600);
```

## Animation Details

**Shimmer:**
- Gradient: `base → highlight → base`
- Background size: 200% width
- Animation: Slides from 200% to -200% over 1.5s
- Timing: `ease-in-out`

**Pulse:**
- Opacity: 1 → 0.5 → 1
- Duration: 1.5s
- Timing: `ease-in-out`
