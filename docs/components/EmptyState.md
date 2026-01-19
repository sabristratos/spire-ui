# EmptyState

Structured placeholder for empty data states with 4-layer stack: icon, title, description, and action slot.

## Usage

```vue
<script setup>
import { EmptyState, Button } from 'spire-ui'
</script>

<template>
  <EmptyState
    title="No projects yet"
    description="Create your first project to get started."
  >
    <Button size="sm">Create Project</Button>
  </EmptyState>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Statement text (e.g., "No results found") |
| `description` | `string` | — | Explanation text |
| `icon` | `IconInput` | — | Custom icon (overrides variant default) |
| `variant` | `'default' \| 'search' \| 'error'` | `'default'` | Visual variant |
| `compact` | `boolean` | `false` | Reduced padding for smaller containers |

## Variants

| Variant | Icon | Use Case |
|---------|------|----------|
| `default` | Inbox | Fresh state, no data created yet |
| `search` | Magnifying glass | No results from search/filter |
| `error` | Alert circle | Failed to load data |

```vue
<!-- Fresh state -->
<EmptyState
  title="No invoices yet"
  description="Create an invoice to get started."
>
  <Button size="sm">Create Invoice</Button>
</EmptyState>

<!-- Filtered state -->
<EmptyState
  variant="search"
  title="No results found"
  description="Try adjusting your search or filters."
>
  <Button size="sm" variant="secondary">Clear Filters</Button>
</EmptyState>

<!-- Error state -->
<EmptyState
  variant="error"
  title="Failed to load data"
  description="Check your connection and try again."
>
  <Button size="sm">Retry</Button>
  <Button size="sm" variant="secondary">Contact Support</Button>
</EmptyState>
```

## Compact Mode

For smaller containers like sidebars or nested sections:

```vue
<Card variant="outline" style="height: 200px;">
  <EmptyState
    compact
    title="No notifications"
    description="You're all caught up!"
  />
</Card>
```

## Custom Icon

Override the variant icon with a custom one:

```vue
<script setup>
import { FolderIcon } from 'some-icon-library'
</script>

<template>
  <EmptyState
    :icon="FolderIcon"
    title="No files uploaded"
    description="Drag and drop files here."
  />
</template>
```

## In DataTable

DataTable uses EmptyState internally. Customize via the `empty` slot:

```vue
<DataTable :data="[]" :columns="columns">
  <template #empty>
    <EmptyState
      variant="search"
      title="No matching users"
      description="Try a different search query"
      compact
    >
      <Button size="sm" variant="secondary">Clear Search</Button>
    </EmptyState>
  </template>
</DataTable>
```

## 4-Layer Stack Structure

1. **Icon** — Visual anchor, muted color
2. **Title** — Clear statement, medium weight
3. **Description** — Explanation, smaller muted text, max-width constrained
4. **Action Slot** — Call-to-action buttons

## Action Slot

The default slot renders below the description for action buttons:

```vue
<EmptyState title="No items" description="Get started by adding one.">
  <!-- Multiple buttons supported -->
  <Button size="sm">Add Item</Button>
  <Button size="sm" variant="secondary">Import</Button>
</EmptyState>
```

## Accessibility

- Icons from the registry include appropriate sizing
- Use descriptive title text for screen readers
- Action buttons should have clear labels

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--empty-state-icon` | Icon color |
| `--empty-state-icon-error` | Error variant icon color |
| `--empty-state-title` | Title text color |
| `--empty-state-description` | Description text color |
