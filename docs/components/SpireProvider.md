# SpireProvider

Container component for applying theme configuration to a section of your app.

## Usage

```vue
<script setup>
import { SpireProvider } from 'spire-ui'
</script>

<template>
  <SpireProvider theme="dark" mood="vibrant" depth="elevated" motion="smooth">
    <App />
  </SpireProvider>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | — | Color scheme |
| `mood` | `'warm' \| 'cool' \| 'vibrant' \| 'muted' \| 'earthy'` | — | Color personality |
| `depth` | `'flat' \| 'subtle' \| 'elevated' \| 'dimensional'` | — | Shadow intensity |
| `motion` | `'minimal' \| 'smooth' \| 'spring' \| 'snappy'` | — | Animation timing |
| `texture` | `'none' \| 'subtle' \| 'medium'` | — | Surface texture overlay |
| `tag` | `string` | `'div'` | Container HTML element |

## Nested Usage

Override settings for specific sections:

```vue
<SpireProvider theme="light" mood="warm">
  <Header />

  <SpireProvider mood="cool" depth="flat">
    <Sidebar />
  </SpireProvider>

  <MainContent />
</SpireProvider>
```

## Accessing Config

Read current theme values with `useSpireConfig`:

```vue
<script setup>
import { useSpireConfig } from 'spire-ui'

const config = useSpireConfig()
// config.value.theme, config.value.mood, config.value.depth, config.value.motion
</script>

<template>
  <div v-if="config">Current mood: {{ config.mood }}</div>
</template>
```

## Notes

- All props are optional; only set props apply data attributes
- Config is reactive; changes to props update injected consumers
- Works with SSR (attributes render server-side)
- See [Theming](../Theming.md) for full system documentation
