<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useId } from '../../composables'

export interface SelectOption {
  /** Display text shown to user */
  label: string
  /** Value stored in v-model */
  value: string | number
  /** Disable this option */
  disabled?: boolean
}

export interface SelectProps {
  /** Selected value (v-model) */
  modelValue?: string | number | null
  /** Available options */
  options: SelectOption[]
  /** Label text above select */
  label?: string
  /** Placeholder when no selection */
  placeholder?: string
  /** Helper text below select */
  hint?: string
  /** Error message (also sets error state) */
  error?: string
  /** Select size - matches Input heights */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Disabled state */
  disabled?: boolean
  /** Required field */
  required?: boolean
  /** Make select full width */
  block?: boolean
  /** HTML id attribute */
  id?: string
  /** HTML name attribute (for forms) */
  name?: string
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: null,
  placeholder: 'Select an option',
  size: 'md',
  disabled: false,
  required: false,
  block: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', value: string | number | null): void
}>()

const triggerRef = ref<HTMLButtonElement | null>(null)
const listboxRef = ref<HTMLUListElement | null>(null)

const isOpen = ref(false)
const highlightedIndex = ref(-1)

const uid = useId('select')
const selectId = computed(() => props.id || uid)
const listboxId = computed(() => `${selectId.value}-listbox`)
const hintId = computed(() => `${selectId.value}-hint`)
const errorId = computed(() => `${selectId.value}-error`)

function getOptionId(index: number) {
  return `${selectId.value}-option-${index}`
}

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const displayText = computed(() => {
  return selectedOption.value?.label || ''
})

const activeDescendant = computed(() => {
  if (!isOpen.value || highlightedIndex.value < 0) return undefined
  return getOptionId(highlightedIndex.value)
})

const menuStyle = ref<Record<string, string>>({})

/**
 * Calculate menu position (below trigger, matching width)
 */
function updateMenuPosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  menuStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
    maxWidth: `${Math.max(rect.width, 300)}px`
  }
}

/**
 * Open the dropdown
 */
function open() {
  if (props.disabled || isOpen.value) return

  isOpen.value = true
  updateMenuPosition()

  const selectedIdx = props.options.findIndex(opt => opt.value === props.modelValue)
  if (selectedIdx >= 0 && !props.options[selectedIdx].disabled) {
    highlightedIndex.value = selectedIdx
  } else {
    highlightedIndex.value = props.options.findIndex(opt => !opt.disabled)
  }

  nextTick(() => {
    scrollToHighlighted()
  })

  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('resize', close)
  window.addEventListener('scroll', updateMenuPosition, true)
}

/**
 * Close the dropdown
 */
function close() {
  if (!isOpen.value) return

  isOpen.value = false
  highlightedIndex.value = -1

  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', updateMenuPosition, true)
}

/**
 * Toggle open/close
 */
function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

/**
 * Handle click outside to close
 */
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (
    triggerRef.value?.contains(target) ||
    listboxRef.value?.contains(target)
  ) {
    return
  }
  close()
}

/**
 * Select an option
 */
function selectOption(option: SelectOption) {
  if (option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
  triggerRef.value?.focus()
}

/**
 * Scroll highlighted option into view
 */
function scrollToHighlighted() {
  if (!listboxRef.value || highlightedIndex.value < 0) return

  const option = listboxRef.value.children[highlightedIndex.value] as HTMLElement
  if (option) {
    option.scrollIntoView({ block: 'nearest' })
  }
}

/**
 * Move highlight up/down
 */
function moveHighlight(direction: 1 | -1) {
  const len = props.options.length
  let next = highlightedIndex.value

  do {
    next = (next + direction + len) % len
  } while (props.options[next].disabled && next !== highlightedIndex.value)

  if (!props.options[next].disabled) {
    highlightedIndex.value = next
    nextTick(scrollToHighlighted)
  }
}

/**
 * Handle keyboard navigation
 */
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value && highlightedIndex.value >= 0) {
        selectOption(props.options[highlightedIndex.value])
      } else {
        open()
      }
      break

    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        open()
      } else {
        moveHighlight(1)
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value) {
        open()
      } else {
        moveHighlight(-1)
      }
      break

    case 'Home':
      event.preventDefault()
      if (isOpen.value) {
        highlightedIndex.value = props.options.findIndex(opt => !opt.disabled)
        nextTick(scrollToHighlighted)
      }
      break

    case 'End':
      event.preventDefault()
      if (isOpen.value) {
        for (let i = props.options.length - 1; i >= 0; i--) {
          if (!props.options[i].disabled) {
            highlightedIndex.value = i
            break
          }
        }
        nextTick(scrollToHighlighted)
      }
      break

    case 'Escape':
      event.preventDefault()
      close()
      break

    case 'Tab':
      close()
      break
  }
}

/**
 * Handle option mouse enter (highlight on hover)
 */
function handleOptionMouseEnter(index: number) {
  if (!props.options[index].disabled) {
    highlightedIndex.value = index
  }
}

/**
 * Handle option click
 */
