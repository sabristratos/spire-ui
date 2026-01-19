import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Detects clicks outside of a target element and executes a callback.
 * Essential for modals, dropdowns, and popovers.
 *
 * @param el - Ref to the element to watch
 * @param handler - Callback executed when click occurs outside
 *
 * Time Complexity: O(1) per event
 * Space Complexity: O(1)
 */
export function useClickOutside(
  el: Ref<HTMLElement | null>,
  handler: () => void
): void {
  const listener = (event: MouseEvent | TouchEvent): void => {
    const target = event.target as Node

    if (!el.value || el.value.contains(target)) {
      return
    }

    handler()
  }

  onMounted(() => {
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', listener)
    document.removeEventListener('touchstart', listener)
  })
}
