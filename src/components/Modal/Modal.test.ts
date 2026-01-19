import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

// Track open state per dialog element using WeakMap (module-level to persist across mocks)
const openStates = new WeakMap<HTMLDialogElement, boolean>()

// Create mock functions at module level
const showModalMock = vi.fn(function(this: HTMLDialogElement) {
  this.setAttribute('open', '')
  openStates.set(this, true)
})

const closeMock = vi.fn(function(this: HTMLDialogElement) {
  this.removeAttribute('open')
  openStates.set(this, false)
})

// Mock dialog methods (JSDOM doesn't fully support native dialog)
beforeEach(() => {
  // Clear mock call history but keep implementation
  showModalMock.mockClear()
  closeMock.mockClear()

  HTMLDialogElement.prototype.showModal = showModalMock
  HTMLDialogElement.prototype.close = closeMock

  // Override the 'open' property getter to read from our state map
  Object.defineProperty(HTMLDialogElement.prototype, 'open', {
    get: function(this: HTMLDialogElement) {
      return openStates.get(this) ?? this.hasAttribute('open')
    },
    configurable: true
  })
})

afterEach(() => {
  document.body.style.overflow = ''
})

describe('Modal', () => {
  describe('Rendering', () => {
    it('renders as a dialog element', () => {
      const wrapper = mount(Modal)
      expect(wrapper.find('dialog').exists()).toBe(true)
    })

    it('renders with ui-modal class', () => {
      const wrapper = mount(Modal)
      expect(wrapper.find('.ui-modal').exists()).toBe(true)
    })

    it('renders slot content in body', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true },
        slots: {
          default: '<p>Modal content</p>'
        }
      })
      expect(wrapper.find('.ui-modal__body').html()).toContain('Modal content')
    })

    it('renders title when provided', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'My Modal' }
      })
      expect(wrapper.find('.ui-modal__title').text()).toBe('My Modal')
    })

    it('does not render header when no title or header slot', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-modal__header').exists()).toBe(false)
    })

    it('renders header slot instead of title', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true },
        slots: {
          header: '<span class="custom-header">Custom Header</span>'
        }
      })
      expect(wrapper.find('.custom-header').exists()).toBe(true)
    })

    it('renders footer slot when provided', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true },
        slots: {
          footer: '<button>Save</button>'
        }
      })
      expect(wrapper.find('.ui-modal__footer').exists()).toBe(true)
      expect(wrapper.find('.ui-modal__footer button').exists()).toBe(true)
    })

    it('does not render footer when no slot provided', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-modal__footer').exists()).toBe(false)
    })
  })

  describe('Sizes', () => {
    it('applies sm size class', () => {
      const wrapper = mount(Modal, {
        props: { size: 'sm' }
      })
      expect(wrapper.find('.ui-modal').classes()).toContain('ui-modal--sm')
    })

    it('applies md size class by default', () => {
      const wrapper = mount(Modal)
      expect(wrapper.find('.ui-modal').classes()).toContain('ui-modal--md')
    })

    it('applies lg size class', () => {
      const wrapper = mount(Modal, {
        props: { size: 'lg' }
      })
      expect(wrapper.find('.ui-modal').classes()).toContain('ui-modal--lg')
    })

    it('applies xl size class', () => {
      const wrapper = mount(Modal, {
        props: { size: 'xl' }
      })
      expect(wrapper.find('.ui-modal').classes()).toContain('ui-modal--xl')
    })

    it('applies full size class', () => {
      const wrapper = mount(Modal, {
        props: { size: 'full' }
      })
      expect(wrapper.find('.ui-modal').classes()).toContain('ui-modal--full')
    })
  })

  describe('Open/Close', () => {
    it('calls showModal when modelValue becomes true', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: false }
      })

      await wrapper.setProps({ modelValue: true })

      expect(showModalMock).toHaveBeenCalled()
    })

    it('calls close when modelValue becomes false', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true }
      })

      await wrapper.setProps({ modelValue: false })

      expect(closeMock).toHaveBeenCalled()
    })

    it('locks body scroll when opened', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: false }
      })

      await wrapper.setProps({ modelValue: true })

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('unlocks body scroll when closed', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true }
      })

      await wrapper.setProps({ modelValue: false })

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Close button', () => {
    it('renders close button when header is visible', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })
      expect(wrapper.find('.ui-modal__close').exists()).toBe(true)
    })

    it('emits update:modelValue false when close button clicked', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })

      await wrapper.find('.ui-modal__close').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('has aria-label', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })
      expect(wrapper.find('.ui-modal__close').attributes('aria-label')).toBe('Close modal')
    })
  })

  describe('Backdrop click', () => {
    it('emits update:modelValue false when backdrop clicked', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })

      const dialog = wrapper.find('dialog')
      // Simulate backdrop click (target === dialog element)
      await dialog.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('does not close when content clicked', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })

      await wrapper.find('.ui-modal__box').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('does not close on backdrop click when persistent', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test', persistent: true }
      })

      const dialog = wrapper.find('dialog')
      await dialog.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Escape key', () => {
    it('emits update:modelValue false on cancel event', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })

      await wrapper.find('dialog').trigger('cancel')

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('prevents default on cancel when persistent', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test', persistent: true }
      })

      const event = new Event('cancel', { cancelable: true })
      const preventDefault = vi.spyOn(event, 'preventDefault')

      wrapper.find('dialog').element.dispatchEvent(event)

      expect(preventDefault).toHaveBeenCalled()
    })
  })

  describe('Close event', () => {
    it('emits close event on dialog close', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })

      await wrapper.find('dialog').trigger('close')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('syncs modelValue on dialog close', async () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })

      await wrapper.find('dialog').trigger('close')

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })
  })

  describe('Accessibility', () => {
    it('uses native dialog element', () => {
      const wrapper = mount(Modal)
      expect(wrapper.find('dialog').exists()).toBe(true)
    })

    it('close button has aria-label', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })
      expect(wrapper.find('.ui-modal__close').attributes('aria-label')).toBe('Close modal')
    })

    it('close button icon is aria-hidden', () => {
      const wrapper = mount(Modal, {
        props: { modelValue: true, title: 'Test' }
      })
      expect(wrapper.find('.ui-modal__close svg').attributes('aria-hidden')).toBe('true')
    })
  })
})
