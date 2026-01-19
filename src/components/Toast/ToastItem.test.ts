import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastItem from './ToastItem.vue'
import type { Toast } from './toastState'

function createToast(overrides: Partial<Toast> = {}): Toast {
  return {
    id: 'test-id',
    title: 'Test Title',
    message: 'Test message',
    variant: 'success',
    duration: 5000,
    createdAt: Date.now(),
    ...overrides
  }
}

describe('ToastItem', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders toast container', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast() }
      })
      expect(wrapper.find('.ui-toast').exists()).toBe(true)
    })

    it('renders title', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ title: 'My Title' }) }
      })
      expect(wrapper.find('.ui-toast__title').text()).toBe('My Title')
    })

    it('renders message', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ message: 'My message' }) }
      })
      expect(wrapper.find('.ui-toast__message').text()).toBe('My message')
    })

    it('does not render title if not provided', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ title: undefined }) }
      })
      expect(wrapper.find('.ui-toast__title').exists()).toBe(false)
    })

    it('does not render message if not provided', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ message: undefined }) }
      })
      expect(wrapper.find('.ui-toast__message').exists()).toBe(false)
    })

    it('renders icon', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast() }
      })
      expect(wrapper.find('.ui-toast__icon svg').exists()).toBe(true)
    })

    it('renders close button', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast() }
      })
      expect(wrapper.find('.ui-toast__close').exists()).toBe(true)
    })

    it('renders progress bar when duration > 0', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 5000 }) }
      })
      expect(wrapper.find('.ui-toast__progress').exists()).toBe(true)
    })

    it('does not render progress bar when duration is 0', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 0 }) }
      })
      expect(wrapper.find('.ui-toast__progress').exists()).toBe(false)
    })
  })

  describe('Variants', () => {
    it('applies success variant class', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'success' }) }
      })
      expect(wrapper.find('.ui-toast').classes()).toContain('ui-toast--success')
    })

    it('applies error variant class', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'error' }) }
      })
      expect(wrapper.find('.ui-toast').classes()).toContain('ui-toast--error')
    })

    it('applies warning variant class', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'warning' }) }
      })
      expect(wrapper.find('.ui-toast').classes()).toContain('ui-toast--warning')
    })

    it('applies info variant class', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'info' }) }
      })
      expect(wrapper.find('.ui-toast').classes()).toContain('ui-toast--info')
    })
  })

  describe('Auto-dismiss', () => {
    it('emits dismiss after duration', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 5000 }) }
      })

      expect(wrapper.emitted('dismiss')).toBeUndefined()

      vi.advanceTimersByTime(5000)

      expect(wrapper.emitted('dismiss')).toHaveLength(1)
      expect(wrapper.emitted('dismiss')?.[0]).toEqual(['test-id'])
    })

    it('does not auto-dismiss when duration is 0', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 0 }) }
      })

      vi.advanceTimersByTime(10000)

      expect(wrapper.emitted('dismiss')).toBeUndefined()
    })
  })

  describe('Close button', () => {
    it('emits dismiss when close button clicked', async () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast() }
      })

      await wrapper.find('.ui-toast__close').trigger('click')

      expect(wrapper.emitted('dismiss')).toHaveLength(1)
      expect(wrapper.emitted('dismiss')?.[0]).toEqual(['test-id'])
    })
  })

  describe('Pause on hover', () => {
    it('pauses timer on mouseenter', async () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 5000 }) }
      })

      // Advance 2 seconds
      vi.advanceTimersByTime(2000)

      // Hover - pause the timer
      await wrapper.find('.ui-toast').trigger('mouseenter')

      // Advance past original duration
      vi.advanceTimersByTime(10000)

      // Should NOT have dismissed
      expect(wrapper.emitted('dismiss')).toBeUndefined()
    })

    it('resumes timer on mouseleave', async () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 5000 }) }
      })

      // Advance 2 seconds (3 seconds remaining)
      vi.advanceTimersByTime(2000)

      // Hover
      await wrapper.find('.ui-toast').trigger('mouseenter')

      // Wait a bit while hovering
      vi.advanceTimersByTime(5000)

      // Leave - resume timer with remaining time
      await wrapper.find('.ui-toast').trigger('mouseleave')

      // Should not dismiss yet (need ~3 more seconds)
      expect(wrapper.emitted('dismiss')).toBeUndefined()

      // Now advance the remaining time
      vi.advanceTimersByTime(3000)

      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })

    it('adds paused class to progress bar on hover', async () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 5000 }) }
      })

      expect(wrapper.find('.ui-toast__progress').classes()).not.toContain('ui-toast__progress--paused')

      await wrapper.find('.ui-toast').trigger('mouseenter')

      expect(wrapper.find('.ui-toast__progress').classes()).toContain('ui-toast__progress--paused')

      await wrapper.find('.ui-toast').trigger('mouseleave')

      expect(wrapper.find('.ui-toast__progress').classes()).not.toContain('ui-toast__progress--paused')
    })
  })

  describe('Accessibility', () => {
    it('has role="alert" for error variant', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'error' }) }
      })
      expect(wrapper.find('.ui-toast').attributes('role')).toBe('alert')
    })

    it('has role="status" for success variant', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'success' }) }
      })
      expect(wrapper.find('.ui-toast').attributes('role')).toBe('status')
    })

    it('has role="status" for info variant', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'info' }) }
      })
      expect(wrapper.find('.ui-toast').attributes('role')).toBe('status')
    })

    it('has role="status" for warning variant', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'warning' }) }
      })
      expect(wrapper.find('.ui-toast').attributes('role')).toBe('status')
    })

    it('has aria-live="assertive" for error variant', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'error' }) }
      })
      expect(wrapper.find('.ui-toast').attributes('aria-live')).toBe('assertive')
    })

    it('has aria-live="polite" for success variant', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ variant: 'success' }) }
      })
      expect(wrapper.find('.ui-toast').attributes('aria-live')).toBe('polite')
    })

    it('close button has aria-label', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast() }
      })
      expect(wrapper.find('.ui-toast__close').attributes('aria-label')).toBe('Dismiss notification')
    })

    it('icon is aria-hidden', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast() }
      })
      expect(wrapper.find('.ui-toast__icon').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Progress bar styling', () => {
    it('sets duration CSS variable', () => {
      const wrapper = mount(ToastItem, {
        props: { toast: createToast({ duration: 3000 }) }
      })
      const progress = wrapper.find('.ui-toast__progress')
      expect(progress.attributes('style')).toContain('--toast-duration: 3000ms')
    })
  })
})
