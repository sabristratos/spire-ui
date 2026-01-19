import { ref, watch, nextTick, onUnmounted, type Ref } from 'vue'

export interface UseStaggerOptions {
  delay?: number
  duration?: number
  easing?: string
  from?: {
    opacity?: number
    transform?: string
  }
  to?: {
    opacity?: number
    transform?: string
  }
  animateOnVisible?: boolean
}

export interface UseStaggerReturn {
  isAnimating: Ref<boolean>
  animate: () => Promise<void>
  reset: () => void
}

/**
 * Creates sequential stagger animations for list items.
 * Handles deferred elements (tabs, v-if) by watching for container availability.
 *
 * @param container - Ref to the container element
 * @param itemSelector - CSS selector for items to animate
 * @param options - Animation configuration
 * @returns Controls for the stagger animation
 *
 * @example
 * ```vue
 * <script setup>
 * const listRef = ref<HTMLElement | null>(null)
 * const { animate } = useStagger(listRef, '.list-item', {
 *   delay: 80,
 *   from: { opacity: 0, transform: 'translateY(12px)' },
 *   to: { opacity: 1, transform: 'translateY(0)' }
 * })
 *
 * // Trigger manually when ready
 * function onTabVisible() {
 *   animate()
 * }
 * </script>
 *
 * <template>
 *   <ul ref="listRef">
 *     <li class="list-item" v-for="item in items" :key="item.id">{{ item.name }}</li>
 *   </ul>
 * </template>
 * ```
 */
export function useStagger(
  container: Ref<HTMLElement | null>,
  itemSelector: string,
  options: UseStaggerOptions = {}
): UseStaggerReturn {
  const {
    delay = 80,
    duration = 400,
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
    from = { opacity: 0, transform: 'translateY(16px)' },
    to = { opacity: 1, transform: 'translateY(0)' },
    animateOnVisible = false
  } = options

  const isAnimating = ref(false)
  let hasAnimatedOnce = false
  let animationTimeout: ReturnType<typeof setTimeout> | null = null

  function getItems(): HTMLElement[] {
    if (!container.value) return []
    return Array.from(container.value.querySelectorAll<HTMLElement>(itemSelector))
  }

  function forceReflow(element: HTMLElement): void {
    void element.offsetHeight
  }

  function applyInitialStyles(items: HTMLElement[]): void {
    items.forEach((item) => {
      item.style.transition = 'none'
      if (from.opacity !== undefined) {
        item.style.opacity = String(from.opacity)
      }
      if (from.transform) {
        item.style.transform = from.transform
      }
    })
  }

  async function animate(): Promise<void> {
    await nextTick()

    const items = getItems()
    if (items.length === 0) return

    if (isAnimating.value) return
    isAnimating.value = true

    applyInitialStyles(items)

    if (items[0]) {
      forceReflow(items[0])
    }

    await new Promise(resolve => requestAnimationFrame(resolve))

    items.forEach((item, index) => {
      const itemDelay = index * delay

      item.style.transition = `opacity ${duration}ms ${easing} ${itemDelay}ms, transform ${duration}ms ${easing} ${itemDelay}ms`

      if (to.opacity !== undefined) {
        item.style.opacity = String(to.opacity)
      }
      if (to.transform) {
        item.style.transform = to.transform
      }
    })

    const totalDuration = (items.length - 1) * delay + duration

    await new Promise<void>(resolve => {
      if (animationTimeout) {
        clearTimeout(animationTimeout)
      }
      animationTimeout = setTimeout(() => {
        animationTimeout = null
        isAnimating.value = false
        items.forEach((item) => {
          item.style.transition = ''
        })
        resolve()
      }, totalDuration + 50)
    })
  }

  function reset(): void {
    const items = getItems()
    items.forEach((item) => {
      item.style.opacity = ''
      item.style.transform = ''
      item.style.transition = ''
    })
    isAnimating.value = false
    hasAnimatedOnce = false
  }

  if (animateOnVisible) {
    watch(
      container,
      async (newContainer) => {
        if (newContainer && !hasAnimatedOnce) {
          await nextTick()
          const items = getItems()
          if (items.length > 0) {
            hasAnimatedOnce = true
            animate()
          }
        }
      },
      { immediate: true }
    )
  }

  onUnmounted(() => {
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }
  })

  return {
    isAnimating,
    animate,
    reset
  }
}

/**
 * Convenience function to apply stagger animation styles directly via CSS.
 * Returns a style object that can be applied to list items.
 *
 * @param index - Item index in the list
 * @param options - Animation configuration
 * @returns Style object with animation delay
 *
 * @example
 * ```vue
 * <template>
 *   <ul>
 *     <li
 *       v-for="(item, index) in items"
 *       :key="item.id"
 *       :style="getStaggerStyle(index)"
 *       class="stagger-item"
 *     >
 *       {{ item.name }}
 *     </li>
 *   </ul>
 * </template>
 *
 * <style>
 * .stagger-item {
 *   animation: stagger-in var(--duration-normal) var(--ease-out) both;
 *   animation-delay: var(--stagger-delay);
 * }
 * </style>
 * ```
 */
export function getStaggerStyle(
  index: number,
  options: { delay?: number } = {}
): Record<string, string> {
  const { delay = 80 } = options
  return {
    '--stagger-delay': `${index * delay}ms`,
    '--stagger-index': String(index)
  }
}
