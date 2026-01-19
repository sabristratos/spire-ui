<script setup lang="ts">
import { computed, type Component } from 'vue'

export interface BreadcrumbLinkProps {
  /** URL for standard anchor */
  href?: string
  /** Route location for vue-router (string or route object) */
  to?: string | Record<string, unknown>
  /** Custom component to render as */
  as?: string | Component
}

const props = defineProps<BreadcrumbLinkProps>()

const componentType = computed(() => {
  if (props.as) return props.as
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'a'
})

const linkProps = computed(() => {
  if (props.to) {
    return { to: props.to }
  }
  if (props.href) {
    return { href: props.href }
  }
  return {}
})
</script>

<template>
  <component
    :is="componentType"
    v-bind="linkProps"
    class="ui-breadcrumb__link"
  >
    <slot />
  </component>
</template>

<style scoped>
.ui-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  margin: calc(var(--space-1) * -1);
  color: var(--breadcrumb-link, var(--text-secondary));
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition:
    color var(--duration-fast) var(--ease-default),
    background-color var(--duration-fast) var(--ease-default);
}

.ui-breadcrumb__link:hover {
  color: var(--breadcrumb-link-hover, var(--text-primary));
  text-decoration: underline;
}

.ui-breadcrumb__link:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
</style>
