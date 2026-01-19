<script setup lang="ts">
import { computed } from 'vue'

export type ProgressVariant = 'linear' | 'circular'
export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressColor = 'primary' | 'success' | 'warning' | 'error'

export interface ProgressProps {
  /** Current progress value (0-100) */
  value?: number
  /** Display variant */
  variant?: ProgressVariant
  /** Size of the progress indicator */
  size?: ProgressSize
  /** Color theme */
  color?: ProgressColor
  /** Show indeterminate animation (unknown duration) */
  indeterminate?: boolean
  /** Show diagonal stripes (linear only) */
  striped?: boolean
  /** Animate stripes (linear only, requires striped) */
  animated?: boolean
  /** Show percentage value label */
  showValue?: boolean
  /** Accessible label describing the progress */
  label?: string
  /** Stroke width for circular variant (default auto based on size) */
  strokeWidth?: number
}

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  variant: 'linear',
  size: 'md',
  color: 'primary',
  indeterminate: false,
  striped: false,
  animated: false,
  showValue: false
})

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))

const linearClasses = computed(() => [
  'ui-progress-linear',
  `ui-progress-linear--${props.size}`,
  `ui-progress-linear--${props.color}`,
  {
    'ui-progress-linear--indeterminate': props.indeterminate,
    'ui-progress-linear--striped': props.striped && !props.indeterminate,
    'ui-progress-linear--animated': props.animated && props.striped && !props.indeterminate
  }
])

const circularClasses = computed(() => [
  'ui-progress-circular',
  `ui-progress-circular--${props.size}`,
  `ui-progress-circular--${props.color}`,
  {
    'ui-progress-circular--indeterminate': props.indeterminate
  }
])

const circularSize = computed(() => {
  const sizes = { sm: 32, md: 48, lg: 64 }
  return sizes[props.size]
})

const circularStrokeWidth = computed(() => {
  if (props.strokeWidth) return props.strokeWidth
  const widths = { sm: 3, md: 4, lg: 5 }
  return widths[props.size]
})

const circularRadius = computed(() => (circularSize.value - circularStrokeWidth.value) / 2)
const circularCircumference = computed(() => 2 * Math.PI * circularRadius.value)
const circularOffset = computed(() =>
  circularCircumference.value - (clampedValue.value / 100) * circularCircumference.value
)

const ariaAttrs = computed(() => {
  const attrs: Record<string, string | number | undefined> = {
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': props.label
  }
  if (!props.indeterminate) {
    attrs['aria-valuenow'] = clampedValue.value
  }
  return attrs
})

const indicatorStyle = computed(() => ({
  width: `${clampedValue.value}%`
}))
</script>

<template>
  <!-- Linear Progress -->
  <div
    v-if="variant === 'linear'"
    :class="linearClasses"
    v-bind="ariaAttrs"
  >
    <div class="ui-progress-linear__track">
      <div
        class="ui-progress-linear__indicator"
        :style="!indeterminate ? indicatorStyle : undefined"
      />
    </div>
    <span v-if="showValue && !indeterminate" class="ui-progress-linear__value">
      {{ clampedValue }}%
    </span>
  </div>

  <!-- Circular Progress -->
  <div
    v-else
    :class="circularClasses"
    v-bind="ariaAttrs"
  >
    <svg
      :width="circularSize"
      :height="circularSize"
      :viewBox="`0 0 ${circularSize} ${circularSize}`"
      class="ui-progress-circular__svg"
    >
      <!-- Track circle -->
      <circle
        class="ui-progress-circular__track"
        :cx="circularSize / 2"
        :cy="circularSize / 2"
        :r="circularRadius"
        fill="none"
        :stroke-width="circularStrokeWidth"
      />
      <!-- Indicator circle -->
      <circle
        class="ui-progress-circular__indicator"
        :cx="circularSize / 2"
        :cy="circularSize / 2"
        :r="circularRadius"
        fill="none"
        :stroke-width="circularStrokeWidth"
        :stroke-dasharray="circularCircumference"
        :stroke-dashoffset="indeterminate ? circularCircumference * 0.75 : circularOffset"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="showValue && !indeterminate" class="ui-progress-circular__value">
      {{ clampedValue }}%
    </span>
  </div>
</template>

<style scoped>
/* ============================================
   LINEAR PROGRESS
   ============================================ */

.ui-progress-linear {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  font-family: var(--font-sans);
}

.ui-progress-linear__track {
  flex: 1;
  background-color: var(--progress-track);
  border-radius: var(--radius-full);
  overflow: hidden;
}

/* Sizes */
.ui-progress-linear--sm .ui-progress-linear__track {
  height: 4px;
}

.ui-progress-linear--md .ui-progress-linear__track {
  height: 8px;
}

.ui-progress-linear--lg .ui-progress-linear__track {
  height: 12px;
}

/* Indicator */
.ui-progress-linear__indicator {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

/* Colors */
.ui-progress-linear--primary .ui-progress-linear__indicator {
  background-color: var(--progress-primary);
}

.ui-progress-linear--success .ui-progress-linear__indicator {
  background-color: var(--progress-success);
}

.ui-progress-linear--warning .ui-progress-linear__indicator {
  background-color: var(--progress-warning);
}

.ui-progress-linear--error .ui-progress-linear__indicator {
  background-color: var(--progress-error);
}

/* Striped pattern */
.ui-progress-linear--striped .ui-progress-linear__indicator {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* Animated stripes (barber pole effect) */
.ui-progress-linear--animated .ui-progress-linear__indicator {
  animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

/* Indeterminate animation */
.ui-progress-linear--indeterminate .ui-progress-linear__indicator {
  width: 30%;
  animation: progress-indeterminate 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

/* Value label */
.ui-progress-linear__value {
  flex-shrink: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--progress-value-text);
  min-width: 3ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ============================================
   CIRCULAR PROGRESS
   ============================================ */

.ui-progress-circular {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
}

.ui-progress-circular__svg {
  transform: rotate(-90deg);
}

/* Track circle */
.ui-progress-circular__track {
  stroke: var(--progress-track);
}

/* Indicator circle */
.ui-progress-circular__indicator {
  transition: stroke-dashoffset var(--duration-normal) var(--ease-out);
}

/* Colors */
.ui-progress-circular--primary .ui-progress-circular__indicator {
  stroke: var(--progress-primary);
}

.ui-progress-circular--success .ui-progress-circular__indicator {
  stroke: var(--progress-success);
}

.ui-progress-circular--warning .ui-progress-circular__indicator {
  stroke: var(--progress-warning);
}

.ui-progress-circular--error .ui-progress-circular__indicator {
  stroke: var(--progress-error);
}

/* Indeterminate animation (Google-style spinner) */
.ui-progress-circular--indeterminate .ui-progress-circular__svg {
  animation: progress-circular-rotate 2s linear infinite;
}

.ui-progress-circular--indeterminate .ui-progress-circular__indicator {
  animation: progress-circular-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
}

@keyframes progress-circular-rotate {
  100% {
    transform: rotate(270deg);
  }
}

@keyframes progress-circular-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}

/* Value label (centered inside circle) */
.ui-progress-circular__value {
  position: absolute;
  font-weight: var(--font-medium);
  color: var(--progress-value-text);
  font-variant-numeric: tabular-nums;
}

.ui-progress-circular--sm .ui-progress-circular__value {
  font-size: var(--text-xs);
}

.ui-progress-circular--md .ui-progress-circular__value {
  font-size: var(--text-sm);
}

.ui-progress-circular--lg .ui-progress-circular__value {
  font-size: var(--text-base);
}
</style>
