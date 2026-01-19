import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChoiceChipGroup from './ChoiceChipGroup.vue'
import ChoiceChip from '../ChoiceChip/ChoiceChip.vue'
import { h } from 'vue'

describe('ChoiceChipGroup', () => {
  describe('Rendering', () => {
    it('renders as a div', () => {
      const wrapper = mount(ChoiceChipGroup)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renders slot content', () => {
      const wrapper = mount(ChoiceChipGroup, {
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'A', value: 'a' }),
            h(ChoiceChip, { label: 'B', value: 'b' })
          ]
        }
      })
      expect(wrapper.text()).toContain('A')
      expect(wrapper.text()).toContain('B')
    })

    it('has role="group"', () => {
      const wrapper = mount(ChoiceChipGroup)
      expect(wrapper.attributes('role')).toBe('group')
    })
  })

  describe('Multiple selection (default)', () => {
    it('adds value to array on click', async () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { type: 'multiple', modelValue: [] },
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'Price', value: 'price' }),
            h(ChoiceChip, { label: 'Date', value: 'date' })
          ]
        }
      })

      await wrapper.findAllComponents(ChoiceChip)[0].find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['price']])
    })

    it('removes value from array when already selected', async () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { type: 'multiple', modelValue: ['price', 'date'] },
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'Price', value: 'price' }),
            h(ChoiceChip, { label: 'Date', value: 'date' })
          ]
        }
      })

      await wrapper.findAllComponents(ChoiceChip)[0].find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['date']])
    })

    it('allows multiple values to be selected', async () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { type: 'multiple', modelValue: ['price'] },
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'Price', value: 'price' }),
            h(ChoiceChip, { label: 'Date', value: 'date' })
          ]
        }
      })

      await wrapper.findAllComponents(ChoiceChip)[1].find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['price', 'date']])
    })
  })

  describe('Single selection', () => {
    it('emits selected value on click', async () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { type: 'single', modelValue: undefined },
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'Price', value: 'price' }),
            h(ChoiceChip, { label: 'Date', value: 'date' })
          ]
        }
      })

      await wrapper.findAllComponents(ChoiceChip)[0].find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['price'])
    })

    it('emits undefined when same value clicked (toggle off)', async () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { type: 'single', modelValue: 'price' },
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'Price', value: 'price' }),
            h(ChoiceChip, { label: 'Date', value: 'date' })
          ]
        }
      })

      await wrapper.findAllComponents(ChoiceChip)[0].find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    })

    it('switches selection when different value clicked', async () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { type: 'single', modelValue: 'price' },
        slots: {
          default: () => [
            h(ChoiceChip, { label: 'Price', value: 'price' }),
            h(ChoiceChip, { label: 'Date', value: 'date' })
          ]
        }
      })

      await wrapper.findAllComponents(ChoiceChip)[1].find('input').trigger('change')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['date'])
    })
  })

  describe('Disabled state', () => {
    it('applies disabled class', () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { disabled: true }
      })
      expect(wrapper.classes()).toContain('ui-choice-chip-group--disabled')
    })

    it('sets aria-disabled', () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { disabled: true }
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
  })

  describe('Accessibility', () => {
    it('has aria-label when label prop provided', () => {
      const wrapper = mount(ChoiceChipGroup, {
        props: { label: 'Filter by' }
      })
      expect(wrapper.attributes('aria-label')).toBe('Filter by')
    })
  })
})
