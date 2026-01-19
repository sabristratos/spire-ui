<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { IconInput } from '../Icon/Icon.vue'

export interface ToggleButtonProps {
  /** Pressed state for standalone usage (v-model) */
  modelValue?: boolean
  /** Value for group usage */
  value?: string | number
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Icon to display */
  icon?: IconInput
  /** Accessible label (required when icon-only) */
  label?: string
}

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const groupContext = inject<{
  modelValue: { value: (string | number)[] | string | number | undefined }
  toggle: (value: string | number) => void
  type: 'single' | 'multiple'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
} | null>('toggleGroup', null)

const isInGroup = computed(() => groupContext !== null && props.value !== undefined)

const effectiveSize = computed(() => groupContext?.size || props.size)

const effectiveDisabled = computed(() => props.disabled || groupContext?.disabled)

const isPressed = computed(() => {
  if (isInGroup.value && groupContext && props.value !== undefined) {
    const groupValue = groupContext.modelValue.value
    if (Array.isArray(groupValue)) {
      return groupValue.includes(props.value)
    }
    return groupValue === props.value
  }
  return props.modelValue ?? false
})

function handleClick() {
  if (effectiveDisabled.value) return

  if (isInGroup.value && groupContext && props.value !== undefined) {
    groupContext.toggle(props.value)
  } else {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}

const isIconOnly = computed(() => props.icon && !props.label)
</script>

<template>
  <button
    type="button"
    :aria-pressed="isPressed"
    :aria-label="isIconOnly ? label : undefined"
    :disabled="effectiveDisabled"
    class="ui-toggle-button"
    :class="[
      `ui-toggle-button--${effectiveSize}`,
      {
        'ui-toggle-button--pressed': isPressed,
        'ui-toggle-button--disabled': effectiveDisabled,
        'ui-toggle-button--icon-only': isIconOnly
      }
    ]"
    @click="handleClick"
  >
    <Icon v-if="icon" :icon="icon" class="ui-toggle-button__icon" />
    <span v-if="label && !isIconOnly" class="ui-toggle-button__label">{{ label }}</span>
    <slot v-if="!icon && !label" />
  </button>
</template>

<style scoped>
.ui-toggle-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1-5);
  border: 1px solid var(--toggle-border);
  border-radius: var(--radius-md);
  background: var(--toggle-bg);
  color: var(--toggle-text);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
  -webkit-tap-highlight-color: transparent;
}

.ui-toggle-button:not(.ui-toggle-button--disabled):hover {
  background: var(--toggle-bg-hover);
  border-color: var(--toggle-border-hover);
}

.ui-toggle-button--pressed {
  background: var(--toggle-bg-pressed);
  border-color: var(--toggle-border-pressed);
  color: var(--toggle-text-pressed);
  box-shadow: inset 0 2px 4px var(--toggle-inset-shadow);
}

.ui-toggle-button--pressed:not(.ui-toggle-button--disabled):hover {
  background: var(--toggle-bg-pressed-hover);
}

.ui-toggle-button:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-toggle-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-toggle-button--sm {
  height: 32px;
  padding: 0 var(--space-2-5);
  font-size: var(--text-xs);
}

.ui-toggle-button--sm.ui-toggle-button--icon-only {
  width: 32px;
  padding: 0;
}

.ui-toggle-button--sm .ui-toggle-button__icon {
  width: 1rem;
  height: 1rem;
}

.ui-toggle-button--md {
  height: 36px;
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
}

.ui-toggle-button--md.ui-toggle-button--icon-only {
  width: 36px;
  padding: 0;
}

.ui-toggle-button--md .ui-toggle-button__icon {
  width: 1.125rem;
  height: 1.125rem;
}

.ui-toggle-button--lg {
  height: 44px;
  padding: 0 var(--space-4);
  font-size: var(--text-md);
}

.ui-toggle-button--lg.ui-toggle-button--icon-only {
  width: 44px;
  padding: 0;
}

.ui-toggle-button--lg .ui-toggle-button__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.ui-toggle-button__icon {
  flex-shrink: 0;
}

.ui-toggle-button__label {
  white-space: nowrap;
}
</style>
