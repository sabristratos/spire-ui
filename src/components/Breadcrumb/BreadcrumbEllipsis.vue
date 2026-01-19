<script setup lang="ts">
import { Dropdown, DropdownItem } from '../Dropdown'

export interface BreadcrumbEllipsisItem {
  /** Display label */
  label: string
  /** URL for standard anchor */
  href?: string
  /** Route location for vue-router (string or route object) */
  to?: string | Record<string, unknown>
}

export interface BreadcrumbEllipsisProps {
  /** Hidden breadcrumb items to show in dropdown */
  items?: BreadcrumbEllipsisItem[]
}

const props = withDefaults(defineProps<BreadcrumbEllipsisProps>(), {
  items: () => []
})
</script>

<template>
  <li class="ui-breadcrumb__item">
    <Dropdown v-if="items.length > 0" placement="bottom-start">
      <template #trigger>
        <button
          type="button"
          class="ui-breadcrumb__ellipsis"
          aria-label="Show more breadcrumbs"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="6" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
          </svg>
        </button>
      </template>

      <DropdownItem
        v-for="(item, index) in items"
        :key="index"
        :href="item.href"
        :to="item.to"
      >
        {{ item.label }}
      </DropdownItem>
    </Dropdown>

    <span v-else class="ui-breadcrumb__ellipsis-static" aria-hidden="true">
      <slot>…</slot>
    </span>
  </li>
</template>

<style scoped>
.ui-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--breadcrumb-ellipsis, var(--text-secondary));
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--ease-default),
    background-color var(--duration-fast) var(--ease-default);
}

.ui-breadcrumb__ellipsis:hover {
  color: var(--breadcrumb-ellipsis-hover, var(--text-primary));
  background-color: var(--breadcrumb-ellipsis-bg-hover, var(--surface-hover));
}

.ui-breadcrumb__ellipsis:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.ui-breadcrumb__ellipsis-static {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1);
  color: var(--breadcrumb-ellipsis, var(--text-secondary));
}
</style>
