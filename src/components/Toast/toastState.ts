import { reactive, readonly, type Component } from 'vue'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  /** Action button label (keep short: Undo, Retry, View) */
  label: string
  /** Callback when action is clicked */
  onClick: () => void
}

export interface ToastOptions {
  /** Toast title */
  title?: string
  /** Toast message/description */
  message?: string
  /** Visual variant */
  variant?: ToastVariant
  /** Auto-dismiss duration in ms (0 = no auto-dismiss). Defaults to 8000ms if action provided, 5000ms otherwise */
  duration?: number
  /** Single action button (Undo, Retry, View) */
  action?: ToastAction
  /** Click handler for toast body (for navigation) */
  onClick?: () => void
  /** Avatar component props for notification-style toasts (replaces icon) */
  avatar?: {
    src?: string
    name?: string
  }
}

export interface Toast {
  /** Unique identifier */
  id: string
  /** Toast title */
  title?: string
  /** Toast message/description */
  message?: string
  /** Visual variant */
  variant: ToastVariant
  /** Auto-dismiss duration in ms */
  duration: number
  /** Timestamp when created */
  createdAt: number
  /** Single action button */
  action?: ToastAction
  /** Click handler for toast body */
  onClick?: () => void
  /** Avatar props for notification toasts */
  avatar?: {
    src?: string
    name?: string
  }
}

/** Maximum number of visible toasts */
const MAX_TOASTS = 5

/** Default duration in ms */
const DEFAULT_DURATION = 5000

/** Default duration when action is present (longer for user reaction time) */
const DEFAULT_ACTION_DURATION = 8000

/** ID counter for unique IDs */
let idCounter = 0

/** Generate unique toast ID */
function generateId(): string {
  return `toast-${++idCounter}-${Date.now().toString(36)}`
}

/** Reactive toast state - singleton */
const state = reactive<{
  toasts: Toast[]
}>({
  toasts: []
})

/**
 * Add a new toast notification
 * @returns Toast ID for manual dismissal
 */
function add(options: ToastOptions & { variant: ToastVariant }): string {
  const id = generateId()

  // Use longer duration if action is present
  const defaultDuration = options.action ? DEFAULT_ACTION_DURATION : DEFAULT_DURATION

  const toast: Toast = {
    id,
    title: options.title,
    message: options.message,
    variant: options.variant,
    duration: options.duration ?? defaultDuration,
    createdAt: Date.now(),
    action: options.action,
    onClick: options.onClick,
    avatar: options.avatar
  }

  // Add to end of array
  state.toasts.push(toast)

  // Enforce max limit - remove oldest
  while (state.toasts.length > MAX_TOASTS) {
    state.toasts.shift()
  }

  return id
}

/**
 * Remove a toast by ID
 */
function remove(id: string): void {
  const index = state.toasts.findIndex(t => t.id === id)
  if (index !== -1) {
    state.toasts.splice(index, 1)
  }
}

/**
 * Remove all toasts
 */
function clear(): void {
  state.toasts.splice(0, state.toasts.length)
}

/**
 * Convenience methods for each variant
 */
function success(title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string {
  return add({ ...options, title, variant: 'success' })
}

function error(title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string {
  return add({ ...options, title, variant: 'error' })
}

function warning(title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string {
  return add({ ...options, title, variant: 'warning' })
}

function info(title: string, options?: Omit<ToastOptions, 'title' | 'variant'>): string {
  return add({ ...options, title, variant: 'info' })
}

/** Readonly access to toast state */
export const toasts = readonly(state).toasts

/** Toast actions */
export const toastActions = {
  add,
  remove,
  clear,
  success,
  error,
  warning,
  info
}
