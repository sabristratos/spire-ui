<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { IconInput } from '../Icon/Icon.vue'
import { useId } from '../../composables'

export interface TextareaProps {
  /** Textarea value (v-model) */
  modelValue?: string
  /** Label text above the textarea */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Helper text below textarea */
  hint?: string
  /** Error message (also sets error state) */
  error?: string
  /** Number of visible rows */
  rows?: number
  /** Disabled state */
  disabled?: boolean
  /** Read-only state */
  readonly?: boolean
  /** Required field */
  required?: boolean
  /** Auto-grow as user types */
  autosize?: boolean
  /** Maximum height in pixels (for autosize) */
  maxHeight?: number
  /** Maximum character count */
  maxLength?: number
  /** Show character counter */
  showCount?: boolean
  /** Icon on the left side (top-aligned) */
  iconLeft?: IconInput
  /** HTML id attribute (auto-generated if not provided) */
  id?: string
  /** HTML name attribute */
  name?: string
  /** Make textarea full width */
  block?: boolean
}

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  disabled: false,
  readonly: false,
  required: false,
  autosize: false,
  showCount: false,
  block: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const slots = useSlots()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const uid = useId('textarea')
const textareaId = computed(() => props.id || uid)
const hintId = computed(() => `${textareaId.value}-hint`)
const errorId = computed(() => `${textareaId.value}-error`)
const counterId = computed(() => `${textareaId.value}-counter`)

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.error) {
    ids.push(errorId.value)
  } else if (props.hint) {
    ids.push(hintId.value)
  }
  if (props.showCount && props.maxLength) {
    ids.push(counterId.value)
  }
  return ids.length > 0 ? ids.join(' ') : undefined
})

const hasLeft = computed(() => props.iconLeft || slots.left)

const charCount = computed(() => (props.modelValue ?? '').length)
const isOverLimit = computed(() => props.maxLength ? charCount.value > props.maxLength : false)
const isNearLimit = computed(() => props.maxLength ? charCount.value >= props.maxLength * 0.9 : false)

const counterText = computed(() => {
  if (!props.maxLength) return `${charCount.value}`
  return `${charCount.value} / ${props.maxLength}`
})

const counterState = computed(() => {
  if (isOverLimit.value) return 'error'
  if (isNearLimit.value) return 'warning'
  return 'default'
})

function adjustHeight() {
  if (!props.autosize || !textareaRef.value) return

  const el = textareaRef.value
  el.style.height = 'auto'

  let newHeight = el.scrollHeight

  if (props.maxHeight && newHeight > props.maxHeight) {
    newHeight = props.maxHeight
    el.style.overflowY = 'auto'
  } else {
    el.style.overflowY = 'hidden'
  }

  el.style.height = `${newHeight}px`
}

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  if (props.autosize) {
    adjustHeight()
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

watch(() => props.modelValue, () => {
  if (props.autosize) {
    nextTick(adjustHeight)
  }
})

onMounted(() => {
  if (props.autosize) {
    nextTick(adjustHeight)
  }
})

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  select: () => textareaRef.value?.select()
})
</script>

