import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChoiceChip from './ChoiceChip.vue'

describe('ChoiceChip', () => {
  describe('Rendering', () => {
    it('renders as a label element', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option' }
      })
      expect(wrapper.find('label').exists()).toBe(true)
    })

    it('renders hidden checkbox input', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option' }
      })
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('renders label text', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Category' }
      })
      expect(wrapper.find('.ui-choice-chip__label').text()).toBe('Category')
    })

    it('renders check container', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option' }
      })
      expect(wrapper.find('.ui-choice-chip__check').exists()).toBe(true)
    })
  })

  describe('Standalone v-model', () => {
    it('is unchecked when modelValue is false', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', modelValue: false }
      })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).checked).toBe(false)
    })

    it('is checked when modelValue is true', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', modelValue: true }
      })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).checked).toBe(true)
    })

    it('applies selected class when checked', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', modelValue: true }
      })
      expect(wrapper.find('.ui-choice-chip').classes()).toContain('ui-choice-chip--selected')
    })

    it('emits update:modelValue on change', async () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', modelValue: false }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('emits change event on change', async () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', modelValue: false }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('change')?.[0]).toEqual([true])
    })

    it('toggles from true to false', async () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', modelValue: true }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })
  })

  describe('Disabled state', () => {
    it('applies disabled attribute to input', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', disabled: true }
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('applies disabled class', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', disabled: true }
      })
      expect(wrapper.find('.ui-choice-chip').classes()).toContain('ui-choice-chip--disabled')
    })

    it('does not emit events when disabled', async () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', disabled: true, modelValue: false }
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Icon support', () => {
    const mockIcon = { render: () => null }

    it('renders icon when provided', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option', icon: mockIcon }
      })
      expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(true)
    })

    it('does not render icon when not provided', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option' }
      })
      expect(wrapper.find('.ui-choice-chip__icon').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('input is visually hidden but accessible', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option' }
      })
      expect(wrapper.find('.ui-choice-chip__input').exists()).toBe(true)
    })

    it('check icon has aria-hidden', () => {
      const wrapper = mount(ChoiceChip, {
        props: { label: 'Option' }
      })
      expect(wrapper.find('.ui-choice-chip__check').attributes('aria-hidden')).toBe('true')
    })
  })
})
