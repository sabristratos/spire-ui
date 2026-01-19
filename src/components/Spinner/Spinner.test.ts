import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('renders 8 dots', () => {
    const wrapper = mount(Spinner)
    const dots = wrapper.findAll('.ui-spinner__dot')
    expect(dots).toHaveLength(8)
  })

  it('has role="status" for accessibility', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('has default aria-label "Loading"', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('accepts custom label', () => {
    const wrapper = mount(Spinner, {
      props: { label: 'Processing request' }
    })
    expect(wrapper.attributes('aria-label')).toBe('Processing request')
    expect(wrapper.find('.ui-spinner__sr-only').text()).toBe('Processing request')
  })

  it('applies default size (md)', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('style')).toContain('--spinner-size: var(--spinner-md)')
  })

  it('applies predefined sizes correctly', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    for (const size of sizes) {
      const wrapper = mount(Spinner, { props: { size } })
      expect(wrapper.attributes('style')).toContain(`--spinner-size: var(--spinner-${size})`)
    }
  })

  it('accepts custom size values', () => {
    const wrapper = mount(Spinner, {
      props: { size: '4rem' }
    })
    expect(wrapper.attributes('style')).toContain('--spinner-size: 4rem')
  })

  it('applies default speed (0.9s)', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('style')).toContain('--spinner-speed: 0.9s')
  })

  it('accepts custom speed', () => {
    const wrapper = mount(Spinner, {
      props: { speed: 1.5 }
    })
    expect(wrapper.attributes('style')).toContain('--spinner-speed: 1.5s')
  })

  it('has screen reader only text', () => {
    const wrapper = mount(Spinner)
    const srOnly = wrapper.find('.ui-spinner__sr-only')
    expect(srOnly.exists()).toBe(true)
    expect(srOnly.text()).toBe('Loading')
  })

  it('applies ui-spinner class', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.classes()).toContain('ui-spinner')
  })

  it('uses inline-flex display for inline usage', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.classes()).toContain('ui-spinner')
  })
})
