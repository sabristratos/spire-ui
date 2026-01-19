<script setup lang="ts">
import { computed, ref } from 'vue'
import Checkbox from '../Checkbox/Checkbox.vue'
import EmptyState from '../EmptyState/EmptyState.vue'
import Skeleton from '../Skeleton/Skeleton.vue'
import { getNestedValue } from '../../utils/object'
import { useInternalIcon } from '../../config/icons'

const skeletonWidths = ['60%', '75%', '90%', '70%', '85%', '65%', '80%', '55%']
function getSkeletonWidth(rowIndex: number, colIndex: number): string {
  return skeletonWidths[(rowIndex * 3 + colIndex) % skeletonWidths.length]
}

const SortAscIcon = useInternalIcon('sortAsc')
const SortDescIcon = useInternalIcon('sortDesc')
const SortNeutralIcon = useInternalIcon('sortNeutral')

export type SortDirection = 'asc' | 'desc' | null
export type ColumnAlign = 'left' | 'center' | 'right'

export interface DataTableColumn {
  /** Key path (supports dot notation: 'user.email') */
  key: string
  /** Header label */
  label: string
  /** Text alignment */
  align?: ColumnAlign
  /** Fixed width (e.g., '80px') */
  width?: string
  /** Enable sorting */
  sortable?: boolean
}

export interface SortState {
  key: string | null
  direction: SortDirection
}

export interface DataTableProps {
  /** Data array */
  data: Record<string, unknown>[]
  /** Column definitions */
  columns: DataTableColumn[]
  /** Enable row selection */
  selectable?: boolean
  /** Selected row IDs (v-model:selectedIds) */
  selectedIds?: (string | number)[]
  /** Row identifier key (default: 'id') */
  rowKey?: string
  /** Loading state */
  loading?: boolean
  /** Skeleton rows count (default: 5) */
  skeletonRows?: number
  /** Striped rows */
  striped?: boolean
  /** Row hover effect */
  hoverable?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Empty state message */
  emptyMessage?: string
  /** Show cell borders */
  bordered?: boolean
  /** Sticky header */
  stickyHeader?: boolean
}

const props = withDefaults(defineProps<DataTableProps>(), {
  selectable: false,
  selectedIds: () => [],
  rowKey: 'id',
  loading: false,
  skeletonRows: 5,
  striped: false,
  hoverable: true,
  size: 'md',
  emptyMessage: 'No data available',
  bordered: false,
  stickyHeader: false
})

const emit = defineEmits<{
  (e: 'update:selectedIds', value: (string | number)[]): void
  (e: 'sort-change', value: SortState): void
  (e: 'row-click', row: Record<string, unknown>, index: number): void
}>()

const currentSort = ref<SortState>({ key: null, direction: null })

function getRowId(row: Record<string, unknown>): string | number {
  const id = row[props.rowKey]
  if (typeof id === 'string' || typeof id === 'number') {
    return id
  }
  console.warn(`DataTable: Row key "${props.rowKey}" must be string or number`)
  return String(id)
}

function getCellValue(row: Record<string, unknown>, key: string): unknown {
  return getNestedValue(row, key)
}

const allSelected = computed(() => {
  if (props.data.length === 0) return false
  return props.data.every(row => props.selectedIds.includes(getRowId(row)))
})

const someSelected = computed(() => {
  if (props.data.length === 0) return false
  return props.selectedIds.length > 0 && !allSelected.value
})

function toggleAll(checked: boolean) {
  if (checked) {
    const allIds = props.data.map(row => getRowId(row))
    emit('update:selectedIds', allIds)
  } else {
    emit('update:selectedIds', [])
  }
}

function toggleRow(row: Record<string, unknown>, checked: boolean) {
  const id = getRowId(row)
  if (checked) {
    emit('update:selectedIds', [...props.selectedIds, id])
  } else {
    emit('update:selectedIds', props.selectedIds.filter(sid => sid !== id))
  }
}

function isRowSelected(row: Record<string, unknown>): boolean {
  return props.selectedIds.includes(getRowId(row))
}

function handleSort(column: DataTableColumn) {
  if (!column.sortable) return

  let newDirection: SortDirection

  if (currentSort.value.key !== column.key) {
    newDirection = 'asc'
  } else {
    const cycle: SortDirection[] = [null, 'asc', 'desc']
    const currentIndex = cycle.indexOf(currentSort.value.direction)
    newDirection = cycle[(currentIndex + 1) % 3]
  }

  currentSort.value = {
    key: newDirection ? column.key : null,
    direction: newDirection
  }

  emit('sort-change', currentSort.value)
}

function handleKeydownSort(event: KeyboardEvent, column: DataTableColumn) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSort(column)
  }
}

const sortedData = computed(() => {
  if (!currentSort.value.key || !currentSort.value.direction) {
    return props.data
  }

  const key = currentSort.value.key
  const dir = currentSort.value.direction === 'asc' ? 1 : -1

  return [...props.data].sort((a, b) => {
    const aVal = getCellValue(a, key)
    const bVal = getCellValue(b, key)

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * dir
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * dir
    }

    return (String(aVal) < String(bVal) ? -1 : String(aVal) > String(bVal) ? 1 : 0) * dir
  })
})

