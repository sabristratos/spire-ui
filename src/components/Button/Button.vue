<script setup lang="ts">
import { computed, useSlots, type Component, type Slots } from 'vue'
import Spinner from '../Spinner/Spinner.vue'
import Icon from '../Icon/Icon.vue'
import type { IconInput } from '../Icon/Icon.vue'

export interface ButtonProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Render as different element or component (e.g., router-link) */
  as?: string | Component
  /** Show loading spinner and disable interactions */
  loading?: boolean
  /** Disable button */
  disabled?: boolean
  /** Icon to show before text (any format supported by Icon component) */
  iconLeft?: IconInput
  /** Icon to show after text (any format supported by Icon component) */
  iconRight?: IconInput
  /** Make button full width */
  block?: boolean
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  as: 'button',
  type: 'button',
  loading: false,
  disabled: false,
  block: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const slots: Slots = useSlots()

const isDisabled = computed<boolean>(() => props.disabled || props.loading)
const hasIconOnly = computed<boolean>(() => !slots.default && !!(props.iconLeft || props.iconRight))

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const iconSizeMap: Record<string, string> = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)'
}

const iconSize = computed(() => iconSizeMap[props.size])
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="as === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      {
        'ui-button--loading': loading,
        'ui-button--disabled': isDisabled,
        'ui-button--block': block,
        'ui-button--icon-only': hasIconOnly
      }
    ]"
    @click="handleClick"
  >
    <span class="ui-button__highlight" aria-hidden="true" />

    <span class="ui-button__inner" :class="{ 'ui-button__inner--hidden': loading }">
      <span v-if="iconLeft" class="ui-button__icon ui-button__icon--left" aria-hidden="true">
        <Icon :icon="iconLeft" :size="iconSize" />
      </span>

      <span v-if="$slots.default" class="ui-button__content">
        <slot />
      </span>

      <span v-if="iconRight" class="ui-button__icon ui-button__icon--right" aria-hidden="true">
        <Icon :icon="iconRight" :size="iconSize" />
      </span>
    </span>

    <span v-if="loading" class="ui-button__loader" aria-hidden="true">
      <Spinner :size="iconSize" :speed="0.8" label="Loading" />
    </span>
  </component>
</template>

<style scoped>
.ui-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  transition:
    background-color var(--transition-fast) var(--ease-default),
    box-shadow var(--transition-fast) var(--ease-default),
    transform var(--transition-fast) var(--ease-default);
}

.ui-button__highlight {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    oklch(1 0 0 / var(--depth-highlight-opacity, 0.12)),
    transparent 25%
  );
  pointer-events: none;
  border-radius: inherit;
}

.ui-button__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: opacity var(--transition-fast) var(--ease-default);
}

.ui-button__inner--hidden {
  opacity: 0;
}

