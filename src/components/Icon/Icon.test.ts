import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent, markRaw } from 'vue'
import Icon from './Icon.vue'

// Mock Vue component icon for testing
const MockVueIcon = markRaw(defineComponent({
  name: 'MockVueIcon',
  render() {
    return h('svg', { 'data-testid': 'mock-svg' }, [
      h('path', { d: 'M0 0h24v24H0z' })
    ])
  }
}))

// Mock HugeIcons data array format
const MockHugeIcon = [
  ['path', { d: 'M12 2v20', stroke: 'currentColor', strokeWidth: '1.5', key: '0' }],
  ['circle', { cx: '12', cy: '12', r: '4', stroke: 'currentColor', strokeWidth: '1.5', key: '1' }]
] as [string, Record<string, unknown>][]

describe('Icon', () => {
  describe('Vue Component Icons', () => {
    it('renders the passed Vue component', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon }
      })

      expect(wrapper.find('[data-testid="mock-svg"]').exists()).toBe(true)
    })

    it('applies default size (md)', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon }
      })

      const style = wrapper.attributes('style')
      expect(style).toContain('--icon-size: var(--icon-md)')
    })

    it('applies predefined sizes correctly', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

      for (const size of sizes) {
        const wrapper = mount(Icon, {
          props: { icon: MockVueIcon, size }
        })

        expect(wrapper.attributes('style')).toContain(`--icon-size: var(--icon-${size})`)
      }
    })

    it('accepts custom size values', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon, size: '3rem' }
      })

      expect(wrapper.attributes('style')).toContain('--icon-size: 3rem')
    })

    it('has aria-hidden="true" when no label provided', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon }
      })

      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('has accessible label when label prop provided', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon, label: 'Close dialog' }
      })

      expect(wrapper.attributes('aria-label')).toBe('Close dialog')
      expect(wrapper.attributes('aria-hidden')).toBe('false')
    })

    it('has role="img" for semantic meaning', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon }
      })

      expect(wrapper.attributes('role')).toBe('img')
    })

    it('applies ui-icon class for styling', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockVueIcon }
      })

      expect(wrapper.classes()).toContain('ui-icon')
    })
  })

  describe('HugeIcons Data Array Format', () => {
    it('renders HugeIcons data array as SVG', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon }
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
      expect(wrapper.find('path').exists()).toBe(true)
      expect(wrapper.find('circle').exists()).toBe(true)
    })

    it('applies size to HugeIcons', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon, size: 'lg' }
      })

      expect(wrapper.attributes('style')).toContain('--icon-size: var(--icon-lg)')
    })

    it('applies custom size to HugeIcons', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon, size: '48px' }
      })

      expect(wrapper.attributes('style')).toContain('--icon-size: 48px')
    })

    it('has proper SVG attributes', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon }
      })

      expect(wrapper.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
      expect(wrapper.attributes('viewBox')).toBe('0 0 24 24')
      expect(wrapper.attributes('fill')).toBe('none')
    })

    it('has aria-hidden for decorative HugeIcons', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon }
      })

      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('has accessible label when provided', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon, label: 'Sun icon' }
      })

      expect(wrapper.attributes('aria-label')).toBe('Sun icon')
      expect(wrapper.attributes('aria-hidden')).toBe('false')
    })

    it('applies ui-icon class', () => {
      const wrapper = mount(Icon, {
        props: { icon: MockHugeIcon }
      })

      expect(wrapper.classes()).toContain('ui-icon')
    })
  })
})
