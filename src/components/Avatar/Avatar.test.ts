import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  describe('Fallback hierarchy', () => {
    it('renders image when src is provided', () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/avatar.jpg', name: 'John Doe' }
      })
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.find('.ui-avatar__text').exists()).toBe(false)
    })

    it('renders initials when no src provided', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'John Doe' }
      })
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('.ui-avatar__text').text()).toBe('JD')
    })

    it('renders fallback icon when no src or name', () => {
      const wrapper = mount(Avatar)
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('.ui-avatar__text').exists()).toBe(false)
      expect(wrapper.find('.ui-avatar__icon').exists()).toBe(true)
    })

    it('falls back to initials on image error', async () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://broken.url/image.jpg', name: 'John Doe' }
      })

      // Initially shows image
      expect(wrapper.find('img').exists()).toBe(true)

      // Simulate error
      await wrapper.find('img').trigger('error')

      // Now shows initials
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('.ui-avatar__text').text()).toBe('JD')
    })

    it('falls back to icon on image error when no name', async () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://broken.url/image.jpg' }
      })

      await wrapper.find('img').trigger('error')

      expect(wrapper.find('.ui-avatar__icon').exists()).toBe(true)
    })
  })

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Avatar, {
          props: { size, name: 'Test' }
        })
        expect(wrapper.classes()).toContain(`ui-avatar--${size}`)
      })
    })

    it('defaults to md size', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-avatar--md')
    })
  })

  describe('Shapes', () => {
    it('applies circle shape by default', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-avatar--circle')
    })

    it('applies square shape when specified', () => {
      const wrapper = mount(Avatar, {
        props: { shape: 'square', name: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-avatar--square')
    })
  })

  describe('Variants', () => {
    const variants = ['neutral', 'primary', 'soft'] as const

    variants.forEach(variant => {
      it(`applies ${variant} variant class`, () => {
        const wrapper = mount(Avatar, {
          props: { variant, name: 'Test' }
        })
        expect(wrapper.classes()).toContain(`ui-avatar--${variant}`)
      })
    })

    it('defaults to soft variant', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-avatar--soft')
    })
  })

  describe('Bordered', () => {
    it('applies bordered class when bordered prop is true', () => {
      const wrapper = mount(Avatar, {
        props: { bordered: true, name: 'Test' }
      })
      expect(wrapper.classes()).toContain('ui-avatar--bordered')
    })

    it('does not apply bordered class by default', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'Test' }
      })
      expect(wrapper.classes()).not.toContain('ui-avatar--bordered')
    })
  })

  describe('Accessibility', () => {
    it('has role="img"', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'John Doe' }
      })
      expect(wrapper.attributes('role')).toBe('img')
    })

    it('uses name for aria-label', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'John Doe' }
      })
      expect(wrapper.attributes('aria-label')).toBe('John Doe')
    })

    it('uses alt for aria-label when provided', () => {
      const wrapper = mount(Avatar, {
        props: { name: 'John Doe', alt: 'Profile picture' }
      })
      expect(wrapper.attributes('aria-label')).toBe('Profile picture')
    })

    it('falls back to "Avatar" when no name or alt', () => {
      const wrapper = mount(Avatar)
      expect(wrapper.attributes('aria-label')).toBe('Avatar')
    })

    it('sets alt attribute on image', () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://example.com/avatar.jpg', name: 'John Doe' }
      })
      expect(wrapper.find('img').attributes('alt')).toBe('John Doe')
    })
  })

  describe('Image error recovery', () => {
    it('resets error state when src changes', async () => {
      const wrapper = mount(Avatar, {
        props: { src: 'https://broken.url/image.jpg', name: 'John Doe' }
      })

      // Trigger error
      await wrapper.find('img').trigger('error')
      expect(wrapper.find('.ui-avatar__text').exists()).toBe(true)

      // Change src
      await wrapper.setProps({ src: 'https://new.url/image.jpg' })

      // Should show image again (error reset)
      expect(wrapper.find('img').exists()).toBe(true)
    })
  })
})
