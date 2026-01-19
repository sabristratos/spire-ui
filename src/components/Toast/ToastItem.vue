<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Avatar from '../Avatar/Avatar.vue'
import type { Toast, ToastVariant } from './toastState'

export interface ToastItemProps {
  /** Toast data */
  toast: Toast
}

const props = defineProps<ToastItemProps>()

const emit = defineEmits<{
  (e: 'dismiss', id: string): void
}>()

const isPaused = ref(false)
const remainingTime = ref(props.toast.duration)
let timerId: ReturnType<typeof setTimeout> | null = null
let startTime = 0

const isClickable = computed(() => !!props.toast.onClick)

const hasAvatar = computed(() => !!props.toast.avatar)

const ariaRole = computed(() => {
  return props.toast.variant === 'error' ? 'alert' : 'status'
})

const ariaLive = computed(() => {
  return props.toast.variant === 'error' ? 'assertive' : 'polite'
})

function startTimer() {
  if (props.toast.duration <= 0) return
  if (remainingTime.value <= 0) return

  startTime = Date.now()
  timerId = setTimeout(() => {
    emit('dismiss', props.toast.id)
  }, remainingTime.value)
}

function pauseTimer() {
  if (timerId) {
    clearTimeout(timerId)
    timerId = null
    const elapsed = Date.now() - startTime
    remainingTime.value = Math.max(0, remainingTime.value - elapsed)
  }
}

function handleMouseEnter() {
  isPaused.value = true
  pauseTimer()
}

function handleMouseLeave() {
  isPaused.value = false
  startTimer()
}

function handleClose(event: Event) {
  event.stopPropagation()
  emit('dismiss', props.toast.id)
}

function handleBodyClick() {
  if (props.toast.onClick) {
    props.toast.onClick()
    emit('dismiss', props.toast.id)
  }
}

function handleActionClick(event: Event) {
  event.stopPropagation()
  if (props.toast.action) {
    props.toast.action.onClick()
    emit('dismiss', props.toast.id)
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerId) {
    clearTimeout(timerId)
  }
})

const iconPaths: Record<ToastVariant, string> = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}
</script>

<template>
  <div
    class="ui-toast"
    :class="[
      `ui-toast--${toast.variant}`,
      { 'ui-toast--clickable': isClickable }
    ]"
    :role="ariaRole"
    :aria-live="ariaLive"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleBodyClick"
  >
    <div v-if="hasAvatar" class="ui-toast__avatar">
      <Avatar
        :src="toast.avatar?.src"
        :name="toast.avatar?.name"
        size="sm"
      />
    </div>
    <div v-else class="ui-toast__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="iconPaths[toast.variant]" />
      </svg>
    </div>

    <div class="ui-toast__content">
      <div v-if="toast.title" class="ui-toast__title">{{ toast.title }}</div>
      <div v-if="toast.message" class="ui-toast__message">{{ toast.message }}</div>

      <button
        v-if="toast.action"
        type="button"
        class="ui-toast__action"
        @click="handleActionClick"
      >
        {{ toast.action.label }}
      </button>
    </div>

    <button
      type="button"
      class="ui-toast__close"
      aria-label="Dismiss notification"
      @click="handleClose"
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

    <div
      v-if="toast.duration > 0"
      class="ui-toast__progress"
      :class="{ 'ui-toast__progress--paused': isPaused }"
      :style="{ '--toast-duration': `${toast.duration}ms` }"
    />
  </div>
</template>

<style scoped>
.ui-toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  max-width: 400px;
  padding: var(--space-4);
  background: var(--toast-bg);
  border: 1px solid var(--toast-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  pointer-events: auto;
}

.ui-toast--clickable {
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-toast--clickable:hover {
  background: var(--toast-bg-hover, var(--color-stone-50));
}

.ui-toast__avatar {
  flex-shrink: 0;
}

.ui-toast__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 1px;
}

.ui-toast__icon svg {
  width: 100%;
  height: 100%;
}

.ui-toast__content {
  flex: 1;
  min-width: 0;
}

.ui-toast__title {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--toast-title);
  line-height: 1.4;
}

.ui-toast__message {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--toast-message);
  line-height: 1.4;
  margin-top: var(--space-1);
}

.ui-toast__title + .ui-toast__message {
  margin-top: var(--space-1);
}

.ui-toast__action {
  display: inline-block;
  margin-top: var(--space-2);
  padding: 0;
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--toast-action);
  cursor: pointer;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-default);
}

.ui-toast__action:hover {
  color: var(--toast-action-hover);
  text-decoration: underline;
}

.ui-toast__action:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.ui-toast__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  margin: -0.25rem -0.25rem -0.25rem 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--toast-close);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.ui-toast__close:hover {
  background: var(--toast-close-hover-bg);
  color: var(--toast-close-hover);
}

.ui-toast__close:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-toast__close svg {
  width: 1rem;
  height: 1rem;
}

.ui-toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--toast-progress);
  transform-origin: left;
  animation: toast-progress var(--toast-duration) linear forwards;
}

.ui-toast__progress--paused {
  animation-play-state: paused;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.ui-toast--success {
  --toast-icon: var(--toast-success-icon);
  --toast-progress: var(--toast-success-progress);
  --toast-action: var(--toast-success-icon);
  --toast-action-hover: var(--color-teal-700);
}

.ui-toast--success .ui-toast__icon {
  color: var(--toast-icon);
}

.ui-toast--error {
  --toast-icon: var(--toast-error-icon);
  --toast-progress: var(--toast-error-progress);
  --toast-action: var(--toast-error-icon);
  --toast-action-hover: var(--color-coral-700);
}

.ui-toast--error .ui-toast__icon {
  color: var(--toast-icon);
}

.ui-toast--warning {
  --toast-icon: var(--toast-warning-icon);
  --toast-progress: var(--toast-warning-progress);
  --toast-action: var(--toast-warning-icon);
  --toast-action-hover: var(--color-amber-600);
}

.ui-toast--warning .ui-toast__icon {
  color: var(--toast-icon);
}

.ui-toast--info {
  --toast-icon: var(--toast-info-icon);
  --toast-progress: var(--toast-info-progress);
  --toast-action: var(--toast-info-icon);
  --toast-action-hover: var(--color-indigo-700);
}

.ui-toast--info .ui-toast__icon {
  color: var(--toast-icon);
}
</style>
