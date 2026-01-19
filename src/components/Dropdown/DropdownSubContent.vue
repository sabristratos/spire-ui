<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  inject,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import { dropdownSubContextKey } from './DropdownSub.vue'

const subContext = inject(dropdownSubContextKey)

const menuRef = ref<HTMLElement | null>(null)
const positionStyle = ref<{ top: string; left: string }>({ top: '0', left: '0' })

function handleMouseEnter() {
  subContext?.cancelClose()
}

function handleMouseLeave() {
  subContext?.scheduleClose()
}

function getFocusableItems(): HTMLElement[] {
  if (!menuRef.value) return []
  return Array.from(
    menuRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => el.getAttribute('aria-disabled') !== 'true')
}

function focusItem(index: number) {
  const items = getFocusableItems()
  if (items.length === 0) return

  if (index < 0) index = items.length - 1
  if (index >= items.length) index = 0

  items[index].focus()
}

function handleKeydown(e: KeyboardEvent) {
  const items = getFocusableItems()
  const currentIndex = items.findIndex(el => el === document.activeElement)

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      e.stopPropagation()
      focusItem(currentIndex + 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      e.stopPropagation()
      focusItem(currentIndex - 1)
      break
    case 'Home':
      e.preventDefault()
      e.stopPropagation()
      focusItem(0)
      break
    case 'End':
      e.preventDefault()
      e.stopPropagation()
      focusItem(items.length - 1)
      break
    case 'ArrowLeft':
    case 'Escape':
      e.preventDefault()
      e.stopPropagation()
      subContext?.close()
      subContext?.triggerRef.value?.focus()
      break
  }
}

function updatePosition() {
  const trigger = subContext?.triggerRef.value
  const menu = menuRef.value
  if (!trigger || !menu) return

  const triggerRect = trigger.getBoundingClientRect()
  const menuRect = menu.getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const gap = 4

  let top = triggerRect.top
  let left = triggerRect.right + gap

  // Flip to left if no space on right
  if (left + menuRect.width > viewport.width - 8) {
    left = triggerRect.left - menuRect.width - gap
  }

  // Clamp vertical position
  if (top + menuRect.height > viewport.height - 8) {
    top = viewport.height - menuRect.height - 8
  }
  top = Math.max(8, top)

  // Clamp horizontal position
  left = Math.max(8, Math.min(left, viewport.width - menuRect.width - 8))

  positionStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

watch(() => subContext?.isOpen.value, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    updatePosition()
    // Focus first item
    const firstItem = menuRef.value?.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
    firstItem?.focus()
  }
})

onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="ui-dropdown-sub">
      <div
        v-if="subContext?.isOpen.value"
        ref="menuRef"
        class="ui-dropdown-sub-content"
        role="menu"
        :style="positionStyle"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @keydown="handleKeydown"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ui-dropdown-sub-content {
  position: fixed;
  z-index: calc(var(--z-dropdown, 50) + 1);
  min-width: 160px;
  padding: var(--space-1);
  background: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  outline: none;
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ui-dropdown-sub-enter-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-dropdown-sub-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-dropdown-sub-enter-from,
.ui-dropdown-sub-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
