# Spire UI

A dependency-free Vue 3 component library built with pure CSS. Uses OKLCH color space for perceptually uniform colors and follows a 3-layer CSS architecture.

## Features

- **Zero runtime dependencies** - Pure CSS styling with no external CSS frameworks
- **Vue 3 Composition API** - Built with `<script setup>` and TypeScript
- **OKLCH Color Space** - Perceptually uniform colors for consistent UI
- **3-Layer CSS Architecture** - Tokens, theme, and component styles
- **Polymorphic Components** - Flexible `as` prop for semantic HTML
- **Accessible** - ARIA attributes and keyboard navigation
- **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install spire-ui
# or
pnpm add spire-ui
# or
yarn add spire-ui
```

### Peer Dependencies

```bash
npm install vue@^3.3.0
```

Optional peer dependency for chart components:
```bash
npm install chart.js@^4.4.0
```

## Quick Start

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Import Spire UI styles
import 'spire-ui/style.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { Button, Input, Modal, useToast } from 'spire-ui'

const toast = useToast()

function handleClick() {
  toast.success('Button clicked!')
}
</script>

<template>
  <Button @click="handleClick">Click me</Button>
</template>
```

## Components

### Layout & Structure
- **Card** - Container with header, content, footer, and image slots
- **Modal** - Dialog overlay with focus trap and scroll lock
- **Drawer** - Slide-in panel from any edge
- **Tabs** - Tabbed content navigation
- **Accordion** - Collapsible content sections

### Form Controls
- **Button** - Primary action element with variants and states
- **Input** - Text input with validation states
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Combobox** - Searchable dropdown with autocomplete
- **Checkbox** - Boolean toggle with indeterminate state
- **Radio** - Single selection from group
- **Switch** - Toggle switch control
- **FileUpload** - File input with drag-and-drop

### Selection
- **SegmentedControl** - Mutually exclusive options
- **ToggleButton** - Pressable button with on/off state
- **ToggleGroup** - Group of toggle buttons
- **ChoiceChip** - Selectable chip
- **ChoiceChipGroup** - Group of choice chips

### Display
- **Avatar** - User profile image with fallback
- **Badge** - Status indicator
- **BadgeContainer** - Position badges relative to content
- **Icon** - Flexible icon adapter
- **Heading** - Typography for headings (h1-h6)
- **Text** - Typography for body text
- **Spinner** - Loading indicator
- **Skeleton** - Loading placeholder
- **Progress** - Progress indicator

### Feedback
- **Toast** - Notification messages
- **Tooltip** - Contextual information on hover
- **Callout** - Highlighted information block
- **EmptyState** - Placeholder for empty content

### Data Display
- **DataTable** - Sortable data table
- **Breadcrumb** - Navigation breadcrumbs

### Overlay
- **Dropdown** - Floating menu with submenus
- **Popover** - Floating content panel

### Charts (requires chart.js)
- **LineChart** - Line/area charts
- **BarChart** - Vertical/horizontal bar charts
- **DonutChart** - Donut/pie charts

## Composables

```typescript
import {
  useClickOutside,
  useClipboard,
  useEventListener,
  useFocusTrap,
  useHoverReveal,
  useId,
  useMagnetic,
  useRelativePosition,
  useRipple,
  useScrollLock,
  useStagger,
  useToast
} from 'spire-ui'
```

## CSS Architecture

Spire UI uses a 3-layer CSS system:

1. **Tokens** (`tokens.css`) - Primitive values (colors, spacing, typography)
2. **Theme** (`theme.css`) - Semantic tokens mapping to intent
3. **Components** - Scoped styles using semantic tokens

Colors are defined in OKLCH format for perceptual uniformity:
```css
--color-primary: oklch(0.55 0.25 275);
```

## Icon Integration

The Icon component accepts:
- Vue components from any icon library
- HugeIcons data array format

```vue
<script setup>
import { Icon } from 'spire-ui'
import { Home01Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <Icon :icon="Home01Icon" size="md" />
</template>
```

Configure default icons globally:
```typescript
import { configureIcons } from 'spire-ui'
import { CheckIcon, AlertIcon } from '@hugeicons/core-free-icons'

configureIcons({
  check: CheckIcon,
  alert: AlertIcon
})
```

## Theme Provider

Wrap your app with SpireProvider for theming:

```vue
<script setup>
import { SpireProvider } from 'spire-ui'
</script>

<template>
  <SpireProvider theme="light" mood="professional">
    <App />
  </SpireProvider>
</template>
```

## Development

```bash
# Install dependencies
pnpm install

# Start playground dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Type check
pnpm typecheck
```

## Project Structure

```
packages/
  ui/                 # Component library
    src/
      components/     # Vue components
      composables/    # Vue composables
      styles/         # CSS tokens and theme
      utils/          # Utility functions
      config/         # Configuration
  playground/         # Development environment
```

## License

MIT
