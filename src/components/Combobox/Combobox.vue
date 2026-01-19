<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useId } from '../../composables'

export interface ComboboxOption {
  /** Display text shown to user */
  label: string
  /** Value stored in v-model */
  value: string | number
  /** Disable this option */
  disabled?: boolean
}

export interface ComboboxProps {
  /** Selected value(s) - single value or array for multiple */
  modelValue?: string | number | (string | number)[] | null
  /** Available options */
  options: ComboboxOption[]
  /** Enable multi-select mode */
  multiple?: boolean
  /** Label text above input */
  label?: string
  /** Placeholder when empty */
  placeholder?: string
  /** Helper text below input */
  hint?: string
  /** Error message (also sets error state) */
  error?: string
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Required field */
  required?: boolean
  /** Full width mode */
  block?: boolean
  /** Allow creating new options (tagging) */
  allowCreate?: boolean
  /** Max chips to display before +N (multi-select only) */
  maxDisplayedChips?: number
  /** HTML id attribute */
  id?: string
  /** HTML name attribute (for forms) */
  name?: string
}

const props = withDefaults(defineProps<ComboboxProps>(), {
  modelValue: null,
  multiple: false,
  placeholder: 'Search...',
  size: 'md',
  disabled: false,
  required: false,
  block: false,
  allowCreate: false,
  maxDisplayedChips: 3
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[] | null): void
  (e: 'create', value: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const listboxRef = ref<HTMLUListElement | null>(null)

const isOpen = ref(false)
const inputValue = ref('')
const highlightedIndex = ref(-1)
const markedChipIndex = ref(-1)

const uid = useId('combobox')
const comboboxId = computed(() => props.id || uid)
const listboxId = computed(() => `${comboboxId.value}-listbox`)
const hintId = computed(() => `${comboboxId.value}-hint`)
const errorId = computed(() => `${comboboxId.value}-error`)

function getOptionId(index: number) {
  return `${comboboxId.value}-option-${index}`
}

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const selectedValues = computed<(string | number)[]>(() => {
  if (props.modelValue === null || props.modelValue === undefined) return []
  if (Array.isArray(props.modelValue)) return props.modelValue
  return [props.modelValue]
})

const selectedOptions = computed(() => {
  return selectedValues.value
    .map(v => props.options.find(opt => opt.value === v))
    .filter((opt): opt is ComboboxOption => opt !== undefined)
})

const filteredOptions = computed(() => {
  const query = inputValue.value.toLowerCase().trim()
  if (!query) return props.options
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query)
  )
})

const showCreateOption = computed(() => {
  if (!props.allowCreate) return false
  const query = inputValue.value.trim()
  if (!query) return false
  const exactMatch = props.options.some(
    opt => opt.label.toLowerCase() === query.toLowerCase()
  )
  return !exactMatch
})

const activeDescendant = computed(() => {
  if (!isOpen.value || highlightedIndex.value < 0) return undefined
  return getOptionId(highlightedIndex.value)
})

const menuStyle = ref<Record<string, string>>({})

/**
 * Update menu position below trigger
 */
function updateMenuPosition() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
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
  highlightedIndex.value = filteredOptions.value.findIndex(opt => !opt.disabled)
  markedChipIndex.value = -1

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
  markedChipIndex.value = -1

  if (!props.multiple && selectedOptions.value.length > 0) {
    inputValue.value = selectedOptions.value[0].label
  } else if (!props.multiple) {
    inputValue.value = ''
  }

  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', updateMenuPosition, true)
}

/**
 * Handle click outside
 */
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (containerRef.value?.contains(target) || listboxRef.value?.contains(target)) {
    return
  }
  close()
}

/**
 * Handle input changes
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  markedChipIndex.value = -1

  if (!isOpen.value) {
    open()
  } else {
    highlightedIndex.value = filteredOptions.value.findIndex(opt => !opt.disabled)
    nextTick(scrollToHighlighted)
  }
}

/**
 * Handle input focus
 */
function handleFocus() {
  inputRef.value?.select()
  if (!isOpen.value && !props.disabled) {
    open()
  }
}

/**
 * Select an option
 */
