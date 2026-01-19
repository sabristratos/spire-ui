# DataTable

Config-driven data table with sorting, selection, loading states, and mobile-responsive card transformation.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from 'spire-ui'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', align: 'center' },
  { key: 'status', label: 'Status', width: '100px' }
]

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' }
]

const selectedIds = ref([])
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    selectable
    v-model:selectedIds="selectedIds"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | Required | Data array |
| `columns` | `DataTableColumn[]` | Required | Column definitions |
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedIds` | `(string \| number)[]` | `[]` | Selected row IDs (v-model) |
| `rowKey` | `string` | `'id'` | Row identifier key |
| `loading` | `boolean` | `false` | Loading state |
| `skeletonRows` | `number` | `5` | Skeleton rows count when loading |
| `striped` | `boolean` | `false` | Striped rows |
| `hoverable` | `boolean` | `true` | Row hover effect |
| `bordered` | `boolean` | `false` | Show cell borders |
| `stickyHeader` | `boolean` | `false` | Sticky header |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `responsiveBreakpoint` | `number \| 'none'` | `768` | Mobile breakpoint (px) |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |

## Column Definition

```typescript
interface DataTableColumn {
  key: string           // Key path (supports dot notation: 'user.email')
  label: string         // Header label
  align?: 'left' | 'center' | 'right'  // Text alignment
  width?: string        // Fixed width (e.g., '80px')
  sortable?: boolean    // Enable sorting
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:selectedIds` | `(string \| number)[]` | Selection changed |
| `sort-change` | `SortState` | Sort column/direction changed |
| `row-click` | `row, index` | Row clicked |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `header-{key}` | `{ column }` | Custom header content |
| `cell-{key}` | `{ value, row, column, index }` | Custom cell content |
| `empty` | — | Custom empty state |
| `loading` | — | Custom loading state |

## Sorting

Tri-state cycle: `null` → `asc` → `desc` → `null`

```vue
<script setup>
function handleSortChange(sort) {
  console.log(sort.key, sort.direction) // 'name', 'asc'
  // For server-side sorting, fetch new data here
}
</script>

<template>
  <DataTable
    :columns="[{ key: 'name', label: 'Name', sortable: true }]"
    :data="data"
    @sort-change="handleSortChange"
  />
</template>
```

## Selection

Select-all checkbox supports indeterminate state:

```vue
<script setup>
const selectedIds = ref([])
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    selectable
    v-model:selectedIds="selectedIds"
  />
  <p>Selected: {{ selectedIds.length }} rows</p>
</template>
```

## Nested Properties

Column keys support dot notation for nested objects:

```vue
<script setup>
const columns = [
  { key: 'user.name', label: 'User Name' },
  { key: 'user.email', label: 'Email' },
  { key: 'department.name', label: 'Department' }
]

const data = [
  { id: 1, user: { name: 'John', email: 'john@example.com' }, department: { name: 'Engineering' } }
]
</script>
```

## Custom Cell Rendering

```vue
<template>
  <DataTable :data="data" :columns="columns">
    <template #cell-status="{ value }">
      <Badge :variant="value === 'Active' ? 'success' : 'default'">
        {{ value }}
      </Badge>
    </template>
    <template #cell-price="{ value }">
      ${{ value.toFixed(2) }}
    </template>
  </DataTable>
</template>
```

## Custom Empty State

```vue
<template>
  <DataTable :data="[]" :columns="columns">
    <template #empty>
      <EmptyState
        variant="search"
        title="No results found"
        description="Try adjusting your filters"
      >
        <Button size="sm" variant="secondary">Clear Filters</Button>
      </EmptyState>
    </template>
  </DataTable>
</template>
```

## Loading State

Uses Skeleton component with organic randomized widths (60-90%):

```vue
<DataTable
  :data="data"
  :columns="columns"
  loading
  :skeleton-rows="5"
/>
```

## Mobile Responsive

Below `responsiveBreakpoint` (default 768px), table transforms to stacked cards:

- Table header hides
- Each row becomes a card
- Cells display as `label: value` pairs
- Set `responsiveBreakpoint="none"` to disable

## Size Variants

| Size | Cell Padding | Font Size |
|------|--------------|-----------|
| `sm` | 8px 12px | 12px |
| `md` | 12px 16px | 14px |
| `lg` | 16px 20px | 16px |

## Accessibility

- `aria-sort` on sortable headers
- `aria-busy` during loading
- Keyboard navigation: Enter/Space triggers sort
- Sortable headers have `role="button"` and `tabindex="0"`
- `data-label` on cells for mobile screen readers

## CSS Tokens

| Token | Description |
|-------|-------------|
| `--table-bg` | Table background |
| `--table-border` | Border color |
| `--table-header-bg` | Header background |
| `--table-header-text` | Header text color |
| `--table-cell-text` | Cell text color |
| `--table-row-hover` | Row hover background |
| `--table-row-selected` | Selected row background |
| `--table-row-striped` | Striped row background |
| `--table-sort-icon` | Sort icon color |
| `--table-sort-icon-active` | Active sort icon color |
