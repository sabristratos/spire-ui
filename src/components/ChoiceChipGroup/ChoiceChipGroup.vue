<script setup lang="ts">
import { provide, toRef } from 'vue'

export interface ChoiceChipGroupProps {
  /** Selected value(s) - single value for 'single' type, array for 'multiple' */
  modelValue?: string | number | (string | number)[]
  /** Selection type */
  type?: 'single' | 'multiple'
  /** Disabled state for all chips */
  disabled?: boolean
  /** Accessible label for the group */
  label?: string
}

const props = withDefaults(defineProps<ChoiceChipGroupProps>(), {
  type: 'multiple',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[] | undefined): void
  (e: 'change', value: string | number | (string | number)[] | undefined): void
}>()

function toggle(value: string | number) {
  if (props.type === 'single') {
    const newValue = props.modelValue === value ? undefined : value
    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    const currentArray = Array.isArray(props.modelValue) ? props.modelValue : []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    emit('update:modelValue', newArray)
    emit('change', newArray)
  }
}

provide('choiceChipGroup', {
  modelValue: toRef(props, 'modelValue'),
  toggle,
  type: props.type,
  disabled: props.disabled
})
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    class="ui-choice-chip-group"
    :class="{ 'ui-choice-chip-group--disabled': disabled }"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-choice-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.ui-choice-chip-group--disabled {
  opacity: 0.5;
}
</style>
