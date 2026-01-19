# Tabs

Tab navigation with a "magic line" indicator that smoothly animates between active tabs. Data-driven header with named slots for panel content.

## Usage

### Basic

```vue
<script setup>
import { ref } from 'vue'
import { Tabs } from 'spire-ui'

const activeTab = ref('account')
const tabs = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' },
  { label: 'Billing', value: 'billing' }
]
</script>

<template>
  <Tabs v-model="activeTab" :items="tabs">
    <template #account>
      <h2>Account Settings</h2>
      <p>Manage your account information.</p>
    </template>

    <template #security>
      <h2>Security</h2>
      <p>Configure security options.</p>
    </template>

    <template #billing>
      <h2>Billing</h2>
      <p>Manage your subscription.</p>
    </template>
  </Tabs>
</template>
```

### With Icons

```vue
<script setup>
import { ref } from 'vue'
import { Tabs } from 'spire-ui'
import { UserIcon, LockIcon, CreditCardIcon } from '@hugeicons/core-free-icons'

const activeTab = ref('account')
const tabs = [
  { label: 'Account', value: 'account', icon: UserIcon },
  { label: 'Security', value: 'security', icon: LockIcon },
  { label: 'Billing', value: 'billing', icon: CreditCardIcon }
]
</script>

<template>
  <Tabs v-model="activeTab" :items="tabs">
    <!-- Panel slots -->
  </Tabs>
</template>
```

### Pill Variant

```vue
<template>
  <Tabs v-model="activeTab" :items="tabs" variant="pill">
    <!-- Panel slots -->
  </Tabs>
</template>
```

### Block Mode (Full Width)

```vue
<template>
  <Tabs v-model="activeTab" :items="tabs" block>
    <!-- Panel slots -->
  </Tabs>
</template>
```

### Disabled Tabs

```vue
<script setup>
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Exports', value: 'exports', disabled: true }
]
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Active tab value (v-model) |
| `items` | `TabItem[]` | — | Array of tab configurations |
| `variant` | `'line' \| 'pill'` | `'line'` | Visual style variant |
| `block` | `boolean` | `false` | Full-width tabs |

### TabItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text |
| `value` | `string \| number` | Unique identifier (also used as slot name) |
| `disabled` | `boolean` | Disable this tab |
| `icon` | `IconInput` | Optional icon component |

## Slots

Tabs use **named slots** where the slot name matches the tab's `value`:

```vue
<Tabs :items="[{ label: 'Account', value: 'account' }]">
  <template #account>
    <!-- Content for account tab -->
  </template>
</Tabs>
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted when active tab changes |

## Keyboard Navigation

The component implements WAI-ARIA roving tabindex pattern:

| Key | Action |
|-----|--------|
| `Tab` | Focus the active tab |
| `ArrowRight` | Move to next tab |
| `ArrowLeft` | Move to previous tab |
| `Home` | Move to first tab |
| `End` | Move to last tab |

Disabled tabs are skipped during keyboard navigation.

## Variants

### Line (Default)

Classic underline indicator with smooth sliding animation.

```vue
<Tabs variant="line" />
```

- Border-bottom on container
- 2px animated indicator line
- Best for: Page sections, settings panels

### Pill

Filled background indicator, like a segmented control.

```vue
<Tabs variant="pill" />
```

- Rounded container background
- Sliding pill indicator with shadow
- Best for: Compact filters, toggle-like navigation

## The "Magic Line"

The indicator smoothly animates between tabs using CSS transforms:

- **Width** transitions to match the active tab's width
- **Transform** slides to the active tab's position
- **ResizeObserver** keeps it in sync during layout changes

```css
.ui-tabs__indicator {
  transition:
    width var(--duration-normal) var(--ease-out-expo),
    transform var(--duration-normal) var(--ease-out-expo);
}
```

## Accessibility

- Tab list has `role="tablist"`
- Each tab button has `role="tab"` and `aria-selected`
- Each panel has `role="tabpanel"` and matching `id`
- Tabs link to panels via `aria-controls`
- Indicator is `aria-hidden="true"`
- Panels are focusable with `tabindex="0"`

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--tabs-border` | List border color (line variant) |
| `--tabs-text` | Inactive tab text |
| `--tabs-text-hover` | Tab text on hover |
| `--tabs-text-active` | Active tab text |
| `--tabs-indicator` | Line indicator color |
| `--tabs-pill-bg` | Pill variant background |
| `--tabs-pill-indicator` | Pill indicator background |

## Design Guidelines

### When to Use Tabs

| Scenario | Use Tabs? |
|----------|-----------|
| Settings page sections | Yes |
| Content that can be grouped | Yes |
| Sequential steps/wizard | No (use Stepper) |
| Navigation between pages | No (use NavLinks) |
| Two-option toggle | No (use SegmentedControl) |

### Tabs vs SegmentedControl

| Feature | Tabs | SegmentedControl |
|---------|------|------------------|
| Content panels | Yes | No |
| Navigation feel | Yes | No |
| Form input | No | Yes |
| Compact toggle | No | Yes |

### Data-Driven Header

Tabs use a prop-based configuration instead of slot-based tabs. This enables:

- Predictable DOM structure for the magic line calculation
- Easy integration with dynamic data
- Simpler keyboard navigation implementation

```vue
<!-- Good: Data-driven -->
<Tabs :items="tabs">
  <template #account>...</template>
</Tabs>

<!-- Not supported: Slot-based tabs -->
<Tabs>
  <Tab label="Account">...</Tab>
</Tabs>
```