.ui-button__loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-button--xs {
  height: var(--input-height-xs);
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.ui-button--sm {
  height: var(--input-height-sm);
  padding: 0 var(--space-2);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.ui-button--md {
  height: var(--input-height-md);
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.ui-button--lg {
  height: var(--input-height-lg);
  padding: 0 var(--space-4);
  font-size: var(--text-base);
  border-radius: var(--radius-md);
}

.ui-button--xl {
  height: var(--input-height-xl);
  padding: 0 var(--space-5);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
}

.ui-button--icon-only.ui-button--xs { width: var(--input-height-xs); padding: 0; }
.ui-button--icon-only.ui-button--sm { width: var(--input-height-sm); padding: 0; }
.ui-button--icon-only.ui-button--md { width: var(--input-height-md); padding: 0; }
.ui-button--icon-only.ui-button--lg { width: var(--input-height-lg); padding: 0; }
.ui-button--icon-only.ui-button--xl { width: var(--input-height-xl); padding: 0; }

.ui-button--primary {
  background-color: var(--action-primary);
  color: var(--action-primary-text);
  border: 1px solid var(--action-primary-hover);
  box-shadow:
    0 1px 2px 0 oklch(0 0 0 / var(--depth-shadow-opacity, 0.1)),
    0 1px 3px 0 oklch(0 0 0 / calc(var(--depth-shadow-opacity, 0.1) * 0.8)),
    inset 0 1px 0 0 oklch(1 0 0 / var(--depth-highlight-opacity, 0.1));
}

.ui-button--primary:hover:not(.ui-button--disabled) {
  background-color: var(--action-primary-hover);
}

.ui-button--primary:active:not(.ui-button--disabled) {
  background-color: var(--action-primary-active);
  box-shadow: inset 0 2px 4px 0 oklch(0 0 0 / calc(var(--depth-inset-opacity, 0.06) * 2.5));
  transform: translateY(1px) scale(0.98);
}

.ui-button--primary:active:not(.ui-button--disabled) .ui-button__highlight {
  opacity: 0;
}

.ui-button--secondary {
  background-color: var(--action-secondary);
  color: var(--action-secondary-text);
  border: 1px solid var(--border-default);
  box-shadow:
    0 1px 2px 0 oklch(0 0 0 / calc(var(--depth-shadow-opacity, 0.1) * 0.5)),
    inset 0 1px 0 0 oklch(1 0 0 / calc(var(--depth-highlight-opacity, 0.12) * 0.4));
}

.ui-button--secondary:hover:not(.ui-button--disabled) {
  background-color: var(--action-secondary-hover);
  border-color: var(--border-hover);
}

.ui-button--secondary:active:not(.ui-button--disabled) {
  background-color: var(--action-secondary-active);
  box-shadow: inset 0 2px 4px 0 oklch(0 0 0 / calc(var(--depth-inset-opacity, 0.06) * 1.3));
  transform: translateY(1px) scale(0.98);
}

.ui-button--secondary:active:not(.ui-button--disabled) .ui-button__highlight {
  opacity: 0;
}

.ui-button--destructive {
  background-color: var(--action-destructive);
  color: var(--action-destructive-text);
  border: 1px solid var(--action-destructive-hover);
  box-shadow:
    0 1px 2px 0 oklch(0 0 0 / var(--depth-shadow-opacity, 0.1)),
    0 1px 3px 0 oklch(0 0 0 / calc(var(--depth-shadow-opacity, 0.1) * 0.8)),
    inset 0 1px 0 0 oklch(1 0 0 / var(--depth-highlight-opacity, 0.1));
}

.ui-button--destructive:hover:not(.ui-button--disabled) {
  background-color: var(--action-destructive-hover);
}

.ui-button--destructive:active:not(.ui-button--disabled) {
  background-color: var(--action-destructive-active);
  box-shadow: inset 0 2px 4px 0 oklch(0 0 0 / calc(var(--depth-inset-opacity, 0.06) * 2.5));
  transform: translateY(1px) scale(0.98);
}

.ui-button--destructive:active:not(.ui-button--disabled) .ui-button__highlight {
  opacity: 0;
}

.ui-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid transparent;
  box-shadow: none;
}

.ui-button--ghost .ui-button__highlight {
  display: none;
}

.ui-button--ghost:hover:not(.ui-button--disabled) {
  background-color: var(--action-secondary);
}

.ui-button--ghost:active:not(.ui-button--disabled) {
  background-color: var(--action-secondary-hover);
  transform: scale(0.98);
}

.ui-button--outline {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  box-shadow: none;
}

.ui-button--outline .ui-button__highlight {
  display: none;
}

.ui-button--outline:hover:not(.ui-button--disabled) {
  background-color: var(--action-secondary);
  border-color: var(--border-hover);
}

.ui-button--outline:active:not(.ui-button--disabled) {
  background-color: var(--action-secondary-hover);
  transform: scale(0.98);
}

.ui-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-button--loading {
  cursor: wait;
}

.ui-button--block {
  display: flex;
  width: 100%;
}

.ui-button:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-button__content {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  text-box: trim-both cap alphabetic;
}

.ui-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ui-button__icon svg {
  color: currentColor;
}
</style>
