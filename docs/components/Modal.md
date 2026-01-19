# Modal

Native `<dialog>` modal with CSS-only animations, automatic focus trapping, and accessible by default. Uses the browser's top-layer for proper stacking without z-index management.

## Usage

### Basic

```vue
<script setup>
import { ref } from 'vue'
import { Modal, Button } from 'spire-ui'

const isOpen = ref(false)
</script>

<template>
  <Button @click="isOpen = true">Open Modal</Button>

  <Modal v-model="isOpen" title="My Modal">
    <p>Modal content goes here.</p>
  </Modal>
</template>
```

### With Footer

```vue
<template>
  <Modal v-model="isOpen" title="Edit Profile">
    <form>
      <Input label="Name" v-model="name" />
      <Input label="Email" v-model="email" />
    </form>

    <template #footer>
      <Button variant="ghost" @click="isOpen = false">Cancel</Button>
      <Button @click="save">Save</Button>
    </template>
  </Modal>
</template>
```

### Custom Header

```vue
<template>
  <Modal v-model="isOpen">
    <template #header>
      <div class="custom-header">
        <Avatar name="John Doe" />
        <span>John's Profile</span>
      </div>
    </template>

    <p>Content with custom header.</p>
  </Modal>
</template>
```

### Confirm Dialog

```vue
<script setup>
import { ref } from 'vue'
import { Modal, Button } from 'spire-ui'

const confirmOpen = ref(false)

function handleDelete() {
  confirmOpen.value = false
  // Perform delete action
}
</script>

<template>
  <Button variant="destructive" @click="confirmOpen = true">
    Delete Item
  </Button>

  <Modal v-model="confirmOpen" title="Delete Item" size="sm">
    <p>Are you sure you want to delete this item? This action cannot be undone.</p>

    <template #footer>
      <Button variant="ghost" @click="confirmOpen = false">Cancel</Button>
      <Button variant="destructive" @click="handleDelete">Delete</Button>
    </template>
  </Modal>
</template>
```

### Persistent (No Backdrop Close)

Use `persistent` when the modal requires explicit user action (e.g., unsaved changes warning):

```vue
<template>
  <Modal v-model="isOpen" title="Unsaved Changes" persistent>
    <p>You have unsaved changes. Are you sure you want to leave?</p>

    <template #footer>
      <Button variant="ghost" @click="discard">Discard</Button>
      <Button @click="save">Save Changes</Button>
    </template>
  </Modal>
</template>
```

When `persistent` is true:
- Clicking the backdrop does not close the modal
- Pressing Escape does not close the modal
- User must interact with a button or the close icon

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Controls modal visibility (v-model) |
| `title` | `string` | — | Optional header title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal width preset |
| `persistent` | `boolean` | `false` | Prevents closing via backdrop click or Escape |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Modal body content |
| `header` | Custom header content (replaces title) |
| `footer` | Footer content (action buttons) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when modal should open/close |
| `close` | — | Emitted when modal is closed |

## Sizes

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | 400px | Confirmations, simple prompts |
| `md` | 600px | Forms, standard dialogs |
| `lg` | 800px | Complex forms, data displays |
| `xl` | 1140px | Large content, tables |
| `full` | 100vw | Full-screen experiences |

On mobile screens (< 640px), all sizes except `full` expand to full width.

## Closing the Modal

The modal can be closed in several ways:

1. **v-model binding**: Set `modelValue` to `false`
2. **Close button**: Click the X icon in the header
3. **Backdrop click**: Click outside the modal (unless `persistent`)
4. **Escape key**: Press Escape (unless `persistent`)

```vue
<script setup>
const isOpen = ref(true)

// Close programmatically
function closeModal() {
  isOpen.value = false
}

// React to close
function onClose() {
  console.log('Modal was closed')
}
</script>

<template>
  <Modal v-model="isOpen" title="Example" @close="onClose">
    <Button @click="closeModal">Done</Button>
  </Modal>
</template>
```

## Accessibility

Modal uses the native `<dialog>` element which provides:

- **Focus trapping**: Tab cycles through focusable elements inside the modal
- **Focus restoration**: Focus returns to the trigger element when closed
- **Escape handling**: Native Escape key support (can be disabled with `persistent`)
- **Screen reader announcement**: Modal is announced when opened
- **Backdrop click**: Clicking outside closes the modal (unless `persistent`)

Additional accessibility features:

- Close button has `aria-label="Close modal"`
- Close icon is `aria-hidden="true"`
- Body scroll is locked while modal is open

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--modal-bg` | Modal background color |
| `--modal-border` | Modal border color |
| `--modal-backdrop` | Backdrop overlay color |
| `--modal-title` | Title text color |
| `--modal-text` | Body text color |
| `--modal-close` | Close button color |
| `--modal-close-hover` | Close button hover color |
| `--modal-close-hover-bg` | Close button hover background |

## Animation

Modal uses CSS-only animations with the modern `allow-discrete` property:

- **Backdrop**: Fades in/out with blur effect
- **Content box**: Scales from 0.95 with slight upward translation
- **Exit animation**: Uses `@starting-style` for proper exit transitions

No JavaScript animation libraries required.

## Design Guidelines

### When to Use Modal

| Scenario | Use Modal? |
|----------|------------|
| Confirm destructive action | Yes |
| Form requiring focus | Yes |
| Preview/quick view | Yes |
| Simple notification | No (use Toast) |
| Inline editing | No (use inline form) |
| Navigation | No (use page/route) |

### Footer Button Order

- **Cancel/secondary action**: Left side, ghost or outline variant
- **Primary action**: Right side, primary or destructive variant

```vue
<template #footer>
  <Button variant="ghost">Cancel</Button>
  <Button>Confirm</Button>
</template>
```

### Modal vs. Toast

| Feedback Type | Component |
|---------------|-----------|
| Requires user decision | Modal |
| Informational only | Toast |
| Can be ignored | Toast |
| Critical/blocking | Modal |
