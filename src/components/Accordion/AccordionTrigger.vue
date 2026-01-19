<script setup lang="ts">
import { inject, useSlots } from 'vue'
import { AccordionItemKey } from './keys'

export interface AccordionTriggerProps {
  /** Hide the default chevron indicator */
  hideIndicator?: boolean
}

const props = withDefaults(defineProps<AccordionTriggerProps>(), {
  hideIndicator: false
})

const slots = useSlots()

const item = inject(AccordionItemKey)

if (!item) {
  throw new Error('AccordionTrigger must be used within AccordionItem')
}

const hasIconSlot = !!slots.icon
</script>

<template>
  <h3 class="ui-accordion__heading">
    <button
      type="button"
      class="ui-accordion__trigger"
      :id="item.triggerId"
      :aria-expanded="item.isOpen.value"
      :aria-controls="item.contentId"
      :disabled="item.disabled.value"
      @click="item.toggle"
    >
      <span class="ui-accordion__trigger-text">
        <slot />
      </span>

      <!-- Custom icon slot (for plus/minus, etc.) -->
      <span v-if="hasIconSlot" class="ui-accordion__indicator">
        <slot name="icon" :is-open="item.isOpen.value" />
      </span>

      <!-- Default chevron -->
      <svg
        v-else-if="!hideIndicator"
        class="ui-accordion__chevron"
        :class="{ 'ui-accordion__chevron--open': item.isOpen.value }"
        width="16"
        height="16"
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
  </h3>
</template>

<style scoped>
.ui-accordion__heading {
  margin: 0;
  font-size: inherit;
}

.ui-accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-4) 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--accordion-trigger, var(--text-primary));
  text-align: left;
  transition: color var(--duration-fast) var(--ease-default);
}

.ui-accordion__trigger:hover {
  color: var(--accordion-trigger-hover, var(--text-primary));
}

.ui-accordion__trigger:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.ui-accordion__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-accordion__trigger-text {
  flex: 1;
}

.ui-accordion__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--accordion-chevron, var(--text-secondary));
}

.ui-accordion__chevron {
  flex-shrink: 0;
  color: var(--accordion-chevron, var(--text-secondary));
  transition: transform var(--duration-normal) cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-accordion__chevron--open {
  transform: rotate(180deg);
}
</style>
