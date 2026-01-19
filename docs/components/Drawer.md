# Drawer

Slide-out panel component for secondary content, navigation, or forms. Supports multiple placements, variants, and mobile-responsive behavior.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { Drawer, Button } from 'spire-ui'

const isOpen = ref(false)
</script>

<template>
  <Button @click="isOpen = true">Open Drawer</Button>
  <Drawer v-model="isOpen" title="My Drawer">
    <p>Drawer content goes here</p>
  </Drawer>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Controls visibility (v-model) |
| `title` | `string` | — | Drawer title |
| `variant` | `DrawerVariant` | `'default'` | Visual variant |
| `placement` | `DrawerPlacement` | `'right'` | Placement on desktop |
| `size` | `DrawerSize` | `'md'` | Width/height preset |
| `maskClosable` | `boolean` | `true` | Allow closing by clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Allow closing with Escape key |
| `showClose` | `boolean` | `true` | Show close button in header |

### Type Definitions

```typescript
type DrawerPlacement = 'right' | 'left' | 'bottom'
type DrawerVariant = 'default' | 'floating'
type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when visibility changes |
| `open` | — | Emitted when drawer opens |
| `close` | — | Emitted when drawer closes |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Main content |
| `header` | — | Custom header content |
| `footer` | `{ close }` | Footer with close function |

## Variants

### Default

Edge-to-edge panel flush with the viewport edge.

```vue
<Drawer v-model="isOpen" variant="default" title="Default Drawer">
  Content here
</Drawer>
```

### Floating

Detached panel with margin and rounded corners. Provides a more modern appearance.

```vue
<Drawer v-model="isOpen" variant="floating" title="Floating Drawer">
  Content here
</Drawer>
```

On mobile screens, the floating variant automatically reverts to the default bottom sheet style.

## Placements

### Right (default)

```vue
<Drawer v-model="isOpen" placement="right">
  Slides in from the right
</Drawer>
```

### Left

```vue
<Drawer v-model="isOpen" placement="left">
  Slides in from the left
</Drawer>
```

### Bottom

```vue
<Drawer v-model="isOpen" placement="bottom">
  Slides up from the bottom
</Drawer>
```

## Sizes

Control the drawer width (for left/right) or max-height (for bottom):

| Size | Width |
|------|-------|
| `sm` | 320px |
| `md` | 400px |
| `lg` | 560px |
| `xl` | 720px |
| `full` | 100% |

```vue
<Drawer v-model="isOpen" size="lg" title="Large Drawer">
  Wide drawer content
</Drawer>
```

Bottom placement always spans full width regardless of size setting.

## Footer Slot

Add action buttons with a sticky footer:

```vue
<Drawer v-model="isOpen" title="Edit Profile">
  <Input label="Name" v-model="name" />
  <Input label="Email" v-model="email" />

  <template #footer="{ close }">
    <Button variant="secondary" @click="close">Cancel</Button>
    <Button @click="save">Save Changes</Button>
  </template>
</Drawer>
```

The footer slot receives a `close` function for programmatic closing.

## Custom Header

Replace the default header with custom content:

```vue
<Drawer v-model="isOpen">
  <template #header>
    <div class="custom-header">
      <Avatar :src="user.avatar" />
      <span>{{ user.name }}</span>
    </div>
  </template>
  Content here
</Drawer>
```

## Programmatic Control

Use a template ref to control the drawer programmatically:

```vue
<script setup>
import { ref } from 'vue'

const drawerRef = ref()

function closeDrawer() {
  drawerRef.value?.close()
}
</script>

<template>
  <Drawer ref="drawerRef" v-model="isOpen">
    <Button @click="closeDrawer">Close from inside</Button>
  </Drawer>
</template>
```

### Exposed Methods

| Method | Description |
|--------|-------------|
| `close()` | Close the drawer |

## Mobile Behavior

On screens narrower than 640px, right and left drawers automatically transform into bottom sheets:

- Placement changes to `bottom`
- Floating variant reverts to default styling
- Full-width with rounded top corners
- Max height of 90vh

This provides a native mobile experience without additional configuration.

## Animations

Drawer uses the Expo Out easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for smooth, natural animations:

- **Enter**: 300ms slide animation
- **Leave**: 200ms slide animation
- **Backdrop**: Fade animation

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Links to title via `aria-labelledby`
- Focus is trapped inside the drawer when open
- First focusable element receives focus on open
- Focus returns to trigger element on close
- Escape key closes (configurable)
- Body scroll is locked while open

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--z-modal` | Z-index (default: 100) |
| `--drawer-bg` | Background color (falls back to `--modal-bg`) |
| `--drawer-border` | Border color (falls back to `--modal-border`) |
| `--drawer-title` | Title text color (falls back to `--modal-title`) |
| `--drawer-close` | Close button color (falls back to `--modal-close`) |
| `--drawer-close-hover` | Close button hover color |
| `--drawer-close-hover-bg` | Close button hover background |
| `--modal-backdrop` | Backdrop color |
| `--shadow-2xl` | Panel shadow |

## Best Practices

1. **Use for secondary content**: Navigation menus, filters, details panels, settings
2. **Prefer modals for confirmation**: Critical actions should use Modal for focused attention
3. **Keep content focused**: Avoid cramming too much into a drawer
4. **Provide clear escape routes**: Always show close button and enable Escape/backdrop close
5. **Use appropriate size**: Match drawer width to content needs

## Examples

### Settings Panel

```vue
<Drawer v-model="settingsOpen" title="Settings" size="lg">
  <div class="settings-section">
    <h4>Notifications</h4>
    <Switch v-model="emailNotifications" label="Email notifications" />
    <Switch v-model="pushNotifications" label="Push notifications" />
  </div>

  <template #footer="{ close }">
    <Button variant="secondary" @click="close">Cancel</Button>
    <Button @click="saveSettings">Save</Button>
  </template>
</Drawer>
```

### Mobile Navigation

```vue
<Drawer v-model="menuOpen" placement="left" title="Menu">
  <nav>
    <a href="/" @click="menuOpen = false">Home</a>
    <a href="/products" @click="menuOpen = false">Products</a>
    <a href="/about" @click="menuOpen = false">About</a>
    <a href="/contact" @click="menuOpen = false">Contact</a>
  </nav>
</Drawer>
```

### Floating Detail Panel

```vue
<Drawer
  v-model="detailsOpen"
  variant="floating"
  size="xl"
  title="Order Details"
>
  <OrderDetails :order="selectedOrder" />

  <template #footer="{ close }">
    <Button variant="secondary" @click="close">Close</Button>
    <Button variant="danger" @click="cancelOrder">Cancel Order</Button>
  </template>
</Drawer>
```
