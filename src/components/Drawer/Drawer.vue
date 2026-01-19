<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'
import { useId, useScrollLock } from '../../composables'

export type DrawerPlacement = 'right' | 'left' | 'bottom'
export type DrawerVariant = 'default' | 'floating'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface DrawerProps {
  /** Controls visibility (v-model) */
  modelValue?: boolean
  /** Drawer title */
  title?: string
  /** Visual variant */
  variant?: DrawerVariant
  /** Placement on desktop */
  placement?: DrawerPlacement
  /** Width/height preset */
  size?: DrawerSize
  /** Allow closing by clicking backdrop */
  maskClosable?: boolean
  /** Allow closing with Escape key */
  closeOnEscape?: boolean
  /** Show close button in header */
  showClose?: boolean
}

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  variant: 'default',
  placement: 'right',
  size: 'md',
  maskClosable: true,
  closeOnEscape: true,
  showClose: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const drawerRef = ref<HTMLElement | null>(null)
const drawerId = useId('drawer')
const titleId = useId('drawer-title')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const actualPlacement = computed(() => {
  return isMobile.value ? 'bottom' : props.placement
})

const shouldLockScroll = computed(() => isOpen.value)
useScrollLock(shouldLockScroll)

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function trapFocus(e: KeyboardEvent) {
  if (!drawerRef.value) return
  if (e.key !== 'Tab') return

  const elements = drawerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  if (elements.length === 0) return

  const first = elements[0]
  const last = elements[elements.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

function focusFirstElement() {
  if (!drawerRef.value) return
  nextTick(() => {
    const first = drawerRef.value?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    first?.focus()
  })
}

let previousActiveElement: HTMLElement | null = null

function open() {
  previousActiveElement = document.activeElement as HTMLElement
  emit('open')
  nextTick(() => {
    focusFirstElement()
    window.addEventListener('keydown', trapFocus)
  })
}

function close() {
  isOpen.value = false
  window.removeEventListener('keydown', trapFocus)
  emit('close')
  nextTick(() => {
    previousActiveElement?.focus()
  })
}

function handleBackdropClick() {
  if (props.maskClosable) {
    close()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    close()
  }
}

watch(isOpen, (newValue) => {
  if (newValue) {
    open()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', trapFocus)
})

const drawerClasses = computed(() => [
  'ui-drawer__panel',
  `ui-drawer__panel--${actualPlacement.value}`,
  `ui-drawer__panel--${props.variant}`,
  `ui-drawer__panel--${props.size}`,
  { 'ui-drawer__panel--mobile': isMobile.value }
])

const transitionName = computed(() => {
  return `ui-drawer-${actualPlacement.value}`
})

defineExpose({
  close
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <div
        v-if="isOpen"
        class="ui-drawer"
        @keydown="handleKeydown"
      >
        <div
          class="ui-drawer__backdrop"
          @click="handleBackdropClick"
        />
        <div
          ref="drawerRef"
          :class="drawerClasses"
          :id="drawerId"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
        >
          <header v-if="title || showClose || $slots.header" class="ui-drawer__header">
            <slot name="header">
              <h2 v-if="title" :id="titleId" class="ui-drawer__title">{{ title }}</h2>
            </slot>
            <button
              v-if="showClose"
              type="button"
              class="ui-drawer__close"
              aria-label="Close drawer"
              @click="close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div class="ui-drawer__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ui-drawer__footer">
            <slot name="footer" :close="close" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ui-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 100);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.ui-drawer__backdrop {
  position: absolute;
  inset: 0;
  background: var(--modal-backdrop, rgba(0, 0, 0, 0.5));
}

.ui-drawer__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--drawer-bg, var(--modal-bg));
  box-shadow: var(--shadow-2xl);
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

/* Placement: Right (default) */
.ui-drawer__panel--right {
  height: 100%;
  margin-left: auto;
}

/* Placement: Left */
.ui-drawer__panel--left {
  height: 100%;
  margin-right: auto;
}

/* Placement: Bottom */
.ui-drawer__panel--bottom {
  width: 100%;
  max-height: 90vh;
  margin-top: auto;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

/* Variant: Default (edge-to-edge) */
.ui-drawer__panel--default.ui-drawer__panel--right,
.ui-drawer__panel--default.ui-drawer__panel--left {
  border-radius: 0;
}

/* Variant: Floating */
.ui-drawer__panel--floating.ui-drawer__panel--right {
  margin: var(--space-4);
  height: calc(100vh - var(--space-8));
  border-radius: var(--radius-xl);
}

.ui-drawer__panel--floating.ui-drawer__panel--left {
  margin: var(--space-4);
  height: calc(100vh - var(--space-8));
  border-radius: var(--radius-xl);
}

/* Floating reverts to default on mobile */
.ui-drawer__panel--mobile.ui-drawer__panel--floating {
  margin: 0;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

/* Sizes */
.ui-drawer__panel--sm {
  width: 320px;
}

.ui-drawer__panel--md {
  width: 400px;
}

.ui-drawer__panel--lg {
  width: 560px;
}

.ui-drawer__panel--xl {
  width: 720px;
}

.ui-drawer__panel--full {
  width: 100%;
}

/* Bottom placement overrides width */
.ui-drawer__panel--bottom {
  width: 100% !important;
}

/* Header */
.ui-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--drawer-border, var(--modal-border, var(--border-default)));
  flex-shrink: 0;
}

.ui-drawer__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--drawer-title, var(--modal-title, var(--text-primary)));
  font-family: var(--font-sans);
}

.ui-drawer__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  margin-left: auto;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--drawer-close, var(--modal-close, var(--text-secondary)));
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default),
              color var(--duration-fast) var(--ease-default);
}

