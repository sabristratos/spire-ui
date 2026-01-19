import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SegmentedControl from './SegmentedControl.vue'

const defaultOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
]

describe('SegmentedControl', () => {
  describe('Rendering', () => {
    it('renders as a radiogroup', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
    })

    it('renders all options', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions }
      })
      const items = wrapper.findAll('[role="radio"]')
      expect(items).toHaveLength(3)
    })

    it('renders option labels', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions }
      })
      expect(wrapper.text()).toContain('Day')
      expect(wrapper.text()).toContain('Week')
      expect(wrapper.text()).toContain('Month')
    })

    it('renders the glider element', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      expect(wrapper.find('.ui-segmented__glider').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('marks selected option with aria-checked', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'week' }
      })
      const items = wrapper.findAll('[role="radio"]')
      expect(items[0].attributes('aria-checked')).toBe('false')
      expect(items[1].attributes('aria-checked')).toBe('true')
      expect(items[2].attributes('aria-checked')).toBe('false')
    })

    it('applies selected class to active option', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'week' }
      })
      const items = wrapper.findAll('.ui-segmented__item')
      expect(items[1].classes()).toContain('ui-segmented__item--selected')
    })

    it('emits update:modelValue on click', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      await wrapper.findAll('[role="radio"]')[2].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
    })

    it('emits change event on click', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      await wrapper.findAll('[role="radio"]')[1].trigger('click')
      expect(wrapper.emitted('change')?.[0]).toEqual(['week'])
    })
  })

  describe('Size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(SegmentedControl, {
          props: { options: defaultOptions, size }
        })
        expect(wrapper.find('.ui-segmented').classes()).toContain(`ui-segmented--${size}`)
      })
    })

    it('defaults to md size', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('.ui-segmented').classes()).toContain('ui-segmented--md')
    })
  })

  describe('Disabled state', () => {
    it('applies disabled class when disabled', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, disabled: true }
      })
      expect(wrapper.find('.ui-segmented').classes()).toContain('ui-segmented--disabled')
    })

    it('sets aria-disabled on container', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, disabled: true }
      })
      expect(wrapper.find('[role="radiogroup"]').attributes('aria-disabled')).toBe('true')
    })

    it('disables all buttons when control is disabled', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, disabled: true }
      })
      const buttons = wrapper.findAll('button')
      buttons.forEach(btn => {
        expect(btn.attributes('disabled')).toBeDefined()
      })
    })

    it('does not emit events when disabled', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day', disabled: true }
      })
      await wrapper.findAll('[role="radio"]')[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Individual option disabled', () => {
    const optionsWithDisabled = [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week', disabled: true },
      { label: 'Month', value: 'month' }
    ]

    it('disables individual option', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: optionsWithDisabled }
      })
      const items = wrapper.findAll('button')
      expect(items[0].attributes('disabled')).toBeUndefined()
      expect(items[1].attributes('disabled')).toBeDefined()
      expect(items[2].attributes('disabled')).toBeUndefined()
    })

    it('applies disabled class to disabled option', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: optionsWithDisabled }
      })
      const items = wrapper.findAll('.ui-segmented__item')
      expect(items[1].classes()).toContain('ui-segmented__item--disabled')
    })

    it('does not emit when clicking disabled option', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: optionsWithDisabled, modelValue: 'day' }
      })
      await wrapper.findAll('[role="radio"]')[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Keyboard navigation', () => {
    it('moves to next option on ArrowRight', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      await wrapper.findAll('[role="radio"]')[0].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['week'])
    })

    it('moves to previous option on ArrowLeft', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'week' }
      })
      await wrapper.findAll('[role="radio"]')[1].trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['day'])
    })

    it('wraps around from last to first on ArrowRight', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'month' }
      })
      await wrapper.findAll('[role="radio"]')[2].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['day'])
    })

    it('wraps around from first to last on ArrowLeft', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      await wrapper.findAll('[role="radio"]')[0].trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
    })

    it('moves to first option on Home', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'month' }
      })
      await wrapper.findAll('[role="radio"]')[2].trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['day'])
    })

    it('moves to last option on End', async () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      await wrapper.findAll('[role="radio"]')[0].trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
    })
  })

  describe('Accessibility', () => {
    it('has aria-label when label prop provided', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, label: 'Select time range' }
      })
      expect(wrapper.find('[role="radiogroup"]').attributes('aria-label')).toBe('Select time range')
    })

    it('auto-generates unique id', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('[role="radiogroup"]').attributes('id')).toMatch(/^segmented-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, id: 'custom-segmented' }
      })
      expect(wrapper.find('[role="radiogroup"]').attributes('id')).toBe('custom-segmented')
    })

    it('selected item has tabindex 0, others have -1', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'week' }
      })
      const items = wrapper.findAll('[role="radio"]')
      expect(items[0].attributes('tabindex')).toBe('-1')
      expect(items[1].attributes('tabindex')).toBe('0')
      expect(items[2].attributes('tabindex')).toBe('-1')
    })

    it('glider has aria-hidden', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, modelValue: 'day' }
      })
      expect(wrapper.find('.ui-segmented__glider').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Form submission', () => {
    it('does not render hidden input by default', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    })

    it('renders hidden input when name prop provided', () => {
      const wrapper = mount(SegmentedControl, {
        props: { options: defaultOptions, name: 'time_range', modelValue: 'week' }
      })
      const input = wrapper.find('input[type="hidden"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('name')).toBe('time_range')
      expect(input.attributes('value')).toBe('week')
    })
  })

  describe('Value types', () => {
    it('works with number values', async () => {
      const numberOptions = [
        { label: '1', value: 1 },
        { label: '5', value: 5 },
        { label: '10', value: 10 }
      ]
      const wrapper = mount(SegmentedControl, {
        props: { options: numberOptions, modelValue: 1 }
      })
      await wrapper.findAll('[role="radio"]')[2].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    })
  })
})
