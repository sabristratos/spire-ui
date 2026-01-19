import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from './Progress.vue'

describe('Progress', () => {
  describe('Linear variant', () => {
    it('renders linear progress by default', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear').exists()).toBe(true)
      expect(wrapper.find('.ui-progress-circular').exists()).toBe(false)
    })

    it('renders track and indicator', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear__track').exists()).toBe(true)
      expect(wrapper.find('.ui-progress-linear__indicator').exists()).toBe(true)
    })

    it('sets indicator width based on value', () => {
      const wrapper = mount(Progress, {
        props: { value: 50 }
      })
      const indicator = wrapper.find('.ui-progress-linear__indicator')
      expect(indicator.attributes('style')).toContain('width: 50%')
    })

    it('clamps value to 0-100 range', async () => {
      const wrapper = mount(Progress, {
        props: { value: 150 }
      })
      const indicator = wrapper.find('.ui-progress-linear__indicator')
      expect(indicator.attributes('style')).toContain('width: 100%')

      await wrapper.setProps({ value: -50 })
      expect(indicator.attributes('style')).toContain('width: 0%')
    })

    it('applies size classes', async () => {
      const wrapper = mount(Progress, {
        props: { size: 'sm' }
      })
      expect(wrapper.find('.ui-progress-linear--sm').exists()).toBe(true)

      await wrapper.setProps({ size: 'md' })
      expect(wrapper.find('.ui-progress-linear--md').exists()).toBe(true)

      await wrapper.setProps({ size: 'lg' })
      expect(wrapper.find('.ui-progress-linear--lg').exists()).toBe(true)
    })

    it('applies color classes', async () => {
      const wrapper = mount(Progress, {
        props: { color: 'primary' }
      })
      expect(wrapper.find('.ui-progress-linear--primary').exists()).toBe(true)

      await wrapper.setProps({ color: 'success' })
      expect(wrapper.find('.ui-progress-linear--success').exists()).toBe(true)

      await wrapper.setProps({ color: 'warning' })
      expect(wrapper.find('.ui-progress-linear--warning').exists()).toBe(true)

      await wrapper.setProps({ color: 'error' })
      expect(wrapper.find('.ui-progress-linear--error').exists()).toBe(true)
    })
  })

  describe('Circular variant', () => {
    it('renders circular progress when variant is circular', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular' }
      })
      expect(wrapper.find('.ui-progress-circular').exists()).toBe(true)
      expect(wrapper.find('.ui-progress-linear').exists()).toBe(false)
    })

    it('renders SVG with track and indicator circles', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular' }
      })
      expect(wrapper.find('.ui-progress-circular__svg').exists()).toBe(true)
      expect(wrapper.find('.ui-progress-circular__track').exists()).toBe(true)
      expect(wrapper.find('.ui-progress-circular__indicator').exists()).toBe(true)
    })

    it('sets stroke-dashoffset based on value', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', value: 50, size: 'md' }
      })
      const indicator = wrapper.find('.ui-progress-circular__indicator')
      expect(indicator.attributes('stroke-dasharray')).toBeDefined()
      expect(indicator.attributes('stroke-dashoffset')).toBeDefined()
    })

    it('applies size to SVG dimensions', async () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', size: 'sm' }
      })
      let svg = wrapper.find('.ui-progress-circular__svg')
      expect(svg.attributes('width')).toBe('32')
      expect(svg.attributes('height')).toBe('32')

      await wrapper.setProps({ size: 'md' })
      svg = wrapper.find('.ui-progress-circular__svg')
      expect(svg.attributes('width')).toBe('48')
      expect(svg.attributes('height')).toBe('48')

      await wrapper.setProps({ size: 'lg' })
      svg = wrapper.find('.ui-progress-circular__svg')
      expect(svg.attributes('width')).toBe('64')
      expect(svg.attributes('height')).toBe('64')
    })

    it('applies color classes', async () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', color: 'success' }
      })
      expect(wrapper.find('.ui-progress-circular--success').exists()).toBe(true)

      await wrapper.setProps({ color: 'error' })
      expect(wrapper.find('.ui-progress-circular--error').exists()).toBe(true)
    })

    it('allows custom stroke width', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', strokeWidth: 8 }
      })
      const track = wrapper.find('.ui-progress-circular__track')
      expect(track.attributes('stroke-width')).toBe('8')
    })
  })

  describe('Indeterminate state', () => {
    it('applies indeterminate class to linear progress', () => {
      const wrapper = mount(Progress, {
        props: { indeterminate: true }
      })
      expect(wrapper.find('.ui-progress-linear--indeterminate').exists()).toBe(true)
    })

    it('applies indeterminate class to circular progress', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', indeterminate: true }
      })
      expect(wrapper.find('.ui-progress-circular--indeterminate').exists()).toBe(true)
    })

    it('does not set inline width style when indeterminate', () => {
      const wrapper = mount(Progress, {
        props: { value: 50, indeterminate: true }
      })
      const indicator = wrapper.find('.ui-progress-linear__indicator')
      expect(indicator.attributes('style')).toBeUndefined()
    })

    it('does not show value label when indeterminate', () => {
      const wrapper = mount(Progress, {
        props: { value: 50, showValue: true, indeterminate: true }
      })
      expect(wrapper.find('.ui-progress-linear__value').exists()).toBe(false)
    })
  })

  describe('Striped pattern', () => {
    it('applies striped class when striped prop is true', () => {
      const wrapper = mount(Progress, {
        props: { striped: true }
      })
      expect(wrapper.find('.ui-progress-linear--striped').exists()).toBe(true)
    })

    it('does not apply striped class when indeterminate', () => {
      const wrapper = mount(Progress, {
        props: { striped: true, indeterminate: true }
      })
      expect(wrapper.find('.ui-progress-linear--striped').exists()).toBe(false)
    })

    it('applies animated class when both striped and animated', () => {
      const wrapper = mount(Progress, {
        props: { striped: true, animated: true }
      })
      expect(wrapper.find('.ui-progress-linear--animated').exists()).toBe(true)
    })

    it('does not apply animated class without striped', () => {
      const wrapper = mount(Progress, {
        props: { animated: true }
      })
      expect(wrapper.find('.ui-progress-linear--animated').exists()).toBe(false)
    })

    it('does not apply animated class when indeterminate', () => {
      const wrapper = mount(Progress, {
        props: { striped: true, animated: true, indeterminate: true }
      })
      expect(wrapper.find('.ui-progress-linear--animated').exists()).toBe(false)
    })
  })

  describe('Value label', () => {
    it('does not show value by default', () => {
      const wrapper = mount(Progress, {
        props: { value: 50 }
      })
      expect(wrapper.find('.ui-progress-linear__value').exists()).toBe(false)
    })

    it('shows value when showValue is true (linear)', () => {
      const wrapper = mount(Progress, {
        props: { value: 50, showValue: true }
      })
      const valueEl = wrapper.find('.ui-progress-linear__value')
      expect(valueEl.exists()).toBe(true)
      expect(valueEl.text()).toBe('50%')
    })

    it('shows value when showValue is true (circular)', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', value: 75, showValue: true }
      })
      const valueEl = wrapper.find('.ui-progress-circular__value')
      expect(valueEl.exists()).toBe(true)
      expect(valueEl.text()).toBe('75%')
    })

    it('displays clamped value', () => {
      const wrapper = mount(Progress, {
        props: { value: 150, showValue: true }
      })
      expect(wrapper.find('.ui-progress-linear__value').text()).toBe('100%')
    })
  })

  describe('Accessibility', () => {
    it('has progressbar role', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear').attributes('role')).toBe('progressbar')
    })

    it('has progressbar role for circular variant', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular' }
      })
      expect(wrapper.find('.ui-progress-circular').attributes('role')).toBe('progressbar')
    })

    it('sets aria-valuemin and aria-valuemax', () => {
      const wrapper = mount(Progress)
      const progress = wrapper.find('.ui-progress-linear')
      expect(progress.attributes('aria-valuemin')).toBe('0')
      expect(progress.attributes('aria-valuemax')).toBe('100')
    })

    it('sets aria-valuenow to current value', () => {
      const wrapper = mount(Progress, {
        props: { value: 42 }
      })
      expect(wrapper.find('.ui-progress-linear').attributes('aria-valuenow')).toBe('42')
    })

    it('removes aria-valuenow when indeterminate', () => {
      const wrapper = mount(Progress, {
        props: { value: 50, indeterminate: true }
      })
      expect(wrapper.find('.ui-progress-linear').attributes('aria-valuenow')).toBeUndefined()
    })

    it('applies aria-label from label prop', () => {
      const wrapper = mount(Progress, {
        props: { label: 'Upload progress' }
      })
      expect(wrapper.find('.ui-progress-linear').attributes('aria-label')).toBe('Upload progress')
    })

    it('applies aria-label to circular variant', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', label: 'Loading data' }
      })
      expect(wrapper.find('.ui-progress-circular').attributes('aria-label')).toBe('Loading data')
    })
  })

  describe('SVG geometry', () => {
    it('has correct viewBox matching size', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', size: 'lg' }
      })
      expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 64 64')
    })

    it('calculates correct radius accounting for stroke width', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular', size: 'md' }
      })
      const track = wrapper.find('.ui-progress-circular__track')
      const radius = track.attributes('r')
      expect(Number(radius)).toBe(22)
    })

    it('has stroke-linecap round on indicator', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular' }
      })
      const indicator = wrapper.find('.ui-progress-circular__indicator')
      expect(indicator.attributes('stroke-linecap')).toBe('round')
    })

    it('has fill="none" on circles', () => {
      const wrapper = mount(Progress, {
        props: { variant: 'circular' }
      })
      expect(wrapper.find('.ui-progress-circular__track').attributes('fill')).toBe('none')
      expect(wrapper.find('.ui-progress-circular__indicator').attributes('fill')).toBe('none')
    })
  })

  describe('Progress updates', () => {
    it('updates indicator width when value changes', async () => {
      const wrapper = mount(Progress, {
        props: { value: 25 }
      })
      expect(wrapper.find('.ui-progress-linear__indicator').attributes('style')).toContain('width: 25%')

      await wrapper.setProps({ value: 75 })
      expect(wrapper.find('.ui-progress-linear__indicator').attributes('style')).toContain('width: 75%')
    })

    it('updates value label when value changes', async () => {
      const wrapper = mount(Progress, {
        props: { value: 30, showValue: true }
      })
      expect(wrapper.find('.ui-progress-linear__value').text()).toBe('30%')

      await wrapper.setProps({ value: 80 })
      expect(wrapper.find('.ui-progress-linear__value').text()).toBe('80%')
    })
  })

  describe('Default props', () => {
    it('has default value of 0', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear__indicator').attributes('style')).toContain('width: 0%')
    })

    it('has default variant of linear', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear').exists()).toBe(true)
    })

    it('has default size of md', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear--md').exists()).toBe(true)
    })

    it('has default color of primary', () => {
      const wrapper = mount(Progress)
      expect(wrapper.find('.ui-progress-linear--primary').exists()).toBe(true)
    })
  })
})
