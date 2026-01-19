<script setup lang="ts">
import { computed } from 'vue'

export interface SpinnerProps {
  /** Predefined size or custom value */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string
  /** Animation speed in seconds */
  speed?: number
  /** Accessible label for screen readers */
  label?: string
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  speed: 0.9,
  label: 'Loading'
})

const sizeMap: Record<string, string> = {
  xs: 'var(--spinner-xs)',
  sm: 'var(--spinner-sm)',
  md: 'var(--spinner-md)',
  lg: 'var(--spinner-lg)',
  xl: 'var(--spinner-xl)'
}

const resolvedSize = computed(() => sizeMap[props.size] ?? props.size)
const resolvedSpeed = computed(() => `${props.speed}s`)
</script>

<template>
  <div
    class="ui-spinner"
    role="status"
    :aria-label="label"
    :style="{
      '--spinner-size': resolvedSize,
      '--spinner-speed': resolvedSpeed
    }"
  >
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <div class="ui-spinner__dot" />
    <span class="ui-spinner__sr-only">{{ label }}</span>
  </div>
</template>

<style scoped>
.ui-spinner {
  --spinner-size: 2rem;
  --spinner-speed: 0.9s;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  height: var(--spinner-size);
  width: var(--spinner-size);
}

.ui-spinner__dot {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.ui-spinner__dot::before {
  content: '';
  height: 20%;
  width: 20%;
  border-radius: 50%;
  background-color: currentColor;
  transform: scale(0);
  opacity: 0.5;
  animation: ui-spinner-pulse calc(var(--spinner-speed) * 1.111) ease-in-out infinite;
}

.ui-spinner__dot:nth-child(2) {
  transform: rotate(45deg);
}
.ui-spinner__dot:nth-child(2)::before {
  animation-delay: calc(var(--spinner-speed) * -0.875);
}

.ui-spinner__dot:nth-child(3) {
  transform: rotate(90deg);
}
.ui-spinner__dot:nth-child(3)::before {
  animation-delay: calc(var(--spinner-speed) * -0.75);
}

.ui-spinner__dot:nth-child(4) {
  transform: rotate(135deg);
}
.ui-spinner__dot:nth-child(4)::before {
  animation-delay: calc(var(--spinner-speed) * -0.625);
}

.ui-spinner__dot:nth-child(5) {
  transform: rotate(180deg);
}
.ui-spinner__dot:nth-child(5)::before {
  animation-delay: calc(var(--spinner-speed) * -0.5);
}

.ui-spinner__dot:nth-child(6) {
  transform: rotate(225deg);
}
.ui-spinner__dot:nth-child(6)::before {
  animation-delay: calc(var(--spinner-speed) * -0.375);
}

.ui-spinner__dot:nth-child(7) {
  transform: rotate(270deg);
}
.ui-spinner__dot:nth-child(7)::before {
  animation-delay: calc(var(--spinner-speed) * -0.25);
}

.ui-spinner__dot:nth-child(8) {
  transform: rotate(315deg);
}
.ui-spinner__dot:nth-child(8)::before {
  animation-delay: calc(var(--spinner-speed) * -0.125);
}

.ui-spinner__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes ui-spinner-pulse {
  0%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
