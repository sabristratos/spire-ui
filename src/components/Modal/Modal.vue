<script setup lang="ts">
import { ref, computed, watch, onMounted, useSlots } from 'vue'
import { useScrollLock } from '../../composables'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  /** Controls visibility (v-model) */
  modelValue?: boolean
  /** Optional header title */
  title?: string
  /** Modal size */
  size?: ModalSize
  /** Prevents closing via backdrop click or Escape key */
  persistent?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  size: 'md',
  persistent: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const slots = useSlots()
const dialogRef = ref<HTMLDialogElement | null>(null)

const isOpen = computed(() => props.modelValue)
useScrollLock(isOpen)

function close() {
  emit('update:modelValue', false)
}

function handleBackdropClick(e: MouseEvent) {
  if (props.persistent) return

  if (e.target === dialogRef.value) {
    close()
  }
}

function handleCancel(e: Event) {
  if (props.persistent) {
    e.preventDefault()
    return
  }
  emit('update:modelValue', false)
}

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}

function syncDialogState(open: boolean) {
  const dialog = dialogRef.value
  if (!dialog) return

  if (open && !dialog.open) {
    dialog.showModal()
  } else if (!open && dialog.open) {
    dialog.close()
  }
}

onMounted(() => {
  if (props.modelValue) {
    syncDialogState(true)
  }
})

watch(
  () => props.modelValue,
  (open) => {
    syncDialogState(open)
  }
)

const hasHeader = () => props.title || slots.header
</script>

<template>
  <dialog
    ref="dialogRef"
    class="ui-modal"
    :class="[`ui-modal--${size}`]"
    @click="handleBackdropClick"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div class="ui-modal__box">
      <header v-if="hasHeader()" class="ui-modal__header">
        <slot name="header">
          <h3 class="ui-modal__title">{{ title }}</h3>
        </slot>
        <button
          type="button"
          class="ui-modal__close"
          aria-label="Close modal"
          @click="close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="ui-modal__body">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="ui-modal__footer">
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.ui-modal {
  border: none;
  padding: 0;
  background: transparent;
  color: inherit;

  margin: auto;
  max-width: calc(100vw - var(--space-8));
  max-height: calc(100vh - var(--space-8));

  width: var(--modal-width, 600px);

  overflow: hidden;
}

.ui-modal--sm {
  --modal-width: 400px;
}

.ui-modal--md {
  --modal-width: 600px;
}

.ui-modal--lg {
  --modal-width: 800px;
}

.ui-modal--xl {
  --modal-width: 1140px;
}

.ui-modal--full {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
}

.ui-modal--full .ui-modal__box {
  border-radius: 0;
  height: 100%;
}

.ui-modal__box {
  background: var(--modal-bg);
  border: 1px solid var(--modal-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100vh - var(--space-8));
}

.ui-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--modal-border);
  flex-shrink: 0;
}

.ui-modal__title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--heading-lg);
  font-weight: var(--font-semibold);
  color: var(--modal-title);
  line-height: 1.3;
}

.ui-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  margin: calc(-1 * var(--space-1));
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--modal-close);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.ui-modal__close:hover {
  background: var(--modal-close-hover-bg);
  color: var(--modal-close-hover);
}

.ui-modal__close:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-modal__close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.ui-modal__body {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
  overscroll-behavior: contain;
  color: var(--modal-text);
}

.ui-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--modal-border);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .ui-modal {
    max-width: calc(100vw - var(--space-4));
    max-height: calc(100vh - var(--space-4));
  }

  .ui-modal--sm,
  .ui-modal--md,
  .ui-modal--lg,
  .ui-modal--xl {
    --modal-width: 100%;
  }

  .ui-modal__header {
    padding: var(--space-3) var(--space-4);
  }

  .ui-modal__body {
    padding: var(--space-4);
  }

  .ui-modal__footer {
    padding: var(--space-3) var(--space-4);
  }
}
</style>

<style>
.ui-modal {
  transition:
    opacity var(--duration-slow) var(--ease-default),
    transform var(--duration-slow) var(--ease-out-expo),
    overlay var(--duration-slow) var(--ease-default) allow-discrete,
    display var(--duration-slow) var(--ease-default) allow-discrete;
}

.ui-modal::backdrop {
  background-color: transparent;
  backdrop-filter: blur(0px);
  transition:
    background-color var(--duration-slow) var(--ease-default),
    backdrop-filter var(--duration-slow) var(--ease-default),
    overlay var(--duration-slow) allow-discrete,
    display var(--duration-slow) allow-discrete;
}

.ui-modal[open]::backdrop {
  background-color: var(--modal-backdrop);
  backdrop-filter: blur(2px);
}

@starting-style {
  .ui-modal[open]::backdrop {
    background-color: transparent;
    backdrop-filter: blur(0px);
  }
}

.ui-modal .ui-modal__box {
  opacity: 0;
  transform: scale(0.95) translateY(10px);

  transition:
    opacity var(--duration-slow) var(--ease-default),
    transform var(--duration-slow) var(--ease-out-expo);
}

.ui-modal[open] .ui-modal__box {
  opacity: 1;
  transform: scale(1) translateY(0);
}

@starting-style {
  .ui-modal[open] .ui-modal__box {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}
</style>
