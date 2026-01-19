<script setup lang="ts">
import { inject } from 'vue'
import { AccordionItemKey } from './keys'

export interface AccordionContentProps {
  /** Lazy render - use v-if instead of v-show. Better performance but breaks Ctrl+F search. */
  lazy?: boolean
}

const props = withDefaults(defineProps<AccordionContentProps>(), {
  lazy: false
})

const item = inject(AccordionItemKey)

if (!item) {
  throw new Error('AccordionContent must be used within AccordionItem')
}

function onEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0'
  element.style.overflow = 'hidden'
  element.offsetHeight
  element.style.height = `${element.scrollHeight}px`
}

function onAfterEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = 'auto'
  element.style.overflow = ''
}

function onLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
  element.style.overflow = 'hidden'
  element.offsetHeight
  element.style.height = '0'
}

function onAfterLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.overflow = ''
}
</script>

<template>
  <!-- Lazy mode: v-if for performance (destroys DOM when closed) -->
  <Transition
    v-if="lazy"
    name="ui-accordion-content"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="item.isOpen.value"
      :id="item.contentId"
      class="ui-accordion__content"
      role="region"
      :aria-labelledby="item.triggerId"
    >
      <div class="ui-accordion__content-inner">
        <slot />
      </div>
    </div>
  </Transition>

  <!-- Default mode: v-show for searchability (keeps DOM alive) -->
  <Transition
    v-else
    name="ui-accordion-content"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div
      v-show="item.isOpen.value"
      :id="item.contentId"
      class="ui-accordion__content"
      role="region"
      :aria-labelledby="item.triggerId"
    >
      <div class="ui-accordion__content-inner">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ui-accordion__content {
  transition: height var(--duration-normal) cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-accordion__content-inner {
  padding-bottom: var(--space-4);
  color: var(--accordion-content, var(--text-secondary));
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.ui-accordion-content-enter-active,
.ui-accordion-content-leave-active {
  transition: height var(--duration-normal) cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
</style>
