<script setup lang="ts">
</script>

<template>
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    class="ui-breadcrumb__page"
  >
    <slot />
  </span>
</template>

<style scoped>
.ui-breadcrumb__page {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  margin: calc(var(--space-1) * -1);
  color: var(--breadcrumb-current, var(--text-primary));
  font-weight: var(--font-medium);
}
</style>
