import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'

// Disable teleport for testing
config.global.stubs = {
  teleport: true
}

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders trigger slot content', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text' },
        slots: { default: '<button>Hover me</button>' }
      })
      expect(wrapper.find('button').text()).toBe('Hover me')
    })

    it('does not show tooltip initially', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text' },
        slots: { default: '<button>Hover me</button>' }
      })
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })

    it('shows tooltip on mouseenter after delay', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 100 },
        slots: { default: '<button>Hover me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')

      // Not visible yet (within delay)
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)

      // Advance past delay
      vi.advanceTimersByTime(150)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
      expect(wrapper.find('[role="tooltip"]').text()).toBe('Help text')
    })

    it('hides tooltip on mouseleave', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Hover me</button>' }
      })

      // Show tooltip
      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      // Hide tooltip
      await wrapper.find('.ui-tooltip-trigger').trigger('mouseleave')
      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })
  })

  describe('Focus interactions', () => {
    it('shows tooltip on focusin', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Focus me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('focusin')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    })

    it('hides tooltip on focusout', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Focus me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('focusin')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      await wrapper.find('.ui-tooltip-trigger').trigger('focusout')
      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })
  })

  describe('Keyboard interactions', () => {
    it('hides tooltip on Escape key', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Press Escape</button>' }
      })

      // Show tooltip
      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)

      // Press Escape
      await wrapper.find('.ui-tooltip-trigger').trigger('keydown', { key: 'Escape' })
      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('respects custom delay', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 500 },
        slots: { default: '<button>Hover me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')

      // Not visible at 400ms
      vi.advanceTimersByTime(400)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)

      // Visible at 550ms
      vi.advanceTimersByTime(150)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    })

    it('does not show when disabled', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0, disabled: true },
        slots: { default: '<button>Hover me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')
      vi.advanceTimersByTime(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('has role="tooltip" on content', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Hover me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    })

    it('sets aria-describedby when visible', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Hover me</button>' }
      })

      // Initially no aria-describedby
      expect(wrapper.find('.ui-tooltip-trigger').attributes('aria-describedby')).toBeUndefined()

      // Show tooltip
      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      // Now has aria-describedby matching tooltip id
      const describedBy = wrapper.find('.ui-tooltip-trigger').attributes('aria-describedby')
      expect(describedBy).toBeDefined()
      expect(describedBy).toMatch(/^tooltip-/)
    })

    it('tooltip id matches aria-describedby', async () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text', delay: 0 },
        slots: { default: '<button>Hover me</button>' }
      })

      await wrapper.find('.ui-tooltip-trigger').trigger('mouseenter')
      vi.advanceTimersByTime(50)
      await wrapper.vm.$nextTick()

      const describedBy = wrapper.find('.ui-tooltip-trigger').attributes('aria-describedby')
      const tooltipId = wrapper.find('[role="tooltip"]').attributes('id')
      expect(describedBy).toBe(tooltipId)
    })
  })

  describe('Placement', () => {
    it('defaults to top placement', () => {
      const wrapper = mount(Tooltip, {
        props: { text: 'Help text' },
        slots: { default: '<button>Hover me</button>' }
      })
      // Placement is internal, but we can check the component accepts the prop
      expect(wrapper.props('placement')).toBe('top')
    })

    it('accepts different placements', () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const

      placements.forEach(placement => {
        const wrapper = mount(Tooltip, {
          props: { text: 'Help text', placement },
          slots: { default: '<button>Hover me</button>' }
        })
        expect(wrapper.props('placement')).toBe(placement)
      })
    })
  })
})
