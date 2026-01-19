<script setup lang="ts">
import { computed, useSlots, type InputHTMLAttributes } from 'vue'
import Icon from '../Icon/Icon.vue'
import Spinner from '../Spinner/Spinner.vue'
import type { IconInput } from '../Icon/Icon.vue'
import { useId } from '../../composables'

export interface InputProps {
  /** Input value (v-model) */
  modelValue?: string | number
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'
  /** Label text above the input */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Helper text below input */
  hint?: string
  /** Error message (also sets error state) */
  error?: string
  /** Input size - matches Button heights */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Disabled state */
  disabled?: boolean
  /** Read-only state */
  readonly?: boolean
  /** Loading state - shows spinner */
  loading?: boolean
  /** Required field */
  required?: boolean
  /** Icon on the left side */
  iconLeft?: IconInput
  /** Icon on the right side */
  iconRight?: IconInput
  /** HTML id attribute (auto-generated if not provided) */
  id?: string
  /** HTML name attribute */
  name?: string
  /** Autocomplete attribute */
  autocomplete?: InputHTMLAttributes['autocomplete']
  /** Make input full width */
  block?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  loading: false,
  required: false,
  block: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const slots = useSlots()

const uid = useId('input')
const inputId = computed(() => props.id || uid)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const hasLeft = computed(() => props.iconLeft || slots.left)
const hasRight = computed(() => props.iconRight || slots.right || props.loading)

const iconSizeMap: Record<string, string> = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)'
}
const iconSize = computed(() => iconSizeMap[props.size])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>

<template>
  <div
    class="ui-input-field"
    :class="[
      `ui-input-field--${size}`,
      {
        'ui-input-field--block': block,
        'ui-input-field--disabled': disabled,
        'ui-input-field--error': error,
        'ui-input-field--readonly': readonly
      }
    ]"
  >
    <label
      v-if="label"
      :for="inputId"
      class="ui-input-field__label"
    >
      {{ label }}
      <span v-if="required" class="ui-input-field__required" aria-hidden="true">*</span>
    </label>

    <div
      class="ui-input-wrapper"
      :class="[
        `ui-input-wrapper--${size}`,
        {
          'ui-input-wrapper--disabled': disabled,
          'ui-input-wrapper--error': error,
          'ui-input-wrapper--readonly': readonly,
          'ui-input-wrapper--has-left': hasLeft,
          'ui-input-wrapper--has-right': hasRight
        }
      ]"
    >
      <span v-if="hasLeft" class="ui-input-wrapper__addon ui-input-wrapper__addon--left">
        <slot name="left">
          <Icon v-if="iconLeft" :icon="iconLeft" :size="iconSize" />
        </slot>
      </span>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="ui-input-wrapper__input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <span v-if="hasRight" class="ui-input-wrapper__addon ui-input-wrapper__addon--right">
        <Spinner v-if="loading" :size="iconSize" />
        <slot v-else name="right">
          <Icon v-if="iconRight" :icon="iconRight" :size="iconSize" />
        </slot>
      </span>
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="ui-input-field__message ui-input-field__message--error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="hintId"
      class="ui-input-field__message ui-input-field__message--hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.ui-input-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-family: var(--font-sans);
}

.ui-input-field--block {
  width: 100%;
}

.ui-input-field__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--input-label);
  line-height: var(--leading-tight);
}

.ui-input-field__required {
  color: var(--input-error);
  margin-left: var(--space-1);
}

.ui-input-field__message {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.ui-input-field__message--hint {
  color: var(--input-hint);
}

.ui-input-field__message--error {
  color: var(--input-error);
}

.ui-input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  box-shadow: var(--input-shadow, none);
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-input-wrapper:focus-within {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring), var(--input-shadow-focus, none);
}

.ui-input-wrapper:not(:focus-within):not(.ui-input-wrapper--disabled):not(.ui-input-wrapper--readonly):hover {
  border-color: var(--input-border-hover);
}

.ui-input-wrapper--error {
  border-color: var(--input-border-error);
}

.ui-input-wrapper--error:focus-within {
  border-color: var(--input-border-error);
  box-shadow: 0 0 0 3px var(--input-ring-error);
}

.ui-input-wrapper--disabled {
  background-color: var(--input-bg-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-input-wrapper--readonly {
  background-color: transparent;
  border-color: var(--input-border-readonly);
}

.ui-input-wrapper--readonly:focus-within {
  border-color: var(--input-border-readonly);
  box-shadow: none;
}

.ui-input-wrapper--xs {
  height: var(--input-height-xs);
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.ui-input-wrapper--sm {
  height: var(--input-height-sm);
  padding: 0 var(--space-2);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.ui-input-wrapper--md {
  height: var(--input-height-md);
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.ui-input-wrapper--lg {
  height: var(--input-height-lg);
  padding: 0 var(--space-3);
  font-size: var(--text-base);
  border-radius: var(--radius-md);
}

.ui-input-wrapper--xl {
  height: var(--input-height-xl);
  padding: 0 var(--space-4);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
}

.ui-input-wrapper__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent !important;
  background-color: transparent !important;
  font-family: inherit;
  font-size: inherit;
  color: var(--input-text) !important;
  outline: none;
}

.ui-input-wrapper__input::placeholder {
  color: var(--input-placeholder);
}

.ui-input-wrapper__input:disabled {
  cursor: not-allowed;
  color: var(--input-text-disabled);
}

.ui-input-wrapper__input:read-only {
  cursor: default;
}

.ui-input-wrapper__input:-webkit-autofill,
.ui-input-wrapper__input:-webkit-autofill:hover,
.ui-input-wrapper__input:-webkit-autofill:focus,
.ui-input-wrapper__input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--input-text) !important;
  -webkit-box-shadow: 0 0 0px 1000px var(--input-bg) inset !important;
  box-shadow: 0 0 0px 1000px var(--input-bg) inset !important;
  background-color: var(--input-bg) !important;
  background-clip: content-box !important;
  transition: background-color 600000s 0s, box-shadow 600000s 0s;
}

.ui-input-wrapper__input[type='number']::-webkit-outer-spin-button,
.ui-input-wrapper__input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.ui-input-wrapper__input[type='number'] {
  -moz-appearance: textfield;
}

.ui-input-wrapper__addon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--input-icon);
}

.ui-input-wrapper__addon--left {
  margin-right: var(--space-2);
}

.ui-input-wrapper__addon--right {
  margin-left: var(--space-2);
}

.ui-input-wrapper--disabled .ui-input-wrapper__addon {
  opacity: 0.5;
}

.ui-input-field--xs .ui-input-field__label {
  font-size: var(--text-xs);
}

.ui-input-field--sm .ui-input-field__label,
.ui-input-field--md .ui-input-field__label {
  font-size: var(--text-sm);
}

.ui-input-field--lg .ui-input-field__label,
.ui-input-field--xl .ui-input-field__label {
  font-size: var(--text-md);
}
</style>
