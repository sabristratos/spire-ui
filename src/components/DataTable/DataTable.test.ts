import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from './DataTable.vue'

const defaultColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
]

const defaultData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
]

describe('DataTable', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table').exists()).toBe(true)
      expect(wrapper.find('.ui-table__table').exists()).toBe(true)
    })

    it('renders all column headers', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      const headers = wrapper.findAll('.ui-table__header-cell')
      expect(headers.length).toBe(3)
      expect(headers[0].text()).toBe('Name')
      expect(headers[1].text()).toBe('Email')
      expect(headers[2].text()).toBe('Role')
    })

    it('renders all data rows', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      const rows = wrapper.findAll('.ui-table__body .ui-table__row')
      expect(rows.length).toBe(3)
    })

    it('renders cell values', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      const cells = wrapper.findAll('.ui-table__cell')
      expect(cells[0].text()).toBe('John Doe')
      expect(cells[1].text()).toBe('john@example.com')
      expect(cells[2].text()).toBe('Admin')
    })

    it('renders nested property values', () => {
      const columns = [{ key: 'user.email', label: 'User Email' }]
      const data = [{ id: 1, user: { email: 'nested@example.com' } }]
      const wrapper = mount(DataTable, {
        props: { columns, data }
      })
      expect(wrapper.find('.ui-table__cell').text()).toBe('nested@example.com')
    })

    it('handles missing nested values gracefully', () => {
      const columns = [{ key: 'user.email', label: 'User Email' }]
      const data = [{ id: 1, user: {} }]
      const wrapper = mount(DataTable, {
        props: { columns, data }
      })
      expect(wrapper.find('.ui-table__cell').text()).toBe('')
    })
  })

  describe('Empty State', () => {
    it('renders empty state when data is empty', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: [] }
      })
      expect(wrapper.find('.ui-table__row--empty').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true)
    })

    it('renders default empty message', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: [] }
      })
      const emptyState = wrapper.findComponent({ name: 'EmptyState' })
      expect(emptyState.props('title')).toBe('No data available')
    })

    it('renders custom empty message', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: [],
          emptyMessage: 'No users found'
        }
      })
      const emptyState = wrapper.findComponent({ name: 'EmptyState' })
      expect(emptyState.props('title')).toBe('No users found')
    })

    it('renders empty slot when provided', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: [] },
        slots: {
          empty: '<div class="custom-empty">Custom empty state</div>'
        }
      })
      expect(wrapper.find('.custom-empty').exists()).toBe(true)
    })
  })

  describe('Loading State', () => {
    it('applies loading class when loading', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, loading: true }
      })
      expect(wrapper.find('.ui-table--loading').exists()).toBe(true)
    })

    it('sets aria-busy when loading', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, loading: true }
      })
      expect(wrapper.find('.ui-table__table').attributes('aria-busy')).toBe('true')
    })

    it('renders skeleton rows when loading', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, loading: true }
      })
      const skeletonRows = wrapper.findAll('.ui-table__row--skeleton')
      expect(skeletonRows.length).toBe(5) // default skeletonRows
    })

    it('renders custom number of skeleton rows', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          loading: true,
          skeletonRows: 10
        }
      })
      const skeletonRows = wrapper.findAll('.ui-table__row--skeleton')
      expect(skeletonRows.length).toBe(10)
    })

    it('renders skeleton bars in each cell', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          loading: true,
          skeletonRows: 1
        }
      })
      const skeletons = wrapper.findAllComponents({ name: 'Skeleton' })
      expect(skeletons.length).toBe(3)
    })
  })

  describe('Selection', () => {
    it('renders checkbox column when selectable', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true
        }
      })
      expect(wrapper.find('.ui-table__header-cell--checkbox').exists()).toBe(true)
      const checkboxCells = wrapper.findAll('.ui-table__cell--checkbox')
      expect(checkboxCells.length).toBe(3)
    })

    it('does not render checkbox column when not selectable', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--checkbox').exists()).toBe(false)
    })

    it('emits update:selectedIds when row is selected', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: []
        }
      })
      const checkbox = wrapper.findAllComponents({ name: 'Checkbox' })[1]
      await checkbox.vm.$emit('update:modelValue', true)
      expect(wrapper.emitted('update:selectedIds')).toBeTruthy()
      expect(wrapper.emitted('update:selectedIds')![0]).toEqual([[1]])
    })

    it('emits update:selectedIds when row is deselected', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: [1, 2]
        }
      })
      const checkbox = wrapper.findAllComponents({ name: 'Checkbox' })[1]
      await checkbox.vm.$emit('update:modelValue', false)
      expect(wrapper.emitted('update:selectedIds')![0]).toEqual([[2]])
    })

    it('applies selected class to selected rows', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: [1]
        }
      })
      const rows = wrapper.findAll('.ui-table__body .ui-table__row')
      expect(rows[0].classes()).toContain('ui-table__row--selected')
      expect(rows[1].classes()).not.toContain('ui-table__row--selected')
    })

    it('select all selects all rows', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: []
        }
      })
      const selectAllCheckbox = wrapper.findAllComponents({ name: 'Checkbox' })[0]
      await selectAllCheckbox.vm.$emit('update:modelValue', true)
      expect(wrapper.emitted('update:selectedIds')![0]).toEqual([[1, 2, 3]])
    })

    it('select all deselects all rows', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: [1, 2, 3]
        }
      })
      const selectAllCheckbox = wrapper.findAllComponents({ name: 'Checkbox' })[0]
      await selectAllCheckbox.vm.$emit('update:modelValue', false)
      expect(wrapper.emitted('update:selectedIds')![0]).toEqual([[]])
    })

    it('select all checkbox is indeterminate when some selected', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: [1]
        }
      })
      const selectAllCheckbox = wrapper.findAllComponents({ name: 'Checkbox' })[0]
      expect(selectAllCheckbox.props('indeterminate')).toBe(true)
    })

    it('select all checkbox is checked when all selected', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: [1, 2, 3]
        }
      })
      const selectAllCheckbox = wrapper.findAllComponents({ name: 'Checkbox' })[0]
      expect(selectAllCheckbox.props('modelValue')).toBe(true)
      expect(selectAllCheckbox.props('indeterminate')).toBe(false)
    })

    it('uses custom rowKey for selection', async () => {
      const data = [
        { uuid: 'a', name: 'John' },
        { uuid: 'b', name: 'Jane' }
      ]
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', label: 'Name' }],
          data,
          selectable: true,
          selectedIds: [],
          rowKey: 'uuid'
        }
      })
      const checkbox = wrapper.findAllComponents({ name: 'Checkbox' })[1]
      await checkbox.vm.$emit('update:modelValue', true)
      expect(wrapper.emitted('update:selectedIds')![0]).toEqual([['a']])
    })
  })

  describe('Sorting', () => {
    it('renders sortable header when column is sortable', () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--sortable').exists()).toBe(true)
    })

    it('does not render sortable header when column is not sortable', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--sortable').exists()).toBe(false)
    })

    it('renders sort icon on sortable columns', () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__sort-icon').exists()).toBe(true)
    })

    it('emits sort-change on header click', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('click')
      expect(wrapper.emitted('sort-change')).toBeTruthy()
      expect(wrapper.emitted('sort-change')![0]).toEqual([{ key: 'name', direction: 'asc' }])
    })

    it('cycles through sort directions: asc -> desc -> null', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      const header = wrapper.find('.ui-table__header-cell--sortable')

      await header.trigger('click')
      expect(wrapper.emitted('sort-change')![0]).toEqual([{ key: 'name', direction: 'asc' }])

      await header.trigger('click')
      expect(wrapper.emitted('sort-change')![1]).toEqual([{ key: 'name', direction: 'desc' }])

      await header.trigger('click')
      expect(wrapper.emitted('sort-change')![2]).toEqual([{ key: null, direction: null }])
    })

    it('resets to asc when switching to different sortable column', async () => {
      const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true }
      ]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      const headers = wrapper.findAll('.ui-table__header-cell--sortable')

      await headers[0].trigger('click')
      expect(wrapper.emitted('sort-change')![0]).toEqual([{ key: 'name', direction: 'asc' }])

      await headers[1].trigger('click')
      expect(wrapper.emitted('sort-change')![1]).toEqual([{ key: 'email', direction: 'asc' }])
    })

    it('sorts data locally in ascending order', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const data = [
        { id: 1, name: 'Charlie' },
        { id: 2, name: 'Alice' },
        { id: 3, name: 'Bob' }
      ]
      const wrapper = mount(DataTable, {
        props: { columns, data }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('click')
      const cells = wrapper.findAll('.ui-table__cell')
      expect(cells[0].text()).toBe('Alice')
      expect(cells[1].text()).toBe('Bob')
      expect(cells[2].text()).toBe('Charlie')
    })

    it('sorts data locally in descending order', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Charlie' },
        { id: 3, name: 'Bob' }
      ]
      const wrapper = mount(DataTable, {
        props: { columns, data }
      })
      const header = wrapper.find('.ui-table__header-cell--sortable')
      await header.trigger('click')
      await header.trigger('click')
      const cells = wrapper.findAll('.ui-table__cell')
      expect(cells[0].text()).toBe('Charlie')
      expect(cells[1].text()).toBe('Bob')
      expect(cells[2].text()).toBe('Alice')
    })

    it('sorts numeric values correctly', async () => {
      const columns = [{ key: 'age', label: 'Age', sortable: true }]
      const data = [
        { id: 1, age: 25 },
        { id: 2, age: 10 },
        { id: 3, age: 100 }
      ]
      const wrapper = mount(DataTable, {
        props: { columns, data }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('click')
      const cells = wrapper.findAll('.ui-table__cell')
      expect(cells[0].text()).toBe('10')
      expect(cells[1].text()).toBe('25')
      expect(cells[2].text()).toBe('100')
    })

    it('handles null values in sorting', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const data = [
        { id: 1, name: 'Bob' },
        { id: 2, name: null },
        { id: 3, name: 'Alice' }
      ]
      const wrapper = mount(DataTable, {
        props: { columns, data }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('click')
      const cells = wrapper.findAll('.ui-table__cell')
      expect(cells[0].text()).toBe('Alice')
      expect(cells[1].text()).toBe('Bob')
      expect(cells[2].text()).toBe('')
    })

    it('applies sorted class to active sort column', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('click')
      expect(wrapper.find('.ui-table__header-cell--sorted').exists()).toBe(true)
    })

    it('applies asc class to sort icon when ascending', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('click')
      expect(wrapper.find('.ui-table__sort-icon--asc').exists()).toBe(true)
    })

    it('applies desc class to sort icon when descending', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      const header = wrapper.find('.ui-table__header-cell--sortable')
      await header.trigger('click')
      await header.trigger('click')
      expect(wrapper.find('.ui-table__sort-icon--desc').exists()).toBe(true)
    })

    it('supports keyboard navigation for sorting', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('sort-change')).toBeTruthy()
    })

    it('supports Space key for sorting', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      await wrapper.find('.ui-table__header-cell--sortable').trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('sort-change')).toBeTruthy()
    })

    it('sets aria-sort attribute', async () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      const header = wrapper.find('.ui-table__header-cell--sortable')
      expect(header.attributes('aria-sort')).toBe('none')

      await header.trigger('click')
      expect(header.attributes('aria-sort')).toBe('ascending')

      await header.trigger('click')
      expect(header.attributes('aria-sort')).toBe('descending')
    })
  })

  describe('Row Click', () => {
    it('emits row-click when row is clicked', async () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      await wrapper.find('.ui-table__row').trigger('click')
      expect(wrapper.emitted('row-click')).toBeTruthy()
      expect(wrapper.emitted('row-click')![0]).toEqual([defaultData[0], 0])
    })

    it('emits row-click with correct row and index', async () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      const rows = wrapper.findAll('.ui-table__body .ui-table__row')
      await rows[2].trigger('click')
      expect(wrapper.emitted('row-click')![0]).toEqual([defaultData[2], 2])
    })

    it('does not trigger row-click when checkbox is clicked', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true,
          selectedIds: []
        }
      })
      await wrapper.find('.ui-table__cell--checkbox').trigger('click')
      expect(wrapper.emitted('row-click')).toBeFalsy()
    })
  })

  describe('Sizes', () => {
    it('applies small size', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, size: 'sm' }
      })
      expect(wrapper.find('.ui-table--sm').exists()).toBe(true)
    })

    it('applies medium size by default', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table--md').exists()).toBe(true)
    })

    it('applies large size', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, size: 'lg' }
      })
      expect(wrapper.find('.ui-table--lg').exists()).toBe(true)
    })
  })

  describe('Visual Options', () => {
    it('applies striped class', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, striped: true }
      })
      expect(wrapper.find('.ui-table--striped').exists()).toBe(true)
    })

    it('applies hoverable class by default', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table--hoverable').exists()).toBe(true)
    })

    it('removes hoverable class when disabled', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, hoverable: false }
      })
      expect(wrapper.find('.ui-table--hoverable').exists()).toBe(false)
    })

    it('applies bordered class', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, bordered: true }
      })
      expect(wrapper.find('.ui-table--bordered').exists()).toBe(true)
    })

    it('applies sticky header class', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, stickyHeader: true }
      })
      expect(wrapper.find('.ui-table--sticky-header').exists()).toBe(true)
    })
  })

  describe('Column Alignment', () => {
    it('applies left alignment by default', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--left').exists()).toBe(true)
      expect(wrapper.find('.ui-table__cell--left').exists()).toBe(true)
    })

    it('applies center alignment', () => {
      const columns = [{ key: 'name', label: 'Name', align: 'center' as const }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--center').exists()).toBe(true)
      expect(wrapper.find('.ui-table__cell--center').exists()).toBe(true)
    })

    it('applies right alignment', () => {
      const columns = [{ key: 'name', label: 'Name', align: 'right' as const }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--right').exists()).toBe(true)
      expect(wrapper.find('.ui-table__cell--right').exists()).toBe(true)
    })
  })

  describe('Column Width', () => {
    it('applies custom width to column', () => {
      const columns = [{ key: 'name', label: 'Name', width: '200px' }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell').attributes('style')).toContain('width: 200px')
    })
  })

  describe('Slots', () => {
    it('renders custom header slot', () => {
      const columns = [{ key: 'name', label: 'Name' }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData },
        slots: {
          'header-name': '<span class="custom-header">Custom Name</span>'
        }
      })
      expect(wrapper.find('.custom-header').exists()).toBe(true)
    })

    it('renders custom cell slot', () => {
      const columns = [{ key: 'name', label: 'Name' }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData },
        slots: {
          'cell-name': '<span class="custom-cell">Custom</span>'
        }
      })
      expect(wrapper.findAll('.custom-cell').length).toBe(3)
    })

    it('passes correct props to cell slot', () => {
      const columns = [{ key: 'name', label: 'Name' }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData },
        slots: {
          'cell-name': `
            <template #cell-name="{ value, row, column, index }">
              <span class="slot-content" data-value="{{ value }}" data-index="{{ index }}">
                {{ value }} - {{ index }}
              </span>
            </template>
          `
        }
      })
      expect(wrapper.find('.slot-content').exists()).toBe(true)
    })

    it('renders loading slot when provided', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData, loading: true },
        slots: {
          loading: '<div class="custom-loading">Loading...</div>'
        }
      })
      expect(wrapper.find('.ui-table__row--skeleton').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has accessible select all checkbox', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true
        }
      })
      const selectAllCheckbox = wrapper.findAllComponents({ name: 'Checkbox' })[0]
      expect(selectAllCheckbox.attributes('aria-label')).toBe('Select all rows')
    })

    it('has accessible row checkboxes', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: defaultColumns,
          data: defaultData,
          selectable: true
        }
      })
      const rowCheckbox = wrapper.findAllComponents({ name: 'Checkbox' })[1]
      expect(rowCheckbox.attributes('aria-label')).toBe('Select row 1')
    })

    it('sortable headers have role button', () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--sortable').attributes('role')).toBe('button')
    })

    it('sortable headers have tabindex', () => {
      const columns = [{ key: 'name', label: 'Name', sortable: true }]
      const wrapper = mount(DataTable, {
        props: { columns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell--sortable').attributes('tabindex')).toBe('0')
    })

    it('non-sortable headers do not have role', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      expect(wrapper.find('.ui-table__header-cell').attributes('role')).toBeUndefined()
    })

    it('cells have data-label for mobile', () => {
      const wrapper = mount(DataTable, {
        props: { columns: defaultColumns, data: defaultData }
      })
      const cell = wrapper.find('.ui-table__cell')
      expect(cell.attributes('data-label')).toBe('Name')
    })
  })
})
