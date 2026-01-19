import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick, Teleport } from 'vue'
import Drawer from './Drawer.vue'

config.global.stubs = {
  teleport: true
}

describe('Drawer', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
    config.global.stubs = { teleport: true }
  })

  describe('Rendering', () => {
    it('does not render when modelValue is false', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: false }
      })
      expect(wrapper.find('.ui-drawer').exists()).toBe(false)
    })

    it('renders when modelValue is true', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer').exists()).toBe(true)
    })

    it('renders slot content in body', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true },
        slots: {
          default: '<p>Drawer content</p>'
        }
      })
      expect(wrapper.find('.ui-drawer__body').html()).toContain('Drawer content')
    })

    it('renders title when provided', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, title: 'My Drawer' }
      })
      expect(wrapper.find('.ui-drawer__title').text()).toBe('My Drawer')
    })

    it('does not render header when no title or showClose', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, showClose: false }
      })
      expect(wrapper.find('.ui-drawer__header').exists()).toBe(false)
    })

    it('renders header slot instead of title', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true },
        slots: {
          header: '<span class="custom-header">Custom Header</span>'
        }
      })
      expect(wrapper.find('.custom-header').exists()).toBe(true)
    })

    it('renders footer slot when provided', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true },
        slots: {
          footer: '<button>Save</button>'
        }
      })
      expect(wrapper.find('.ui-drawer__footer').exists()).toBe(true)
      expect(wrapper.find('.ui-drawer__footer button').exists()).toBe(true)
    })

    it('does not render footer when no slot provided', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__footer').exists()).toBe(false)
    })
  })

  describe('Variants', () => {
    it('applies default variant class', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, variant: 'default' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--default')
    })

    it('applies floating variant class', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, variant: 'floating' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--floating')
    })
  })

  describe('Placements', () => {
    it('applies right placement by default', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--right')
    })

    it('applies left placement', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, placement: 'left' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--left')
    })

    it('applies bottom placement', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, placement: 'bottom' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--bottom')
    })
  })

  describe('Sizes', () => {
    it('applies sm size class', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, size: 'sm' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--sm')
    })

    it('applies md size class by default', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--md')
    })

    it('applies lg size class', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, size: 'lg' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--lg')
    })

    it('applies xl size class', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, size: 'xl' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--xl')
    })

    it('applies full size class', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, size: 'full' }
      })
      expect(wrapper.find('.ui-drawer__panel').classes()).toContain('ui-drawer__panel--full')
    })
  })

  describe('Close button', () => {
    it('renders close button when showClose is true', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, showClose: true }
      })
      expect(wrapper.find('.ui-drawer__close').exists()).toBe(true)
    })

    it('does not render close button when showClose is false', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, showClose: false, title: 'Test' }
      })
      expect(wrapper.find('.ui-drawer__close').exists()).toBe(false)
    })

    it('emits update:modelValue false when close button clicked', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })

      await wrapper.find('.ui-drawer__close').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('close button has aria-label', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__close').attributes('aria-label')).toBe('Close drawer')
    })
  })

  describe('Backdrop click', () => {
    it('emits update:modelValue false when backdrop clicked', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })

      await wrapper.find('.ui-drawer__backdrop').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('does not close on backdrop click when maskClosable is false', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, maskClosable: false }
      })

      await wrapper.find('.ui-drawer__backdrop').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Escape key', () => {
    it('emits update:modelValue false on Escape', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })

      await wrapper.find('.ui-drawer').trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })

    it('does not close on Escape when closeOnEscape is false', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, closeOnEscape: false }
      })

      await wrapper.find('.ui-drawer').trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Events', () => {
    it('emits open event when opened', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: false }
      })

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('emits close event when closed', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })

      await wrapper.find('.ui-drawer__close').trigger('click')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('Scroll lock', () => {
    it('locks body scroll when opened', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: false }
      })

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('unlocks body scroll when closed', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })

      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Accessibility', () => {
    it('has role dialog', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__panel').attributes('role')).toBe('dialog')
    })

    it('has aria-modal true', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__panel').attributes('aria-modal')).toBe('true')
    })

    it('has aria-labelledby when title provided', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, title: 'Test Title' }
      })
      const panel = wrapper.find('.ui-drawer__panel')
      const labelledby = panel.attributes('aria-labelledby')
      expect(labelledby).toBeTruthy()

      const title = wrapper.find('.ui-drawer__title')
      expect(title.attributes('id')).toBe(labelledby)
    })

    it('close button icon is aria-hidden', () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.ui-drawer__close svg').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Exposed methods', () => {
    it('exposes close method', async () => {
      const wrapper = mount(Drawer, {
        props: { modelValue: true }
      })

      const vm = wrapper.vm as unknown as { close: () => void }
      vm.close()
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })
  })
})