.ui-drawer__close:hover {
  background: var(--drawer-close-hover-bg, var(--modal-close-hover-bg, var(--surface-hover)));
  color: var(--drawer-close-hover, var(--modal-close-hover, var(--text-primary)));
}

.ui-drawer__close:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

/* Body */
.ui-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

/* Footer */
.ui-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--drawer-border, var(--modal-border, var(--border-default)));
  flex-shrink: 0;
}

/* Animations - Expo Out curve */

/* Right slide */
.ui-drawer-right-enter-active .ui-drawer__backdrop,
.ui-drawer-right-leave-active .ui-drawer__backdrop {
  transition: opacity 300ms var(--ease-default);
}

.ui-drawer-right-enter-active .ui-drawer__panel,
.ui-drawer-right-leave-active .ui-drawer__panel {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-drawer-right-enter-from .ui-drawer__backdrop,
.ui-drawer-right-leave-to .ui-drawer__backdrop {
  opacity: 0;
}

.ui-drawer-right-enter-from .ui-drawer__panel,
.ui-drawer-right-leave-to .ui-drawer__panel {
  transform: translateX(100%);
}

/* Left slide */
.ui-drawer-left-enter-active .ui-drawer__backdrop,
.ui-drawer-left-leave-active .ui-drawer__backdrop {
  transition: opacity 300ms var(--ease-default);
}

.ui-drawer-left-enter-active .ui-drawer__panel,
.ui-drawer-left-leave-active .ui-drawer__panel {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-drawer-left-enter-from .ui-drawer__backdrop,
.ui-drawer-left-leave-to .ui-drawer__backdrop {
  opacity: 0;
}

.ui-drawer-left-enter-from .ui-drawer__panel,
.ui-drawer-left-leave-to .ui-drawer__panel {
  transform: translateX(-100%);
}

/* Bottom slide */
.ui-drawer-bottom-enter-active .ui-drawer__backdrop,
.ui-drawer-bottom-leave-active .ui-drawer__backdrop {
  transition: opacity 300ms var(--ease-default);
}

.ui-drawer-bottom-enter-active .ui-drawer__panel,
.ui-drawer-bottom-leave-active .ui-drawer__panel {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-drawer-bottom-enter-from .ui-drawer__backdrop,
.ui-drawer-bottom-leave-to .ui-drawer__backdrop {
  opacity: 0;
}

.ui-drawer-bottom-enter-from .ui-drawer__panel,
.ui-drawer-bottom-leave-to .ui-drawer__panel {
  transform: translateY(100%);
}

/* Mobile adjustments */
@media (max-width: 639px) {
  .ui-drawer {
    align-items: flex-end;
    justify-content: stretch;
  }

  .ui-drawer__panel {
    width: 100% !important;
    max-height: 90vh;
    margin: 0;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
}
</style>
