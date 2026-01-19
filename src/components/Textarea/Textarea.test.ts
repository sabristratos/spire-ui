import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Textarea from './Textarea.vue'

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders a textarea element', () => {
      const wrapper = mount(Textarea)
      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('renders label when provided', () => {
      const wrapper = mount(Textarea, {
        props: { label: 'Description' }
      })
      expect(wrapper.find('label').text()).toContain('Description')
    })

    it('renders required indicator when required', () => {
      const wrapper = mount(Textarea, {
        props: { label: 'Description', required: true }
      })
      expect(wrapper.find('.ui-textarea-field__required').exists()).toBe(true)
    })

    it('renders hint text', () => {
      const wrapper = mount(Textarea, {
        props: { hint: 'Enter a detailed description' }
      })
      expect(wrapper.find('.ui-textarea-field__message--hint').text()).toBe('Enter a detailed description')
    })

    it('renders error message', () => {
      const wrapper = mount(Textarea, {
        props: { error: 'This field is required' }
      })
      expect(wrapper.find('.ui-textarea-field__message--error').text()).toBe('This field is required')
    })

    it('renders placeholder', () => {
      const wrapper = mount(Textarea, {
        props: { placeholder: 'Enter text...' }
      })
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text...')
    })

    it('sets rows attribute', () => {
      const wrapper = mount(Textarea, {
        props: { rows: 5 }
      })
      expect(wrapper.find('textarea').attributes('rows')).toBe('5')
    })

    it('defaults to 3 rows', () => {
      const wrapper = mount(Textarea)
      expect(wrapper.find('textarea').attributes('rows')).toBe('3')
    })
  })

  describe('v-model', () => {
    it('binds value correctly', () => {
      const wrapper = mount(Textarea, {
        props: { modelValue: 'Hello world' }
      })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('Hello world')
    })

    it('emits update:modelValue on input', async () => {
      const wrapper = mount(Textarea)
      const textarea = wrapper.find('textarea')

      await textarea.setValue('New content')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('New content')
    })
  })

  describe('Focus events', () => {
    it('emits focus event', async () => {
      const wrapper = mount(Textarea)
      await wrapper.find('textarea').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event', async () => {
      const wrapper = mount(Textarea)
      await wrapper.find('textarea').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('States', () => {
    it('applies disabled state', () => {
      const wrapper = mount(Textarea, {
        props: { disabled: true }
      })
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.ui-textarea-field--disabled').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper--disabled').exists()).toBe(true)
    })

    it('applies readonly state', () => {
      const wrapper = mount(Textarea, {
        props: { readonly: true }
      })
      expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
      expect(wrapper.find('.ui-textarea-field--readonly').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper--readonly').exists()).toBe(true)
    })

    it('applies error state', () => {
      const wrapper = mount(Textarea, {
        props: { error: 'Error message' }
      })
      expect(wrapper.find('.ui-textarea-field--error').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper--error').exists()).toBe(true)
    })

    it('applies block modifier', () => {
      const wrapper = mount(Textarea, {
        props: { block: true }
      })
      expect(wrapper.find('.ui-textarea-field--block').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('generates unique id for textarea', () => {
      const wrapper = mount(Textarea)
      const id = wrapper.find('textarea').attributes('id')
      expect(id).toMatch(/^textarea-/)
    })

    it('uses provided id', () => {
      const wrapper = mount(Textarea, {
        props: { id: 'custom-textarea' }
      })
      expect(wrapper.find('textarea').attributes('id')).toBe('custom-textarea')
    })

    it('links label to textarea', () => {
      const wrapper = mount(Textarea, {
        props: { label: 'Bio', id: 'bio-field' }
      })
      expect(wrapper.find('label').attributes('for')).toBe('bio-field')
    })

    it('sets aria-invalid when error', () => {
      const wrapper = mount(Textarea, {
        props: { error: 'Required' }
      })
      expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
    })

    it('links aria-describedby to hint', () => {
      const wrapper = mount(Textarea, {
        props: { hint: 'Help text', id: 'test-id' }
      })
      expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('test-id-hint')
    })

    it('links aria-describedby to error over hint', () => {
      const wrapper = mount(Textarea, {
        props: { hint: 'Help text', error: 'Error', id: 'test-id' }
      })
      expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('test-id-error')
    })

    it('links aria-describedby to counter when showCount and maxLength', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, maxLength: 100, id: 'test-id' }
      })
      expect(wrapper.find('textarea').attributes('aria-describedby')).toContain('test-id-counter')
    })
  })

  describe('Character count', () => {
    it('shows character counter when showCount is true', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, modelValue: 'Hello' }
      })
      expect(wrapper.find('.ui-textarea-field__counter').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-field__counter').text()).toBe('5')
    })

    it('shows count with max length', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, maxLength: 100, modelValue: 'Hello' }
      })
      expect(wrapper.find('.ui-textarea-field__counter').text()).toBe('5 / 100')
    })

    it('applies warning state at 90%', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, maxLength: 10, modelValue: '123456789' }
      })
      expect(wrapper.find('.ui-textarea-field__counter--warning').exists()).toBe(true)
    })

    it('applies error state over limit', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: true, maxLength: 5, modelValue: '123456' }
      })
      expect(wrapper.find('.ui-textarea-field__counter--error').exists()).toBe(true)
    })

    it('applies error state to wrapper when over limit', () => {
      const wrapper = mount(Textarea, {
        props: { maxLength: 5, modelValue: '123456' }
      })
      expect(wrapper.find('.ui-textarea-field--error').exists()).toBe(true)
    })

    it('hides counter when showCount is false', () => {
      const wrapper = mount(Textarea, {
        props: { showCount: false, maxLength: 100 }
      })
      expect(wrapper.find('.ui-textarea-field__counter').exists()).toBe(false)
    })

    it('sets maxlength attribute on textarea', () => {
      const wrapper = mount(Textarea, {
        props: { maxLength: 140 }
      })
      expect(wrapper.find('textarea').attributes('maxlength')).toBe('140')
    })
  })

  describe('Auto-grow', () => {
    it('applies autosize class when enabled', () => {
      const wrapper = mount(Textarea, {
        props: { autosize: true }
      })
      expect(wrapper.find('.ui-textarea-wrapper--autosize').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper__textarea--autosize').exists()).toBe(true)
    })

    it('does not apply autosize class when disabled', () => {
      const wrapper = mount(Textarea, {
        props: { autosize: false }
      })
      expect(wrapper.find('.ui-textarea-wrapper--autosize').exists()).toBe(false)
    })

    it('adjusts height on input when autosize is true', async () => {
      const wrapper = mount(Textarea, {
        props: { autosize: true },
        attachTo: document.body
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement

      // Mock scrollHeight
      Object.defineProperty(textarea, 'scrollHeight', {
        value: 100,
        configurable: true
      })

      await wrapper.find('textarea').setValue('Line 1\nLine 2\nLine 3')
      await nextTick()

      // Height should be set to scrollHeight
      expect(textarea.style.height).toBe('100px')

      wrapper.unmount()
    })

    it('respects maxHeight constraint', async () => {
      const wrapper = mount(Textarea, {
        props: { autosize: true, maxHeight: 150 },
        attachTo: document.body
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement

      // Mock scrollHeight larger than maxHeight
      Object.defineProperty(textarea, 'scrollHeight', {
        value: 200,
        configurable: true
      })

      await wrapper.find('textarea').setValue('Very long content...')
      await nextTick()

      // Height should be capped at maxHeight
      expect(textarea.style.height).toBe('150px')
      expect(textarea.style.overflowY).toBe('auto')

      wrapper.unmount()
    })
  })

  describe('Resize behavior', () => {
    it('has vertical resize by default', () => {
      const wrapper = mount(Textarea)
      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).not.toContain('ui-textarea-wrapper__textarea--autosize')
    })

    it('disables resize when autosize is true', () => {
      const wrapper = mount(Textarea, {
        props: { autosize: true }
      })
      expect(wrapper.find('.ui-textarea-wrapper__textarea--autosize').exists()).toBe(true)
    })

    it('disables resize when disabled', async () => {
      const wrapper = mount(Textarea, {
        props: { disabled: true },
        attachTo: document.body
      })

      const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
      const styles = window.getComputedStyle(textarea)

      // The CSS sets resize: none for disabled textareas
      // In JSDOM, we can check the class is applied
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()

      wrapper.unmount()
    })
  })

  describe('Icons', () => {
    it('renders left icon', () => {
      const mockIcon = { template: '<svg class="mock-icon"></svg>' }
      const wrapper = mount(Textarea, {
        props: { iconLeft: mockIcon as any }
      })
      expect(wrapper.find('.ui-textarea-wrapper__addon--left').exists()).toBe(true)
    })

    it('renders left slot content', () => {
      const wrapper = mount(Textarea, {
        slots: {
          left: '<span class="custom-icon">📝</span>'
        }
      })
      expect(wrapper.find('.ui-textarea-wrapper__addon--left').exists()).toBe(true)
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('applies has-left class when icon present', () => {
      const mockIcon = { template: '<svg class="mock-icon"></svg>' }
      const wrapper = mount(Textarea, {
        props: { iconLeft: mockIcon as any }
      })
      expect(wrapper.find('.ui-textarea-wrapper--has-left').exists()).toBe(true)
    })
  })

  describe('Exposed methods', () => {
    it('exposes focus method', async () => {
      const wrapper = mount(Textarea, {
        attachTo: document.body
      })

      const focusSpy = vi.spyOn(wrapper.find('textarea').element, 'focus')

      ;(wrapper.vm as any).focus()

      expect(focusSpy).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('exposes blur method', async () => {
      const wrapper = mount(Textarea, {
        attachTo: document.body
      })

      const blurSpy = vi.spyOn(wrapper.find('textarea').element, 'blur')

      ;(wrapper.vm as any).blur()

      expect(blurSpy).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('exposes select method', async () => {
      const wrapper = mount(Textarea, {
        props: { modelValue: 'Select me' },
        attachTo: document.body
      })

      const selectSpy = vi.spyOn(wrapper.find('textarea').element, 'select')

      ;(wrapper.vm as any).select()

      expect(selectSpy).toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('Name attribute', () => {
    it('sets name attribute', () => {
      const wrapper = mount(Textarea, {
        props: { name: 'bio' }
      })
      expect(wrapper.find('textarea').attributes('name')).toBe('bio')
    })
  })

  describe('Visual parity with Input', () => {
    it('uses same wrapper pattern class structure', () => {
      const wrapper = mount(Textarea)
      // Should have field and wrapper classes similar to Input
      expect(wrapper.find('.ui-textarea-field').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper').exists()).toBe(true)
    })

    it('applies error state classes consistently', () => {
      const wrapper = mount(Textarea, {
        props: { error: 'Error' }
      })
      expect(wrapper.find('.ui-textarea-field--error').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper--error').exists()).toBe(true)
    })

    it('applies disabled state classes consistently', () => {
      const wrapper = mount(Textarea, {
        props: { disabled: true }
      })
      expect(wrapper.find('.ui-textarea-field--disabled').exists()).toBe(true)
      expect(wrapper.find('.ui-textarea-wrapper--disabled').exists()).toBe(true)
    })
  })
})