function selectOption(option: ComboboxOption) {
  if (option.disabled) return

  if (props.multiple) {
    const currentValues = [...selectedValues.value]
    const idx = currentValues.indexOf(option.value)
    if (idx >= 0) {
      currentValues.splice(idx, 1)
    } else {
      currentValues.push(option.value)
    }
    emit('update:modelValue', currentValues)
    inputValue.value = ''
    inputRef.value?.focus()
  } else {
    emit('update:modelValue', option.value)
    inputValue.value = option.label
    close()
  }
}

/**
 * Remove a chip (multi-select)
 */
function removeChip(value: string | number, event?: MouseEvent) {
  event?.stopPropagation()
  const currentValues = selectedValues.value.filter(v => v !== value)
  emit('update:modelValue', currentValues.length > 0 ? currentValues : null)
  inputRef.value?.focus()
}

/**
 * Handle creating a new option
 */
function handleCreate() {
  const value = inputValue.value.trim()
  if (!value) return
  emit('create', value)
  inputValue.value = ''
  if (!props.multiple) {
    close()
  }
}

/**
 * Scroll highlighted option into view
 */
function scrollToHighlighted() {
  if (!listboxRef.value || highlightedIndex.value < 0) return
  const option = listboxRef.value.children[highlightedIndex.value] as HTMLElement
  option?.scrollIntoView({ block: 'nearest' })
}

/**
 * Move highlight
 */
function moveHighlight(direction: 1 | -1) {
  const len = filteredOptions.value.length
  if (len === 0) return

  let next = highlightedIndex.value
  do {
    next = (next + direction + len) % len
  } while (filteredOptions.value[next]?.disabled && next !== highlightedIndex.value)

  if (!filteredOptions.value[next]?.disabled) {
    highlightedIndex.value = next
    nextTick(scrollToHighlighted)
  }
}

/**
 * Handle keyboard navigation
 */
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
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

    case 'Enter':
      event.preventDefault()
      if (isOpen.value && highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      } else if (showCreateOption.value) {
        handleCreate()
      }
      break

    case 'Escape':
      event.preventDefault()
      close()
      break

    case 'Backspace':
      if (props.multiple && inputValue.value === '' && selectedValues.value.length > 0) {
        event.preventDefault()
        const lastIdx = selectedValues.value.length - 1

        if (markedChipIndex.value === lastIdx) {
          removeChip(selectedValues.value[lastIdx])
          markedChipIndex.value = -1
        } else {
          markedChipIndex.value = lastIdx
        }
      }
      break

    case 'Home':
      if (isOpen.value) {
        event.preventDefault()
        highlightedIndex.value = filteredOptions.value.findIndex(opt => !opt.disabled)
        nextTick(scrollToHighlighted)
      }
      break

    case 'End':
      if (isOpen.value) {
        event.preventDefault()
        for (let i = filteredOptions.value.length - 1; i >= 0; i--) {
          if (!filteredOptions.value[i].disabled) {
            highlightedIndex.value = i
            break
          }
        }
        nextTick(scrollToHighlighted)
      }
      break

    case 'Tab':
      close()
      break
  }
}

/**
 * Highlight matching text in option label
 */
function highlightMatch(label: string): string {
  const query = inputValue.value.trim()
  if (!query) return label

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return label.replace(regex, '<mark>$1</mark>')
}

/**
 * Check if option is selected
 */
function isSelected(value: string | number): boolean {
  return selectedValues.value.includes(value)
}

/**
 * Chips to display (with overflow handling)
 */
const displayedChips = computed(() => {
  if (!props.multiple) return []
  return selectedOptions.value.slice(0, props.maxDisplayedChips)
})

const overflowCount = computed(() => {
  if (!props.multiple) return 0
  return Math.max(0, selectedOptions.value.length - props.maxDisplayedChips)
})

