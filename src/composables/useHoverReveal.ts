import { watch, onUnmounted, type Ref } from 'vue'

export interface UseHoverRevealOptions {
  size?: number
  opacity?: number
}

/**
 * Creates a radial gradient spotlight effect that follows the cursor on hover.
 * Handles deferred elements (tabs, v-if) by watching for target availability.
 *
 * @param target - Ref to the target element
 * @param options - Configuration options
 *
 * @example
 * ```vue
 * <script setup>
 * const cardRef = ref<HTMLElement | null>(null)
 * useHoverReveal(cardRef, { size: 200, opacity: 0.1 })
 * </script>
 *
 * <template>
 *   <div ref="cardRef" data-hover-reveal>Hover over me</div>
 * </template>
 * ```
 */
export function useHoverReveal(
  target: Ref<HTMLElement | null>,
  options: UseHoverRevealOptions = {}
): void {
  const { size, opacity } = options

  let isInitialized = false
  let currentElement: HTMLElement | null = null

  function handleMouseMove(event: MouseEvent) {
    if (!target.value) return

    const rect = target.value.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    target.value.style.setProperty('--mouse-x', `${x}%`)
    target.value.style.setProperty('--mouse-y', `${y}%`)
    if (size !== undefined) {
      target.value.style.setProperty('--effect-hover-reveal-size', `${size}px`)
    }
    if (opacity !== undefined) {
      target.value.style.setProperty('--effect-hover-reveal-opacity', `${opacity}`)
    }
  }

  function handleMouseLeave() {
    if (!target.value) return
    target.value.style.removeProperty('--mouse-x')
    target.value.style.removeProperty('--mouse-y')
  }

  function initialize(element: HTMLElement) {
    if (isInitialized && currentElement === element) return

    cleanup()

    currentElement = element
    isInitialized = true

    element.setAttribute('data-hover-reveal', '')
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
  }

  function cleanup() {
    if (currentElement) {
      currentElement.removeEventListener('mousemove', handleMouseMove)
      currentElement.removeEventListener('mouseleave', handleMouseLeave)
      currentElement.style.removeProperty('--mouse-x')
      currentElement.style.removeProperty('--mouse-y')
    }
    isInitialized = false
    currentElement = null
  }

  watch(
    target,
    (newTarget) => {
      if (newTarget) {
        initialize(newTarget)
      } else {
        cleanup()
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    cleanup()
  })
}
