import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders slot content', () => {
      const wrapper = mount(Badge, {
        slots: { default: 'New' }
      })
      expect(wrapper.text()).toBe('New')
    })

    it('renders numeric value', () => {
      const wrapper = mount(Badge, {
        props: { value: 5 }
      })
      expect(wrapper.text()).toBe('5')
    })

    it('has role="status" for accessibility', () => {
      const wrapper = mount(Badge, {
        slots: { default: 'Active' }
      })
      expect(wrapper.attributes('role')).toBe('status')
    })
  })

  describe('Variants', () => {
    const variants = ['default', 'success', 'warning', 'danger', 'info'] as const

    variants.forEach(variant => {
      it(`applies ${variant} variant class`, () => {
        const wrapper = mount(Badge, {
          props: { variant },
          slots: { default: 'Test' }
        })
        expect(wrapper.classes()).toContain(`ui-badge--${variant}`)
      })
    })

    it('defaults to default variant', () => {
      const wrapper = mount(Badge, {
        slots: { default: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-badge--default')
    })
  })

  describe('Dot mode', () => {
    it('renders as dot when dot prop is true', () => {
      const wrapper = mount(Badge, {
        props: { dot: true }
      })
      expect(wrapper.classes()).toContain('ui-badge--dot')
      expect(wrapper.text()).toBe('')
    })

    it('renders as dot when no content provided', () => {
      const wrapper = mount(Badge)
      expect(wrapper.classes()).toContain('ui-badge--dot')
    })

    it('applies pulse animation when pulse prop is true', () => {
      const wrapper = mount(Badge, {
        props: { dot: true, pulse: true }
      })
      expect(wrapper.classes()).toContain('ui-badge--pulse')
    })

    it('does not apply pulse to non-dot badges', () => {
      const wrapper = mount(Badge, {
        props: { pulse: true },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).not.toContain('ui-badge--pulse')
    })
  })

  describe('Numeric constraints', () => {
    it('displays value directly when under max', () => {
      const wrapper = mount(Badge, {
        props: { value: 50 }
      })
      expect(wrapper.text()).toBe('50')
    })

    it('displays max+ when value exceeds default max (99)', () => {
      const wrapper = mount(Badge, {
        props: { value: 150 }
      })
      expect(wrapper.text()).toBe('99+')
    })

    it('respects custom max prop', () => {
      const wrapper = mount(Badge, {
        props: { value: 15, max: 10 }
      })
      expect(wrapper.text()).toBe('10+')
    })

    it('displays exact value at max boundary', () => {
      const wrapper = mount(Badge, {
        props: { value: 99 }
      })
      expect(wrapper.text()).toBe('99')
    })
  })

  describe('Accessibility', () => {
    it('uses label prop for aria-label', () => {
      const wrapper = mount(Badge, {
        props: { value: 150, label: '150 unread messages' }
      })
      expect(wrapper.attributes('aria-label')).toBe('150 unread messages')
    })

    it('uses actual value for aria-label when no label provided', () => {
      const wrapper = mount(Badge, {
        props: { value: 150 }
      })
      expect(wrapper.attributes('aria-label')).toBe('150')
    })

    it('has no aria-label for text-only badges without label prop', () => {
      const wrapper = mount(Badge, {
        slots: { default: 'New' }
      })
      expect(wrapper.attributes('aria-label')).toBeUndefined()
    })
  })

  describe('Typography', () => {
    it('applies ui-badge base class', () => {
      const wrapper = mount(Badge, {
        slots: { default: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-badge')
    })
  })
})