watch(() => props.modelValue, (newVal) => {
  if (!props.multiple && newVal !== null && newVal !== undefined) {
    const opt = props.options.find(o => o.value === newVal)
    if (opt) {
      inputValue.value = opt.label
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', updateMenuPosition, true)
})
</script>

<template>
  <div
    class="ui-combobox"
    :class="[
      `ui-combobox--${size}`,
      {
        'ui-combobox--block': block,
        'ui-combobox--disabled': disabled,
        'ui-combobox--error': error,
        'ui-combobox--open': isOpen,
        'ui-combobox--multiple': multiple
      }
    ]"
  >
    <label
      v-if="label"
      :for="comboboxId"
      class="ui-combobox__label"
    >
      {{ label }}
      <span v-if="required" class="ui-combobox__required" aria-hidden="true">*</span>
    </label>

    <div
      ref="containerRef"
      class="ui-combobox__trigger"
      :class="[
        `ui-combobox__trigger--${size}`,
        {
          'ui-combobox__trigger--error': error,
          'ui-combobox__trigger--multiple': multiple
        }
      ]"
      @click="inputRef?.focus()"
    >
      <template v-if="multiple">
        <span
          v-for="(chip, idx) in displayedChips"
          :key="chip.value"
          class="ui-combobox__chip"
          :class="{ 'ui-combobox__chip--marked': markedChipIndex === selectedValues.indexOf(chip.value) }"
        >
          {{ chip.label }}
          <button
            type="button"
            class="ui-combobox__chip-remove"
            tabindex="-1"
            aria-label="Remove"
            @click="removeChip(chip.value, $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </span>

        <span v-if="overflowCount > 0" class="ui-combobox__overflow">
          +{{ overflowCount }}
        </span>
      </template>

      <input
        :id="comboboxId"
        ref="inputRef"
        type="text"
        role="combobox"
        class="ui-combobox__input"
        :value="inputValue"
        :placeholder="multiple && selectedValues.length > 0 ? '' : placeholder"
        :disabled="disabled"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendant"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-required="required"
        aria-autocomplete="list"
        autocomplete="off"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <svg
        class="ui-combobox__chevron"
        :class="{ 'ui-combobox__chevron--open': isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>

    <select
      v-if="name"
      :name="name"
      :multiple="multiple"
      :required="required"
      :disabled="disabled"
      class="ui-combobox__native"
      tabindex="-1"
      aria-hidden="true"
    >
      <option v-if="!multiple" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :selected="isSelected(opt.value)"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>

    <Teleport to="body">
      <Transition name="ui-combobox-menu">
        <ul
          v-if="isOpen"
          :id="listboxId"
          ref="listboxRef"
          role="listbox"
          class="ui-combobox__listbox"
          :class="{ 'ui-combobox__listbox--multi': multiple }"
          :style="menuStyle"
          :aria-labelledby="comboboxId"
          :aria-multiselectable="multiple"
        >
          <li
            v-if="filteredOptions.length === 0 && !showCreateOption"
            class="ui-combobox__empty"
          >
            No results found
          </li>

          <li
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            :id="getOptionId(index)"
            role="option"
            class="ui-combobox__option"
            :class="{
              'ui-combobox__option--selected': isSelected(option.value),
              'ui-combobox__option--highlighted': index === highlightedIndex,
              'ui-combobox__option--disabled': option.disabled
            }"
            :aria-selected="isSelected(option.value)"
            :aria-disabled="option.disabled"
            @mouseenter="!option.disabled && (highlightedIndex = index)"
            @click="selectOption(option)"
          >
            <span v-if="multiple" class="ui-combobox__checkbox">
              <svg v-if="isSelected(option.value)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>

            <span class="ui-combobox__option-label" v-html="highlightMatch(option.label)" />

            <svg
              v-if="!multiple && isSelected(option.value)"
              class="ui-combobox__check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          </li>

          <li
            v-if="showCreateOption"
            class="ui-combobox__option ui-combobox__option--create"
            :class="{ 'ui-combobox__option--highlighted': filteredOptions.length === 0 }"
            @click="handleCreate"
          >
            Create "<strong>{{ inputValue.trim() }}</strong>"
          </li>
        </ul>
      </Transition>
    </Teleport>

    <p
      v-if="error"
      :id="errorId"
      class="ui-combobox__message ui-combobox__message--error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="hintId"
      class="ui-combobox__message ui-combobox__message--hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.ui-combobox {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-family: var(--font-sans);
}

