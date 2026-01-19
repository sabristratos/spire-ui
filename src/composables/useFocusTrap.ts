import { watch, nextTick, onUnmounted, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

/**
 * Traps focus within a container element when active.
 * Tab cycles through focusable elements, never escaping the container.
 * Critical for modal accessibility.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  isActive: Ref<boolean>
) {
  const trapFocus = (e: KeyboardEvent) => {
    if (!isActive.value || !container.value) return
    if (e.key !== 'Tab') return

    const elements = container.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    if (elements.length === 0) return

    const first = elements[0]
    const last = elements[elements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  watch(isActive, async (val) => {
    if (val) {
      await nextTick()
      const first = container.value?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      first?.focus()
      window.addEventListener('keydown', trapFocus)
    } else {
      window.removeEventListener('keydown', trapFocus)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', trapFocus)
  })
}
