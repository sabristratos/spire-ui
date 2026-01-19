import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastProvider from './ToastProvider.vue'
import { toastActions } from './toastState'

describe('ToastProvider', () => {
  beforeEach(() => {
    toastActions.clear()
  })

  describe('Rendering', () => {
    it('renders provider container', () => {
      const wrapper = mount(ToastProvider, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').exists()).toBe(true)
    })

    it('renders toasts from state', () => {
      toastActions.success('Toast 1')
      toastActions.error('Toast 2')

      const wrapper = mount(ToastProvider, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })

      const toasts = wrapper.findAll('.ui-toast')
      expect(toasts.length).toBe(2)
    })
  })

  describe('Positions', () => {
    it('applies top-right position by default', () => {
      const wrapper = mount(ToastProvider, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').classes()).toContain('ui-toast-provider--top-right')
    })

    it('applies top-left position', () => {
      const wrapper = mount(ToastProvider, {
        props: { position: 'top-left' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').classes()).toContain('ui-toast-provider--top-left')
    })

    it('applies bottom-right position', () => {
      const wrapper = mount(ToastProvider, {
        props: { position: 'bottom-right' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').classes()).toContain('ui-toast-provider--bottom-right')
    })

    it('applies bottom-left position', () => {
      const wrapper = mount(ToastProvider, {
        props: { position: 'bottom-left' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').classes()).toContain('ui-toast-provider--bottom-left')
    })

    it('applies top-center position', () => {
      const wrapper = mount(ToastProvider, {
        props: { position: 'top-center' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').classes()).toContain('ui-toast-provider--top-center')
    })

    it('applies bottom-center position', () => {
      const wrapper = mount(ToastProvider, {
        props: { position: 'bottom-center' },
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').classes()).toContain('ui-toast-provider--bottom-center')
    })
  })

  describe('Accessibility', () => {
    it('has role="region"', () => {
      const wrapper = mount(ToastProvider, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').attributes('role')).toBe('region')
    })

    it('has aria-label="Notifications"', () => {
      const wrapper = mount(ToastProvider, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.find('.ui-toast-provider').attributes('aria-label')).toBe('Notifications')
    })
  })

  describe('Dismiss handling', () => {
    it('removes toast when dismiss event is emitted', async () => {
      const id = toastActions.success('Test toast')

      const wrapper = mount(ToastProvider, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })

      expect(wrapper.findAll('.ui-toast').length).toBe(1)

      // Find the close button and click it
      await wrapper.find('.ui-toast__close').trigger('click')

      // Toast should be removed
      expect(wrapper.findAll('.ui-toast').length).toBe(0)
    })
  })
})
