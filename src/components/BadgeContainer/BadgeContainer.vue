<script setup lang="ts">
import { computed } from 'vue'

type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface BadgeContainerProps {
  /** Badge position relative to content */
  position?: BadgePosition
  /** Horizontal offset adjustment (CSS value) */
  offsetX?: string
  /** Vertical offset adjustment (CSS value) */
  offsetY?: string
  /** Show cutout border matching background */
  cutout?: boolean
}

const props = withDefaults(defineProps<BadgeContainerProps>(), {
  position: 'top-right',
  offsetX: '0px',
  offsetY: '0px',
  cutout: false
})

const badgeStyle = computed(() => {
  const positions: Record<BadgePosition, Record<string, string>> = {
    'top-right': {
      top: '0',
      right: '0',
      transform: `translate(calc(50% + ${props.offsetX}), calc(-50% + ${props.offsetY}))`
    },
    'top-left': {
      top: '0',
      left: '0',
      transform: `translate(calc(-50% + ${props.offsetX}), calc(-50% + ${props.offsetY}))`
    },
    'bottom-right': {
      bottom: '0',
      right: '0',
      transform: `translate(calc(50% + ${props.offsetX}), calc(50% + ${props.offsetY}))`
    },
    'bottom-left': {
      bottom: '0',
      left: '0',
      transform: `translate(calc(-50% + ${props.offsetX}), calc(50% + ${props.offsetY}))`
    }
  }
  return positions[props.position]
})

const badgeClasses = computed(() => [
  'ui-badge-container__badge',
  { 'ui-badge-container__badge--cutout': props.cutout }
])
</script>

<template>
  <span class="ui-badge-container">
    <!-- Content (Button, Avatar, etc.) -->
    <slot />

    <!-- Badge overlay -->
    <span v-if="$slots.badge" :class="badgeClasses" :style="badgeStyle">
      <slot name="badge" />
    </span>
  </span>
</template>

<style scoped>
.ui-badge-container {
  display: inline-flex;
  position: relative;
  vertical-align: middle;
}

.ui-badge-container__badge {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  line-height: 0;
}

/* Cutout effect - creates visual separation from content */
.ui-badge-container__badge--cutout :deep(.ui-badge) {
  box-shadow: 0 0 0 2px var(--bg-primary);
}

.ui-badge-container__badge--cutout :deep(.ui-badge--dot) {
  box-shadow: 0 0 0 2px var(--bg-primary);
}
</style>
