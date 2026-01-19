export { default as ToastProvider } from './ToastProvider.vue'
export type { ToastProviderProps } from './ToastProvider.vue'

export { default as ToastItem } from './ToastItem.vue'
export type { ToastItemProps } from './ToastItem.vue'

import { toastActions } from './toastState'
export { toasts, toastActions } from './toastState'
export type { Toast, ToastOptions, ToastVariant, ToastAction } from './toastState'

/**
 * Composable for triggering toast notifications.
 * Can be used anywhere - components, stores, API interceptors.
 *
 * @example
 * ```ts
 * const toast = useToast()
 *
 * // Simple usage
 * toast.success('Saved!')
 * toast.error('Something went wrong')
 *
 * // With message
 * toast.success('Profile updated', { message: 'Your changes have been saved.' })
 *
 * // Custom duration (ms)
 * toast.info('Heads up', { duration: 10000 })
 *
 * // No auto-dismiss
 * toast.warning('Action required', { duration: 0 })
 *
 * // Manual dismiss
 * const id = toast.info('Processing...')
 * // later...
 * toast.dismiss(id)
 * ```
 */
export function useToast() {
  return {
    /**
     * Show a success toast
     * @param title - Toast title
     * @param options - Additional options (message, duration)
     * @returns Toast ID for manual dismissal
     */
    success: toastActions.success,

    /**
     * Show an error toast
     * @param title - Toast title
     * @param options - Additional options (message, duration)
     * @returns Toast ID for manual dismissal
     */
    error: toastActions.error,

    /**
     * Show a warning toast
     * @param title - Toast title
     * @param options - Additional options (message, duration)
     * @returns Toast ID for manual dismissal
     */
    warning: toastActions.warning,

    /**
     * Show an info toast
     * @param title - Toast title
     * @param options - Additional options (message, duration)
     * @returns Toast ID for manual dismissal
     */
    info: toastActions.info,

    /**
     * Dismiss a specific toast
     * @param id - Toast ID returned from success/error/warning/info
     */
    dismiss: toastActions.remove,

    /**
     * Dismiss all toasts
     */
    clear: toastActions.clear
  }
}
