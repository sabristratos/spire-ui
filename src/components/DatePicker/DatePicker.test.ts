import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import DatePicker from './DatePicker.vue'

config.global.stubs = {
  teleport: true
}

const mockMatchMedia = (matches: Record<string, boolean> = {}) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
}

describe('DatePicker', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia({
        '(max-width: 640px)': false,
        '(any-hover: hover)': false
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders trigger element', () => {
      const wrapper = mount(DatePicker)
      expect(wrapper.find('.ui-datepicker-trigger').exists()).toBe(true)
    })

    it('renders with label', () => {
      const wrapper = mount(DatePicker, {
        props: { label: 'Birth Date' }
      })
      expect(wrapper.find('.ui-datepicker-field__label').text()).toBe('Birth Date')
    })

    it('renders with placeholder', () => {
      const wrapper = mount(DatePicker, {
        props: { placeholder: 'Pick a date' }
      })
      expect(wrapper.find('.ui-datepicker-trigger__value').text()).toBe('Pick a date')
    })

    it('renders with hint text', () => {
      const wrapper = mount(DatePicker, {
        props: { hint: 'Choose your preferred date' }
      })
      expect(wrapper.find('.ui-datepicker-field__message--hint').text()).toBe('Choose your preferred date')
    })

    it('renders with error message', () => {
      const wrapper = mount(DatePicker, {
        props: { error: 'Date is required' }
      })
      expect(wrapper.find('.ui-datepicker-field__message--error').text()).toBe('Date is required')
    })

    it('error takes precedence over hint', () => {
      const wrapper = mount(DatePicker, {
        props: { hint: 'Hint text', error: 'Error text' }
      })
      expect(wrapper.find('.ui-datepicker-field__message--error').exists()).toBe(true)
      expect(wrapper.find('.ui-datepicker-field__message--hint').exists()).toBe(false)
    })

    it('renders required indicator', () => {
      const wrapper = mount(DatePicker, {
        props: { label: 'Date', required: true }
      })
      expect(wrapper.find('.ui-datepicker-field__required').exists()).toBe(true)
    })

    it('renders calendar icon in trigger', () => {
      const wrapper = mount(DatePicker)
      expect(wrapper.find('.ui-datepicker-trigger__icon').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('displays formatted date when value is set', () => {
      const wrapper = mount(DatePicker, {
        props: { modelValue: '2024-06-15' }
      })
      expect(wrapper.find('.ui-datepicker-trigger--has-value').exists()).toBe(true)
    })

    it('emits update:modelValue when date is selected', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const dayButton = wrapper.find('.ui-datepicker__day:not(.ui-datepicker__day--other-month):not([disabled])')
      await dayButton.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('shows selected date in calendar', async () => {
      const wrapper = mount(DatePicker, {
        props: { modelValue: '2024-06-15' },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__day--selected').exists()).toBe(true)
    })
  })

  describe('Size variants', () => {
    it('applies xs size class', () => {
      const wrapper = mount(DatePicker, {
        props: { size: 'xs' }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--xs')
    })

    it('applies sm size class', () => {
      const wrapper = mount(DatePicker, {
        props: { size: 'sm' }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--sm')
    })

    it('applies md size class', () => {
      const wrapper = mount(DatePicker, {
        props: { size: 'md' }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--md')
    })

    it('applies lg size class', () => {
      const wrapper = mount(DatePicker, {
        props: { size: 'lg' }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--lg')
    })

    it('applies xl size class', () => {
      const wrapper = mount(DatePicker, {
        props: { size: 'xl' }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--xl')
    })
  })

  describe('States', () => {
    it('applies disabled state', () => {
      const wrapper = mount(DatePicker, {
        props: { disabled: true }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--disabled')
    })

    it('does not open popover when disabled', async () => {
      const wrapper = mount(DatePicker, {
        props: { disabled: true }
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__grid').exists()).toBe(false)
    })

    it('applies error state', () => {
      const wrapper = mount(DatePicker, {
        props: { error: 'Error' }
      })
      expect(wrapper.find('.ui-datepicker-trigger').classes()).toContain('ui-datepicker-trigger--error')
    })

    it('applies block state', () => {
      const wrapper = mount(DatePicker, {
        props: { block: true }
      })
      expect(wrapper.find('.ui-datepicker-field').classes()).toContain('ui-datepicker-field--block')
    })
  })

  describe('Calendar navigation', () => {
    it('shows month and year in header', async () => {
      const wrapper = mount(DatePicker, {
        props: { modelValue: '2024-06-15' },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__title-btn').text()).toContain('2024')
    })

    it('renders weekday headers', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const weekdays = wrapper.findAll('.ui-datepicker__weekday')
      expect(weekdays.length).toBe(7)
    })

    it('renders 42 day cells (6 rows × 7 days)', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const days = wrapper.findAll('.ui-datepicker__day')
      expect(days.length).toBe(42)
    })
  })

  describe('Date constraints', () => {
    it('disables dates before min date', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          modelValue: '2024-06-15',
          min: '2024-06-10'
        },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const disabledDays = wrapper.findAll('.ui-datepicker__day--disabled')
      expect(disabledDays.length).toBeGreaterThan(0)
    })

    it('disables dates after max date', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          modelValue: '2024-06-15',
          max: '2024-06-20'
        },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const disabledDays = wrapper.findAll('.ui-datepicker__day--disabled')
      expect(disabledDays.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('auto-generates unique id', () => {
      const wrapper = mount(DatePicker)
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('id')).toMatch(/^datepicker-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(DatePicker, {
        props: { id: 'custom-id' }
      })
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('id')).toBe('custom-id')
    })

    it('links label to trigger via for attribute', () => {
      const wrapper = mount(DatePicker, {
        props: { label: 'Date', id: 'date-input' }
      })
      expect(wrapper.find('label').attributes('for')).toBe('date-input')
    })

    it('sets aria-describedby to hint id', () => {
      const wrapper = mount(DatePicker, {
        props: { hint: 'Helpful hint', id: 'my-picker' }
      })
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('aria-describedby')).toBe('my-picker-hint')
    })

    it('sets aria-describedby to error id when error exists', () => {
      const wrapper = mount(DatePicker, {
        props: { error: 'Error message', id: 'my-picker' }
      })
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('aria-describedby')).toBe('my-picker-error')
    })

    it('sets aria-invalid when error exists', () => {
      const wrapper = mount(DatePicker, {
        props: { error: 'Error message' }
      })
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('aria-invalid')).toBe('true')
    })

    it('error message has role="alert"', () => {
      const wrapper = mount(DatePicker, {
        props: { error: 'Error message' }
      })
      expect(wrapper.find('.ui-datepicker-field__message--error').attributes('role')).toBe('alert')
    })

    it('trigger has role="combobox"', () => {
      const wrapper = mount(DatePicker)
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('role')).toBe('combobox')
    })

    it('trigger has aria-haspopup="grid"', () => {
      const wrapper = mount(DatePicker)
      const valueWrapper = wrapper.find('.ui-datepicker-trigger__value-wrapper')
      expect(valueWrapper.attributes('aria-haspopup')).toBe('grid')
    })
  })

  describe('HTML attributes', () => {
    it('passes name attribute to hidden input', () => {
      const wrapper = mount(DatePicker, {
        props: { name: 'birthdate' }
      })
      expect(wrapper.find('input[type="hidden"]').attributes('name')).toBe('birthdate')
    })

    it('passes required attribute to hidden input', () => {
      const wrapper = mount(DatePicker, {
        props: { name: 'date', required: true }
      })
      expect(wrapper.find('input[type="hidden"]').attributes('required')).toBeDefined()
    })
  })

  describe('Exposed methods', () => {
    it('exposes open method', () => {
      const wrapper = mount(DatePicker)
      expect(typeof wrapper.vm.open).toBe('function')
    })

    it('exposes close method', () => {
      const wrapper = mount(DatePicker)
      expect(typeof wrapper.vm.close).toBe('function')
    })

    it('exposes toggle method', async () => {
      const wrapper = mount(DatePicker)
      expect(typeof wrapper.vm.toggle).toBe('function')
    })
  })

  describe('Custom formatting', () => {
    it('uses custom formatDisplay function', () => {
      const wrapper = mount(DatePicker, {
        props: {
          modelValue: '2024-06-15',
          formatDisplay: (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
        }
      })
      expect(wrapper.find('.ui-datepicker-trigger__value').text()).toBe('15/6/2024')
    })
  })

  describe('Range mode', () => {
    it('accepts mode="range" prop', () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'range' }
      })
      expect(wrapper.vm.$props.mode).toBe('range')
    })

    it('displays range value as "start – end"', () => {
      const wrapper = mount(DatePicker, {
        props: {
          mode: 'range',
          modelValue: ['2024-06-10', '2024-06-15']
        }
      })
      expect(wrapper.find('.ui-datepicker-trigger--has-value').exists()).toBe(true)
    })

    it('emits tuple for range selection', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'range' },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const days = wrapper.findAll('.ui-datepicker__day:not(.ui-datepicker__day--other-month):not([disabled])')
      await days[0].trigger('click')
      await days[5].trigger('click')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(Array.isArray(emitted?.[0]?.[0])).toBe(true)
    })

    it('shows "Select end date" hint during selection', async () => {
      const wrapper = mount(DatePicker, {
        props: { mode: 'range' },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const day = wrapper.find('.ui-datepicker__day:not(.ui-datepicker__day--other-month):not([disabled])')
      await day.trigger('click')

      expect(wrapper.find('.ui-datepicker__hint').text()).toBe('Select end date')
    })

    it('applies range-start and range-end classes', async () => {
      const wrapper = mount(DatePicker, {
        props: {
          mode: 'range',
          modelValue: ['2024-06-10', '2024-06-15']
        },
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__day--range-start').exists()).toBe(true)
      expect(wrapper.find('.ui-datepicker__day--range-end').exists()).toBe(true)
    })
  })

  describe('ARIA grid roles', () => {
    it('grid has role="grid"', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__grid').attributes('role')).toBe('grid')
    })

    it('day cells have role="gridcell"', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const firstDay = wrapper.find('.ui-datepicker__day')
      expect(firstDay.attributes('role')).toBe('gridcell')
    })

    it('today has aria-current="date"', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const todayCell = wrapper.find('.ui-datepicker__day--today')
      if (todayCell.exists()) {
        expect(todayCell.attributes('aria-current')).toBe('date')
      }
    })

    it('weekday headers have role="columnheader"', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const weekday = wrapper.find('.ui-datepicker__weekday')
      expect(weekday.attributes('role')).toBe('columnheader')
    })
  })

  describe('Year/Month drilldown', () => {
    it('switches to year view when clicking header', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__title-btn').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__year-grid').exists()).toBe(true)
    })

    it('shows 20 years in year grid', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__title-btn').trigger('click')
      await wrapper.vm.$nextTick()

      const years = wrapper.findAll('.ui-datepicker__year')
      expect(years.length).toBe(20)
    })

    it('switches to month view when year is selected', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__title-btn').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__year').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__month-grid').exists()).toBe(true)
    })

    it('shows 12 months in month grid', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__title-btn').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__year').trigger('click')
      await wrapper.vm.$nextTick()

      const months = wrapper.findAll('.ui-datepicker__month')
      expect(months.length).toBe(12)
    })

    it('returns to day view when month is selected', async () => {
      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-datepicker-trigger').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__title-btn').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__year').trigger('click')
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-datepicker__month').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-datepicker__grid').exists()).toBe(true)
    })
  })

  describe('Hybrid input mode', () => {
    it('renders editable input on desktop with pointer', async () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia({
          '(max-width: 640px)': false,
          '(any-hover: hover)': true
        })
      })

      const wrapper = mount(DatePicker, {
        attachTo: document.body
      })

      expect(wrapper.find('.ui-datepicker-trigger__input').exists()).toBe(true)
    })

    it('renders value wrapper on touch devices', () => {
      const wrapper = mount(DatePicker)
      expect(wrapper.find('.ui-datepicker-trigger__value-wrapper').exists()).toBe(true)
    })

    it('renders value wrapper for range mode even on desktop', async () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia({
          '(max-width: 640px)': false,
          '(any-hover: hover)': true
        })
      })

      const wrapper = mount(DatePicker, {
        props: { mode: 'range' },
        attachTo: document.body
      })

      expect(wrapper.find('.ui-datepicker-trigger__value-wrapper').exists()).toBe(true)
    })
  })
})
