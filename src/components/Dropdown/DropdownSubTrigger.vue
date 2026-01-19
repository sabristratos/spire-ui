<script setup lang="ts">
import {
  ref,
  inject,
  onMounted,
  onUnmounted,
  type Component
} from 'vue'
import { dropdownContextKey } from './Dropdown.vue'
import { dropdownSubContextKey } from './DropdownSub.vue'

export interface DropdownSubTriggerProps {
  /** Disabled state */
  disabled?: boolean
  /** Leading icon */
  icon?: Component
}

const props = withDefaults(defineProps<DropdownSubTriggerProps>(), {
  disabled: false
})

const parentContext = inject(dropdownContextKey)
const subContext = inject(dropdownSubContextKey)
const triggerRef = ref<HTMLElement | null>(null)

function handleMouseEnter() {
  if (props.disabled) return
  subContext?.cancelClose()
  subContext?.open()
}

function handleMouseLeave() {
  if (props.disabled) return
  subContext?.scheduleClose()
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  subContext?.onTriggerKeydown(e)
}

onMounted(() => {
  if (triggerRef.value) {
    parentContext?.registerItem(triggerRef.value)
    if (subContext) {
      subContext.triggerRef.value = triggerRef.value
    }
  }
})

onUnmounted(() => {
  if (triggerRef.value) {
    parentContext?.unregisterItem(triggerRef.value)
  }
})
</script>

<template>
  <button
    ref="triggerRef"
    type="button"
    class="ui-dropdown-sub-trigger"
    :class="{ 'ui-dropdown-sub-trigger--disabled': disabled }"
    role="menuitem"
    :aria-haspopup="true"
    :aria-expanded="subContext?.isOpen.value"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    :disabled="disabled"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
  >
    <span v-if="icon" class="ui-dropdown-sub-trigger__icon">
      <component :is="icon" />
    </span>
    <span class="ui-dropdown-sub-trigger__content">
      <slot />
    </span>
    <span class="ui-dropdown-sub-trigger__chevron">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.ui-dropdown-sub-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--dropdown-item-text);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  outline: none;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-dropdown-sub-trigger:hover:not(.ui-dropdown-sub-trigger--disabled),
.ui-dropdown-sub-trigger:focus:not(.ui-dropdown-sub-trigger--disabled) {
  background-color: var(--dropdown-item-hover);
}

.ui-dropdown-sub-trigger:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: -2px;
}

.ui-dropdown-sub-trigger--disabled {
  color: var(--dropdown-item-disabled);
  cursor: not-allowed;
}

.ui-dropdown-sub-trigger__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ui-dropdown-sub-trigger__icon > :deep(svg) {
  width: 100%;
  height: 100%;
}

.ui-dropdown-sub-trigger__content {
  flex: 1;
  min-width: 0;
}

.ui-dropdown-sub-trigger__chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  color: var(--dropdown-item-shortcut);
  flex-shrink: 0;
}
</style>
