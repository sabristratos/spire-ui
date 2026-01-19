<script setup lang="ts">
import { computed } from 'vue'
import Spinner from '../Spinner/Spinner.vue'
import { useId } from '../../composables'

export interface SwitchProps {
  /** Checked state (v-model) */
  modelValue?: boolean
  /** Switch size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Loading state - shows spinner in thumb */
  loading?: boolean
  /** Accessible label (required for a11y if no visible label) */
  label?: string
  /** HTML name for form submission */
  name?: string
  /** ID for label association */
  id?: string
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  size: 'md',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const uid = useId('switch')
const switchId = computed(() => props.id || uid)

const isDisabled = computed(() => props.disabled || props.loading)

function toggle() {
  if (isDisabled.value) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}

const spinnerSizeMap: Record<string, string> = {
  sm: '0.625rem',
  md: '0.75rem',
  lg: '0.875rem'
}
const spinnerSize = computed(() => spinnerSizeMap[props.size])
</script>

<template>
  <button
    :id="switchId"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="isDisabled"
    class="ui-switch"
    :class="[
      `ui-switch--${size}`,
      {
        'ui-switch--checked': modelValue,
        'ui-switch--disabled': isDisabled,
        'ui-switch--loading': loading
      }
    ]"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <span class="ui-switch__track" aria-hidden="true">
      <span class="ui-switch__thumb">
        <Spinner
          v-if="loading"
          :size="spinnerSize"
          class="ui-switch__spinner"
        />
      </span>
    </span>

    <input
      v-if="name"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      class="ui-switch__input"
      tabindex="-1"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.ui-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  vertical-align: middle;
  -webkit-tap-highlight-color: transparent;
}

.ui-switch::after {
  content: '';
  position: absolute;
  top: -8px;
  bottom: -8px;
  left: -8px;
  right: -8px;
}

.ui-switch__track {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: var(--radius-full);
  background-color: var(--switch-track-off);
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-switch--checked .ui-switch__track {
  background-color: var(--switch-track-on);
}

.ui-switch--disabled .ui-switch__track {
  opacity: 0.5;
}

.ui-switch__thumb {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--switch-thumb);
  box-shadow:
    0 1px 3px 0 oklch(0 0 0 / 0.1),
    0 1px 2px -1px oklch(0 0 0 / 0.1);
  transition: transform var(--duration-normal) var(--ease-out-back);
  will-change: transform;
}

.ui-switch--sm .ui-switch__track {
  width: 2rem;
  height: 1.125rem;
}

.ui-switch--sm .ui-switch__thumb {
  width: 0.875rem;
  height: 0.875rem;
  left: 2px;
  transform: translateX(0);
}

.ui-switch--sm.ui-switch--checked .ui-switch__thumb {
  transform: translateX(0.875rem);
}

.ui-switch--md .ui-switch__track {
  width: 2.5rem;
  height: 1.375rem;
}

.ui-switch--md .ui-switch__thumb {
  width: 1.125rem;
  height: 1.125rem;
  left: 2px;
  transform: translateX(0);
}

.ui-switch--md.ui-switch--checked .ui-switch__thumb {
  transform: translateX(1.125rem);
}

.ui-switch--lg .ui-switch__track {
  width: 3rem;
  height: 1.625rem;
}

.ui-switch--lg .ui-switch__thumb {
  width: 1.375rem;
  height: 1.375rem;
  left: 2px;
  transform: translateX(0);
}

.ui-switch--lg.ui-switch--checked .ui-switch__thumb {
  transform: translateX(1.375rem);
}

.ui-switch--disabled {
  cursor: not-allowed;
}

.ui-switch--loading {
  cursor: wait;
}

.ui-switch:focus-visible .ui-switch__track {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-switch__spinner {
  color: var(--switch-spinner);
}

.ui-switch__input {
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
</style>
