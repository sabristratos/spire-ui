# Theming

Customize the look and feel of Spire UI with theme systems for color mood, shadow depth, and motion personality.

## Quick Start

Apply themes via data attributes on any container:

```html
<html data-theme="dark" data-mood="vibrant" data-depth="dimensional" data-motion="spring">
```

Or use the Vue provider:

```vue
<script setup>
import { SpireProvider } from 'spire-ui'
</script>

<template>
  <SpireProvider theme="dark" mood="vibrant" depth="dimensional" motion="spring">
    <App />
  </SpireProvider>
</template>
```

---

## Theme (Light/Dark)

Controls the base color scheme.

| Value | Description |
|-------|-------------|
| `light` | Light backgrounds, dark text (default) |
| `dark` | Dark backgrounds, light text |

```html
<html data-theme="dark">
```

---

## Mood System

Controls color temperature and saturation, giving your UI a distinct personality.

| Mood | Description | Character |
|------|-------------|-----------|
| `warm` | Warm stone neutrals, indigo accent | Default, welcoming |
| `cool` | Blue-gray undertones | Professional, calm |
| `vibrant` | Higher saturation, violet-purple | Energetic, bold |
| `muted` | Desaturated, slate tones | Subtle, understated |
| `earthy` | Olive/terracotta, teal-green accent | Organic, grounded |

```html
<div data-mood="cool">
  <!-- Content with cool color palette -->
</div>
```

### Visual Comparison

**Warm** (default): Stone grays with indigo primary
**Cool**: Blue-shifted grays with deeper blue primary
**Vibrant**: Slightly warmer grays with purple primary
**Muted**: Desaturated grays with muted purple primary
**Earthy**: Yellow-brown grays with teal-green primary

---

## Depth System

Controls shadow intensity and surface highlights.

| Depth | Shadows | Highlights | Use Case |
|-------|---------|------------|----------|
| `flat` | None | None | Minimal, shadcn-like aesthetic |
| `subtle` | Very soft | Minimal | Clean, understated |
| `elevated` | Soft | Visible | Default, balanced |
| `dimensional` | Pronounced | Rich | Premium, immersive |

```html
<div data-depth="dimensional">
  <!-- Cards and surfaces with rich shadows -->
</div>
```

### Shadow Intensity

```
flat        ░░░░░░░░░░  No shadows
subtle      ▓░░░░░░░░░  Barely visible
elevated    ▓▓▓░░░░░░░  Soft, balanced (default)
dimensional ▓▓▓▓▓░░░░░  Rich, premium
```

---

## Motion System

Controls animation timing and easing curves.

| Motion | Speed | Easing | Character |
|--------|-------|--------|-----------|
| `minimal` | 0.5x | Linear | Fast, functional |
| `smooth` | 1x | Ease-out | Default, professional |
| `spring` | 1.2x | Overshoot | Bouncy, playful |
| `snappy` | 0.7x | Expo-out | Quick, responsive |

```html
<div data-motion="spring">
  <!-- Animations have bouncy feel -->
</div>
```

### Reduced Motion

All motion presets respect `prefers-reduced-motion`. When enabled:
- Durations are minimized
- Bouncy/overshoot easings become linear
- Animations remain functional but subtle

---

## Texture System

Adds subtle noise/grain overlay to surfaces for a tactile feel.

| Texture | Opacity | Use Case |
|---------|---------|----------|
| `none` | 0% | Clean, digital look (default) |
| `subtle` | 3% | Slight grain, organic feel |
| `medium` | 6% | More pronounced texture |

```html
<div data-texture="subtle">
  <!-- Surface has subtle grain overlay -->
</div>
```

Elements with texture need `position: relative` for the pseudo-element overlay.

---

## SpireProvider

Vue component for applying theme settings to a section of your app.