function handleRowClick(row: Record<string, unknown>, index: number) {
  emit('row-click', row, index)
}

const totalColumns = computed(() => {
  return props.columns.length + (props.selectable ? 1 : 0)
})

const skeletonArray = computed(() => Array.from({ length: props.skeletonRows }))
</script>

<template>
  <div
    class="ui-table"
    :class="[
      `ui-table--${size}`,
      {
        'ui-table--striped': striped,
        'ui-table--hoverable': hoverable,
        'ui-table--bordered': bordered,
        'ui-table--loading': loading,
        'ui-table--sticky-header': stickyHeader
      }
    ]"
  >
    <div class="ui-table__wrapper">
      <table class="ui-table__table" :aria-busy="loading || undefined">
        <thead class="ui-table__header">
          <tr class="ui-table__header-row">
            <th
              v-if="selectable"
              class="ui-table__header-cell ui-table__header-cell--checkbox"
            >
              <Checkbox
                :model-value="allSelected"
                :indeterminate="someSelected"
                size="sm"
                aria-label="Select all rows"
                @update:model-value="toggleAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              class="ui-table__header-cell"
              :class="[
                `ui-table__header-cell--${column.align || 'left'}`,
                {
                  'ui-table__header-cell--sortable': column.sortable,
                  'ui-table__header-cell--sorted': currentSort.key === column.key
                }
              ]"
              :style="column.width ? { width: column.width } : undefined"
              :aria-sort="
                column.sortable
                  ? currentSort.key === column.key
                    ? currentSort.direction === 'asc'
                      ? 'ascending'
                      : currentSort.direction === 'desc'
                        ? 'descending'
                        : 'none'
                    : 'none'
                  : undefined
              "
              :tabindex="column.sortable ? 0 : undefined"
              :role="column.sortable ? 'button' : undefined"
              @click="handleSort(column)"
              @keydown="handleKeydownSort($event, column)"
            >
              <div class="ui-table__header-content">
                <slot :name="`header-${column.key}`" :column="column">
                  <span class="ui-table__header-text">{{ column.label }}</span>
                </slot>
                <span
                  v-if="column.sortable"
                  class="ui-table__sort-icon"
                  :class="{
                    'ui-table__sort-icon--asc': currentSort.key === column.key && currentSort.direction === 'asc',
                    'ui-table__sort-icon--desc': currentSort.key === column.key && currentSort.direction === 'desc'
                  }"
                  aria-hidden="true"
                >
                  <component
                    v-if="currentSort.key !== column.key || !currentSort.direction"
                    :is="SortNeutralIcon"
                    class="ui-table__sort-svg ui-table__sort-svg--neutral"
                  />
                  <component
                    v-else-if="currentSort.direction === 'asc'"
                    :is="SortAscIcon"
                    class="ui-table__sort-svg"
                  />
                  <component
                    v-else
                    :is="SortDescIcon"
                    class="ui-table__sort-svg"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="ui-table__body">
          <template v-if="loading">
            <tr
              v-for="(_, skeletonIndex) in skeletonArray"
              :key="`skeleton-${skeletonIndex}`"
              class="ui-table__row ui-table__row--skeleton"
            >
              <td v-if="selectable" class="ui-table__cell ui-table__cell--checkbox">
                <Skeleton variant="rect" :width="16" :height="16" />
              </td>
              <td
                v-for="(column, colIndex) in columns"
                :key="column.key"
                class="ui-table__cell"
                :class="[`ui-table__cell--${column.align || 'left'}`]"
              >
                <Skeleton
                  variant="text"
                  :width="getSkeletonWidth(skeletonIndex, colIndex)"
                  :height="16"
                />
              </td>
            </tr>
          </template>

          <template v-else-if="sortedData.length === 0">
            <tr class="ui-table__row ui-table__row--empty">
              <td :colspan="totalColumns" class="ui-table__cell ui-table__cell--empty">
                <slot name="empty">
                  <EmptyState
                    :title="emptyMessage"
                    compact
                  />
                </slot>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(row, rowIndex) in sortedData"
              :key="getRowId(row)"
              class="ui-table__row"
              :class="{
                'ui-table__row--selected': isRowSelected(row),
                'ui-table__row--clickable': $attrs.onRowClick
              }"
              @click="handleRowClick(row, rowIndex)"
            >
              <td
                v-if="selectable"
                class="ui-table__cell ui-table__cell--checkbox"
                @click.stop
              >
                <Checkbox
                  :model-value="isRowSelected(row)"
                  size="sm"
                  :aria-label="`Select row ${rowIndex + 1}`"
                  @update:model-value="toggleRow(row, $event)"
                />
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                class="ui-table__cell"
                :class="[`ui-table__cell--${column.align || 'left'}`]"
                :data-label="column.label"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :value="getCellValue(row, column.key)"
                  :row="row"
                  :column="column"
                  :index="rowIndex"
                >
                  {{ getCellValue(row, column.key) ?? '' }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.ui-table {
  font-family: var(--font-sans);
  width: 100%;
}

.ui-table__wrapper {
  overflow-x: auto;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-lg);
  background: var(--table-bg);
}

