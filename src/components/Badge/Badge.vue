<script setup lang="ts">
import { computed, useSlots } from 'vue'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  /** Color variant */
  variant?: BadgeVariant
  /** Render as dot indicator instead of pill */
  dot?: boolean
  /** Add pulse animation (dot mode only) */
  pulse?: boolean
  /** Numeric value for count badges */
  value?: number
  /** Max value before showing "+" (default: 99) */
  max?: number
  /** Accessible label (required for numeric badges) */
  label?: string
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  max: 99
})

const slots = useSlots()

const isDot = computed(() => props.dot || (!slots.default && props.value === undefined))

const displayText = computed(() => {
  if (props.value === undefined) return null
  return props.value > props.max ? `${props.max}+` : String(props.value)
})

const ariaLabel = computed(() => {
  if (props.label) return props.label
  if (props.value !== undefined) return String(props.value)
  return undefined
})

const classes = computed(() => [
  'ui-badge',
  `ui-badge--${props.variant}`,
  {
    'ui-badge--dot': isDot.value,
    'ui-badge--pulse': props.pulse && isDot.value
  }
])
</script>

<template>
  <span :class="classes" :aria-label="ariaLabel" role="status">
    <template v-if="!isDot">
      <slot>{{ displayText }}</slot>
    </template>
  </span>
</template>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  font-variant-numeric: tabular-nums;
  border-radius: 9999px;
  padding: 0.25em 0.625em;
  border: 1px solid transparent;
}

.ui-badge--dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: none;
}

.ui-badge--pulse {
  animation: ui-badge-pulse 2s ease-in-out infinite;
}

@keyframes ui-badge-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 0 4px currentColor;
    opacity: 0.6;
  }
}

.ui-badge--default {
  background-color: var(--badge-default-bg);
  color: var(--badge-default-text);
  border-color: var(--badge-default-border);
}

.ui-badge--success {
  background-color: var(--badge-success-bg);
  color: var(--badge-success-text);
  border-color: var(--badge-success-border);
}

.ui-badge--warning {
  background-color: var(--badge-warning-bg);
  color: var(--badge-warning-text);
  border-color: var(--badge-warning-border);
}

.ui-badge--danger {
  background-color: var(--badge-danger-bg);
  color: var(--badge-danger-text);
  border-color: var(--badge-danger-border);
}

.ui-badge--info {
  background-color: var(--badge-info-bg);
  color: var(--badge-info-text);
  border-color: var(--badge-info-border);
}

.ui-badge--dot.ui-badge--default { background-color: var(--badge-default-text); }
.ui-badge--dot.ui-badge--success { background-color: var(--badge-success-text); }
.ui-badge--dot.ui-badge--warning { background-color: var(--badge-warning-text); }
.ui-badge--dot.ui-badge--danger { background-color: var(--badge-danger-text); }
.ui-badge--dot.ui-badge--info { background-color: var(--badge-info-text); }
</style>
