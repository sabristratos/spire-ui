import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Callout from './Callout.vue'

describe('Callout', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(Callout)
      expect(wrapper.find('.ui-callout').exists()).toBe(true)
      expect(wrapper.find('.ui-callout--info').exists()).toBe(true)
    })

    it('renders title from prop', () => {
      const wrapper = mount(Callout, {
        props: { title: 'Test Title' }
      })
      expect(wrapper.find('.ui-callout__title').text()).toBe('Test Title')
    })

    it('renders title from slot', () => {
      const wrapper = mount(Callout, {
        slots: {
          title: 'Slot Title'
        }
      })
      expect(wrapper.find('.ui-callout__title').text()).toBe('Slot Title')
    })

    it('renders body content from default slot', () => {
      const wrapper = mount(Callout, {
        slots: {
          default: '<p>Body content</p>'
        }
      })
      expect(wrapper.find('.ui-callout__body').exists()).toBe(true)
      expect(wrapper.find('.ui-callout__body p').text()).toBe('Body content')
    })

    it('renders both title and body', () => {
      const wrapper = mount(Callout, {
        props: { title: 'Title' },
        slots: {
          default: 'Body text'
        }
      })
      expect(wrapper.find('.ui-callout__title').text()).toBe('Title')
      expect(wrapper.find('.ui-callout__body').text()).toBe('Body text')
    })

    it('does not render title element when no title provided', () => {
      const wrapper = mount(Callout, {
        slots: {
          default: 'Body only'
        }
      })
      expect(wrapper.find('.ui-callout__title').exists()).toBe(false)
    })

    it('does not render body element when no default slot', () => {
      const wrapper = mount(Callout, {
        props: { title: 'Title only' }
      })
      expect(wrapper.find('.ui-callout__body').exists()).toBe(false)
    })
  })

  describe('Variants', () => {
    it.each([
      ['info', '.ui-callout--info'],
      ['success', '.ui-callout--success'],
      ['warning', '.ui-callout--warning'],
      ['error', '.ui-callout--error'],
      ['neutral', '.ui-callout--neutral']
    ])('applies %s variant class', (variant, expectedClass) => {
      const wrapper = mount(Callout, {
        props: { variant: variant as any }
      })
      expect(wrapper.find(expectedClass).exists()).toBe(true)
    })
  })

  describe('Accent border', () => {
    it('applies accent class when accent prop is true', () => {
      const wrapper = mount(Callout, {
        props: { accent: true }
      })
      expect(wrapper.find('.ui-callout--accent').exists()).toBe(true)
    })

    it('does not apply accent class by default', () => {
      const wrapper = mount(Callout)
      expect(wrapper.find('.ui-callout--accent').exists()).toBe(false)
    })
  })

  describe('Icons', () => {
    it('renders icon by default', () => {
      const wrapper = mount(Callout)
      expect(wrapper.find('.ui-callout__icon').exists()).toBe(true)
      expect(wrapper.find('.ui-callout__icon svg').exists()).toBe(true)
    })

    it('hides icon when hideIcon is true', () => {
      const wrapper = mount(Callout, {
        props: { hideIcon: true }
      })
      expect(wrapper.find('.ui-callout__icon').exists()).toBe(false)
    })

    it('renders custom icon from slot', () => {
      const wrapper = mount(Callout, {
        slots: {
          icon: '<span data-testid="custom-icon">★</span>'
        }
      })
      expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(true)
    })

    it('does not render icon slot when hideIcon is true', () => {
      const wrapper = mount(Callout, {
        props: { hideIcon: true },
        slots: {
          icon: '<span data-testid="custom-icon">★</span>'
        }
      })
      expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(false)
      expect(wrapper.find('.ui-callout__icon').exists()).toBe(false)
    })

    it.each([
      ['info', 'info icon'],
      ['success', 'checkmark icon'],
      ['warning', 'triangle icon'],
      ['error', 'x icon'],
      ['neutral', 'info icon']
    ])('renders appropriate icon for %s variant', (variant) => {
      const wrapper = mount(Callout, {
        props: { variant: variant as any }
      })
      expect(wrapper.find('.ui-callout__icon svg').exists()).toBe(true)
    })
  })

  describe('Dismissible', () => {
    it('does not render close button by default', () => {
      const wrapper = mount(Callout)
      expect(wrapper.find('.ui-callout__close').exists()).toBe(false)
    })

    it('renders close button when dismissible is true', () => {
      const wrapper = mount(Callout, {
        props: { dismissible: true }
      })
      expect(wrapper.find('.ui-callout__close').exists()).toBe(true)
    })

    it('emits close event when close button clicked', async () => {
      const wrapper = mount(Callout, {
        props: { dismissible: true }
      })
      await wrapper.find('.ui-callout__close').trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('close button has aria-label', () => {
      const wrapper = mount(Callout, {
        props: { dismissible: true }
      })
      expect(wrapper.find('.ui-callout__close').attributes('aria-label')).toBe('Dismiss')
    })
  })

  describe('Action slot', () => {
    it('renders action slot content', () => {
      const wrapper = mount(Callout, {
        slots: {
          action: '<button data-testid="action-btn">Action</button>'
        }
      })
      expect(wrapper.find('[data-testid="action-btn"]').exists()).toBe(true)
    })

    it('renders action slot alongside close button', () => {
      const wrapper = mount(Callout, {
        props: { dismissible: true },
        slots: {
          action: '<button data-testid="action-btn">Action</button>'
        }
      })
      expect(wrapper.find('[data-testid="action-btn"]').exists()).toBe(true)
      expect(wrapper.find('.ui-callout__close').exists()).toBe(true)
    })

    it('does not render actions container when no action or dismissible', () => {
      const wrapper = mount(Callout, {
        props: { title: 'Title' }
      })
      expect(wrapper.find('.ui-callout__actions').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('has role="alert" for error variant', () => {
      const wrapper = mount(Callout, {
        props: { variant: 'error' }
      })
      expect(wrapper.find('.ui-callout').attributes('role')).toBe('alert')
    })

    it('has role="status" for info variant', () => {
      const wrapper = mount(Callout, {
        props: { variant: 'info' }
      })
      expect(wrapper.find('.ui-callout').attributes('role')).toBe('status')
    })

    it('has role="status" for success variant', () => {
      const wrapper = mount(Callout, {
        props: { variant: 'success' }
      })
      expect(wrapper.find('.ui-callout').attributes('role')).toBe('status')
    })

    it('has role="status" for warning variant', () => {
      const wrapper = mount(Callout, {
        props: { variant: 'warning' }
      })
      expect(wrapper.find('.ui-callout').attributes('role')).toBe('status')
    })

    it('has role="status" for neutral variant', () => {
      const wrapper = mount(Callout, {
        props: { variant: 'neutral' }
      })
      expect(wrapper.find('.ui-callout').attributes('role')).toBe('status')
    })

    it('icons have aria-hidden', () => {
      const wrapper = mount(Callout)
      expect(wrapper.find('.ui-callout__icon svg').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Layout', () => {
    it('icon container has flex-shrink-0', () => {
      const wrapper = mount(Callout)
      const icon = wrapper.find('.ui-callout__icon')
      expect(icon.exists()).toBe(true)
    })

    it('content container takes remaining space', () => {
      const wrapper = mount(Callout, {
        props: { title: 'Title' },
        slots: { default: 'Body' }
      })
      const content = wrapper.find('.ui-callout__content')
      expect(content.exists()).toBe(true)
    })
  })
})
