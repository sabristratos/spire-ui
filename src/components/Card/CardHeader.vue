<script setup lang="ts">
import { inject, onMounted, useSlots } from 'vue'

export interface CardHeaderProps {
  /** Title text (alternative to slot) */
  title?: string
  /** Subtitle text (alternative to slot) */
  subtitle?: string
  /** Aligns header content */
  align?: 'start' | 'center'
}

const props = withDefaults(defineProps<CardHeaderProps>(), {
  align: 'start'
})

const slots = useSlots()

const cardContext = inject<{
  registerHeader: () => void
} | null>('card', null)

onMounted(() => {
  cardContext?.registerHeader()
})

const hasActions = !!slots.actions
</script>

<template>
  <div
    class="ui-card__header"
    :class="[`ui-card__header--${align}`]"
  >
    <div class="ui-card__header-content">
      <slot name="title">
        <h3 v-if="title" class="ui-card__title">{{ title }}</h3>
      </slot>
      <slot name="subtitle">
        <p v-if="subtitle" class="ui-card__subtitle">{{ subtitle }}</p>
      </slot>
      <slot />
    </div>
    <div v-if="$slots.actions" class="ui-card__header-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.ui-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
}

.ui-card__header--start {
  text-align: start;
}

.ui-card__header--center {
  text-align: center;
  justify-content: center;
}

.ui-card__header--center .ui-card__header-content {
  align-items: center;
}

.ui-card__header-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
  flex: 1;
}

.ui-card__header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ui-card__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--card-title);
}

.ui-card__subtitle {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--card-subtitle);
}
</style>
