<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useId } from '../../composables'

export interface CheckboxProps {
  /** Checked state (v-model) */
  modelValue?: boolean
  /** Indeterminate state (partial selection) */
  indeterminate?: boolean
  /** Checkbox size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Visible label text */
  label?: string
  /** Description text below label */
  description?: string
  /** HTML name for form submission */
  name?: string
  /** Value attribute for form submission */
  value?: string
  /** ID for label association */
  id?: string
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const uid = useId('checkbox')
const checkboxId = computed(() => props.id || uid)

watch(
  () => props.indeterminate,
  (val) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = val
    }
  }
)

onMounted(() => {
  if (inputRef.value && props.indeterminate) {
    inputRef.value.indeterminate = true
  }
})

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}

const checkPathLength = 24
const indeterminatePathLength = 10
</script>

<template>
  <label
    class="ui-checkbox"
    :class="[
      `ui-checkbox--${size}`,
      {
        'ui-checkbox--disabled': disabled,
        'ui-checkbox--checked': modelValue,
        'ui-checkbox--indeterminate': indeterminate
      }
    ]"
  >
    <input
      ref="inputRef"
      :id="checkboxId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :name="name"
      :value="value"
      class="ui-checkbox__input"
      @change="handleChange"
    />

    <span class="ui-checkbox__box" aria-hidden="true">
      <svg
        v-if="modelValue && !indeterminate"
        class="ui-checkbox__icon ui-checkbox__check"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M3.5 8.5L6.5 11.5L12.5 4.5"
          :stroke-dasharray="checkPathLength"
          :stroke-dashoffset="0"
        />
      </svg>

      <svg
        v-else-if="indeterminate"
        class="ui-checkbox__icon ui-checkbox__indeterminate"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path
          d="M4 8H12"
          :stroke-dasharray="indeterminatePathLength"
          :stroke-dashoffset="0"
        />
      </svg>
    </span>

    <span v-if="label || description" class="ui-checkbox__content">
      <span v-if="label" class="ui-checkbox__label">{{ label }}</span>
      <span v-if="description" class="ui-checkbox__description">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
  font-family: var(--font-sans);
  -webkit-tap-highlight-color: transparent;
}

.ui-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-checkbox__input {
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

.ui-checkbox__box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--checkbox-border);
  border-radius: var(--radius-sm);
  background-color: var(--checkbox-bg);
  transition:
    background-color var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-checkbox--checked .ui-checkbox__box,
.ui-checkbox--indeterminate .ui-checkbox__box {
  background-color: var(--checkbox-checked-bg);
  border-color: var(--checkbox-checked-bg);
}

.ui-checkbox:not(.ui-checkbox--disabled):hover .ui-checkbox__box {
  border-color: var(--checkbox-border-hover);
}

.ui-checkbox--checked:not(.ui-checkbox--disabled):hover .ui-checkbox__box,
.ui-checkbox--indeterminate:not(.ui-checkbox--disabled):hover .ui-checkbox__box {
  background-color: var(--checkbox-checked-hover);
  border-color: var(--checkbox-checked-hover);
}

.ui-checkbox__input:focus-visible + .ui-checkbox__box {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-checkbox--sm .ui-checkbox__box {
  width: 1rem;
  height: 1rem;
}

.ui-checkbox--md .ui-checkbox__box {
  width: 1.25rem;
  height: 1.25rem;
}

.ui-checkbox--lg .ui-checkbox__box {
  width: 1.5rem;
  height: 1.5rem;
}

.ui-checkbox__icon {
  position: absolute;
  color: var(--checkbox-check);
}

.ui-checkbox--sm .ui-checkbox__icon {
  width: 0.75rem;
  height: 0.75rem;
}

.ui-checkbox--md .ui-checkbox__icon {
  width: 1rem;
  height: 1rem;
}

.ui-checkbox--lg .ui-checkbox__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.ui-checkbox__check path {
  stroke-dashoffset: 24;
  animation: checkbox-draw 0.2s var(--ease-out-expo) forwards;
}

@keyframes checkbox-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.ui-checkbox__indeterminate path {
  stroke-dashoffset: 10;
  animation: checkbox-dash 0.15s var(--ease-out-expo) forwards;
}

@keyframes checkbox-dash {
  to {
    stroke-dashoffset: 0;
  }
}

.ui-checkbox__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: 1px;
}

.ui-checkbox__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--checkbox-label);
  line-height: var(--leading-tight);
}

.ui-checkbox__description {
  font-size: var(--text-xs);
  color: var(--checkbox-description);
  line-height: var(--leading-normal);
}

.ui-checkbox--sm .ui-checkbox__label {
  font-size: var(--text-xs);
}

.ui-checkbox--lg .ui-checkbox__label {
  font-size: var(--text-md);
}

.ui-checkbox--lg .ui-checkbox__description {
  font-size: var(--text-sm);
}
</style>
