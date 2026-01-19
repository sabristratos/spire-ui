import { ref, watch, onUnmounted, type Ref } from 'vue'

export interface UseMagneticOptions {
  strength?: number
  radius?: number
  ease?: number
}

export interface UseMagneticReturn {
  x: Ref<number>
  y: Ref<number>
  isHovering: Ref<boolean>
  style: Ref<Record<string, string>>
}

/**
 * Creates a magnetic hover effect where the element subtly follows the cursor.
 * Handles deferred elements (tabs, v-if) by watching for target availability.
 *
 * @param target - Ref to the target element
 * @param options - Configuration options
 * @returns Reactive values for position and style
 *
 * @example
 * ```vue
 * <script setup>
 * const buttonRef = ref<HTMLElement | null>(null)
 * const { style } = useMagnetic(buttonRef, { strength: 0.3 })
 * </script>
 *
 * <template>
 *   <button ref="buttonRef" :style="style">Magnetic Button</button>
 * </template>
 * ```
 */
export function useMagnetic(
  target: Ref<HTMLElement | null>,
  options: UseMagneticOptions = {}
): UseMagneticReturn {
  const { strength = 0.2, radius = 100, ease = 0.15 } = options

  const x = ref(0)
  const y = ref(0)
  const isHovering = ref(false)
  const style = ref<Record<string, string>>({})

  let animationFrame: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let isInitialized = false
  let currentElement: HTMLElement | null = null

  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  function animate() {
    currentX = lerp(currentX, targetX, ease)
    currentY = lerp(currentY, targetY, ease)

    const deltaX = Math.abs(currentX - targetX)
    const deltaY = Math.abs(currentY - targetY)

    if (deltaX < 0.01 && deltaY < 0.01) {
      currentX = targetX
      currentY = targetY
    }

    x.value = currentX
    y.value = currentY
    style.value = {
      transform: `translate(${currentX}px, ${currentY}px)`,
      transition: 'none'
    }

    if (isHovering.value || currentX !== 0 || currentY !== 0) {
      animationFrame = requestAnimationFrame(animate)
    } else {
      animationFrame = null
      style.value = {
        transform: 'translate(0, 0)',
        transition: 'transform var(--duration-normal, 200ms) var(--ease-out, ease-out)'
      }
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (!target.value) return

    const rect = target.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = event.clientX - centerX
    const distanceY = event.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < radius) {
      isHovering.value = true
      const factor = 1 - distance / radius
      targetX = distanceX * strength * factor
      targetY = distanceY * strength * factor

      if (!animationFrame) {
        animationFrame = requestAnimationFrame(animate)
      }
    } else if (isHovering.value) {
      handleMouseLeave()
    }
  }

  function handleMouseLeave() {
    isHovering.value = false
    targetX = 0
    targetY = 0

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  function initialize(element: HTMLElement) {
    if (isInitialized && currentElement === element) return

    cleanup()

    currentElement = element
    isInitialized = true

    document.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
  }

  function cleanup() {
    document.removeEventListener('mousemove', handleMouseMove)
    if (currentElement) {
      currentElement.removeEventListener('mouseleave', handleMouseLeave)
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
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

  return {
    x,
    y,
    isHovering,
    style
  }
}
