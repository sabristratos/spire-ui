import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Input from './Input.vue'

// Mock icon component for testing
const MockIcon = defineComponent({
  name: 'MockIcon',
  render() {
    return h('svg', { class: 'mock-icon' })
  }
})

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      const wrapper = mount(Input)
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('renders with label', () => {
      const wrapper = mount(Input, {
        props: { label: 'Email' }
      })
      expect(wrapper.find('label').text()).toBe('Email')
    })

    it('renders with placeholder', () => {
      const wrapper = mount(Input, {
        props: { placeholder: 'Enter email' }
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter email')
    })

    it('renders with hint text', () => {
      const wrapper = mount(Input, {
        props: { hint: 'We will never share your email' }
      })
      expect(wrapper.find('.ui-input-field__message--hint').text()).toBe('We will never share your email')
    })

    it('renders with error message', () => {
      const wrapper = mount(Input, {
        props: { error: 'Email is required' }
      })
      expect(wrapper.find('.ui-input-field__message--error').text()).toBe('Email is required')
    })

    it('error takes precedence over hint', () => {
      const wrapper = mount(Input, {
        props: { hint: 'Hint text', error: 'Error text' }
      })
      expect(wrapper.find('.ui-input-field__message--error').exists()).toBe(true)
      expect(wrapper.find('.ui-input-field__message--hint').exists()).toBe(false)
    })

    it('renders required indicator', () => {
      const wrapper = mount(Input, {
        props: { label: 'Email', required: true }
      })
      expect(wrapper.find('.ui-input-field__required').exists()).toBe(true)
      expect(wrapper.find('input').attributes('required')).toBeDefined()
    })
  })

  describe('v-model', () => {
    it('binds modelValue to input', () => {
      const wrapper = mount(Input, {
        props: { modelValue: 'test@example.com' }
      })
      expect(wrapper.find('input').element.value).toBe('test@example.com')
    })

    it('emits update:modelValue on input', async () => {
      const wrapper = mount(Input)
      await wrapper.find('input').setValue('hello')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    })

    it('handles number type correctly', async () => {
      const wrapper = mount(Input, {
        props: { type: 'number' }
      })
      await wrapper.find('input').setValue('42')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
    })
  })

  describe('Events', () => {
    it('emits focus event', async () => {
      const wrapper = mount(Input)
      await wrapper.find('input').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event', async () => {
      const wrapper = mount(Input)
      await wrapper.find('input').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('Size variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Input, {
          props: { size }
        })
        expect(wrapper.find('.ui-input-wrapper').classes()).toContain(`ui-input-wrapper--${size}`)
      })
    })
  })

  describe('States', () => {
    it('applies disabled state', () => {
      const wrapper = mount(Input, {
        props: { disabled: true }
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.ui-input-wrapper').classes()).toContain('ui-input-wrapper--disabled')
    })

    it('applies readonly state', () => {
      const wrapper = mount(Input, {
        props: { readonly: true }
      })
      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
      expect(wrapper.find('.ui-input-wrapper').classes()).toContain('ui-input-wrapper--readonly')
    })

    it('applies error state', () => {
      const wrapper = mount(Input, {
        props: { error: 'Invalid input' }
      })
      expect(wrapper.find('.ui-input-wrapper').classes()).toContain('ui-input-wrapper--error')
    })

    it('applies block state', () => {
      const wrapper = mount(Input, {
        props: { block: true }
      })
      expect(wrapper.find('.ui-input-field').classes()).toContain('ui-input-field--block')
    })
  })

  describe('Input types', () => {
    const types = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] as const

    types.forEach(type => {
      it(`renders ${type} input type`, () => {
        const wrapper = mount(Input, {
          props: { type }
        })
        expect(wrapper.find('input').attributes('type')).toBe(type)
      })
    })
  })

  describe('Icons and loading', () => {
    it('renders left icon', () => {
      const wrapper = mount(Input, {
        props: { iconLeft: MockIcon }
      })
      expect(wrapper.find('.ui-input-wrapper__addon--left').exists()).toBe(true)
    })

    it('renders right icon', () => {
      const wrapper = mount(Input, {
        props: { iconRight: MockIcon }
      })
      expect(wrapper.find('.ui-input-wrapper__addon--right').exists()).toBe(true)
    })

    it('renders loading spinner', () => {
      const wrapper = mount(Input, {
        props: { loading: true }
      })
      expect(wrapper.find('.ui-input-wrapper__addon--right').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(true)
    })

    it('loading spinner takes precedence over right icon', () => {
      const wrapper = mount(Input, {
        props: { loading: true, iconRight: MockIcon }
      })
      expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(true)
    })
  })

  describe('Slots', () => {
    it('renders left slot', () => {
      const wrapper = mount(Input, {
        slots: { left: '<span class="custom-left">$</span>' }
      })
      expect(wrapper.find('.custom-left').text()).toBe('$')
    })

    it('renders right slot', () => {
      const wrapper = mount(Input, {
        slots: { right: '<span class="custom-right">%</span>' }
      })
      expect(wrapper.find('.custom-right').text()).toBe('%')
    })
  })

  describe('Accessibility', () => {
    it('auto-generates unique id', () => {
      const wrapper = mount(Input)
      const input = wrapper.find('input')
      expect(input.attributes('id')).toMatch(/^input-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(Input, {
        props: { id: 'custom-id' }
      })
      expect(wrapper.find('input').attributes('id')).toBe('custom-id')
    })

    it('links label to input via for attribute', () => {
      const wrapper = mount(Input, {
        props: { label: 'Email', id: 'email-input' }
      })
      expect(wrapper.find('label').attributes('for')).toBe('email-input')
    })

    it('sets aria-describedby to hint id', () => {
      const wrapper = mount(Input, {
        props: { hint: 'Helpful hint', id: 'my-input' }
      })
      expect(wrapper.find('input').attributes('aria-describedby')).toBe('my-input-hint')
    })

    it('sets aria-describedby to error id when error exists', () => {
      const wrapper = mount(Input, {
        props: { error: 'Error message', id: 'my-input' }
      })
      expect(wrapper.find('input').attributes('aria-describedby')).toBe('my-input-error')
    })

    it('sets aria-invalid when error exists', () => {
      const wrapper = mount(Input, {
        props: { error: 'Error message' }
      })
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    })

    it('error message has role="alert"', () => {
      const wrapper = mount(Input, {
        props: { error: 'Error message' }
      })
      expect(wrapper.find('.ui-input-field__message--error').attributes('role')).toBe('alert')
    })
  })

  describe('HTML attributes', () => {
    it('passes name attribute', () => {
      const wrapper = mount(Input, {
        props: { name: 'email' }
      })
      expect(wrapper.find('input').attributes('name')).toBe('email')
    })

    it('passes autocomplete attribute', () => {
      const wrapper = mount(Input, {
        props: { autocomplete: 'email' }
      })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
    })
  })
})
