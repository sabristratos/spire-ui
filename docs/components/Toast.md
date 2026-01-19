# Toast

Global notification system with auto-dismiss, pause-on-hover, progress bar, actions, and avatar support. Uses singleton state so toasts can be triggered from anywhere - components, stores, or API interceptors.

## Setup

Add `ToastProvider` once at your app root (e.g., `App.vue`):

```vue
<script setup>
import { ToastProvider } from 'spire-ui'
</script>

<template>
  <div id="app">
    <!-- Your app content -->
    <ToastProvider />
  </div>
</template>
```

## Usage

### Basic

```ts
import { useToast } from 'spire-ui'

const toast = useToast()

// Success
toast.success('Changes saved')

// Error
toast.error('Something went wrong')

// Warning
toast.warning('Session expiring soon')

// Info
toast.info('New version available')
```

### With Message

```ts
toast.success('Profile updated', {
  message: 'Your changes have been saved successfully.'
})

toast.error('Upload failed', {
  message: 'Please check your file size and try again.'
})
```

### With Action (Undo/Retry Pattern)

Actions are for **reversal or retry** only. Maximum 1 action per toast.

```ts
// Undo pattern
toast.success('Item deleted', {
  message: 'The file has been moved to trash.',
  action: {
    label: 'Undo',
    onClick: () => restoreItem()
  }
})

// Retry pattern
toast.error('Connection failed', {
  message: 'Could not reach the server.',
  action: {
    label: 'Retry',
    onClick: () => reconnect()
  }
})
```

When an action is provided, duration defaults to **8 seconds** (instead of 5) to give users time to react.

### Notification Style (With Avatar)

For user notifications, use `avatar` instead of the default icon:

```ts
// With avatar (initials fallback)
toast.info('John commented on your post', {
  message: 'This looks great! When can we ship it?',
  avatar: { name: 'John Doe' }
})

// With avatar image
toast.info('Sarah liked your photo', {
  avatar: { src: 'https://example.com/sarah.jpg' }
})
```

### Clickable Toast (Navigation)

Make the entire toast clickable for navigation:

```ts
toast.info('New message from John', {
  avatar: { name: 'John Doe' },
  onClick: () => router.push('/messages/123')
})
```

Clicking the toast body triggers `onClick` and dismisses the toast.

### Custom Duration

```ts
// Quick toast (2 seconds)
toast.info('Copied!', { duration: 2000 })

// Long toast (10 seconds)
toast.warning('Please review', { duration: 10000 })

// No auto-dismiss (user must click close)
toast.error('Action required', { duration: 0 })
```

### Manual Dismiss

```ts
// Get the toast ID
const id = toast.info('Processing...')

// Later, dismiss it
toast.dismiss(id)

// Or clear all toasts
toast.clear()
```

### From Non-Component Code

The singleton pattern allows triggering toasts from anywhere:

```ts
// api/client.ts
import { useToast } from 'spire-ui'

const toast = useToast()

export async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed')
    return response.json()
  } catch (error) {
    toast.error('Request failed', {
      message: error.message,
      action: {
        label: 'Retry',
        onClick: () => fetchData()
      }
    })
    throw error
  }
}
```

## ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'top-right'` | Position of the toast container |

## useToast API

| Method | Signature | Description |
|--------|-----------|-------------|
| `success` | `(title: string, options?) => string` | Show success toast, returns ID |
| `error` | `(title: string, options?) => string` | Show error toast, returns ID |
| `warning` | `(title: string, options?) => string` | Show warning toast, returns ID |
| `info` | `(title: string, options?) => string` | Show info toast, returns ID |
| `dismiss` | `(id: string) => void` | Dismiss a specific toast |
| `clear` | `() => void` | Dismiss all toasts |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | — | Optional description below the title |
| `duration` | `number` | `5000` (or `8000` with action) | Auto-dismiss delay in ms (0 = no auto-dismiss) |
| `action` | `{ label: string, onClick: () => void }` | — | Single action button (Undo, Retry, View) |
| `onClick` | `() => void` | — | Click handler for toast body (navigation) |
| `avatar` | `{ src?: string, name?: string }` | — | Avatar props (replaces icon) |

## Design Guidelines

### Actions: Keep It Simple

- **Maximum 1 action** per toast. If you need "Accept" and "Decline", use a Modal.
- **Short labels**: Undo, Retry, View, Open
- **Use for reversal or retry only** - toasts are transient, don't rely on them for critical decisions

### System Toasts vs. Notification Toasts

| Type | Leading Element | Use Case |
|------|-----------------|----------|
| **System** | Variant icon | "Saved!", "Error occurred" |
| **Notification** | User avatar | "John commented...", "Sarah liked..." |

### When to Use What

| Scenario | Component |
|----------|-----------|
| Operation feedback | System toast (icon) |
| User activity | Notification toast (avatar) |
| Critical decision | Modal (not toast) |
| Persistent info | Banner (not toast) |

## Features

### Pause on Hover

When the user hovers over a toast:
- Timer pauses
- Progress bar animation pauses
- Timer resumes when mouse leaves

### Progress Bar

Visual indicator showing remaining time. Syncs with pause-on-hover via CSS `animation-play-state`.

### Queue Management

Maximum 5 toasts visible at once. When limit is exceeded, oldest toasts are removed.

### Stacking Animation

When a toast is dismissed, remaining toasts smoothly slide to fill the gap using `TransitionGroup` with `v-move`.

## Accessibility

- Container has `role="region"` and `aria-label="Notifications"`
- Error toasts use `role="alert"` (assertive - interrupts screen reader)
- Other variants use `role="status"` (polite - waits for pause)
- Close button is keyboard focusable with clear label
- Action buttons are focusable
- Icons are `aria-hidden`

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--toast-bg` | Toast background |
| `--toast-border` | Toast border |
| `--toast-title` | Title text color |
| `--toast-message` | Message text color |
| `--toast-close` | Close button color |
| `--toast-close-hover` | Close button hover color |
| `--toast-close-hover-bg` | Close button hover background |
| `--toast-success-icon` | Success icon color |
| `--toast-success-progress` | Success progress bar |
| `--toast-error-icon` | Error icon color |
| `--toast-error-progress` | Error progress bar |
| `--toast-warning-icon` | Warning icon color |
| `--toast-warning-progress` | Warning progress bar |
| `--toast-info-icon` | Info icon color |
| `--toast-info-progress` | Info progress bar |

## Responsive Behavior

On mobile screens (< 480px), toasts expand to full width for better touch targets.
