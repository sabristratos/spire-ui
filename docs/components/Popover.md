# Popover

A floating panel anchored to a trigger element. Unlike Dropdown (for menu actions), Popover is designed for rich content like forms, information panels, and inline editing. Features focus trapping, keyboard navigation, and configurable close behaviors.

## Usage

### Basic

```vue
<script setup>
import { Popover, Button, Text } from 'spire-ui'
</script>

<template>
  <Popover>
    <template #trigger>
      <Button variant="secondary">Show Info</Button>
    </template>
    <Text>This is popover content. Click outside or press Escape to close.</Text>
  </Popover>
</template>
```

### With Arrow

```vue
<template>
  <Popover arrow>
    <template #trigger>
      <Button variant="secondary">With Arrow</Button>
    </template>
    <Text>The arrow visually connects the popover to its trigger.</Text>
  </Popover>
</template>
```

### Form Inside Popover

Use the scoped `close` function to dismiss the popover from within content:

```vue
<script setup>
import { ref } from 'vue'
import { Popover, Button, Input } from 'spire-ui'

const name = ref('')
const email = ref('')

function save() {
  console.log('Saving:', name.value, email.value)
}
</script>

<template>
  <Popover :width="320">
    <template #trigger>
      <Button>Edit Profile</Button>
    </template>
    <template #default="{ close }">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <h4>Edit Profile</h4>
        <Input v-model="name" label="Name" />
        <Input v-model="email" label="Email" />
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <Button variant="secondary" size="sm" @click="close">Cancel</Button>
          <Button size="sm" @click="save(); close()">Save</Button>
        </div>
      </div>
    </template>
  </Popover>
</template>
```

### Programmatic Control

Access the popover's methods via ref:

```vue
<script setup>
import { ref } from 'vue'
import { Popover, Button } from 'spire-ui'

const popoverRef = ref(null)
</script>

<template>
  <Popover ref="popoverRef">
    <template #trigger>
      <Button variant="secondary">Controlled Popover</Button>
    </template>
    <Text>Programmatically controlled!</Text>
  </Popover>

  <Button @click="popoverRef?.open()">Open</Button>
  <Button @click="popoverRef?.close()">Close</Button>
  <Button @click="popoverRef?.toggle()">Toggle</Button>
</template>
```

### Custom Width

```vue
<template>
  <!-- Auto width (default) -->
  <Popover>
    <template #trigger><Button>Auto Width</Button></template>
    <Text>Width adapts to content.</Text>
  </Popover>

  <!-- Fixed width -->
  <Popover :width="400">
    <template #trigger><Button>400px Wide</Button></template>
    <Text>This popover has a fixed 400px width.</Text>
  </Popover>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `PopoverPlacement` | `'bottom'` | Position relative to trigger |
| `offset` | `number` | `8` | Gap between trigger and popover (px) |
| `arrow` | `boolean` | `false` | Show connecting arrow |
| `disabled` | `boolean` | `false` | Prevent popover from opening |
| `width` | `'auto' \| number` | `'auto'` | Fixed width in pixels or auto |
| `closeOnEscape` | `boolean` | `true` | Close when Escape is pressed |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside |
| `lockScroll` | `boolean` | `false` | Prevent body scrolling when open |
| `trapFocus` | `boolean` | `true` | Keep focus cycling within popover |

### Placement Values

```typescript
type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'
```

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `trigger` | `{ open, toggle, close }` | Element that triggers the popover |
| `default` | `{ close }` | Popover content |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `open` | — | Emitted when popover opens |
| `close` | — | Emitted when popover closes |

## Exposed Methods

Access via template ref:

| Method | Description |
|--------|-------------|
| `open()` | Open the popover |
| `close()` | Close the popover |
| `toggle()` | Toggle open/closed state |
| `isOpen` | Reactive boolean for current state |

## Closing the Popover

The popover can be closed in several ways:

1. **Click outside**: Click anywhere outside the popover (unless `closeOnClickOutside` is false)
2. **Escape key**: Press Escape (unless `closeOnEscape` is false)
3. **Scoped close function**: Call `close()` from the default slot
4. **Programmatic**: Call `close()` via ref
5. **Toggle trigger**: Click the trigger again

## Focus Management

When `trapFocus` is enabled (default):

- Focus moves to the first focusable element when opened
- Tab cycles through focusable elements within the popover
- Shift+Tab cycles backwards
- Focus returns to the trigger when closed

```vue
<template>
  <!-- Focus trapped (default) -->
  <Popover>
    <template #trigger><Button>With Focus Trap</Button></template>
    <Input label="First field" />
    <Input label="Second field" />
    <Button>Submit</Button>
  </Popover>

  <!-- Focus not trapped -->
  <Popover :trap-focus="false">
    <template #trigger><Button>No Focus Trap</Button></template>
    <Text>Tab will move focus outside the popover.</Text>
  </Popover>
</template>
```

## Accessibility

Popover implements proper ARIA patterns:

- `role="dialog"` on the content panel
- `aria-haspopup="dialog"` on the trigger
- `aria-expanded` reflects open state
- `aria-controls` links trigger to content
- `aria-modal` when focus is trapped
- Focus management on open/close

## Auto-positioning

Popover automatically flips to the opposite side if there isn't enough space:

- `top` → `bottom` if too close to top edge
- `bottom` → `top` if too close to bottom edge
- `left` → `right` if too close to left edge
- `right` → `left` if too close to right edge

The actual placement is tracked internally and reflected in CSS classes for arrow positioning.

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--popover-bg` | Background color (falls back to `--dropdown-bg`) |
| `--popover-border` | Border color (falls back to `--dropdown-border`) |
| `--z-popover` | Z-index layer (default: 60) |
| `--shadow-xl` | Drop shadow |
| `--radius-lg` | Border radius |
| `--space-4` | Content padding |

## Animation

Popover uses CSS transitions:

- **Enter**: Fade in with scale from 0.95
- **Leave**: Fade out with scale to 0.95
- Duration controlled by `--duration-fast`

## Popover vs Dropdown vs Modal

| Feature | Popover | Dropdown | Modal |
|---------|---------|----------|-------|
| Purpose | Rich content, forms | Action menus | Blocking dialogs |
| Focus trap | Optional (default on) | No | Yes |
| Content type | Any | Menu items | Any |
| Trigger | Click | Click | Button/programmatic |
| Role | `dialog` | `menu` | Native dialog |
| Click outside | Configurable | Always closes | Configurable |

### When to Use Popover

| Scenario | Use Popover? |
|----------|--------------|
| Quick edit form | Yes |
| User info card | Yes |
| Color picker | Yes |
| Date picker | Yes |
| Action menu | No (use Dropdown) |
| Settings panel | Depends (Modal if complex) |
| Confirmation | No (use Modal) |

## Design Guidelines

### Content Sizing

- Set explicit `width` for forms to prevent layout shifts
- Use `auto` width for simple tooltips or info cards
- Keep content concise; use Modal for complex flows

### Arrow Usage

- Use arrows when visual connection to trigger is important
- Omit arrows for larger popovers where the relationship is obvious

### Close Behaviors

- Keep default behaviors unless you have a specific reason
- Use `closeOnClickOutside: false` for multi-step forms
- Use `closeOnEscape: false` sparingly (can frustrate users)
