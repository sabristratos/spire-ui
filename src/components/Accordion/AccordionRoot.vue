<script setup lang="ts">
import { computed, provide, toRef, ref, watch } from 'vue'
import { AccordionKey } from './keys'
import type { AccordionVariant } from './keys'

export interface AccordionRootProps {
  /** Currently open item(s) - single value or array for multiple mode */
  modelValue?: string | string[]
  /** Allow all items to be collapsed */
  collapsible?: boolean
  /** Allow multiple items open simultaneously */
  multiple?: boolean
  /** Visual variant */
  variant?: AccordionVariant
}

const props = withDefaults(defineProps<AccordionRootProps>(), {
  collapsible: true,
  multiple: false,
  variant: 'contained'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()

const internalValue = ref<string | string[] | undefined>(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

const isControlled = computed(() => props.modelValue !== undefined)

const openItems = computed(() => {
  const value = isControlled.value ? props.modelValue : internalValue.value
  if (value === undefined) {
    return new Set<string>()
  }
  if (Array.isArray(value)) {
    return new Set(value)
  }
  return new Set([value])
})

function toggle(value: string) {
  const isOpen = openItems.value.has(value)
  let newValue: string | string[] | undefined

  if (isOpen) {
    if (!props.collapsible && openItems.value.size === 1) {
      return
    }

    if (props.multiple) {
      const newSet = new Set(openItems.value)
      newSet.delete(value)
      newValue = Array.from(newSet)
    } else {
      newValue = undefined
    }
  } else {
    if (props.multiple) {
      const newSet = new Set(openItems.value)
      newSet.add(value)
      newValue = Array.from(newSet)
    } else {
      newValue = value
    }
  }

  internalValue.value = newValue
  emit('update:modelValue', newValue)
}

provide(AccordionKey, {
  openItems,
  toggle,
  collapsible: toRef(props, 'collapsible'),
  multiple: toRef(props, 'multiple'),
  variant: toRef(props, 'variant')
})
</script>

<template>
  <div
    class="ui-accordion"
    :class="[`ui-accordion--${variant}`]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Contained variant: single border around group */
.ui-accordion--contained {
  border: 1px solid var(--accordion-border, var(--border-default));
  border-radius: var(--radius-lg);
}

/* Split variant: no outer border, items are separate cards */
.ui-accordion--split {
  gap: var(--space-3);
}
</style>
