<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import { useId, useScrollLock } from '../../composables'

export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export interface PopoverProps {
  /** Popover placement relative to trigger */
  placement?: PopoverPlacement
  /** Offset from trigger (px) */
  offset?: number
  /** Show arrow pointing to trigger */
  arrow?: boolean
  /** Disable the popover */
  disabled?: boolean
  /** Width of the popover ('auto' or px value) */
  width?: 'auto' | number
  /** Close on Escape key */
  closeOnEscape?: boolean
  /** Close when clicking outside */
  closeOnClickOutside?: boolean
  /** Lock body scroll when open */
  lockScroll?: boolean
  /** Trap focus inside popover */
  trapFocus?: boolean
}

const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'bottom',
  offset: 8,
  arrow: false,
  disabled: false,
  width: 'auto',
  closeOnEscape: true,
  closeOnClickOutside: true,
  lockScroll: false,
  trapFocus: true
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

const triggerId = useId('popover-trigger')
const popoverId = useId('popover-content')

const shouldLockScroll = computed(() => props.lockScroll && isOpen.value)
useScrollLock(shouldLockScroll)

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function trapFocus(e: KeyboardEvent) {
  if (!props.trapFocus || !popoverRef.value) return
  if (e.key !== 'Tab') return

  const elements = popoverRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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

function focusFirstElement() {
  if (!props.trapFocus || !popoverRef.value) return
  const first = popoverRef.value.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
  first?.focus()
}

const positionStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})
const actualPlacement = ref<PopoverPlacement>(props.placement)

function open() {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  emit('open')
  nextTick(() => {
    updatePosition()
    if (props.trapFocus) {
      requestAnimationFrame(() => {
        focusFirstElement()
        window.addEventListener('keydown', trapFocus)
      })
    }
  })
}

function close() {
  if (!isOpen.value) return
  isOpen.value = false
  window.removeEventListener('keydown', trapFocus)
  emit('close')
  nextTick(() => {
    const trigger = triggerRef.value?.querySelector('button, [tabindex]') as HTMLElement
    trigger?.focus()
  })
}

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function updatePosition() {
  if (!triggerRef.value || !popoverRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const arrowSize = props.arrow ? 8 : 0

  let placement = props.placement
  let top: number
  let left: number

  const spaceAbove = triggerRect.top
  const spaceBelow = viewport.height - triggerRect.bottom
  const spaceLeft = triggerRect.left
  const spaceRight = viewport.width - triggerRect.right

  if (placement.startsWith('top') && spaceAbove < popoverRect.height + props.offset && spaceBelow > spaceAbove) {
    placement = placement.replace('top', 'bottom') as PopoverPlacement
  } else if (placement.startsWith('bottom') && spaceBelow < popoverRect.height + props.offset && spaceAbove > spaceBelow) {
    placement = placement.replace('bottom', 'top') as PopoverPlacement
  } else if (placement.startsWith('left') && spaceLeft < popoverRect.width + props.offset && spaceRight > spaceLeft) {
    placement = placement.replace('left', 'right') as PopoverPlacement
  } else if (placement.startsWith('right') && spaceRight < popoverRect.width + props.offset && spaceLeft > spaceRight) {
    placement = placement.replace('right', 'left') as PopoverPlacement
  }

  actualPlacement.value = placement

  const totalOffset = props.offset + arrowSize

  if (placement.startsWith('top')) {
    top = triggerRect.top - popoverRect.height - totalOffset
  } else if (placement.startsWith('bottom')) {
    top = triggerRect.bottom + totalOffset
  } else if (placement.startsWith('left')) {
    left = triggerRect.left - popoverRect.width - totalOffset
  } else {
    left = triggerRect.right + totalOffset
  }

  if (placement.startsWith('top') || placement.startsWith('bottom')) {
    if (placement.endsWith('start')) {
      left = triggerRect.left
    } else if (placement.endsWith('end')) {
      left = triggerRect.right - popoverRect.width
    } else {
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
    }
  } else {
    if (placement.endsWith('start')) {
      top = triggerRect.top
    } else if (placement.endsWith('end')) {
      top = triggerRect.bottom - popoverRect.height
    } else {
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
    }
  }

  left = Math.max(8, Math.min(left!, viewport.width - popoverRect.width - 8))
  top = Math.max(8, Math.min(top!, viewport.height - popoverRect.height - 8))

  positionStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }

  if (props.arrow) {
    updateArrowPosition(triggerRect, popoverRect, placement, top, left)
  }
}

