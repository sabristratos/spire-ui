import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from './Text.vue'

describe('Text', () => {
  describe('Rendering', () => {
    it('renders as p by default', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Hello' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('p')
    })

    it('renders slot content', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Body text' }
      })
      expect(wrapper.text()).toBe('Body text')
    })

    it('renders as custom tag via "as" prop', () => {
      const wrapper = mount(Text, {
        props: { as: 'span' },
        slots: { default: 'Inline text' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('span')
    })

    it('can render as label', () => {
      const wrapper = mount(Text, {
        props: { as: 'label' },
        slots: { default: 'Field label' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('label')
    })
  })

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Text, {
          props: { size },
          slots: { default: 'Text' }
        })
        expect(wrapper.classes()).toContain(`ui-text--${size}`)
      })
    })

    it('defaults to md size', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('ui-text--md')
    })
  })

  describe('Weights', () => {
    const weights = ['regular', 'medium', 'semibold', 'bold'] as const

    weights.forEach(weight => {
      it(`applies ${weight} weight class`, () => {
        const wrapper = mount(Text, {
          props: { weight },
          slots: { default: 'Text' }
        })
        expect(wrapper.classes()).toContain(`ui-text--${weight}`)
      })
    })

    it('defaults to regular weight', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('ui-text--regular')
    })
  })

  describe('Alignment', () => {
    const alignments = ['left', 'center', 'right', 'justify'] as const

    alignments.forEach(align => {
      it(`applies ${align} alignment class`, () => {
        const wrapper = mount(Text, {
          props: { align },
          slots: { default: 'Text' }
        })
        expect(wrapper.classes()).toContain(`ui-text--${align}`)
      })
    })

    it('defaults to left alignment', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('ui-text--left')
    })
  })

  describe('Muted variant', () => {
    it('applies muted class when muted prop is true', () => {
      const wrapper = mount(Text, {
        props: { muted: true },
        slots: { default: 'Secondary text' }
      })
      expect(wrapper.classes()).toContain('ui-text--muted')
    })

    it('does not apply muted class by default', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).not.toContain('ui-text--muted')
    })
  })

  describe('Truncation', () => {
    it('applies truncate class when truncate prop is true', () => {
      const wrapper = mount(Text, {
        props: { truncate: true },
        slots: { default: 'Very long text' }
      })
      expect(wrapper.classes()).toContain('ui-text--truncate')
    })

    it('does not apply truncate when clamp is set', () => {
      const wrapper = mount(Text, {
        props: { truncate: true, clamp: 2 },
        slots: { default: 'Long text' }
      })
      expect(wrapper.classes()).not.toContain('ui-text--truncate')
      expect(wrapper.classes()).toContain('ui-text--clamp')
    })
  })

  describe('Line clamping', () => {
    it('applies clamp class when clamp prop is set', () => {
      const wrapper = mount(Text, {
        props: { clamp: 3 },
        slots: { default: 'Multi-line text' }
      })
      expect(wrapper.classes()).toContain('ui-text--clamp')
    })

    it('accepts different clamp values', () => {
      const wrapper = mount(Text, {
        props: { clamp: 5 },
        slots: { default: 'Multi-line text' }
      })
      expect(wrapper.classes()).toContain('ui-text--clamp')
    })
  })
})