function handleOptionClick(option: SelectOption, event: MouseEvent) {
  event.preventDefault()
  selectOption(option)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', updateMenuPosition, true)
})
</script>

<template>
  <div
    class="ui-select"
    :class="[
      `ui-select--${size}`,
      {
        'ui-select--block': block,
        'ui-select--disabled': disabled,
        'ui-select--error': error,
        'ui-select--open': isOpen
      }
    ]"
  >
    <label
      v-if="label"
      :for="selectId"
      class="ui-select__label"
    >
      {{ label }}
      <span v-if="required" class="ui-select__required" aria-hidden="true">*</span>
    </label>

    <button
      :id="selectId"
      ref="triggerRef"
      type="button"
      role="combobox"
      class="ui-select__trigger"
      :class="[
        `ui-select__trigger--${size}`,
        {
          'ui-select__trigger--error': error,
          'ui-select__trigger--placeholder': !selectedOption
        }
      ]"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      :aria-required="required"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="ui-select__value">
        {{ displayText || placeholder }}
      </span>
      <svg
        class="ui-select__chevron"
        :class="{ 'ui-select__chevron--open': isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <select
      v-if="name"
      :name="name"
      :value="modelValue ?? ''"
      :required="required"
      :disabled="disabled"
      class="ui-select__native"
      tabindex="-1"
      aria-hidden="true"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>

    <Teleport to="body">
      <Transition name="ui-select-menu">
        <ul
          v-if="isOpen"
          :id="listboxId"
          ref="listboxRef"
          role="listbox"
          class="ui-select__listbox"
          :style="menuStyle"
          :aria-labelledby="selectId"
        >
          <li
            v-for="(option, index) in options"
            :key="option.value"
            :id="getOptionId(index)"
            role="option"
            class="ui-select__option"
            :class="{
              'ui-select__option--selected': option.value === modelValue,
              'ui-select__option--highlighted': index === highlightedIndex,
              'ui-select__option--disabled': option.disabled
            }"
            :aria-selected="option.value === modelValue"
            :aria-disabled="option.disabled"
            @mouseenter="handleOptionMouseEnter(index)"
            @click="handleOptionClick(option, $event)"
          >
            {{ option.label }}
            <svg
              v-if="option.value === modelValue"
              class="ui-select__check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          </li>
        </ul>
      </Transition>
    </Teleport>

    <p
      v-if="error"
      :id="errorId"
      class="ui-select__message ui-select__message--error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="hintId"
      class="ui-select__message ui-select__message--hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.ui-select {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-family: var(--font-sans);
}

.ui-select--block {
  width: 100%;
}

.ui-select__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--input-label);
  line-height: var(--leading-tight);
}

.ui-select__required {
  color: var(--input-error);
  margin-left: var(--space-1);
}

.ui-select__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--input-text);
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-select__trigger--xs {
  height: var(--input-height-xs);
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
}

.ui-select__trigger--sm {
  height: var(--input-height-sm);
  padding: 0 var(--space-2);
  font-size: var(--text-sm);
}

.ui-select__trigger--md {
  height: var(--input-height-md);
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
}

.ui-select__trigger--lg {
  height: var(--input-height-lg);
  padding: 0 var(--space-3);
  font-size: var(--text-base);
}

.ui-select__trigger--xl {
  height: var(--input-height-xl);
  padding: 0 var(--space-4);
  font-size: var(--text-base);
}

.ui-select__trigger:hover:not(:disabled) {
  border-color: var(--input-border-hover);
}

.ui-select__trigger:focus-visible {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--ring-color);
}

.ui-select--open .ui-select__trigger {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--ring-color);
}

.ui-select__trigger--error {
  border-color: var(--input-error);
}

.ui-select__trigger--error:focus-visible,
.ui-select--open .ui-select__trigger--error {
  box-shadow: 0 0 0 3px var(--input-ring-error);
}

.ui-select__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--input-bg-disabled);
}

.ui-select__trigger--placeholder {
  color: var(--input-placeholder);
}

.ui-select__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-select__chevron {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  color: var(--input-icon);
  transition: transform var(--duration-fast) var(--ease-default);
}

.ui-select__chevron--open {
  transform: rotate(180deg);
}

.ui-select__native {
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

.ui-select__message {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.ui-select__message--hint {
  color: var(--input-hint);
}

.ui-select__message--error {
  color: var(--input-error);
}
</style>

<style>
.ui-select__listbox {
  z-index: 9999;
  margin: 0;
  padding: var(--space-1);
  list-style: none;
  background-color: var(--select-menu-bg);
  border: 1px solid var(--select-menu-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 256px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.ui-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--select-option-text);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-select__option--highlighted {
  background-color: var(--select-option-hover);
}

.ui-select__option--selected {
  color: var(--select-option-selected);
  font-weight: var(--font-medium);
}

.ui-select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-select__check {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  color: var(--select-option-selected);
}

.ui-select-menu-enter-active,
.ui-select-menu-leave-active {
  transition:
    opacity var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-default);
}

.ui-select-menu-enter-from,
.ui-select-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