<template>
  <div
    class="ui-textarea-field"
    :class="{
      'ui-textarea-field--block': block,
      'ui-textarea-field--disabled': disabled,
      'ui-textarea-field--error': error || isOverLimit,
      'ui-textarea-field--readonly': readonly
    }"
  >
    <label
      v-if="label"
      :for="textareaId"
      class="ui-textarea-field__label"
    >
      {{ label }}
      <span v-if="required" class="ui-textarea-field__required" aria-hidden="true">*</span>
    </label>

    <div
      class="ui-textarea-wrapper"
      :class="{
        'ui-textarea-wrapper--disabled': disabled,
        'ui-textarea-wrapper--error': error || isOverLimit,
        'ui-textarea-wrapper--readonly': readonly,
        'ui-textarea-wrapper--has-left': hasLeft,
        'ui-textarea-wrapper--autosize': autosize
      }"
    >
      <span v-if="hasLeft" class="ui-textarea-wrapper__addon ui-textarea-wrapper__addon--left">
        <slot name="left">
          <Icon v-if="iconLeft" :icon="iconLeft" size="var(--text-md)" />
        </slot>
      </span>

      <textarea
        :id="textareaId"
        ref="textareaRef"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :maxlength="maxLength"
        :aria-invalid="error || isOverLimit ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="ui-textarea-wrapper__textarea"
        :class="{ 'ui-textarea-wrapper__textarea--autosize': autosize }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <div class="ui-textarea-field__footer">
      <div class="ui-textarea-field__messages">
        <p
          v-if="error"
          :id="errorId"
          class="ui-textarea-field__message ui-textarea-field__message--error"
          role="alert"
        >
          {{ error }}
        </p>
        <p
          v-else-if="hint"
          :id="hintId"
          class="ui-textarea-field__message ui-textarea-field__message--hint"
        >
          {{ hint }}
        </p>
      </div>

      <span
        v-if="showCount"
        :id="counterId"
        class="ui-textarea-field__counter"
        :class="`ui-textarea-field__counter--${counterState}`"
        aria-live="polite"
      >
        {{ counterText }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.ui-textarea-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-family: var(--font-sans);
}

.ui-textarea-field--block {
  width: 100%;
}

.ui-textarea-field__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--input-label);
  line-height: var(--leading-tight);
}

.ui-textarea-field__required {
  color: var(--input-error);
  margin-left: var(--space-1);
}

.ui-textarea-field__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
  min-height: var(--text-xs);
}

.ui-textarea-field__messages {
  flex: 1;
  min-width: 0;
}

.ui-textarea-field__message {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.ui-textarea-field__message--hint {
  color: var(--input-hint);
}

.ui-textarea-field__message--error {
  color: var(--input-error);
}

.ui-textarea-field__counter {
  flex-shrink: 0;
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  font-variant-numeric: tabular-nums;
}

.ui-textarea-field__counter--default {
  color: var(--input-hint);
}

.ui-textarea-field__counter--warning {
  color: var(--status-warning);
}

.ui-textarea-field__counter--error {
  color: var(--input-error);
}

.ui-textarea-wrapper {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--space-3);
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-textarea-wrapper:focus-within {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring);
}

.ui-textarea-wrapper:not(:focus-within):not(.ui-textarea-wrapper--disabled):not(.ui-textarea-wrapper--readonly):hover {
  border-color: var(--input-border-hover);
}

.ui-textarea-wrapper--error {
  border-color: var(--input-border-error);
}

.ui-textarea-wrapper--error:focus-within {
  border-color: var(--input-border-error);
  box-shadow: 0 0 0 3px var(--input-ring-error);
}

.ui-textarea-wrapper--disabled {
  background-color: var(--input-bg-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-textarea-wrapper--readonly {
  background-color: transparent;
  border-color: var(--input-border-readonly);
}

.ui-textarea-wrapper--readonly:focus-within {
  border-color: var(--input-border-readonly);
  box-shadow: none;
}

.ui-textarea-wrapper__textarea {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--input-text);
  outline: none;
  resize: vertical;
  min-height: calc(var(--text-sm) * var(--leading-normal));
}

.ui-textarea-wrapper__textarea::placeholder {
  color: var(--input-placeholder);
}

.ui-textarea-wrapper__textarea:disabled {
  cursor: not-allowed;
  color: var(--input-text-disabled);
  resize: none;
}

.ui-textarea-wrapper__textarea:read-only {
  cursor: default;
}

.ui-textarea-wrapper__textarea--autosize {
  resize: none;
  overflow-y: hidden;
}

.ui-textarea-wrapper__addon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--input-icon);
  padding-top: 2px;
}

.ui-textarea-wrapper__addon--left {
  margin-right: var(--space-2);
}

.ui-textarea-wrapper--disabled .ui-textarea-wrapper__addon {
  opacity: 0.5;
}
</style>
