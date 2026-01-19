<script lang="ts">
import type { InjectionKey } from 'vue'

export interface DropdownSubContext {
  isOpen: { value: boolean }
  triggerRef: { value: HTMLElement | null }
  open: () => void
  close: () => void
  onTriggerKeydown: (e: KeyboardEvent) => void
  scheduleClose: () => void
  cancelClose: () => void
}

export const dropdownSubContextKey: InjectionKey<DropdownSubContext> = Symbol('dropdownSub')
</script>

<script setup lang="ts">
import { ref, provide, inject } from 'vue'
import { dropdownContextKey } from './Dropdown.vue'

const parentContext = inject(dropdownContextKey)

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

let closeTimeout: ReturnType<typeof setTimeout> | null = null

function open() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function scheduleClose() {
  if (closeTimeout) clearTimeout(closeTimeout)
  closeTimeout = setTimeout(() => {
    close()
  }, 150)
}

function cancelClose() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    open()
  }
}

function onContentKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    e.stopPropagation()
    close()
    triggerRef.value?.focus()
  }
}

provide(dropdownSubContextKey, {
  isOpen,
  triggerRef,
  open,
  close,
  onTriggerKeydown,
  scheduleClose,
  cancelClose
} as DropdownSubContext)

defineExpose({
  isOpen,
  triggerRef,
  contentRef,
  open,
  close,
  scheduleClose,
  cancelClose,
  onContentKeydown
})
</script>

<template>
  <div class="ui-dropdown-sub">
    <slot />
  </div>
</template>

<style scoped>
.ui-dropdown-sub {
  position: relative;
}
</style>
