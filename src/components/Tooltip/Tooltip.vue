<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useId, useRelativePosition, calculatePosition, type Placement } from '../../composables'

export interface TooltipProps {
  /** Tooltip text content */
  text: string
  /** Preferred placement (may flip on collision) */
  placement?: Placement
  /** Delay before showing (ms) - prevents flicker on rapid mouseover */
  delay?: number
  /** Gap between trigger and tooltip */
  offset?: number
  /** Disable the tooltip */
  disabled?: boolean
}

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  delay: 200,
  offset: 8,
  disabled: false
})

const tooltipId = useId('tooltip')

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const { coords, updatePosition, getPlacement } = useRelativePosition(
  triggerRef,
  contentRef,
  () => props.placement,
  props.offset
)

function onEnter(el: Element) {
  if (!triggerRef.value) return
  const result = calculatePosition(
    triggerRef.value,
    el as HTMLElement,
    getPlacement(),
    props.offset
  )
  coords.value = result
}

const tooltipStyle = computed(() => ({
  top: `${coords.value.top}px`,
  left: `${coords.value.left}px`
}))

const arrowClass = computed(() => `ui-tooltip__arrow--${coords.value.actualPlacement}`)

function show() {
  if (props.disabled) return

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  if (showTimer) clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function hide() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }

  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, 50)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isVisible.value) {
    hide()
  }
}

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <span
    ref="triggerRef"
    class="ui-tooltip-trigger"
    :aria-describedby="isVisible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown="onKeydown"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition :name="`ui-tooltip-${coords.actualPlacement}`" @enter="onEnter">
      <div
        v-if="isVisible && !disabled"
        :id="tooltipId"
        ref="contentRef"
        role="tooltip"
        class="ui-tooltip"
        :style="tooltipStyle"
      >
        {{ text }}
        <span class="ui-tooltip__arrow" :class="arrowClass" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ui-tooltip-trigger {
  display: inline-block;
}

.ui-tooltip {
  position: fixed;
  z-index: var(--z-tooltip);
  max-width: 250px;
  padding: var(--space-1) var(--space-2);
  background-color: var(--tooltip-bg);
  color: var(--tooltip-text);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.4;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  pointer-events: none;
  white-space: normal;
  word-wrap: break-word;
}

.ui-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--tooltip-bg);
  transform: rotate(45deg);
}

.ui-tooltip__arrow--top {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.ui-tooltip__arrow--bottom {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.ui-tooltip__arrow--left {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}

.ui-tooltip__arrow--right {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}

.ui-tooltip-top-enter-active,
.ui-tooltip-top-leave-active,
.ui-tooltip-bottom-enter-active,
.ui-tooltip-bottom-leave-active,
.ui-tooltip-left-enter-active,
.ui-tooltip-left-leave-active,
.ui-tooltip-right-enter-active,
.ui-tooltip-right-leave-active {
  transition:
    opacity var(--duration-fast) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo);
  will-change: transform, opacity;
}

.ui-tooltip-top-enter-from,
.ui-tooltip-top-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.96);
}

.ui-tooltip-bottom-enter-from,
.ui-tooltip-bottom-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}

.ui-tooltip-left-enter-from,
.ui-tooltip-left-leave-to {
  opacity: 0;
  transform: translateX(4px) scale(0.96);
}

.ui-tooltip-right-enter-from,
.ui-tooltip-right-leave-to {
  opacity: 0;
  transform: translateX(-4px) scale(0.96);
}
</style>
