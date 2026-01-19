<script setup lang="ts">
import { computed, provide, inject } from 'vue'
import { useId } from '../../composables'
import { AccordionKey, AccordionItemKey } from './keys'

export interface AccordionItemProps {
  /** Unique identifier for this item */
  value: string
  /** Disable this item */
  disabled?: boolean
}

const props = withDefaults(defineProps<AccordionItemProps>(), {
  disabled: false
})

const accordion = inject(AccordionKey)

if (!accordion) {
  throw new Error('AccordionItem must be used within AccordionRoot')
}

const triggerId = useId('accordion-trigger')
const contentId = useId('accordion-content')

const isOpen = computed(() => accordion.openItems.value.has(props.value))

function toggle() {
  if (props.disabled) return
  accordion!.toggle(props.value)
}

provide(AccordionItemKey, {
  value: props.value,
  triggerId,
  contentId,
  isOpen,
  disabled: computed(() => props.disabled),
  toggle
})

const itemClasses = computed(() => [
  'ui-accordion__item',
  `ui-accordion__item--${accordion.variant.value}`,
  {
    'ui-accordion__item--disabled': props.disabled,
    'ui-accordion__item--open': isOpen.value
  }
])
</script>

<template>
  <div
    :class="itemClasses"
    :data-state="isOpen ? 'open' : 'closed'"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-accordion__item {
  overflow: hidden;
}

.ui-accordion__item--disabled {
  opacity: 0.5;
}

/* Contained variant: dividers between items */
.ui-accordion__item--contained {
  border-bottom: 1px solid var(--accordion-border, var(--border-default));
  padding: 0 var(--space-4);
}

.ui-accordion__item--contained:last-child {
  border-bottom: none;
}

/* Split variant: separate cards */
.ui-accordion__item--split {
  border: 1px solid var(--accordion-border, var(--border-default));
  border-radius: var(--radius-lg);
  padding: 0 var(--space-4);
  background: var(--accordion-item-bg, var(--surface-default));
}
</style>
