import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export type Placement = 'top' | 'bottom' | 'left' | 'right'

export interface PositionResult {
  top: number
  left: number
  actualPlacement: Placement
}

/**
 * Pure calculation function - no reactive dependencies.
 * Can be called synchronously before first paint.
 */
export function calculatePosition(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  desiredPlacement: Placement,
  offset: number
): PositionResult {
  const triggerRect = triggerEl.getBoundingClientRect()

  // Use offsetWidth/Height for content - not affected by CSS transforms (scale)
  const contentWidth = contentEl.offsetWidth
  const contentHeight = contentEl.offsetHeight

  const viewport = {
    width: window.innerWidth || 1024,
    height: window.innerHeight || 768
  }

  const triggerCenterX = triggerRect.left + triggerRect.width / 2
  const triggerCenterY = triggerRect.top + triggerRect.height / 2

  function calcPosition(p: Placement): { top: number; left: number } {
    switch (p) {
      case 'top':
        return {
          top: triggerRect.top - contentHeight - offset,
          left: triggerCenterX - contentWidth / 2
        }
      case 'bottom':
        return {
          top: triggerRect.bottom + offset,
          left: triggerCenterX - contentWidth / 2
        }
      case 'left':
        return {
          top: triggerCenterY - contentHeight / 2,
          left: triggerRect.left - contentWidth - offset
        }
      case 'right':
        return {
          top: triggerCenterY - contentHeight / 2,
          left: triggerRect.right + offset
        }
    }
  }

  const opposites: Record<Placement, Placement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  }

  let currentPlacement = desiredPlacement
  let pos = calcPosition(currentPlacement)

  const overflows = {
    top: pos.top < 0,
    bottom: pos.top + contentHeight > viewport.height,
    left: pos.left < 0,
    right: pos.left + contentWidth > viewport.width
  }

  if (
    (currentPlacement === 'top' && overflows.top) ||
    (currentPlacement === 'bottom' && overflows.bottom) ||
    (currentPlacement === 'left' && overflows.left) ||
    (currentPlacement === 'right' && overflows.right)
  ) {
    currentPlacement = opposites[currentPlacement]
    pos = calcPosition(currentPlacement)
  }

  const top = Math.max(offset, Math.min(pos.top, viewport.height - contentHeight - offset))
  const left = Math.max(offset, Math.min(pos.left, viewport.width - contentWidth - offset))

  return { top, left, actualPlacement: currentPlacement }
}

/**
 * Composable for positioning floating elements relative to a trigger.
 * Includes collision detection to flip placement when near viewport edges.
 */
export function useRelativePosition(
  trigger: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
  placement: Ref<Placement> | Placement | (() => Placement) = 'top',
  offset = 8
) {
  const coords = ref<PositionResult>({ top: 0, left: 0, actualPlacement: 'top' })

  function getPlacement(): Placement {
    if (typeof placement === 'string') return placement
    if (typeof placement === 'function') return placement()
    return placement.value
  }

  function updatePosition() {
    if (!trigger.value || !content.value) return
    coords.value = calculatePosition(trigger.value, content.value, getPlacement(), offset)
  }

  onMounted(() => {
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  })

  return { coords, updatePosition, getPlacement }
}
