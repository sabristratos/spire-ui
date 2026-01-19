<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  onMounted,
  onUnmounted,
  type Component
} from 'vue'
import { dropdownContextKey, type DropdownContext } from './Dropdown.vue'

export interface DropdownItemProps {
  /** Renders as RouterLink when provided */
  to?: string | Record<string, unknown>
  /** Renders as anchor when provided */
  href?: string
  /** Disabled state */
  disabled?: boolean
  /** Danger/destructive styling */
  danger?: boolean
  /** Leading icon */
  icon?: Component
  /** Keyboard shortcut hint */
  shortcut?: string
  /** Prevent menu from closing on click */
  preventClose?: boolean
  /** Show chevron indicator (for submenu triggers) */
  chevron?: boolean
}

const props = withDefaults(defineProps<DropdownItemProps>(), {
  disabled: false,
  danger: false,
  preventClose: false,
  chevron: false
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const context = inject(dropdownContextKey)
const itemRef = ref<HTMLElement | null>(null)

const componentType = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const componentProps = computed(() => {
  const base: Record<string, unknown> = {
    class: [
      'ui-dropdown-item',
      {
        'ui-dropdown-item--disabled': props.disabled,
        'ui-dropdown-item--danger': props.danger
      }
    ],
    role: 'menuitem',
    tabindex: props.disabled ? -1 : 0
  }

  if (props.disabled) {
    base['aria-disabled'] = 'true'
  }

  if (componentType.value === 'router-link') {
    base.to = props.to
  } else if (componentType.value === 'a') {
    base.href = props.href
    base.target = '_blank'
    base.rel = 'noopener noreferrer'
  } else {
    base.type = 'button'
    base.disabled = props.disabled
  }

  return base
})

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)

  if (!props.preventClose) {
    context?.close()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event)

    if (!props.preventClose) {
      context?.close()
    }
  }
}

onMounted(() => {
  if (itemRef.value) {
    context?.registerItem(itemRef.value)
  }
})

onUnmounted(() => {
  if (itemRef.value) {
    context?.unregisterItem(itemRef.value)
  }
})
</script>

<template>
  <component
    :is="componentType"
    ref="itemRef"
    v-bind="componentProps"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="icon" class="ui-dropdown-item__icon">
      <component :is="icon" />
    </span>
    <span class="ui-dropdown-item__content">
      <slot />
    </span>
    <span v-if="shortcut" class="ui-dropdown-item__shortcut">
      {{ shortcut }}
    </span>
    <span v-if="chevron" class="ui-dropdown-item__chevron">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </span>
  </component>
</template>

<style scoped>
.ui-dropdown-item {
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
  text-decoration: none;
  outline: none;
  transition: background-color var(--duration-fast) var(--ease-default),
              color var(--duration-fast) var(--ease-default);
}

.ui-dropdown-item:hover:not(.ui-dropdown-item--disabled),
.ui-dropdown-item:focus:not(.ui-dropdown-item--disabled) {
  background-color: var(--dropdown-item-hover);
}

.ui-dropdown-item:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: -2px;
}

.ui-dropdown-item--disabled {
  color: var(--dropdown-item-disabled);
  cursor: not-allowed;
}

.ui-dropdown-item--danger {
  color: var(--dropdown-item-danger);
}

.ui-dropdown-item--danger:hover:not(.ui-dropdown-item--disabled),
.ui-dropdown-item--danger:focus:not(.ui-dropdown-item--disabled) {
  background-color: var(--dropdown-item-danger-hover);
}

.ui-dropdown-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ui-dropdown-item__icon > :deep(svg) {
  width: 100%;
  height: 100%;
}

.ui-dropdown-item__content {
  flex: 1;
  min-width: 0;
}

.ui-dropdown-item__shortcut {
  margin-left: auto;
  padding-left: var(--space-4);
  font-size: var(--text-xs);
  color: var(--dropdown-item-shortcut);
  flex-shrink: 0;
}

.ui-dropdown-item__chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  color: var(--dropdown-item-shortcut);
  flex-shrink: 0;
}
</style>
