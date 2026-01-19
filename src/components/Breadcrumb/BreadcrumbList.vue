<script setup lang="ts">
</script>

<template>
  <ol class="ui-breadcrumb__list">
    <slot />
  </ol>
</template>

<style scoped>
.ui-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