.ui-combobox--block {
  width: 100%;
}

.ui-combobox__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--input-label);
  line-height: var(--leading-tight);
}

.ui-combobox__required {
  color: var(--input-error);
  margin-left: var(--space-1);
}

.ui-combobox__trigger {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
  width: 100%;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  cursor: text;
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-combobox__trigger:not(.ui-combobox__trigger--multiple) {
  flex-wrap: nowrap;
}

.ui-combobox__trigger--sm {
  min-height: 2rem;
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-sm);
}

.ui-combobox__trigger--md {
  min-height: 2.25rem;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
}

.ui-combobox__trigger--lg {
  min-height: 2.5rem;
  padding: var(--space-1) var(--space-4);
  font-size: var(--text-md);
}

.ui-combobox__trigger:hover:not(.ui-combobox--disabled .ui-combobox__trigger) {
  border-color: var(--input-border-hover);
}

.ui-combobox__trigger:focus-within {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring);
}

.ui-combobox__trigger--error {
  border-color: var(--input-border-error);
}

.ui-combobox__trigger--error:focus-within {
  box-shadow: 0 0 0 3px var(--input-ring-error);
}

.ui-combobox--disabled .ui-combobox__trigger {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--input-bg-disabled);
}

.ui-combobox__input {
  flex: 1;
  min-width: 60px;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  color: var(--input-text);
}

.ui-combobox__input::placeholder {
  color: var(--input-placeholder);
}

.ui-combobox__input:disabled {
  cursor: not-allowed;
}

.ui-combobox__chevron {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  color: var(--input-icon);
  transition: transform var(--duration-fast) var(--ease-default);
  margin-left: auto;
}

.ui-combobox__chevron--open {
  transform: rotate(180deg);
}

.ui-combobox__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0 var(--space-2);
  height: 1.5rem;
  background-color: var(--chip-bg-selected);
  border: 1px solid var(--chip-border-selected);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--chip-text-selected);
  white-space: nowrap;
}

.ui-combobox__chip--marked {
  background-color: var(--action-destructive);
  border-color: var(--action-destructive);
  color: var(--action-destructive-text);
}

.ui-combobox__chip-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.875rem;
  height: 0.875rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  border-radius: var(--radius-sm);
}

.ui-combobox__chip-remove:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.ui-combobox__chip-remove svg {
  width: 0.75rem;
  height: 0.75rem;
}

.ui-combobox__overflow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-2);
  height: 1.5rem;
  background-color: var(--badge-default-bg);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--badge-default-text);
}

.ui-combobox__native {
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

.ui-combobox__message {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.ui-combobox__message--hint {
  color: var(--input-hint);
}

.ui-combobox__message--error {
  color: var(--input-error);
}
</style>

<style>
.ui-combobox__listbox {
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

.ui-combobox__option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--select-option-text);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-combobox__option--highlighted {
  background-color: var(--select-option-hover);
}

.ui-combobox__option--selected {
  color: var(--select-option-selected);
  font-weight: var(--font-medium);
}

.ui-combobox__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-combobox__option--create {
  color: var(--action-primary);
}

.ui-combobox__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: 1.5px solid var(--checkbox-border);
  border-radius: var(--radius-sm);
  background-color: var(--checkbox-bg);
  flex-shrink: 0;
}

.ui-combobox__option--selected .ui-combobox__checkbox {
  background-color: var(--checkbox-checked-bg);
  border-color: var(--checkbox-checked-bg);
  color: var(--checkbox-check);
}

.ui-combobox__checkbox svg {
  width: 0.75rem;
  height: 0.75rem;
}

.ui-combobox__option-label {
  flex: 1;
}

.ui-combobox__option-label mark {
  background-color: transparent;
  color: var(--action-primary);
  font-weight: var(--font-semibold);
}

.ui-combobox__check {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  color: var(--select-option-selected);
}

.ui-combobox__empty {
  padding: var(--space-3);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--input-placeholder);
}

.ui-combobox-menu-enter-active,
.ui-combobox-menu-leave-active {
  transition:
    opacity var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-default);
}

.ui-combobox-menu-enter-from,
.ui-combobox-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
