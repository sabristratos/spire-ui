import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'
import Select from './Select.vue'

// Disable teleport for testing
config.global.stubs = {
  teleport: true
}

const defaultOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
]

describe('Select', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders trigger button with combobox role', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('[role="combobox"]').exists()).toBe(true)
    })

    it('renders label when provided', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, label: 'Select Fruit' }
      })
      expect(wrapper.find('label').text()).toBe('Select Fruit')
    })

    it('renders required indicator when required', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, label: 'Fruit', required: true }
      })
      expect(wrapper.find('.ui-select__required').exists()).toBe(true)
    })

    it('renders placeholder when no selection', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, placeholder: 'Choose...' }
      })
      expect(wrapper.find('.ui-select__value').text()).toBe('Choose...')
    })

    it('renders selected value label', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'banana' }
      })
      expect(wrapper.find('.ui-select__value').text()).toBe('Banana')
    })

    it('renders hint text when provided', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, hint: 'Pick your favorite' }
      })
      expect(wrapper.find('.ui-select__message--hint').text()).toBe('Pick your favorite')
    })

    it('renders error text when provided', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, error: 'Selection required' }
      })
      expect(wrapper.find('.ui-select__message--error').text()).toBe('Selection required')
    })

    it('renders chevron icon', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('.ui-select__chevron').exists()).toBe(true)
    })
  })

  describe('Open/Close behavior', () => {
    it('opens dropdown on click', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    })

    it('closes dropdown on second click', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      await trigger.trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('does not open when disabled', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, disabled: true }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('renders all options when open', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const options = wrapper.findAll('[role="option"]')
      expect(options).toHaveLength(3)
    })

    it('chevron rotates when open', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      expect(wrapper.find('.ui-select__chevron--open').exists()).toBe(true)
    })
  })

  describe('Selection', () => {
    it('emits update:modelValue on option click', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const options = wrapper.findAll('[role="option"]')
      await options[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
    })

    it('emits change event on selection', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const options = wrapper.findAll('[role="option"]')
      await options[1].trigger('click')
      expect(wrapper.emitted('change')).toEqual([['banana']])
    })

    it('closes dropdown after selection', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const options = wrapper.findAll('[role="option"]')
      await options[1].trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('does not emit when disabled option clicked', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Select, {
        props: { options }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const optionElements = wrapper.findAll('[role="option"]')
      await optionElements[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('shows checkmark for selected option', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'banana' }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const selectedOption = wrapper.findAll('[role="option"]')[1]
      expect(selectedOption.find('.ui-select__check').exists()).toBe(true)
    })
  })

  describe('Keyboard navigation', () => {
    it('opens with Enter key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('[role="combobox"]').trigger('keydown', { key: 'Enter' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('opens with Space key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('[role="combobox"]').trigger('keydown', { key: ' ' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('opens with ArrowDown key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('opens with ArrowUp key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('[role="combobox"]').trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('closes with Escape key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'Escape' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      wrapper.unmount()
    })

    it('navigates down with ArrowDown', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      // Check highlighted class moved
      const options = wrapper.findAll('[role="option"]')
      expect(options[1].classes()).toContain('ui-select__option--highlighted')
      wrapper.unmount()
    })

    it('navigates up with ArrowUp', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'cherry' },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[1].classes()).toContain('ui-select__option--highlighted')
      wrapper.unmount()
    })

    it('wraps around at end', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'cherry' },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[0].classes()).toContain('ui-select__option--highlighted')
      wrapper.unmount()
    })

    it('selects with Enter on highlighted option', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'ArrowDown' })
      await trigger.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
      wrapper.unmount()
    })

    it('goes to first option with Home key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'cherry' },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'Home' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[0].classes()).toContain('ui-select__option--highlighted')
      wrapper.unmount()
    })

    it('goes to last option with End key', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'apple' },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'End' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[2].classes()).toContain('ui-select__option--highlighted')
      wrapper.unmount()
    })

    it('skips disabled options', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true },
        { label: 'Cherry', value: 'cherry' }
      ]
      const wrapper = mount(Select, {
        props: { options, modelValue: 'apple' },
        attachTo: document.body
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      await trigger.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const optionElements = wrapper.findAll('[role="option"]')
      expect(optionElements[2].classes()).toContain('ui-select__option--highlighted')
      wrapper.unmount()
    })
  })

  describe('Highlight on hover', () => {
    it('highlights option on mouseenter', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      await wrapper.findAll('[role="option"]')[2].trigger('mouseenter')
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[2].classes()).toContain('ui-select__option--highlighted')
    })

    it('does not highlight disabled option on mouseenter', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Select, {
        props: { options }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const optionElements = wrapper.findAll('[role="option"]')
      await optionElements[1].trigger('mouseenter')
      expect(optionElements[1].classes()).not.toContain('ui-select__option--highlighted')
    })
  })

  describe('Disabled state', () => {
    it('applies disabled attribute to trigger', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, disabled: true }
      })
      expect(wrapper.find('[role="combobox"]').attributes('disabled')).toBeDefined()
    })

    it('applies disabled class to container', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, disabled: true }
      })
      expect(wrapper.find('.ui-select--disabled').exists()).toBe(true)
    })

    it('applies disabled class to disabled options', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Select, {
        props: { options }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const optionElements = wrapper.findAll('[role="option"]')
      expect(optionElements[1].classes()).toContain('ui-select__option--disabled')
    })
  })

  describe('Error state', () => {
    it('applies error class when error provided', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('.ui-select--error').exists()).toBe(true)
    })

    it('applies error class to trigger', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('.ui-select__trigger--error').exists()).toBe(true)
    })

    it('error has alert role', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('.ui-select__message--error').attributes('role')).toBe('alert')
    })
  })

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Select, {
          props: { options: defaultOptions, size }
        })
        expect(wrapper.find(`.ui-select--${size}`).exists()).toBe(true)
        expect(wrapper.find(`.ui-select__trigger--${size}`).exists()).toBe(true)
      })
    })
  })

  describe('Block mode', () => {
    it('applies block class when block prop is true', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, block: true }
      })
      expect(wrapper.find('.ui-select--block').exists()).toBe(true)
    })
  })

  describe('Hidden native select', () => {
    it('renders hidden native select when name provided', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, name: 'fruit' }
      })
      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('does not render hidden select without name', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('select').exists()).toBe(false)
    })

    it('hidden select has correct name and value', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, name: 'fruit', modelValue: 'banana' }
      })
      const select = wrapper.find('select')
      expect(select.attributes('name')).toBe('fruit')
      expect((select.element as HTMLSelectElement).value).toBe('banana')
    })

    it('hidden select is aria-hidden', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, name: 'fruit' }
      })
      expect(wrapper.find('select').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Accessibility', () => {
    it('trigger has aria-haspopup="listbox"', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('[role="combobox"]').attributes('aria-haspopup')).toBe('listbox')
    })

    it('trigger has aria-expanded', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      const trigger = wrapper.find('[role="combobox"]')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      await trigger.trigger('click')
      expect(trigger.attributes('aria-expanded')).toBe('true')
    })

    it('trigger has aria-controls linking to listbox', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, id: 'test-select' }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      expect(wrapper.find('[role="combobox"]').attributes('aria-controls')).toBe('test-select-listbox')
      expect(wrapper.find('[role="listbox"]').attributes('id')).toBe('test-select-listbox')
    })

    it('options have role="option"', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      wrapper.findAll('[role="option"]').forEach(option => {
        expect(option.attributes('role')).toBe('option')
      })
    })

    it('selected option has aria-selected="true"', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, modelValue: 'banana' }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const options = wrapper.findAll('[role="option"]')
      expect(options[0].attributes('aria-selected')).toBe('false')
      expect(options[1].attributes('aria-selected')).toBe('true')
      expect(options[2].attributes('aria-selected')).toBe('false')
    })

    it('disabled options have aria-disabled', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Select, {
        props: { options }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      const optionElements = wrapper.findAll('[role="option"]')
      expect(optionElements[1].attributes('aria-disabled')).toBe('true')
    })

    it('trigger has aria-activedescendant when open', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, id: 'test-select' }
      })
      const trigger = wrapper.find('[role="combobox"]')
      await trigger.trigger('click')
      // First non-disabled option is highlighted
      expect(trigger.attributes('aria-activedescendant')).toBe('test-select-option-0')
    })

    it('aria-invalid set when error exists', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('[role="combobox"]').attributes('aria-invalid')).toBe('true')
    })

    it('aria-required set when required', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, required: true }
      })
      expect(wrapper.find('[role="combobox"]').attributes('aria-required')).toBe('true')
    })

    it('aria-describedby links to hint', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, hint: 'Choose wisely', id: 'test-select' }
      })
      expect(wrapper.find('[role="combobox"]').attributes('aria-describedby')).toBe('test-select-hint')
      expect(wrapper.find('.ui-select__message--hint').attributes('id')).toBe('test-select-hint')
    })

    it('aria-describedby links to error when present', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, hint: 'Choose wisely', error: 'Required', id: 'test-select' }
      })
      // Error takes precedence over hint
      expect(wrapper.find('[role="combobox"]').attributes('aria-describedby')).toBe('test-select-error')
    })

    it('label links to trigger via for attribute', () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, label: 'Fruit', id: 'test-select' }
      })
      expect(wrapper.find('label').attributes('for')).toBe('test-select')
      expect(wrapper.find('[role="combobox"]').attributes('id')).toBe('test-select')
    })

    it('listbox has aria-labelledby', async () => {
      const wrapper = mount(Select, {
        props: { options: defaultOptions, id: 'test-select' }
      })
      await wrapper.find('[role="combobox"]').trigger('click')
      expect(wrapper.find('[role="listbox"]').attributes('aria-labelledby')).toBe('test-select')
    })
  })
})
