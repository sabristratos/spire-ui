<script setup lang="ts">
import { provide, ref, toRef, computed, type Component } from 'vue'

export type CardVariant = 'elevated' | 'outline' | 'ghost'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  /** Visual style variant */
  variant?: CardVariant
  /** Render as different element (article, section, aside, etc.) */
  as?: string | Component
  /** Makes the entire card clickable with overlay pattern */
  interactive?: boolean
  /** Horizontal layout - image on side instead of top */
  horizontal?: boolean
  /** Disabled state for interactive cards */
  disabled?: boolean
  /** Loading state - shows skeleton overlay */
  loading?: boolean
  /** Custom padding override */
  padding?: CardPadding
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'elevated',
  as: 'div',
  interactive: false,
  horizontal: false,
  disabled: false,
  loading: false,
  padding: 'md'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const hasHeader = ref(false)
const hasTopImage = ref(false)

function registerHeader() {
  hasHeader.value = true
}

function registerTopImage() {
  hasTopImage.value = true
}

provide('card', {
  variant: toRef(props, 'variant'),
  horizontal: toRef(props, 'horizontal'),
  interactive: toRef(props, 'interactive'),
  loading: toRef(props, 'loading'),
  padding: toRef(props, 'padding'),
  hasHeader,
  hasTopImage,
  registerHeader,
  registerTopImage
})

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  if (props.interactive) {
    emit('click', event)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event as unknown as MouseEvent)
  }
}

const isClickable = computed(() => props.interactive && !props.disabled && !props.loading)
</script>

<template>
  <component
    :is="as"
    class="ui-card"
    :class="[
      `ui-card--${variant}`,
      `ui-card--padding-${padding}`,
      {
        'ui-card--interactive': interactive,
        'ui-card--horizontal': horizontal,
        'ui-card--disabled': disabled,
        'ui-card--loading': loading
      }
    ]"
    :tabindex="isClickable ? 0 : undefined"
    :role="isClickable ? 'button' : undefined"
    :aria-disabled="disabled || undefined"
    :aria-busy="loading || undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
    <div v-if="loading" class="ui-card__skeleton" aria-hidden="true" />
  </component>
</template>

<style scoped>
.ui-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: var(--card-radius);
  overflow: hidden;
  font-family: var(--font-sans);
}

.ui-card--elevated {
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
}

.ui-card--outline {
  border: 1px solid var(--card-border);
  box-shadow: none;
}

.ui-card--ghost {
  border: none;
  box-shadow: none;
  background: transparent;
}

.ui-card--interactive {
  cursor: pointer;
  transition:
    box-shadow var(--duration-fast) var(--ease-default),
    border-color var(--duration-fast) var(--ease-default);
}

.ui-card--interactive::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-card--interactive:hover:not(.ui-card--disabled):not(.ui-card--loading)::after {
  background-color: oklch(0 0 0 / calc(var(--depth-shadow-opacity, 0.1) * 0.3));
}

.ui-card--interactive:active:not(.ui-card--disabled):not(.ui-card--loading)::after {
  background-color: oklch(0 0 0 / var(--depth-inset-opacity, 0.06));
}

.ui-card--interactive.ui-card--elevated:hover:not(.ui-card--disabled):not(.ui-card--loading) {
  box-shadow: var(--card-shadow-hover);
  border-color: var(--card-border-hover);
}

.ui-card--interactive > :deep(*) {
  position: relative;
  z-index: 1;
}

.ui-card--interactive:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-card--horizontal {
  flex-direction: row;
}

.ui-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ui-card--loading {
  cursor: wait;
}

.ui-card__skeleton {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: linear-gradient(
    90deg,
    var(--card-bg) 25%,
    var(--color-stone-100) 50%,
    var(--card-bg) 75%
  );
  background-size: 200% 100%;
  animation: card-skeleton-shimmer 1.5s infinite;
  border-radius: inherit;
}

@keyframes card-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 640px) {
  .ui-card--horizontal {
    flex-direction: column;
  }
}
</style>
