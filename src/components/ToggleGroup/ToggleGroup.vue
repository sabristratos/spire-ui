<script setup lang="ts">
import { provide, computed, toRef } from 'vue'

export interface ToggleGroupProps {
  /** Selected value(s) - single value for 'single' type, array for 'multiple' */
  modelValue?: string | number | (string | number)[]
  /** Selection type */
  type?: 'single' | 'multiple'
  /** Size for all buttons in group */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state for all buttons */
  disabled?: boolean
  /** Accessible label for the group */
  label?: string
  /** Orientation for keyboard navigation */
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  type: 'single',
  size: 'md',
  disabled: false,
  orientation: 'horizontal'
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

provide('toggleGroup', {
  modelValue: toRef(props, 'modelValue'),
  toggle,
  type: props.type,
  size: props.size,
  disabled: props.disabled
})

const role = computed(() => props.type === 'single' ? 'radiogroup' : 'group')
</script>

<template>
  <div
    :role="role"
    :aria-label="label"
    :aria-orientation="orientation"
    :aria-disabled="disabled || undefined"
    class="ui-toggle-group"
    :class="[
      `ui-toggle-group--${orientation}`,
      { 'ui-toggle-group--disabled': disabled }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-toggle-group {
  display: inline-flex;
  gap: 0;
}

.ui-toggle-group--horizontal {
  flex-direction: row;
}

.ui-toggle-group--vertical {
  flex-direction: column;
}

.ui-toggle-group--horizontal :slotted(.ui-toggle-button) {
  border-radius: 0;
}

.ui-toggle-group--horizontal :slotted(.ui-toggle-button:first-child) {
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

.ui-toggle-group--horizontal :slotted(.ui-toggle-button:last-child) {
  border-top-right-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.ui-toggle-group--horizontal :slotted(.ui-toggle-button:not(:first-child)) {
  margin-left: -1px;
}

.ui-toggle-group--vertical :slotted(.ui-toggle-button) {
  border-radius: 0;
}

.ui-toggle-group--vertical :slotted(.ui-toggle-button:first-child) {
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}

.ui-toggle-group--vertical :slotted(.ui-toggle-button:last-child) {
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.ui-toggle-group--vertical :slotted(.ui-toggle-button:not(:first-child)) {
  margin-top: -1px;
}

.ui-toggle-group :slotted(.ui-toggle-button--pressed) {
  z-index: 1;
}

.ui-toggle-group--disabled {
  opacity: 0.5;
}
</style>
