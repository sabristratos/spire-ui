<script setup lang="ts">
import { toasts, toastActions } from './toastState'
import ToastItem from './ToastItem.vue'

export interface ToastProviderProps {
  /** Position of the toast container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

withDefaults(defineProps<ToastProviderProps>(), {
  position: 'top-right'
})

function handleDismiss(id: string) {
  toastActions.remove(id)
}
</script>

<template>
  <Teleport to="body">
    <div
      class="ui-toast-provider"
      :class="[`ui-toast-provider--${position}`]"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup name="toast">
        <ToastItem
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @dismiss="handleDismiss"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.ui-toast-provider {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  pointer-events: none;
}

.ui-toast-provider--top-right {
  top: 0;
  right: 0;
  align-items: flex-end;
}

.ui-toast-provider--top-left {
  top: 0;
  left: 0;
  align-items: flex-start;
}

.ui-toast-provider--bottom-right {
  bottom: 0;
  right: 0;
  align-items: flex-end;
  flex-direction: column-reverse;
}

.ui-toast-provider--bottom-left {
  bottom: 0;
  left: 0;
  align-items: flex-start;
  flex-direction: column-reverse;
}

.ui-toast-provider--top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.ui-toast-provider--bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
  flex-direction: column-reverse;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-active {
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out-back);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-from {
  opacity: 1;
  transform: scale(1);
}

.toast-leave-active {
  position: absolute;
  transition:
    opacity var(--duration-fast) var(--ease-default),
    transform var(--duration-fast) var(--ease-default);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.toast-move {
  transition: transform var(--duration-normal) var(--ease-out);
}

.ui-toast-provider--top-left .toast-enter-from,
.ui-toast-provider--bottom-left .toast-enter-from {
  transform: translateX(-100%);
}

.ui-toast-provider--top-center .toast-enter-from,
.ui-toast-provider--bottom-center .toast-enter-from {
  transform: translateY(-100%) scale(0.9);
}

.ui-toast-provider--bottom-right .toast-enter-from,
.ui-toast-provider--bottom-left .toast-enter-from {
  transform: translateY(100%);
}

.ui-toast-provider--bottom-right .toast-enter-from {
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .ui-toast-provider {
    left: 0 !important;
    right: 0 !important;
    transform: none !important;
    padding: var(--space-3);
  }

  .ui-toast-provider--top-right,
  .ui-toast-provider--top-left,
  .ui-toast-provider--top-center {
    top: 0;
    bottom: auto;
    align-items: stretch;
  }

  .ui-toast-provider--bottom-right,
  .ui-toast-provider--bottom-left,
  .ui-toast-provider--bottom-center {
    bottom: 0;
    top: auto;
    align-items: stretch;
  }

  .toast-enter-from {
    transform: translateY(-20px);
  }

  .ui-toast-provider--bottom-right .toast-enter-from,
  .ui-toast-provider--bottom-left .toast-enter-from,
  .ui-toast-provider--bottom-center .toast-enter-from {
    transform: translateY(20px);
  }
}
</style>
