import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent, markRaw } from 'vue'
import Button from './Button.vue'

// Mock icon component
const MockIcon = markRaw(defineComponent({
  name: 'MockIcon',
  render() {
    return h('svg', { 'data-testid': 'mock-icon' })
  }
}))

describe('Button', () => {
  describe('Rendering', () => {
    it('renders as button by default', () => {
      const wrapper = mount(Button, {
        slots: { default: 'Click me' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('button')
    })

    it('renders slot content', () => {
      const wrapper = mount(Button, {
        slots: { default: 'Click me' }
      })
      expect(wrapper.text()).toContain('Click me')
    })

    it('renders as custom element via "as" prop', () => {
      const wrapper = mount(Button, {
        props: { as: 'a' },
        slots: { default: 'Link' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('a')
    })

    it('has type="button" by default', () => {
      const wrapper = mount(Button)
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('accepts type prop', () => {
      const wrapper = mount(Button, {
        props: { type: 'submit' }
      })
      expect(wrapper.attributes('type')).toBe('submit')
    })
  })

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'destructive', 'ghost', 'outline'] as const

    variants.forEach(variant => {
      it(`applies ${variant} variant class`, () => {
        const wrapper = mount(Button, {
          props: { variant },
          slots: { default: 'Button' }
        })
        expect(wrapper.classes()).toContain(`ui-button--${variant}`)
      })
    })

    it('defaults to primary variant', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).toContain('ui-button--primary')
    })
  })

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Button, {
          props: { size },
          slots: { default: 'Button' }
        })
        expect(wrapper.classes()).toContain(`ui-button--${size}`)
      })
    })

    it('defaults to md size', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).toContain('ui-button--md')
    })
  })

  describe('Disabled state', () => {
    it('applies disabled class when disabled', () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      expect(wrapper.classes()).toContain('ui-button--disabled')
    })

    it('sets disabled attribute on button', () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('sets aria-disabled when disabled', () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('Loading state', () => {
    it('applies loading class when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      expect(wrapper.classes()).toContain('ui-button--loading')
    })

    it('shows spinner when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      expect(wrapper.find('.ui-button__loader').exists()).toBe(true)
    })

    it('sets aria-busy when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })

    it('is disabled when loading', () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('Icons', () => {
    it('renders left icon', () => {
      const wrapper = mount(Button, {
        props: { iconLeft: MockIcon },
        slots: { default: 'Button' }
      })
      expect(wrapper.find('.ui-button__icon--left').exists()).toBe(true)
    })

    it('renders right icon', () => {
      const wrapper = mount(Button, {
        props: { iconRight: MockIcon },
        slots: { default: 'Button' }
      })
      expect(wrapper.find('.ui-button__icon--right').exists()).toBe(true)
    })

    it('applies icon-only class when only icon provided', () => {
      const wrapper = mount(Button, {
        props: { iconLeft: MockIcon }
      })
      expect(wrapper.classes()).toContain('ui-button--icon-only')
    })

    it('keeps icon in DOM but fades content when loading (overlay pattern)', () => {
      const wrapper = mount(Button, {
        props: { iconLeft: MockIcon, loading: true },
        slots: { default: 'Button' }
      })
      // Icon stays in DOM to preserve width
      expect(wrapper.find('.ui-button__icon--left').exists()).toBe(true)
      // Inner content has hidden class (opacity: 0)
      expect(wrapper.find('.ui-button__inner--hidden').exists()).toBe(true)
      // Spinner overlay is shown
      expect(wrapper.find('.ui-button__loader').exists()).toBe(true)
    })
  })

  describe('Block mode', () => {
    it('applies block class when block prop is true', () => {
      const wrapper = mount(Button, {
        props: { block: true }
      })
      expect(wrapper.classes()).toContain('ui-button--block')
    })
  })

  describe('Events', () => {
    it('emits click event', async () => {
      const wrapper = mount(Button)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('passes event object to click handler', async () => {
      const wrapper = mount(Button)
      await wrapper.trigger('click')
      const emitted = wrapper.emitted('click')
      expect(emitted?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('Accessibility', () => {
    it('has highlight element for visual effect', () => {
      const wrapper = mount(Button)
      expect(wrapper.find('.ui-button__highlight').exists()).toBe(true)
    })

    it('highlight is hidden from screen readers', () => {
      const wrapper = mount(Button)
      expect(wrapper.find('.ui-button__highlight').attributes('aria-hidden')).toBe('true')
    })
  })
})