function updateArrowPosition(
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopoverPlacement,
  popoverTop: number,
  popoverLeft: number
) {
  const arrowSize = 12
  const arrowOffset = arrowSize / 2
  const minEdgeDistance = 12
  const arrowPos: Record<string, string> = {}

  if (placement.startsWith('top') || placement.startsWith('bottom')) {
    const triggerCenterX = triggerRect.left + triggerRect.width / 2
    let arrowLeft = triggerCenterX - popoverLeft - arrowOffset

    arrowLeft = Math.max(minEdgeDistance, Math.min(arrowLeft, popoverRect.width - minEdgeDistance - arrowSize))

    arrowPos.left = `${arrowLeft}px`

    if (placement.startsWith('top')) {
      arrowPos.bottom = `-${arrowOffset}px`
    } else {
      arrowPos.top = `-${arrowOffset}px`
    }
  } else {
    const triggerCenterY = triggerRect.top + triggerRect.height / 2
    let arrowTop = triggerCenterY - popoverTop - arrowOffset

    arrowTop = Math.max(minEdgeDistance, Math.min(arrowTop, popoverRect.height - minEdgeDistance - arrowSize))

    arrowPos.top = `${arrowTop}px`

    if (placement.startsWith('left')) {
      arrowPos.right = `-${arrowOffset}px`
    } else {
      arrowPos.left = `-${arrowOffset}px`
    }
  }

  arrowStyle.value = arrowPos
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    event.stopPropagation()
    close()
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!props.closeOnClickOutside) return

  const target = event.target as Node
  if (
    !triggerRef.value?.contains(target) &&
    !popoverRef.value?.contains(target)
  ) {
    close()
  }
}

const popoverStyle = computed(() => {
  const style: Record<string, string> = { ...positionStyle.value }

  if (typeof props.width === 'number') {
    style.width = `${props.width}px`
  }

  return style
})

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('keydown', trapFocus)
})

defineExpose({
  open,
  close,
  toggle,
  isOpen
})
</script>

<template>
  <div class="ui-popover">
    <div
      ref="triggerRef"
      class="ui-popover__trigger"
      :id="triggerId"
      :aria-haspopup="'dialog'"
      :aria-expanded="isOpen"
      :aria-controls="popoverId"
      @click="toggle"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle" :close="close" />
    </div>

    <Teleport to="body">
      <Transition name="ui-popover">
        <div
          v-if="isOpen"
          ref="popoverRef"
          class="ui-popover__content"
          :class="[`ui-popover__content--${actualPlacement}`]"
          :id="popoverId"
          role="dialog"
          :aria-labelledby="triggerId"
          :aria-modal="trapFocus"
          :style="popoverStyle"
          @keydown="handleKeydown"
        >
          <div
            v-if="arrow"
            class="ui-popover__arrow"
            :style="arrowStyle"
          />
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ui-popover {
  display: inline-block;
  position: relative;
}

.ui-popover__trigger {
  display: inline-flex;
}

.ui-popover__content {
  position: fixed;
  z-index: var(--z-popover, 60);
  min-width: 200px;
  padding: var(--space-4);
  background: var(--popover-bg, var(--dropdown-bg));
  border: 1px solid var(--popover-border, var(--dropdown-border));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  outline: none;
  font-family: var(--font-sans);
}

.ui-popover__arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--popover-bg, var(--dropdown-bg));
  transform: rotate(45deg);
  z-index: -1;
}

/* Bottom placement: arrow at top, pointing up - show top-left borders */
.ui-popover__content--bottom .ui-popover__arrow,
.ui-popover__content--bottom-start .ui-popover__arrow,
.ui-popover__content--bottom-end .ui-popover__arrow {
  border-top: 1px solid var(--popover-border, var(--dropdown-border));
  border-left: 1px solid var(--popover-border, var(--dropdown-border));
  border-bottom: none;
  border-right: none;
}

/* Top placement: arrow at bottom, pointing down - show bottom-right borders */
.ui-popover__content--top .ui-popover__arrow,
.ui-popover__content--top-start .ui-popover__arrow,
.ui-popover__content--top-end .ui-popover__arrow {
  border-bottom: 1px solid var(--popover-border, var(--dropdown-border));
  border-right: 1px solid var(--popover-border, var(--dropdown-border));
  border-top: none;
  border-left: none;
}

/* Left placement: arrow at right, pointing right - show top-right borders */
.ui-popover__content--left .ui-popover__arrow,
.ui-popover__content--left-start .ui-popover__arrow,
.ui-popover__content--left-end .ui-popover__arrow {
  border-top: 1px solid var(--popover-border, var(--dropdown-border));
  border-right: 1px solid var(--popover-border, var(--dropdown-border));
  border-bottom: none;
  border-left: none;
}

/* Right placement: arrow at left, pointing left - show bottom-left borders */
.ui-popover__content--right .ui-popover__arrow,
.ui-popover__content--right-start .ui-popover__arrow,
.ui-popover__content--right-end .ui-popover__arrow {
  border-bottom: 1px solid var(--popover-border, var(--dropdown-border));
  border-left: 1px solid var(--popover-border, var(--dropdown-border));
  border-top: none;
  border-right: none;
}

/* Hide arrow on mobile - popovers become bottom sheets */
@media (max-width: 640px) {
  .ui-popover__arrow {
    display: none;
  }
}

.ui-popover-enter-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-popover-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-popover-enter-from,
.ui-popover-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