.ui-table__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.ui-table__header {
  background: var(--table-header-bg);
}

.ui-table__header-row {
  border-bottom: 1px solid var(--table-border);
}

.ui-table__header-cell {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--table-header-text);
  white-space: nowrap;
  user-select: none;
}

.ui-table__header-cell--center {
  text-align: center;
}

.ui-table__header-cell--right {
  text-align: right;
}

.ui-table__header-cell--checkbox {
  width: 48px;
  text-align: center;
}

.ui-table__header-cell--sortable {
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-default);
}

.ui-table__header-cell--sortable:hover {
  color: var(--table-sort-icon-active);
}

.ui-table__header-cell--sortable:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: -2px;
}

.ui-table__header-content {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.ui-table__header-cell--center .ui-table__header-content {
  justify-content: center;
}

.ui-table__header-cell--right .ui-table__header-content {
  justify-content: flex-end;
}

.ui-table__sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: var(--table-sort-icon);
  transition: color var(--duration-fast) var(--ease-default);
}

.ui-table__sort-svg {
  width: 100%;
  height: 100%;
}

.ui-table__sort-svg--neutral {
  opacity: 0.5;
}

.ui-table__sort-icon--asc,
.ui-table__sort-icon--desc {
  color: var(--table-sort-icon-active);
}

.ui-table__sort-icon--asc .ui-table__sort-svg--neutral,
.ui-table__sort-icon--desc .ui-table__sort-svg--neutral {
  opacity: 1;
}

.ui-table__header-cell--sortable:hover .ui-table__sort-icon {
  color: var(--table-sort-icon-active);
}

.ui-table__header-cell--sortable:hover .ui-table__sort-svg--neutral {
  opacity: 1;
}

.ui-table__body {
  background: var(--table-bg);
}

.ui-table__row {
  border-bottom: 1px solid var(--table-border);
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-table__row:last-child {
  border-bottom: none;
}

.ui-table--hoverable .ui-table__row:not(.ui-table__row--empty):not(.ui-table__row--skeleton):hover {
  background-color: var(--table-row-hover);
}

.ui-table__row--selected {
  background-color: var(--table-row-selected);
}

.ui-table--hoverable .ui-table__row--selected:hover {
  background-color: var(--table-row-selected);
}

.ui-table__row--clickable {
  cursor: pointer;
}

.ui-table--striped .ui-table__row:nth-child(even):not(.ui-table__row--selected) {
  background-color: var(--table-row-striped);
}

.ui-table__cell {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--table-cell-text);
  vertical-align: middle;
}

.ui-table__cell--center {
  text-align: center;
}

.ui-table__cell--right {
  text-align: right;
}

.ui-table__cell--checkbox {
  width: 48px;
  text-align: center;
}

.ui-table__cell--empty {
  padding: 0;
  text-align: center;
}

.ui-table--bordered .ui-table__cell {
  border-right: 1px solid var(--table-border);
}

.ui-table--bordered .ui-table__cell:last-child {
  border-right: none;
}

.ui-table--bordered .ui-table__header-cell {
  border-right: 1px solid var(--table-border);
}

.ui-table--bordered .ui-table__header-cell:last-child {
  border-right: none;
}

.ui-table--sm .ui-table__header-cell,
.ui-table--sm .ui-table__cell {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.ui-table--lg .ui-table__header-cell,
.ui-table--lg .ui-table__cell {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-md);
}

.ui-table--sticky-header .ui-table__wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.ui-table--sticky-header .ui-table__header {
  position: sticky;
  top: 0;
  z-index: 1;
}

@media (max-width: 768px) {
  .ui-table__wrapper {
    border: none;
    border-radius: 0;
    background: transparent;
  }

  .ui-table__header {
    display: none;
  }

  .ui-table__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .ui-table__row {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--table-border);
    border-radius: var(--radius-lg);
    background: var(--table-bg);
    padding: var(--space-3);
  }

  .ui-table__row--empty {
    padding: var(--space-6);
  }

  .ui-table__row--skeleton {
    min-height: 120px;
  }

  .ui-table__cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--table-border);
  }

  .ui-table__cell:last-child {
    border-bottom: none;
  }

  .ui-table__cell::before {
    content: attr(data-label);
    font-weight: var(--font-medium);
    color: var(--table-header-text);
    margin-right: var(--space-4);
    flex-shrink: 0;
  }

  .ui-table__cell--checkbox {
    justify-content: flex-start;
    border-bottom: 1px solid var(--table-border);
  }

  .ui-table__cell--checkbox::before {
    content: 'Select';
  }

  .ui-table__cell--empty {
    border-bottom: none;
  }

  .ui-table__cell--empty::before {
    display: none;
  }

  .ui-table--bordered .ui-table__cell {
    border-right: none;
  }
}
</style>
