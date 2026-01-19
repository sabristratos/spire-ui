import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleGroup from './ToggleGroup.vue'
import ToggleButton from '../ToggleButton/ToggleButton.vue'
import { h } from 'vue'

describe('ToggleGroup', () => {
  describe('Rendering', () => {
    it('renders as a div', () => {
      const wrapper = mount(ToggleGroup)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renders slot content', () => {
      const wrapper = mount(ToggleGroup, {
        slots: {
          default: () => [
            h(ToggleButton, { value: 'a' }, () => 'A'),
            h(ToggleButton, { value: 'b' }, () => 'B')
          ]
        }
      })
      expect(wrapper.text()).toContain('A')
      expect(wrapper.text()).toContain('B')
    })

    it('has role="radiogroup" for single type', () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'single' }
      })
      expect(wrapper.attributes('role')).toBe('radiogroup')
    })

    it('has role="group" for multiple type', () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'multiple' }
      })
      expect(wrapper.attributes('role')).toBe('group')
    })
  })

  describe('Single selection', () => {
    it('emits selected value on child click', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'single', modelValue: undefined },
        slots: {
          default: () => [
            h(ToggleButton, { value: 'bold' }, () => 'B'),
            h(ToggleButton, { value: 'italic' }, () => 'I')
          ]
        }
      })

      await wrapper.findAllComponents(ToggleButton)[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bold'])
    })

    it('emits undefined when same value clicked (toggle off)', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'single', modelValue: 'bold' },
        slots: {
          default: () => [
            h(ToggleButton, { value: 'bold' }, () => 'B'),
            h(ToggleButton, { value: 'italic' }, () => 'I')
          ]
        }
      })

      await wrapper.findAllComponents(ToggleButton)[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    })

    it('switches selection when different value clicked', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'single', modelValue: 'bold' },
        slots: {
          default: () => [
            h(ToggleButton, { value: 'bold' }, () => 'B'),
            h(ToggleButton, { value: 'italic' }, () => 'I')
          ]
        }
      })

      await wrapper.findAllComponents(ToggleButton)[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['italic'])
    })
  })

  describe('Multiple selection', () => {
    it('adds value to array on click', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'multiple', modelValue: [] },
        slots: {
          default: () => [
            h(ToggleButton, { value: 'bold' }, () => 'B'),
            h(ToggleButton, { value: 'italic' }, () => 'I')
          ]
        }
      })

      await wrapper.findAllComponents(ToggleButton)[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['bold']])
    })

    it('removes value from array when already selected', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'multiple', modelValue: ['bold', 'italic'] },
        slots: {
          default: () => [
            h(ToggleButton, { value: 'bold' }, () => 'B'),
            h(ToggleButton, { value: 'italic' }, () => 'I')
          ]
        }
      })

      await wrapper.findAllComponents(ToggleButton)[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['italic']])
    })

    it('allows multiple values to be selected', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { type: 'multiple', modelValue: ['bold'] },
        slots: {
          default: () => [
            h(ToggleButton, { value: 'bold' }, () => 'B'),
            h(ToggleButton, { value: 'italic' }, () => 'I')
          ]
        }
      })

      await wrapper.findAllComponents(ToggleButton)[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['bold', 'italic']])
    })
  })

  describe('Orientation', () => {
    it('applies horizontal class by default', () => {
      const wrapper = mount(ToggleGroup)
      expect(wrapper.classes()).toContain('ui-toggle-group--horizontal')
    })

    it('applies vertical class when orientation is vertical', () => {
      const wrapper = mount(ToggleGroup, {
        props: { orientation: 'vertical' }
      })
      expect(wrapper.classes()).toContain('ui-toggle-group--vertical')
    })

    it('sets aria-orientation attribute', () => {
      const wrapper = mount(ToggleGroup, {
        props: { orientation: 'vertical' }
      })
      expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    })
  })

  describe('Disabled state', () => {
    it('applies disabled class', () => {
      const wrapper = mount(ToggleGroup, {
        props: { disabled: true }
      })
      expect(wrapper.classes()).toContain('ui-toggle-group--disabled')
    })

    it('sets aria-disabled', () => {
      const wrapper = mount(ToggleGroup, {
        props: { disabled: true }
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
  })

  describe('Accessibility', () => {
    it('has aria-label when label prop provided', () => {
      const wrapper = mount(ToggleGroup, {
        props: { label: 'Text formatting' }
      })
      expect(wrapper.attributes('aria-label')).toBe('Text formatting')
    })
  })
})
