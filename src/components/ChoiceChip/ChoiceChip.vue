<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { IconInput } from '../Icon/Icon.vue'
import { useId } from '../../composables'

export interface ChoiceChipProps {
  /** Selected state for standalone usage (v-model) */
  modelValue?: boolean
  /** Value for group usage */
  value?: string | number
  /** Chip label text */
  label: string
  /** Optional leading icon */
  icon?: IconInput
  /** Disabled state */
  disabled?: boolean
}

const props = withDefaults(defineProps<ChoiceChipProps>(), {
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
  disabled?: boolean
} | null>('choiceChipGroup', null)

const isInGroup = computed(() => groupContext !== null && props.value !== undefined)

const effectiveDisabled = computed(() => props.disabled || groupContext?.disabled)

const isSelected = computed(() => {
  if (isInGroup.value && groupContext && props.value !== undefined) {
    const groupValue = groupContext.modelValue.value
    if (Array.isArray(groupValue)) {
      return groupValue.includes(props.value)
    }
    return groupValue === props.value
  }
  return props.modelValue ?? false
})

const chipId = useId('chip')

function handleChange() {
  if (effectiveDisabled.value) return

  if (isInGroup.value && groupContext && props.value !== undefined) {
    groupContext.toggle(props.value)
  } else {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>

<template>
  <label
    class="ui-choice-chip"
    :class="{
      'ui-choice-chip--selected': isSelected,
      'ui-choice-chip--disabled': effectiveDisabled
    }"
  >
    <input
      :id="chipId"
      type="checkbox"
      :checked="isSelected"
      :disabled="effectiveDisabled"
      class="ui-choice-chip__input"
      @change="handleChange"
    />

    <span class="ui-choice-chip__check" aria-hidden="true">
      <svg
        class="ui-choice-chip__check-icon"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3.5 8.5L6.5 11L12.5 5" />
      </svg>
    </span>

    <Icon v-if="icon" :icon="icon" class="ui-choice-chip__icon" />

    <span class="ui-choice-chip__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.ui-choice-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 32px;
  padding: 0 var(--space-3);
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--chip-text);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
  -webkit-tap-highlight-color: transparent;
}

.ui-choice-chip__input {
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

.ui-choice-chip:not(.ui-choice-chip--disabled):hover {
  background: var(--chip-bg-hover);
  border-color: var(--chip-border-hover);
}

.ui-choice-chip:not(.ui-choice-chip--disabled):active {
  background: var(--chip-bg-active);
  border-color: var(--chip-border-active);
}

.ui-choice-chip--selected {
  background: var(--chip-bg-selected);
  border-color: var(--chip-border-selected);
  color: var(--chip-text-selected);
}

.ui-choice-chip--selected:not(.ui-choice-chip--disabled):hover {
  background: var(--chip-bg-selected-hover);
  border-color: var(--chip-border-selected-hover);
}

.ui-choice-chip--selected:not(.ui-choice-chip--disabled):active {
  background: var(--chip-bg-selected-active);
  border-color: var(--chip-border-selected-active);
}

.ui-choice-chip__input:focus-visible + .ui-choice-chip__check {
}

.ui-choice-chip:has(.ui-choice-chip__input:focus-visible) {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-choice-chip--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-choice-chip__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0;
  margin-right: calc(-1 * var(--space-2));
  overflow: hidden;
  transition:
    width var(--duration-fast) var(--ease-out-expo),
    margin var(--duration-fast) var(--ease-out-expo);
}

.ui-choice-chip--selected .ui-choice-chip__check {
  width: 1rem;
  margin-right: 0;
}

.ui-choice-chip__check-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-out-back);
}

.ui-choice-chip--selected .ui-choice-chip__check-icon {
  opacity: 1;
  transform: scale(1);
}

.ui-choice-chip__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.ui-choice-chip__label {
  white-space: nowrap;
}
</style>
