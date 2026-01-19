<script setup lang="ts">
</script>

<template>
  <li class="ui-breadcrumb__item">
    <slot />
  </li>
</template>

<style scoped>
.ui-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
