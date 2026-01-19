<script setup lang="ts">
export interface CardFooterProps {
  /** Content alignment */
  align?: 'start' | 'center' | 'end' | 'between'
  /** Remove separator border */
  borderless?: boolean
}

const props = withDefaults(defineProps<CardFooterProps>(), {
  align: 'end',
  borderless: false
})
</script>

<template>
  <div
    class="ui-card__footer"
    :class="[
      `ui-card__footer--${align}`,
      { 'ui-card__footer--borderless': borderless }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-card__footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: var(--card-footer-bg);
  border-top: 1px solid var(--card-footer-border);
  margin-top: auto;
}

.ui-card__footer--start {
  justify-content: flex-start;
}

.ui-card__footer--center {
  justify-content: center;
}

.ui-card__footer--end {
  justify-content: flex-end;
}

.ui-card__footer--between {
  justify-content: space-between;
}

.ui-card__footer--borderless {
  border-top: none;
  background: transparent;
}
</style>
