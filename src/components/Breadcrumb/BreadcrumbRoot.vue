<script setup lang="ts">
import { provide, useSlots } from 'vue'
import { BreadcrumbKey } from './keys'
import type { Component, VNode } from 'vue'

export interface BreadcrumbRootProps {
  /** Custom separator component or string */
  separator?: Component | string | (() => VNode)
}

const props = withDefaults(defineProps<BreadcrumbRootProps>(), {
  separator: '/'
})

defineSlots<{
  default?(): unknown
  separator?(): unknown
}>()

const slots = useSlots()

provide(BreadcrumbKey, {
  separator: (slots as Record<string, unknown>).separator
    ? () => (slots as { separator: () => VNode[] }).separator()
    : props.separator
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="ui-breadcrumb">
    <slot />
  </nav>
</template>

<style scoped>
.ui-breadcrumb {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}
</style>
