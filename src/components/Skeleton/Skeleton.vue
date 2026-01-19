<script setup lang="ts">
import { computed } from 'vue'

export type SkeletonVariant = 'text' | 'circle' | 'rect'

export interface SkeletonProps {
  /** Shape variant */
  variant?: SkeletonVariant
  /** Width (px, %, or CSS value) */
  width?: string | number
  /** Height (px or CSS value) */
  height?: string | number
  /** Animation style */
  animation?: 'shimmer' | 'pulse' | 'none'
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  animation: 'shimmer'
})

const normalizeSize = (value: string | number | undefined): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'number') return `${value}px`
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`
  return value
}

const style = computed(() => ({
  width: normalizeSize(props.width),
  height: normalizeSize(props.height)
}))
</script>

<template>
  <span
    class="ui-skeleton"
    :class="[
      `ui-skeleton--${variant}`,
      `ui-skeleton--${animation}`
    ]"
    :style="style"
    aria-hidden="true"
  />
</template>

<style scoped>
.ui-skeleton {
  display: block;
  background-color: var(--skeleton-base);
  border-radius: var(--radius-sm);
}

.ui-skeleton--text {
  height: 1em;
  border-radius: var(--radius-sm);
}

.ui-skeleton--circle {
  border-radius: 50%;
  aspect-ratio: 1;
}

.ui-skeleton--rect {
  border-radius: var(--radius-md);
}

.ui-skeleton--shimmer {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.ui-skeleton--pulse {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.ui-skeleton--none {
  animation: none;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
