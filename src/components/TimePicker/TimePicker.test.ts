import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import TimePicker from './TimePicker.vue'

config.global.stubs = {
  teleport: true
}

describe('TimePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders input element', () => {
      const wrapper = mount(TimePicker)
      expect(wrapper.find('.ui-input-wrapper').exists()).toBe(true)
    })

    it('renders with label', () => {
      const wrapper = mount(TimePicker, {
        props: { label: 'Start Time' }
      })
      expect(wrapper.find('.ui-input-field__label').text()).toBe('Start Time')
    })

    it('renders with placeholder', () => {
      const wrapper = mount(TimePicker, {
        props: { placeholder: 'Select time' }
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Select time')
    })

    it('renders default placeholder for 12h format', () => {
      const wrapper = mount(TimePicker, {
        props: { format: '12h' }
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('hh:mm AM/PM')
    })

    it('renders default placeholder for 24h format', () => {
      const wrapper = mount(TimePicker, {
        props: { format: '24h' }
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('HH:mm')
    })

    it('renders with hint text', () => {
      const wrapper = mount(TimePicker, {
        props: { hint: 'Choose your preferred time' }
      })
      expect(wrapper.find('.ui-input-field__message--hint').text()).toBe('Choose your preferred time')
    })

    it('renders with error message', () => {
      const wrapper = mount(TimePicker, {
        props: { error: 'Time is required' }
      })
      expect(wrapper.find('.ui-input-field__message--error').text()).toBe('Time is required')
    })

    it('renders required indicator', () => {
      const wrapper = mount(TimePicker, {
        props: { label: 'Time', required: true }
      })
      expect(wrapper.find('.ui-input-field__required').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('displays formatted time when value is set (12h)', () => {
      const wrapper = mount(TimePicker, {
        props: { modelValue: '14:30', format: '12h' }
      })
      expect(wrapper.find('input').element.value).toBe('02:30 PM')
    })

    it('displays formatted time when value is set (24h)', () => {
      const wrapper = mount(TimePicker, {
        props: { modelValue: '14:30', format: '24h' }
      })
      expect(wrapper.find('input').element.value).toBe('14:30')
    })

    it('emits update:modelValue when time is parsed from input', async () => {
      const wrapper = mount(TimePicker, {
        props: { format: '12h' }
      })

      const input = wrapper.find('input')
      await input.setValue('2:30pm')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['14:30'])
    })

    it('handles midnight correctly (12h)', () => {
      const wrapper = mount(TimePicker, {
        props: { modelValue: '00:00', format: '12h' }
      })
      expect(wrapper.find('input').element.value).toBe('12:00 AM')
    })

    it('handles noon correctly (12h)', () => {
      const wrapper = mount(TimePicker, {
        props: { modelValue: '12:00', format: '12h' }
      })
      expect(wrapper.find('input').element.value).toBe('12:00 PM')
    })
  })

  describe('Size variants', () => {
    it('applies xs size class', () => {
      const wrapper = mount(TimePicker, {
        props: { size: 'xs' }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--xs')
    })

    it('applies sm size class', () => {
      const wrapper = mount(TimePicker, {
        props: { size: 'sm' }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--sm')
    })

    it('applies md size class', () => {
      const wrapper = mount(TimePicker, {
        props: { size: 'md' }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--md')
    })

    it('applies lg size class', () => {
      const wrapper = mount(TimePicker, {
        props: { size: 'lg' }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--lg')
    })

    it('applies xl size class', () => {
      const wrapper = mount(TimePicker, {
        props: { size: 'xl' }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--xl')
    })
  })

  describe('States', () => {
    it('applies disabled state', () => {
      const wrapper = mount(TimePicker, {
        props: { disabled: true }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--disabled')
    })

    it('applies block state', () => {
      const wrapper = mount(TimePicker, {
        props: { block: true }
      })
      expect(wrapper.find('.ui-timepicker').classes()).toContain('ui-timepicker--block')
    })
  })

  describe('Popover panel', () => {
    it('renders hour column', async () => {
      const wrapper = mount(TimePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-timepicker__column').exists()).toBe(true)
    })

    it('renders separator between columns', async () => {
      const wrapper = mount(TimePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-timepicker__separator').text()).toBe(':')
    })

    it('renders period column for 12h format', async () => {
      const wrapper = mount(TimePicker, {
        props: { format: '12h' },
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-timepicker__column--period').exists()).toBe(true)
    })

    it('does not render period column for 24h format', async () => {
      const wrapper = mount(TimePicker, {
        props: { format: '24h' },
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-timepicker__column--period').exists()).toBe(false)
    })

    it('renders highlight bar', async () => {
      const wrapper = mount(TimePicker, {
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.ui-timepicker__highlight').exists()).toBe(true)
    })

    it('renders 12 hours for 12h format', async () => {
      const wrapper = mount(TimePicker, {
        props: { format: '12h' },
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const columns = wrapper.findAll('.ui-timepicker__column')
      const hourColumn = columns[0]
      const hourItems = hourColumn.findAll('.ui-timepicker__item')
      expect(hourItems.length).toBe(12)
    })

    it('renders 24 hours for 24h format', async () => {
      const wrapper = mount(TimePicker, {
        props: { format: '24h' },
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const columns = wrapper.findAll('.ui-timepicker__column')
      const hourColumn = columns[0]
      const hourItems = hourColumn.findAll('.ui-timepicker__item')
      expect(hourItems.length).toBe(24)
    })

    it('renders 60 minutes by default', async () => {
      const wrapper = mount(TimePicker, {
        props: { minuteStep: 1 },
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const columns = wrapper.findAll('.ui-timepicker__column')
      const minuteColumn = columns[1]
      const minuteItems = minuteColumn.findAll('.ui-timepicker__item')
      expect(minuteItems.length).toBe(60)
    })

    it('respects minuteStep prop', async () => {
      const wrapper = mount(TimePicker, {
        props: { minuteStep: 15 },
        attachTo: document.body
      })

      await wrapper.find('.ui-popover__trigger').trigger('click')
      await wrapper.vm.$nextTick()

      const columns = wrapper.findAll('.ui-timepicker__column')
      const minuteColumn = columns[1]
      const minuteItems = minuteColumn.findAll('.ui-timepicker__item')
      expect(minuteItems.length).toBe(4)
    })
  })

  describe('Accessibility', () => {
    it('auto-generates unique id', () => {
      const wrapper = mount(TimePicker)
      const input = wrapper.find('input')
      expect(input.attributes('id')).toMatch(/^timepicker-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(TimePicker, {
        props: { id: 'custom-time-id' }
      })
      const input = wrapper.find('input')
      expect(input.attributes('id')).toBe('custom-time-id')
    })

    it('links label to input via for attribute', () => {
      const wrapper = mount(TimePicker, {
        props: { label: 'Time', id: 'time-input' }
      })
      expect(wrapper.find('label').attributes('for')).toBe('time-input')
    })
  })

  describe('HTML attributes', () => {
    it('passes name attribute to input', () => {
      const wrapper = mount(TimePicker, {
        props: { name: 'meeting-time' }
      })
      expect(wrapper.find('input').attributes('name')).toBe('meeting-time')
    })
  })

  describe('Exposed methods', () => {
    it('exposes open method', () => {
      const wrapper = mount(TimePicker)
      expect(typeof wrapper.vm.open).toBe('function')
    })

    it('exposes close method', () => {
      const wrapper = mount(TimePicker)
      expect(typeof wrapper.vm.close).toBe('function')
    })

    it('exposes toggle method', () => {
      const wrapper = mount(TimePicker)
      expect(typeof wrapper.vm.toggle).toBe('function')
    })
  })

  describe('Focus and blur events', () => {
    it('emits focus event', async () => {
      const wrapper = mount(TimePicker)
      await wrapper.find('input').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event', async () => {
      const wrapper = mount(TimePicker)
      await wrapper.find('input').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })
})
