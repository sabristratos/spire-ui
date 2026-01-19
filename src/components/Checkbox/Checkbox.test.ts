import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders as a label element', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('label').exists()).toBe(true)
    })

    it('renders native checkbox input', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('renders custom box element', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('.ui-checkbox__box').exists()).toBe(true)
    })

    it('does not render check icon when unchecked', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false }
      })
      expect(wrapper.find('.ui-checkbox__check').exists()).toBe(false)
    })

    it('renders check icon when checked', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-checkbox__check').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('reflects unchecked state', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false }
      })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).checked).toBe(false)
    })

    it('reflects checked state', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: true }
      })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).checked).toBe(true)
      expect(wrapper.find('.ui-checkbox').classes()).toContain('ui-checkbox--checked')
    })

    it('emits update:modelValue on change', async () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false }
      })
      await wrapper.find('input').setValue(true)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('emits change event on change', async () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false }
      })
      await wrapper.find('input').setValue(true)
      expect(wrapper.emitted('change')?.[0]).toEqual([true])
    })

    it('unchecks when toggled from true', async () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: true }
      })
      await wrapper.find('input').setValue(false)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })
  })

  describe('Indeterminate state', () => {
    it('applies indeterminate class', () => {
      const wrapper = mount(Checkbox, {
        props: { indeterminate: true }
      })
      expect(wrapper.find('.ui-checkbox').classes()).toContain('ui-checkbox--indeterminate')
    })

    it('renders indeterminate icon instead of check', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: true, indeterminate: true }
      })
      expect(wrapper.find('.ui-checkbox__check').exists()).toBe(false)
      expect(wrapper.find('.ui-checkbox__indeterminate').exists()).toBe(true)
    })

    it('renders indeterminate icon even when unchecked', () => {
      const wrapper = mount(Checkbox, {
        props: { modelValue: false, indeterminate: true }
      })
      expect(wrapper.find('.ui-checkbox__indeterminate').exists()).toBe(true)
    })
  })

  describe('Size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Checkbox, {
          props: { size }
        })
        expect(wrapper.find('.ui-checkbox').classes()).toContain(`ui-checkbox--${size}`)
      })
    })

    it('defaults to md size', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('.ui-checkbox').classes()).toContain('ui-checkbox--md')
    })
  })

  describe('Disabled state', () => {
    it('applies disabled attribute to input', () => {
      const wrapper = mount(Checkbox, {
        props: { disabled: true }
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('applies disabled class', () => {
      const wrapper = mount(Checkbox, {
        props: { disabled: true }
      })
      expect(wrapper.find('.ui-checkbox').classes()).toContain('ui-checkbox--disabled')
    })
  })

  describe('Label and description', () => {
    it('renders label text', () => {
      const wrapper = mount(Checkbox, {
        props: { label: 'Accept terms' }
      })
      expect(wrapper.find('.ui-checkbox__label').text()).toBe('Accept terms')
    })

    it('renders description text', () => {
      const wrapper = mount(Checkbox, {
        props: { description: 'By checking this you agree' }
      })
      expect(wrapper.find('.ui-checkbox__description').text()).toBe('By checking this you agree')
    })

    it('renders both label and description', () => {
      const wrapper = mount(Checkbox, {
        props: {
          label: 'Accept terms',
          description: 'By checking this you agree'
        }
      })
      expect(wrapper.find('.ui-checkbox__label').exists()).toBe(true)
      expect(wrapper.find('.ui-checkbox__description').exists()).toBe(true)
    })

    it('does not render content wrapper when no label or description', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('.ui-checkbox__content').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('auto-generates unique id', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('input').attributes('id')).toMatch(/^checkbox-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(Checkbox, {
        props: { id: 'custom-checkbox' }
      })
      expect(wrapper.find('input').attributes('id')).toBe('custom-checkbox')
    })

    it('input is visually hidden but accessible', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('.ui-checkbox__input').exists()).toBe(true)
    })

    it('custom box has aria-hidden', () => {
      const wrapper = mount(Checkbox)
      expect(wrapper.find('.ui-checkbox__box').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Form attributes', () => {
    it('applies name attribute', () => {
      const wrapper = mount(Checkbox, {
        props: { name: 'terms' }
      })
      expect(wrapper.find('input').attributes('name')).toBe('terms')
    })

    it('applies value attribute', () => {
      const wrapper = mount(Checkbox, {
        props: { value: 'accepted' }
      })
      expect(wrapper.find('input').attributes('value')).toBe('accepted')
    })
  })
})
