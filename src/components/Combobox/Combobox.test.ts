import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'
import Combobox from './Combobox.vue'

// Disable teleport for testing
config.global.stubs = {
  teleport: true
}

const defaultOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
]

describe('Combobox', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders input with combobox role', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('[role="combobox"]').exists()).toBe(true)
      expect(wrapper.find('input[role="combobox"]').exists()).toBe(true)
    })

    it('renders label when provided', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, label: 'Select Fruit' }
      })
      expect(wrapper.find('label').text()).toBe('Select Fruit')
    })

    it('renders required indicator when required', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, label: 'Fruit', required: true }
      })
      expect(wrapper.find('.ui-combobox__required').exists()).toBe(true)
    })

    it('renders placeholder when no selection', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, placeholder: 'Choose...' }
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Choose...')
    })

    it('renders hint text when provided', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, hint: 'Pick your favorite' }
      })
      expect(wrapper.find('.ui-combobox__message--hint').text()).toBe('Pick your favorite')
    })

    it('renders error text when provided', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, error: 'Selection required' }
      })
      expect(wrapper.find('.ui-combobox__message--error').text()).toBe('Selection required')
    })

    it('renders chevron icon', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('.ui-combobox__chevron').exists()).toBe(true)
    })
  })

  describe('Open/Close behavior', () => {
    it('opens dropdown on focus', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('does not open when disabled', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, disabled: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      wrapper.unmount()
    })

    it('renders all options when open', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const options = wrapper.findAll('[role="option"]')
      expect(options).toHaveLength(3)
      wrapper.unmount()
    })

    it('closes with Escape key', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      await input.trigger('keydown', { key: 'Escape' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      wrapper.unmount()
    })

    it('chevron rotates when open', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('.ui-combobox__chevron--open').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('Filtering', () => {
    it('filters options based on input value', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('ban')
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options).toHaveLength(1)
      expect(options[0].text()).toContain('Banana')
      wrapper.unmount()
    })

    it('shows "No results found" when no matches', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('xyz')
      await nextTick()
      expect(wrapper.find('.ui-combobox__empty').exists()).toBe(true)
      expect(wrapper.find('.ui-combobox__empty').text()).toBe('No results found')
      wrapper.unmount()
    })

    it('filters case-insensitively', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('BAN')
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options).toHaveLength(1)
      wrapper.unmount()
    })
  })

  describe('Single selection', () => {
    it('emits update:modelValue on option click', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const options = wrapper.findAll('[role="option"]')
      await options[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
      wrapper.unmount()
    })

    it('closes dropdown after selection in single mode', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const options = wrapper.findAll('[role="option"]')
      await options[1].trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      wrapper.unmount()
    })

    it('updates input value to selected label', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: 'banana' },
        attachTo: document.body
      })
      // When modelValue is set, input should be populated with the selected label
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Banana')
      wrapper.unmount()
    })

    it('does not emit when disabled option clicked', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Combobox, {
        props: { options },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const optionElements = wrapper.findAll('[role="option"]')
      await optionElements[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      wrapper.unmount()
    })

    it('shows checkmark for selected option', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: 'banana' },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      // Clear the input to show all options (modelValue populates input with selected label)
      await wrapper.find('input').setValue('')
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      const selectedOption = options[1] // Banana is at index 1
      expect(selectedOption.find('.ui-combobox__check').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('Multi-selection', () => {
    it('renders chips for selected values', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple', 'banana'], multiple: true }
      })
      const chips = wrapper.findAll('.ui-combobox__chip')
      expect(chips).toHaveLength(2)
      expect(chips[0].text()).toContain('Apple')
      expect(chips[1].text()).toContain('Banana')
    })

    it('emits array value when selecting in multi mode', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, multiple: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const options = wrapper.findAll('[role="option"]')
      await options[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([[['apple']]])
      wrapper.unmount()
    })

    it('keeps dropdown open in multi mode', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, multiple: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const options = wrapper.findAll('[role="option"]')
      await options[0].trigger('click')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('toggles selection in multi mode', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple'], multiple: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const options = wrapper.findAll('[role="option"]')
      // Click already selected option to deselect
      await options[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
      wrapper.unmount()
    })

    it('removes chip on X click', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple', 'banana'], multiple: true },
        attachTo: document.body
      })
      const removeButtons = wrapper.findAll('.ui-combobox__chip-remove')
      await removeButtons[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([[['banana']]])
      wrapper.unmount()
    })

    it('shows checkbox in multi-select options', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, multiple: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const checkboxes = wrapper.findAll('.ui-combobox__checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
      wrapper.unmount()
    })

    it('checkbox shows checkmark when selected', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple'], multiple: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const selectedOption = wrapper.findAll('[role="option"]')[0]
      expect(selectedOption.find('.ui-combobox__checkbox svg').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('Backspace chip deletion', () => {
    it('marks last chip on first backspace', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple', 'banana'], multiple: true },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'Backspace' })
      expect(wrapper.find('.ui-combobox__chip--marked').exists()).toBe(true)
      wrapper.unmount()
    })

    it('deletes marked chip on second backspace', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple', 'banana'], multiple: true },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'Backspace' })
      await input.trigger('keydown', { key: 'Backspace' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple']])
      wrapper.unmount()
    })

    it('does not trigger backspace delete when input has value', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: ['apple'], multiple: true },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.setValue('test')
      await input.trigger('keydown', { key: 'Backspace' })
      expect(wrapper.find('.ui-combobox__chip--marked').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('Overflow handling', () => {
    it('shows overflow badge when chips exceed maxDisplayedChips', () => {
      const wrapper = mount(Combobox, {
        props: {
          options: defaultOptions,
          modelValue: ['apple', 'banana', 'cherry'],
          multiple: true,
          maxDisplayedChips: 2
        }
      })
      expect(wrapper.find('.ui-combobox__overflow').exists()).toBe(true)
      expect(wrapper.find('.ui-combobox__overflow').text()).toBe('+1')
    })

    it('displays correct number of chips up to max', () => {
      const wrapper = mount(Combobox, {
        props: {
          options: defaultOptions,
          modelValue: ['apple', 'banana', 'cherry'],
          multiple: true,
          maxDisplayedChips: 2
        }
      })
      const chips = wrapper.findAll('.ui-combobox__chip')
      expect(chips).toHaveLength(2)
    })

    it('does not show overflow badge when within limit', () => {
      const wrapper = mount(Combobox, {
        props: {
          options: defaultOptions,
          modelValue: ['apple', 'banana'],
          multiple: true,
          maxDisplayedChips: 3
        }
      })
      expect(wrapper.find('.ui-combobox__overflow').exists()).toBe(false)
    })
  })

  describe('Keyboard navigation', () => {
    it('opens with ArrowDown key', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('opens with ArrowUp key', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      wrapper.unmount()
    })

    it('navigates down with ArrowDown', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[1].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })

    it('navigates up with ArrowUp', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      // Navigate to end first, then up
      await input.trigger('keydown', { key: 'End' })
      await input.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      // End goes to index 2 (Cherry), ArrowUp goes to index 1 (Banana)
      expect(options[1].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })

    it('wraps around at end', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      // Navigate to last option
      await input.trigger('keydown', { key: 'End' })
      await nextTick()
      // Then down should wrap to first
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[0].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })

    it('selects with Enter on highlighted option', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
      wrapper.unmount()
    })

    it('goes to first option with Home key', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'End' })
      await input.trigger('keydown', { key: 'Home' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[0].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })

    it('goes to last option with End key', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'End' })
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[2].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })

    it('skips disabled options', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true },
        { label: 'Cherry', value: 'cherry' }
      ]
      const wrapper = mount(Combobox, {
        props: { options },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const optionElements = wrapper.findAll('[role="option"]')
      expect(optionElements[2].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })
  })

  describe('Highlight on hover', () => {
    it('highlights option on mouseenter', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.findAll('[role="option"]')[2].trigger('mouseenter')
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[2].classes()).toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })

    it('does not highlight disabled option on mouseenter', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Combobox, {
        props: { options },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const optionElements = wrapper.findAll('[role="option"]')
      await optionElements[1].trigger('mouseenter')
      expect(optionElements[1].classes()).not.toContain('ui-combobox__option--highlighted')
      wrapper.unmount()
    })
  })

  describe('Create mode (allowCreate)', () => {
    it('shows create option when allowCreate and no exact match', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, allowCreate: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('Mango')
      await nextTick()
      expect(wrapper.find('.ui-combobox__option--create').exists()).toBe(true)
      expect(wrapper.find('.ui-combobox__option--create').text()).toContain('Create "Mango"')
      wrapper.unmount()
    })

    it('does not show create option when exact match exists', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, allowCreate: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('Apple')
      await nextTick()
      expect(wrapper.find('.ui-combobox__option--create').exists()).toBe(false)
      wrapper.unmount()
    })

    it('emits create event on create option click', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, allowCreate: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('Mango')
      await nextTick()
      await wrapper.find('.ui-combobox__option--create').trigger('click')
      expect(wrapper.emitted('create')).toEqual([['Mango']])
      wrapper.unmount()
    })

    it('emits create via Enter when no options match', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, allowCreate: true },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.setValue('NewFruit')
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('create')).toEqual([['NewFruit']])
      wrapper.unmount()
    })
  })

  describe('Disabled state', () => {
    it('applies disabled attribute to input', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, disabled: true }
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('applies disabled class to container', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, disabled: true }
      })
      expect(wrapper.find('.ui-combobox--disabled').exists()).toBe(true)
    })

    it('applies disabled class to disabled options', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Combobox, {
        props: { options },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const optionElements = wrapper.findAll('[role="option"]')
      expect(optionElements[1].classes()).toContain('ui-combobox__option--disabled')
      wrapper.unmount()
    })
  })

  describe('Error state', () => {
    it('applies error class when error provided', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('.ui-combobox--error').exists()).toBe(true)
    })

    it('applies error class to trigger', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('.ui-combobox__trigger--error').exists()).toBe(true)
    })

    it('error has alert role', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('.ui-combobox__message--error').attributes('role')).toBe('alert')
    })
  })

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      it(`applies ${size} size class`, () => {
        const wrapper = mount(Combobox, {
          props: { options: defaultOptions, size }
        })
        expect(wrapper.find(`.ui-combobox--${size}`).exists()).toBe(true)
        expect(wrapper.find(`.ui-combobox__trigger--${size}`).exists()).toBe(true)
      })
    })
  })

  describe('Block mode', () => {
    it('applies block class when block prop is true', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, block: true }
      })
      expect(wrapper.find('.ui-combobox--block').exists()).toBe(true)
    })
  })

  describe('Hidden native select', () => {
    it('renders hidden native select when name provided', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, name: 'fruit' }
      })
      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('does not render hidden select without name', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('select').exists()).toBe(false)
    })

    it('hidden select has correct name attribute', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, name: 'fruit', modelValue: 'banana' }
      })
      const select = wrapper.find('select')
      expect(select.attributes('name')).toBe('fruit')
    })

    it('hidden select supports multiple attribute', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, name: 'fruits', multiple: true }
      })
      const select = wrapper.find('select')
      expect(select.attributes('multiple')).toBeDefined()
    })

    it('hidden select is aria-hidden', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, name: 'fruit' }
      })
      expect(wrapper.find('select').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Accessibility', () => {
    it('input has aria-expanded', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      expect(input.attributes('aria-expanded')).toBe('false')
      await input.trigger('focus')
      expect(input.attributes('aria-expanded')).toBe('true')
      wrapper.unmount()
    })

    it('input has aria-controls linking to listbox', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, id: 'test-combobox' },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('input').attributes('aria-controls')).toBe('test-combobox-listbox')
      expect(wrapper.find('[role="listbox"]').attributes('id')).toBe('test-combobox-listbox')
      wrapper.unmount()
    })

    it('options have role="option"', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      wrapper.findAll('[role="option"]').forEach(option => {
        expect(option.attributes('role')).toBe('option')
      })
      wrapper.unmount()
    })

    it('selected option has aria-selected="true"', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, modelValue: 'banana' },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      // Clear input to show all options (modelValue populates input with selected label)
      await wrapper.find('input').setValue('')
      await nextTick()
      const options = wrapper.findAll('[role="option"]')
      expect(options[0].attributes('aria-selected')).toBe('false')
      expect(options[1].attributes('aria-selected')).toBe('true')
      expect(options[2].attributes('aria-selected')).toBe('false')
      wrapper.unmount()
    })

    it('disabled options have aria-disabled', async () => {
      const options = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true }
      ]
      const wrapper = mount(Combobox, {
        props: { options },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      const optionElements = wrapper.findAll('[role="option"]')
      expect(optionElements[1].attributes('aria-disabled')).toBe('true')
      wrapper.unmount()
    })

    it('input has aria-activedescendant when open', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, id: 'test-combobox' },
        attachTo: document.body
      })
      const input = wrapper.find('input')
      await input.trigger('focus')
      expect(input.attributes('aria-activedescendant')).toBe('test-combobox-option-0')
      wrapper.unmount()
    })

    it('aria-invalid set when error exists', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, error: 'Required' }
      })
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    })

    it('aria-required set when required', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, required: true }
      })
      expect(wrapper.find('input').attributes('aria-required')).toBe('true')
    })

    it('aria-describedby links to hint', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, hint: 'Choose wisely', id: 'test-combobox' }
      })
      expect(wrapper.find('input').attributes('aria-describedby')).toBe('test-combobox-hint')
      expect(wrapper.find('.ui-combobox__message--hint').attributes('id')).toBe('test-combobox-hint')
    })

    it('aria-describedby links to error when present', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, hint: 'Choose wisely', error: 'Required', id: 'test-combobox' }
      })
      expect(wrapper.find('input').attributes('aria-describedby')).toBe('test-combobox-error')
    })

    it('label links to input via for attribute', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, label: 'Fruit', id: 'test-combobox' }
      })
      expect(wrapper.find('label').attributes('for')).toBe('test-combobox')
      expect(wrapper.find('input').attributes('id')).toBe('test-combobox')
    })

    it('listbox has aria-labelledby', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, id: 'test-combobox' },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('[role="listbox"]').attributes('aria-labelledby')).toBe('test-combobox')
      wrapper.unmount()
    })

    it('listbox has aria-multiselectable in multi mode', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions, multiple: true },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')
      wrapper.unmount()
    })

    it('input has aria-autocomplete="list"', () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions }
      })
      expect(wrapper.find('input').attributes('aria-autocomplete')).toBe('list')
    })
  })

  describe('Match highlighting', () => {
    it('highlights matching text in options', async () => {
      const wrapper = mount(Combobox, {
        props: { options: defaultOptions },
        attachTo: document.body
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').setValue('an')
      await nextTick()
      const optionLabel = wrapper.find('.ui-combobox__option-label')
      expect(optionLabel.html()).toContain('<mark>')
      wrapper.unmount()
    })
  })
})
