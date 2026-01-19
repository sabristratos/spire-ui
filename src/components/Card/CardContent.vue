<script setup lang="ts">
import { inject, computed } from 'vue'

export interface CardContentProps {
  /** Remove default padding */
  flush?: boolean
}

const props = withDefaults(defineProps<CardContentProps>(), {
  flush: false
})

const cardContext = inject<{
  hasHeader: { value: boolean }
  hasTopImage: { value: boolean }
} | null>('card', null)

const removeTopPadding = computed(() => cardContext?.hasHeader?.value ?? false)
</script>

<template>
  <div
    class="ui-card__content"
    :class="{
      'ui-card__content--flush': flush,
      'ui-card__content--no-top-padding': removeTopPadding
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-card__content {
  padding: var(--space-6);
  color: var(--card-text);
  flex: 1;
}

.ui-card__content--flush {
  padding: 0;
}

.ui-card__content--no-top-padding {
  padding-top: 0;
}
</style>