```vue
<script setup>
import { SpireProvider } from 'spire-ui'
</script>

<template>
  <SpireProvider
    theme="dark"
    mood="vibrant"
    depth="elevated"
    motion="smooth"
  >
    <YourContent />
  </SpireProvider>
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | — | Color scheme |
| `mood` | `'warm' \| 'cool' \| 'vibrant' \| 'muted' \| 'earthy'` | — | Color personality |
| `depth` | `'flat' \| 'subtle' \| 'elevated' \| 'dimensional'` | — | Shadow intensity |
| `motion` | `'minimal' \| 'smooth' \| 'spring' \| 'snappy'` | — | Animation feel |
| `texture` | `'none' \| 'subtle' \| 'medium'` | — | Surface texture |
| `tag` | `string` | `'div'` | Container element |

### Nested Providers

Providers can be nested to override settings for specific sections:

```vue
<SpireProvider theme="light" mood="warm">
  <!-- Main app uses warm mood -->

  <SpireProvider mood="cool" depth="flat">
    <!-- This section uses cool mood, flat depth -->
  </SpireProvider>
</SpireProvider>
```

### Accessing Config

Use `useSpireConfig` to read the current configuration:

```vue
<script setup>
import { useSpireConfig } from 'spire-ui'

const config = useSpireConfig()
// config.theme, config.mood, config.depth, config.motion
</script>
```

---

## Combining Systems

All systems work together:

```html
<!-- Dark theme, vibrant colors, rich shadows, bouncy animations -->
<html data-theme="dark" data-mood="vibrant" data-depth="dimensional" data-motion="spring">
```

```html
<!-- Light theme, cool colors, minimal shadows, snappy animations -->
<html data-theme="light" data-mood="cool" data-depth="flat" data-motion="snappy">
```

---

## Per-Section Overrides

Apply different settings to specific sections:

```vue
<template>
  <!-- Main content -->
  <main data-mood="warm" data-depth="elevated">
    <Card>Standard card</Card>
  </main>

  <!-- Sidebar with different feel -->
  <aside data-mood="cool" data-depth="flat">
    <Card>Flat, cool sidebar</Card>
  </aside>

  <!-- Hero section -->
  <section data-mood="vibrant" data-depth="dimensional">
    <Card>Bold, dimensional hero</Card>
  </section>
</template>
```

---

## CSS Custom Properties

All systems expose CSS custom properties you can use in your own styles:

### Mood Properties

```css
--mood-chroma-scale    /* Saturation multiplier */
--mood-warmth          /* Neutral hue (60=warm, 240=cool) */
--mood-hue-shift       /* Accent color rotation */
```

### Depth Properties

```css
--depth-shadow-opacity      /* Base shadow opacity */
--depth-shadow-spread       /* Shadow spread multiplier */
--depth-highlight-opacity   /* Surface highlight opacity */
--depth-inset-opacity       /* Inset shadow opacity */
```

### Motion Properties

```css
--motion-duration-scale   /* Duration multiplier */
--motion-bounce           /* Overshoot amount */
--motion-ease-default     /* Standard easing */
--motion-ease-bounce      /* Bouncy easing */
```

### Shadow Tokens

```css
--shadow-sm   /* Small shadow */
--shadow-md   /* Medium shadow */
--shadow-lg   /* Large shadow */
--shadow-xl   /* Extra large shadow */
```

---

## Examples

### Dashboard with Warm Theme

```vue
<SpireProvider theme="light" mood="warm" depth="elevated" motion="smooth">
  <Dashboard />
</SpireProvider>
```

### Admin Panel with Cool, Minimal Theme

```vue
<SpireProvider theme="light" mood="cool" depth="flat" motion="snappy">
  <AdminPanel />
</SpireProvider>
```

### Creative App with Vibrant Theme

```vue
<SpireProvider theme="dark" mood="vibrant" depth="dimensional" motion="spring">
  <CreativeStudio />
</SpireProvider>
```

### Marketing Site with Earthy Theme

```vue
<SpireProvider theme="light" mood="earthy" depth="subtle" motion="smooth">
  <LandingPage />
</SpireProvider>
```
