<script setup lang="ts">
import { computed } from 'vue'
import { useId } from '../../composables'

export interface RadioProps {
  /** Selected value (v-model) - shared across radio group */
  modelValue?: string | number | boolean
  /** Value of this radio option */
  value: string | number | boolean
  /** Radio size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Visible label text */
  label?: string
  /** Description text below label */
  description?: string
  /** HTML name for radio group (required for native behavior) */
  name?: string
  /** ID for label association */
  id?: string
}

const props = withDefaults(defineProps<RadioProps>(), {
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean): void
}>()

const uid = useId('radio')
const radioId = computed(() => props.id || uid)

const isChecked = computed(() => props.modelValue === props.value)

function handleChange() {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<template>
  <label
    class="ui-radio"
    :class="[
      `ui-radio--${size}`,
      {
        'ui-radio--disabled': disabled,
        'ui-radio--checked': isChecked
      }
    ]"
  >
    <input
      :id="radioId"
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      :value="value"
      class="ui-radio__input"
      @change="handleChange"
    />

    <span class="ui-radio__box" aria-hidden="true">
      <span v-if="isChecked" class="ui-radio__dot" />
    </span>

    <span v-if="label || description" class="ui-radio__content">
      <span v-if="label" class="ui-radio__label">{{ label }}</span>
      <span v-if="description" class="ui-radio__description">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.ui-radio {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
  font-family: var(--font-sans);
  -webkit-tap-highlight-color: transparent;
}

.ui-radio--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-radio__input {
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

.ui-radio__box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--radio-border);
  border-radius: var(--radius-full);
  background-color: var(--radio-bg);
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-radio--checked .ui-radio__box {
  border-color: var(--radio-checked);
}

.ui-radio:not(.ui-radio--disabled):hover .ui-radio__box {
  border-color: var(--radio-border-hover);
}

.ui-radio--checked:not(.ui-radio--disabled):hover .ui-radio__box {
  border-color: var(--radio-checked-hover);
}

.ui-radio__input:focus-visible + .ui-radio__box {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-radio--sm .ui-radio__box {
  width: 1rem;
  height: 1rem;
}

.ui-radio--md .ui-radio__box {
  width: 1.25rem;
  height: 1.25rem;
}

.ui-radio--lg .ui-radio__box {
  width: 1.5rem;
  height: 1.5rem;
}

.ui-radio__dot {
  position: absolute;
  border-radius: var(--radius-full);
  background-color: var(--radio-checked);
  animation: radio-scale 0.15s var(--ease-out-back) forwards;
}

.ui-radio--sm .ui-radio__dot {
  width: 0.5rem;
  height: 0.5rem;
}

.ui-radio--md .ui-radio__dot {
  width: 0.625rem;
  height: 0.625rem;
}

.ui-radio--lg .ui-radio__dot {
  width: 0.75rem;
  height: 0.75rem;
}

@keyframes radio-scale {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.ui-radio__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: 1px;
}

.ui-radio__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--radio-label);
  line-height: var(--leading-tight);
}

.ui-radio__description {
  font-size: var(--text-xs);
  color: var(--radio-description);
  line-height: var(--leading-normal);
}

.ui-radio--sm .ui-radio__label {
  font-size: var(--text-xs);
}

.ui-radio--lg .ui-radio__label {
  font-size: var(--text-md);
}

.ui-radio--lg .ui-radio__description {
  font-size: var(--text-sm);
}
</style>
