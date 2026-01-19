<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { IconInput } from '../Icon/Icon.vue'
import { useInternalIcon } from '../../config/icons'

export type EmptyStateVariant = 'default' | 'search' | 'error'

export interface EmptyStateProps {
  /** Title text */
  title?: string
  /** Description text */
  description?: string
  /** Custom icon to display (overrides variant icon) */
  icon?: IconInput
  /** Visual variant */
  variant?: EmptyStateVariant
  /** Compact mode with reduced padding */
  compact?: boolean
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  variant: 'default',
  compact: false
})

const slots = useSlots()

const resolvedIcon = computed(() => {
  if (props.icon) return null
  switch (props.variant) {
    case 'search': return useInternalIcon('emptySearch')
    case 'error': return useInternalIcon('error')
    default: return useInternalIcon('emptyData')
  }
})

const hasCustomIcon = computed(() => !!props.icon)
const hasTitle = computed(() => !!props.title)
const hasDescription = computed(() => !!props.description)
const hasAction = computed(() => !!slots.default)
</script>

<template>
  <div
    class="ui-empty-state"
    :class="[
      `ui-empty-state--${variant}`,
      { 'ui-empty-state--compact': compact }
    ]"
  >
    <div class="ui-empty-state__content">
      <div v-if="hasCustomIcon" class="ui-empty-state__icon">
        <Icon :icon="icon!" size="48px" />
      </div>

      <div v-else class="ui-empty-state__icon ui-empty-state__icon--default">
        <component :is="resolvedIcon" class="ui-empty-state__icon-svg" />
      </div>

      <div v-if="hasTitle" class="ui-empty-state__title">
        {{ title }}
      </div>

      <div v-if="hasDescription" class="ui-empty-state__description">
        {{ description }}
      </div>

      <div v-if="hasAction" class="ui-empty-state__action">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  padding: var(--space-8) var(--space-4);
  padding-bottom: var(--space-12);
  text-align: center;
  font-family: var(--font-sans);
}

.ui-empty-state--compact {
  min-height: 10rem;
  padding: var(--space-6) var(--space-4);
  padding-bottom: var(--space-8);
}

.ui-empty-state__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  max-width: 24rem;
}

.ui-empty-state__icon {
  color: var(--empty-state-icon);
  margin-bottom: var(--space-2);
}

.ui-empty-state__icon-svg {
  width: 48px;
  height: 48px;
}

.ui-empty-state--error .ui-empty-state__icon {
  color: var(--empty-state-icon-error);
}

.ui-empty-state__title {
  font-size: var(--text-md);
  font-weight: var(--font-medium);
  color: var(--empty-state-title);
  line-height: var(--leading-tight);
}

.ui-empty-state__description {
  font-size: var(--text-sm);
  color: var(--empty-state-description);
  line-height: var(--leading-normal);
  max-width: 20rem;
}

.ui-empty-state__action {
  margin-top: var(--space-3);
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
