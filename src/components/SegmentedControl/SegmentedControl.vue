<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useId } from '../../composables'

export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SegmentedControlProps {
  /** Array of options to display */
  options: SegmentedOption[]
  /** Selected value (v-model) */
  modelValue?: string | number
  /** Control size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Accessible label for the group */
  label?: string
  /** HTML name for form submission */
  name?: string
  /** ID for the control */
  id?: string
}

const props = withDefaults(defineProps<SegmentedControlProps>(), {
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLButtonElement[]>([])

const uid = useId('segmented')
const controlId = computed(() => props.id || uid)

const gliderStyle = ref({
  transform: 'translateX(0px)',
  width: '0px',
  opacity: 0
})

const selectedIndex = computed(() =>
  props.options.findIndex(opt => opt.value === props.modelValue)
)

function updateGlider() {
  const index = selectedIndex.value
  if (index === -1 || !itemRefs.value[index]) {
    gliderStyle.value.opacity = 0
    return
  }

  const item = itemRefs.value[index]
  const container = containerRef.value
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const itemRect = item.getBoundingClientRect()

  const offsetX = itemRect.left - containerRect.left
  const width = item.offsetWidth

  gliderStyle.value = {
    transform: `translateX(${offsetX}px)`,
    width: `${width}px`,
    opacity: 1
  }
}

watch(() => props.modelValue, () => {
  nextTick(updateGlider)
})

watch(() => props.options, () => {
  nextTick(updateGlider)
}, { deep: true })

onMounted(() => {
  requestAnimationFrame(() => {
    updateGlider()
  })
})

function selectOption(option: SegmentedOption) {
  if (props.disabled || option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const enabledOptions = props.options
    .map((opt, i) => ({ opt, i }))
    .filter(({ opt }) => !opt.disabled)

  const currentEnabledIndex = enabledOptions.findIndex(({ i }) => i === index)
  if (currentEnabledIndex === -1) return

  let nextIndex = -1

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      nextIndex = enabledOptions[(currentEnabledIndex + 1) % enabledOptions.length].i
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      nextIndex = enabledOptions[(currentEnabledIndex - 1 + enabledOptions.length) % enabledOptions.length].i
      break
    case 'Home':
      event.preventDefault()
      nextIndex = enabledOptions[0].i
      break
    case 'End':
      event.preventDefault()
      nextIndex = enabledOptions[enabledOptions.length - 1].i
      break
  }

  if (nextIndex !== -1 && itemRefs.value[nextIndex]) {
    itemRefs.value[nextIndex].focus()
    selectOption(props.options[nextIndex])
  }
}

function setItemRef(el: HTMLButtonElement | null, index: number) {
  if (el) {
    itemRefs.value[index] = el
  }
}
</script>

<template>
  <div
    ref="containerRef"
    :id="controlId"
    role="radiogroup"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    class="ui-segmented"
    :class="[
      `ui-segmented--${size}`,
      { 'ui-segmented--disabled': disabled }
    ]"
  >
    <div
      class="ui-segmented__glider"
      :style="gliderStyle"
      aria-hidden="true"
    />

    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => setItemRef(el as HTMLButtonElement, index)"
      type="button"
      role="radio"
      :aria-checked="modelValue === option.value"
      :disabled="disabled || option.disabled"
      :tabindex="modelValue === option.value ? 0 : -1"
      class="ui-segmented__item"
      :class="{
        'ui-segmented__item--selected': modelValue === option.value,
        'ui-segmented__item--disabled': option.disabled
      }"
      @click="selectOption(option)"
      @keydown="handleKeydown($event, index)"
    >
      {{ option.label }}
    </button>

    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="modelValue"
    />
  </div>
</template>

<style scoped>
.ui-segmented {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: var(--segmented-bg);
  border-radius: var(--radius-md);
  padding: var(--space-1);
  gap: var(--space-0-5);
  font-family: var(--font-sans);
}

.ui-segmented--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-segmented__glider {
  position: absolute;
  top: var(--space-1);
  bottom: var(--space-1);
  left: 0;
  background: var(--segmented-glider);
  border-radius: calc(var(--radius-md) - 2px);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-normal) var(--ease-out-back),
    width var(--duration-normal) var(--ease-out-back),
    opacity var(--duration-fast) var(--ease-default);
  pointer-events: none;
}

.ui-segmented__item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0%;
  min-width: 0;
  padding: 0 var(--space-3);
  background: transparent;
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
  font-family: inherit;
  font-weight: var(--font-medium);
  color: var(--segmented-text);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-default);
  -webkit-tap-highlight-color: transparent;
}

.ui-segmented__item:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-segmented__item--selected {
  color: var(--segmented-text-active);
}

.ui-segmented__item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-segmented:not(.ui-segmented--disabled) .ui-segmented__item:not(.ui-segmented__item--disabled):hover {
  color: var(--segmented-text-hover);
}

.ui-segmented--sm {
  min-height: 32px;
}

.ui-segmented--sm .ui-segmented__item {
  height: 24px;
  font-size: var(--text-xs);
  padding: 0 var(--space-2);
}

.ui-segmented--md {
  min-height: 40px;
}

.ui-segmented--md .ui-segmented__item {
  height: 32px;
  font-size: var(--text-sm);
}

.ui-segmented--lg {
  min-height: 48px;
}

.ui-segmented--lg .ui-segmented__item {
  height: 40px;
  font-size: var(--text-md);
  padding: 0 var(--space-4);
}
</style>
