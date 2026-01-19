import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from './Radio.vue'

describe('Radio', () => {
  describe('Rendering', () => {
    it('renders as a label element', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('label').exists()).toBe(true)
    })

    it('renders native radio input', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
    })

    it('renders custom box element', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('.ui-radio__box').exists()).toBe(true)
    })

    it('does not render dot when unchecked', () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 'b', value: 'a' }
      })
      expect(wrapper.find('.ui-radio__dot').exists()).toBe(false)
    })

    it('renders dot when checked', () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 'a', value: 'a' }
      })
      expect(wrapper.find('.ui-radio__dot').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('is unchecked when modelValue differs from value', () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 'other', value: 'a' }
      })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).checked).toBe(false)
    })

    it('is checked when modelValue matches value', () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 'a', value: 'a' }
      })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).checked).toBe(true)
      expect(wrapper.find('.ui-radio').classes()).toContain('ui-radio--checked')
    })

    it('emits update:modelValue on change', async () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 'other', value: 'a' }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    })

    it('emits change event on change', async () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 'other', value: 'a' }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('change')?.[0]).toEqual(['a'])
    })

    it('works with number values', () => {
      const wrapper = mount(Radio, {
        props: { modelValue: 1, value: 1 }
      })
      expect(wrapper.find('.ui-radio').classes()).toContain('ui-radio--checked')
    })

    it('works with boolean values', () => {
      const wrapper = mount(Radio, {
        props: { modelValue: true, value: true }
      })
      expect(wrapper.find('.ui-radio').classes()).toContain('ui-radio--checked')
    })
  })

  describe('Radio group behavior', () => {
    it('uses name attribute for grouping', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', name: 'group1' }
      })
      expect(wrapper.find('input').attributes('name')).toBe('group1')
    })

    it('passes value to native input', () => {
      const wrapper = mount(Radio, {
        props: { value: 'option-a' }
      })
      expect(wrapper.find('input').attributes('value')).toBe('option-a')
    })
  })

  describe('Size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Radio, {
          props: { value: 'a', size }
        })
        expect(wrapper.find('.ui-radio').classes()).toContain(`ui-radio--${size}`)
      })
    })

    it('defaults to md size', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('.ui-radio').classes()).toContain('ui-radio--md')
    })
  })

  describe('Disabled state', () => {
    it('applies disabled attribute to input', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', disabled: true }
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('applies disabled class', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', disabled: true }
      })
      expect(wrapper.find('.ui-radio').classes()).toContain('ui-radio--disabled')
    })

    it('does not emit events when disabled', async () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', modelValue: 'other', disabled: true }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Label and description', () => {
    it('renders label text', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', label: 'Option A' }
      })
      expect(wrapper.find('.ui-radio__label').text()).toBe('Option A')
    })

    it('renders description text', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', description: 'This is the first option' }
      })
      expect(wrapper.find('.ui-radio__description').text()).toBe('This is the first option')
    })

    it('renders both label and description', () => {
      const wrapper = mount(Radio, {
        props: {
          value: 'a',
          label: 'Option A',
          description: 'This is the first option'
        }
      })
      expect(wrapper.find('.ui-radio__label').exists()).toBe(true)
      expect(wrapper.find('.ui-radio__description').exists()).toBe(true)
    })

    it('does not render content wrapper when no label or description', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('.ui-radio__content').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('auto-generates unique id', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('input').attributes('id')).toMatch(/^radio-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a', id: 'custom-radio' }
      })
      expect(wrapper.find('input').attributes('id')).toBe('custom-radio')
    })

    it('input is visually hidden but accessible', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('.ui-radio__input').exists()).toBe(true)
    })

    it('custom box has aria-hidden', () => {
      const wrapper = mount(Radio, {
        props: { value: 'a' }
      })
      expect(wrapper.find('.ui-radio__box').attributes('aria-hidden')).toBe('true')
    })
  })
})
