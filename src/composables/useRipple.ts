import { watch, onUnmounted, type Ref } from 'vue'

export interface UseRippleOptions {
  color?: string
  opacity?: number
  duration?: number
  disabled?: Ref<boolean> | boolean
}

/**
 * Creates a ripple effect on click for interactive elements.
 * Handles deferred elements (tabs, v-if) by watching for target availability.
 *
 * @param target - Ref to the target element
 * @param options - Configuration options
 *
 * @example
 * ```vue
 * <script setup>
 * const buttonRef = ref<HTMLElement | null>(null)
 * useRipple(buttonRef, { color: 'white', opacity: 0.3 })
 * </script>
 *
 * <template>
 *   <button ref="buttonRef" data-ripple>Click me</button>
 * </template>
 * ```
 */
export function useRipple(
  target: Ref<HTMLElement | null>,
  options: UseRippleOptions = {}
): void {
  const {
    color = 'var(--effect-ripple-color, white)',
    opacity = 0.25,
    duration = 800,
    disabled = false
  } = options

  let isInitialized = false
  let currentElement: HTMLElement | null = null
  let styleElement: HTMLStyleElement | null = null

  function isDisabled(): boolean {
    if (typeof disabled === 'boolean') return disabled
    return disabled.value
  }

  function ensureKeyframes(): void {
    if (document.querySelector('style[data-ripple-keyframes]')) return

    styleElement = document.createElement('style')
    styleElement.setAttribute('data-ripple-keyframes', '')
    styleElement.textContent = `
      @keyframes ui-ripple-expand {
        0% {
          opacity: 0;
          transform: scale(0);
        }
        15% {
          opacity: var(--ripple-opacity, 0.25);
        }
        100% {
          transform: scale(2.5);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(styleElement)
  }

  function createRipple(event: MouseEvent) {
    if (!target.value || isDisabled()) return

    const element = target.value
    const rect = element.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const size = Math.max(rect.width, rect.height) * 2

    const ripple = document.createElement('span')
    ripple.className = 'ui-ripple'
    ripple.style.cssText = `
      position: absolute;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      --ripple-opacity: ${opacity};
      opacity: 0;
      transform: scale(0);
      pointer-events: none;
      animation: ui-ripple-expand ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `

    element.style.position = element.style.position || 'relative'
    element.style.overflow = 'hidden'

    element.appendChild(ripple)

    ripple.addEventListener('animationend', () => {
      ripple.remove()
    })
  }

  function initialize(element: HTMLElement) {
    if (isInitialized && currentElement === element) return

    cleanup()

    currentElement = element
    isInitialized = true

    ensureKeyframes()
    element.addEventListener('click', createRipple)
    element.setAttribute('data-ripple', '')
  }

  function cleanup() {
    if (currentElement) {
      currentElement.removeEventListener('click', createRipple)
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
