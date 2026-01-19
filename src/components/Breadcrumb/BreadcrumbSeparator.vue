<script setup lang="ts">
import { inject, useSlots, h, isVNode } from 'vue'
import type { Component, VNode } from 'vue'
import { BreadcrumbKey } from './keys'

defineSlots<{
  default(): unknown
}>()

const breadcrumb = inject(BreadcrumbKey)
const slots = useSlots() as { default?: () => VNode[] }

function renderSeparator(): VNode | string {
  if (slots.default) {
    return slots.default()[0]
  }

  if (!breadcrumb) {
    return '/'
  }

  const sep = breadcrumb.separator

  if (typeof sep === 'string') {
    return sep
  }

  if (typeof sep === 'function') {
    const result = (sep as () => VNode | VNode[])()
    if (isVNode(result)) {
      return result
    }
    if (Array.isArray(result) && result.length > 0) {
      return result[0]
    }
  }

  return h(sep as Component)
}
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    class="ui-breadcrumb__separator"
  >
    <component :is="() => renderSeparator()" />
  </li>
</template>

<style scoped>
.ui-breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  color: var(--breadcrumb-separator, var(--text-tertiary));
}

.ui-breadcrumb__separator :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
