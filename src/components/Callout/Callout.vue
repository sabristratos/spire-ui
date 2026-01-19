<script setup lang="ts">
import { computed, useSlots } from 'vue'

export type CalloutVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral'

export interface CalloutProps {
  /** Visual variant determining color and icon */
  variant?: CalloutVariant
  /** Title text (alternative to #title slot) */
  title?: string
  /** Show left accent border instead of full border */
  accent?: boolean
  /** Show dismiss button */
  dismissible?: boolean
  /** Hide the default icon */
  hideIcon?: boolean
}

const props = withDefaults(defineProps<CalloutProps>(), {
  variant: 'info',
  accent: false,
  dismissible: false,
  hideIcon: false
})

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  default?(): unknown
  title?(): unknown
  icon?(): unknown
  action?(): unknown
}>()

const slots = useSlots()

const hasTitle = computed(() => !!props.title || !!slots.title)

const ariaRole = computed(() => {
  if (props.variant === 'error') return 'alert'
  return 'status'
})

const calloutClasses = computed(() => [
  'ui-callout',
  `ui-callout--${props.variant}`,
  {
    'ui-callout--accent': props.accent
  }
])
</script>

<template>
  <div
    :class="calloutClasses"
    :role="ariaRole"
  >
    <div v-if="!hideIcon" class="ui-callout__icon">
      <slot name="icon">
        <!-- Info icon -->
        <svg
          v-if="variant === 'info' || variant === 'neutral'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>

        <!-- Success icon -->
        <svg
          v-else-if="variant === 'success'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>

        <!-- Warning icon -->
        <svg
          v-else-if="variant === 'warning'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>

        <!-- Error icon -->
        <svg
          v-else-if="variant === 'error'"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6" />
          <path d="M9 9l6 6" />
        </svg>
      </slot>
    </div>

    <div class="ui-callout__content">
      <div v-if="hasTitle" class="ui-callout__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.default" class="ui-callout__body">
        <slot />
      </div>
    </div>

    <div v-if="$slots.action || dismissible" class="ui-callout__actions">
      <slot name="action" />
      <button
        v-if="dismissible"
        type="button"
        class="ui-callout__close"
        aria-label="Dismiss"
        @click="emit('close')"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.ui-callout {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
}

/* Info variant */
.ui-callout--info {
  background-color: var(--callout-info-bg, var(--status-info-bg));
  border: 1px solid var(--callout-info-border, var(--color-indigo-200));
  color: var(--callout-info-text, var(--color-indigo-900));
}

.ui-callout--info.ui-callout--accent {
  border: none;
  border-left: 4px solid var(--callout-info-accent, var(--color-indigo-500));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ui-callout--info .ui-callout__icon {
  color: var(--callout-info-icon, var(--color-indigo-500));
}

/* Success variant */
.ui-callout--success {
  background-color: var(--callout-success-bg, var(--status-success-bg));
  border: 1px solid var(--callout-success-border, var(--color-teal-200));
  color: var(--callout-success-text, var(--color-teal-900));
}

.ui-callout--success.ui-callout--accent {
  border: none;
  border-left: 4px solid var(--callout-success-accent, var(--color-teal-500));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ui-callout--success .ui-callout__icon {
  color: var(--callout-success-icon, var(--color-teal-500));
}

/* Warning variant */
.ui-callout--warning {
  background-color: var(--callout-warning-bg, var(--status-warning-bg));
  border: 1px solid var(--callout-warning-border, var(--color-amber-200));
  color: var(--callout-warning-text, var(--color-amber-900));
}

.ui-callout--warning.ui-callout--accent {
  border: none;
  border-left: 4px solid var(--callout-warning-accent, var(--color-amber-500));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ui-callout--warning .ui-callout__icon {
  color: var(--callout-warning-icon, var(--color-amber-500));
}

/* Error variant */
.ui-callout--error {
  background-color: var(--callout-error-bg, var(--status-error-bg));
  border: 1px solid var(--callout-error-border, var(--color-coral-200));
  color: var(--callout-error-text, var(--color-coral-900));
}

.ui-callout--error.ui-callout--accent {
  border: none;
  border-left: 4px solid var(--callout-error-accent, var(--color-coral-500));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ui-callout--error .ui-callout__icon {
  color: var(--callout-error-icon, var(--color-coral-500));
}

/* Neutral variant */
.ui-callout--neutral {
  background-color: var(--callout-neutral-bg, var(--color-stone-100));
  border: 1px solid var(--callout-neutral-border, var(--color-stone-200));
  color: var(--callout-neutral-text, var(--color-stone-900));
}

.ui-callout--neutral.ui-callout--accent {
  border: none;
  border-left: 4px solid var(--callout-neutral-accent, var(--color-stone-400));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ui-callout--neutral .ui-callout__icon {
  color: var(--callout-neutral-icon, var(--color-stone-500));
}

/* Icon - pinned to top */
.ui-callout__icon {
  flex-shrink: 0;
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Content */
.ui-callout__content {
  flex: 1;
  min-width: 0;
}

.ui-callout__title {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  line-height: var(--leading-tight);
}

.ui-callout__body {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  margin-top: var(--space-1);
}

.ui-callout__title + .ui-callout__body {
  margin-top: var(--space-1);
}

/* Actions */
.ui-callout__actions {
  flex-shrink: 0;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ui-callout__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--duration-fast) var(--ease-default);
}

.ui-callout__close:hover {
  opacity: 1;
}

.ui-callout__close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  opacity: 1;
}

/* Links inside callout body */
.ui-callout__body :deep(a) {
  font-weight: var(--font-medium);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ui-callout__body :deep(a:hover) {
  text-decoration-thickness: 2px;
}
</style>
