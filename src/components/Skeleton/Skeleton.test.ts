import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.find('.ui-skeleton').exists()).toBe(true)
      expect(wrapper.find('.ui-skeleton--text').exists()).toBe(true)
      expect(wrapper.find('.ui-skeleton--shimmer').exists()).toBe(true)
    })

    it('has aria-hidden attribute for accessibility', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('renders as span element', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('Variants', () => {
    it('applies text variant by default', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.find('.ui-skeleton--text').exists()).toBe(true)
    })

    it('applies circle variant', () => {
      const wrapper = mount(Skeleton, {
        props: { variant: 'circle' }
      })
      expect(wrapper.find('.ui-skeleton--circle').exists()).toBe(true)
    })

    it('applies rect variant', () => {
      const wrapper = mount(Skeleton, {
        props: { variant: 'rect' }
      })
      expect(wrapper.find('.ui-skeleton--rect').exists()).toBe(true)
    })
  })

  describe('Animation', () => {
    it('applies shimmer animation by default', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.find('.ui-skeleton--shimmer').exists()).toBe(true)
    })

    it('applies pulse animation', () => {
      const wrapper = mount(Skeleton, {
        props: { animation: 'pulse' }
      })
      expect(wrapper.find('.ui-skeleton--pulse').exists()).toBe(true)
    })

    it('applies no animation when set to none', () => {
      const wrapper = mount(Skeleton, {
        props: { animation: 'none' }
      })
      expect(wrapper.find('.ui-skeleton--none').exists()).toBe(true)
    })
  })

  describe('Dimensions', () => {
    it('applies numeric width as pixels', () => {
      const wrapper = mount(Skeleton, {
        props: { width: 100 }
      })
      expect(wrapper.attributes('style')).toContain('width: 100px')
    })

    it('applies string width directly', () => {
      const wrapper = mount(Skeleton, {
        props: { width: '50%' }
      })
      expect(wrapper.attributes('style')).toContain('width: 50%')
    })

    it('applies numeric height as pixels', () => {
      const wrapper = mount(Skeleton, {
        props: { height: 20 }
      })
      expect(wrapper.attributes('style')).toContain('height: 20px')
    })

    it('applies string height directly', () => {
      const wrapper = mount(Skeleton, {
        props: { height: '2rem' }
      })
      expect(wrapper.attributes('style')).toContain('height: 2rem')
    })

    it('applies both width and height', () => {
      const wrapper = mount(Skeleton, {
        props: { width: 200, height: 50 }
      })
      const style = wrapper.attributes('style')
      expect(style).toContain('width: 200px')
      expect(style).toContain('height: 50px')
    })

    it('does not apply undefined dimensions', () => {
      const wrapper = mount(Skeleton)
      const style = wrapper.attributes('style') || ''
      expect(style).not.toContain('width')
      expect(style).not.toContain('height')
    })
  })

  describe('Combined Props', () => {
    it('applies all props correctly', () => {
      const wrapper = mount(Skeleton, {
        props: {
          variant: 'circle',
          animation: 'pulse',
          width: 48,
          height: 48
        }
      })

      expect(wrapper.find('.ui-skeleton--circle').exists()).toBe(true)
      expect(wrapper.find('.ui-skeleton--pulse').exists()).toBe(true)
      expect(wrapper.attributes('style')).toContain('width: 48px')
      expect(wrapper.attributes('style')).toContain('height: 48px')
    })
  })
})
