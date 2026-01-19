import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Heading from './Heading.vue'

describe('Heading', () => {
  describe('Rendering', () => {
    it('renders as h2 by default', () => {
      const wrapper = mount(Heading, {
        slots: { default: 'Hello' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('h2')
    })

    it('renders slot content', () => {
      const wrapper = mount(Heading, {
        slots: { default: 'Page Title' }
      })
      expect(wrapper.text()).toBe('Page Title')
    })

    it('renders as custom tag via "as" prop', () => {
      const wrapper = mount(Heading, {
        props: { as: 'h1' },
        slots: { default: 'Main Title' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('h1')
    })

    it('can render as non-heading elements', () => {
      const wrapper = mount(Heading, {
        props: { as: 'div' },
        slots: { default: 'Visual heading' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('Sizes', () => {
    const sizes = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Heading, {
          props: { size },
          slots: { default: 'Heading' }
        })
        expect(wrapper.classes()).toContain(`ui-heading--${size}`)
      })
    })

    it('defaults to 2xl size', () => {
      const wrapper = mount(Heading, {
        slots: { default: 'Heading' }
      })
      expect(wrapper.classes()).toContain('ui-heading--2xl')
    })
  })

  describe('Alignment', () => {
    const alignments = ['left', 'center', 'right'] as const

    alignments.forEach(align => {
      it(`applies ${align} alignment class`, () => {
        const wrapper = mount(Heading, {
          props: { align },
          slots: { default: 'Heading' }
        })
        expect(wrapper.classes()).toContain(`ui-heading--${align}`)
      })
    })

    it('defaults to left alignment', () => {
      const wrapper = mount(Heading, {
        slots: { default: 'Heading' }
      })
      expect(wrapper.classes()).toContain('ui-heading--left')
    })
  })

  describe('Truncation', () => {
    it('applies truncate class when truncate prop is true', () => {
      const wrapper = mount(Heading, {
        props: { truncate: true },
        slots: { default: 'Very long heading text' }
      })
      expect(wrapper.classes()).toContain('ui-heading--truncate')
    })

    it('does not apply truncate class by default', () => {
      const wrapper = mount(Heading, {
        slots: { default: 'Heading' }
      })
      expect(wrapper.classes()).not.toContain('ui-heading--truncate')
    })
  })

  describe('Polymorphism', () => {
    it('allows visual h1 with semantic h2', () => {
      const wrapper = mount(Heading, {
        props: { as: 'h2', size: '4xl' },
        slots: { default: 'Looks big, semantically h2' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('h2')
      expect(wrapper.classes()).toContain('ui-heading--4xl')
    })
  })
})
