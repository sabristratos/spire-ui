import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Locks body scroll when active, preventing background scrolling.
 * Compensates for scrollbar width to prevent layout shift.
 */
export function useScrollLock(isLocked: Ref<boolean>) {
  const lock = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.overflow = 'hidden'
  }

  const unlock = () => {
    document.body.style.paddingRight = ''
    document.body.style.overflow = ''
  }

  watch(isLocked, (val) => {
    if (val) lock()
    else unlock()
  })

  onUnmounted(() => unlock())
}
