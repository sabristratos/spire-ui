import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from './Switch.vue'

describe('Switch', () => {
  describe('Rendering', () => {
    it('renders as a button', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('has role="switch"', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('button').attributes('role')).toBe('switch')
    })

    it('has type="button" to prevent form submission', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('button').attributes('type')).toBe('button')
    })

    it('renders track and thumb', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('.ui-switch__track').exists()).toBe(true)
      expect(wrapper.find('.ui-switch__thumb').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('reflects modelValue as aria-checked', () => {
      const wrapper = mount(Switch, {
        props: { modelValue: false }
      })
      expect(wrapper.find('button').attributes('aria-checked')).toBe('false')
    })

    it('shows checked state when modelValue is true', () => {
      const wrapper = mount(Switch, {
        props: { modelValue: true }
      })
      expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
      expect(wrapper.find('.ui-switch').classes()).toContain('ui-switch--checked')
    })

    it('emits update:modelValue on click', async () => {
      const wrapper = mount(Switch, {
        props: { modelValue: false }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('emits change event on click', async () => {
      const wrapper = mount(Switch, {
        props: { modelValue: false }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('change')?.[0]).toEqual([true])
    })

    it('toggles from true to false', async () => {
      const wrapper = mount(Switch, {
        props: { modelValue: true }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })
  })

  describe('Size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Switch, {
          props: { size }
        })
        expect(wrapper.find('.ui-switch').classes()).toContain(`ui-switch--${size}`)
      })
    })
  })

  describe('Disabled state', () => {
    it('applies disabled attribute', () => {
      const wrapper = mount(Switch, {
        props: { disabled: true }
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('applies disabled class', () => {
      const wrapper = mount(Switch, {
        props: { disabled: true }
      })
      expect(wrapper.find('.ui-switch').classes()).toContain('ui-switch--disabled')
    })

    it('does not emit events when disabled', async () => {
      const wrapper = mount(Switch, {
        props: { disabled: true, modelValue: false }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Loading state', () => {
    it('renders spinner when loading', () => {
      const wrapper = mount(Switch, {
        props: { loading: true }
      })
      expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(true)
    })

    it('applies loading class', () => {
      const wrapper = mount(Switch, {
        props: { loading: true }
      })
      expect(wrapper.find('.ui-switch').classes()).toContain('ui-switch--loading')
    })

    it('is disabled when loading', () => {
      const wrapper = mount(Switch, {
        props: { loading: true }
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('does not emit events when loading', async () => {
      const wrapper = mount(Switch, {
        props: { loading: true, modelValue: false }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Keyboard interaction', () => {
    it('toggles on Enter key', async () => {
      const wrapper = mount(Switch, {
        props: { modelValue: false }
      })
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('does not toggle on Enter when disabled', async () => {
      const wrapper = mount(Switch, {
        props: { disabled: true, modelValue: false }
      })
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Accessibility', () => {
    it('has aria-label when label prop provided', () => {
      const wrapper = mount(Switch, {
        props: { label: 'Enable notifications' }
      })
      expect(wrapper.find('button').attributes('aria-label')).toBe('Enable notifications')
    })

    it('auto-generates unique id', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('button').attributes('id')).toMatch(/^switch-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(Switch, {
        props: { id: 'custom-switch' }
      })
      expect(wrapper.find('button').attributes('id')).toBe('custom-switch')
    })
  })

  describe('Form submission', () => {
    it('does not render hidden input by default', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false)
    })

    it('renders hidden input when name prop provided', () => {
      const wrapper = mount(Switch, {
        props: { name: 'notifications' }
      })
      const input = wrapper.find('input[type="checkbox"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('name')).toBe('notifications')
    })

    it('hidden input reflects checked state', () => {
      const wrapper = mount(Switch, {
        props: { name: 'notifications', modelValue: true }
      })
      const input = wrapper.find('input[type="checkbox"]')
      expect((input.element as HTMLInputElement).checked).toBe(true)
    })

    it('hidden input is aria-hidden', () => {
      const wrapper = mount(Switch, {
        props: { name: 'notifications' }
      })
      expect(wrapper.find('input').attributes('aria-hidden')).toBe('true')
    })

    it('hidden input has tabindex=-1', () => {
      const wrapper = mount(Switch, {
        props: { name: 'notifications' }
      })
      expect(wrapper.find('input').attributes('tabindex')).toBe('-1')
    })
  })
})
