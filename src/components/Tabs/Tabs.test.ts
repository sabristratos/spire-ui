import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Tabs from './Tabs.vue'

const defaultItems = [
  { label: 'Tab 1', value: 'tab1' },
  { label: 'Tab 2', value: 'tab2' },
  { label: 'Tab 3', value: 'tab3' }
]

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeEach(() => {
  global.ResizeObserver = ResizeObserverMock as any
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Tabs', () => {
  describe('Rendering', () => {
    it('renders tab list with correct role', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    })

    it('renders all tab buttons', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      expect(tabs).toHaveLength(3)
    })

    it('renders tab labels', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      expect(wrapper.text()).toContain('Tab 1')
      expect(wrapper.text()).toContain('Tab 2')
      expect(wrapper.text()).toContain('Tab 3')
    })

    it('renders magic line indicator', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      expect(wrapper.find('.ui-tabs__indicator').exists()).toBe(true)
    })

    it('renders tab panels', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      const panels = wrapper.findAll('[role="tabpanel"]')
      expect(panels).toHaveLength(3)
    })
  })

  describe('Active state', () => {
    it('marks active tab with aria-selected true', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab2', items: defaultItems }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      expect(tabs[0].attributes('aria-selected')).toBe('false')
      expect(tabs[1].attributes('aria-selected')).toBe('true')
      expect(tabs[2].attributes('aria-selected')).toBe('false')
    })

    it('applies active class to active tab', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab2', items: defaultItems }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      expect(tabs[1].classes()).toContain('ui-tabs__tab--active')
    })

    it('shows only active panel', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab2', items: defaultItems },
        slots: {
          tab1: '<div>Content 1</div>',
          tab2: '<div>Content 2</div>',
          tab3: '<div>Content 3</div>'
        }
      })
      const panels = wrapper.findAll('[role="tabpanel"]')
      // v-show uses display:none, check via style attribute
      expect(panels[0].attributes('style')).toContain('display: none')
      expect(panels[1].attributes('style')).toBeUndefined()
      expect(panels[2].attributes('style')).toContain('display: none')
    })
  })

  describe('Tab selection', () => {
    it('emits update:modelValue when tab clicked', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab2']])
    })

    it('does not emit when disabled tab clicked', async () => {
      const items = [
        { label: 'Tab 1', value: 'tab1' },
        { label: 'Tab 2', value: 'tab2', disabled: true }
      ]
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Disabled tabs', () => {
    it('applies disabled attribute to disabled tabs', () => {
      const items = [
        { label: 'Tab 1', value: 'tab1' },
        { label: 'Tab 2', value: 'tab2', disabled: true }
      ]
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      expect(tabs[0].attributes('disabled')).toBeUndefined()
      expect(tabs[1].attributes('disabled')).toBeDefined()
    })
  })

  describe('Keyboard navigation', () => {
    it('moves focus right with ArrowRight', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[0].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab2']])
      wrapper.unmount()
    })

    it('moves focus left with ArrowLeft', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab2', items: defaultItems },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[1].trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab1']])
      wrapper.unmount()
    })

    it('wraps around from last to first', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab3', items: defaultItems },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[2].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab1']])
      wrapper.unmount()
    })

    it('wraps around from first to last', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[0].trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab3']])
      wrapper.unmount()
    })

    it('skips disabled tabs', async () => {
      const items = [
        { label: 'Tab 1', value: 'tab1' },
        { label: 'Tab 2', value: 'tab2', disabled: true },
        { label: 'Tab 3', value: 'tab3' }
      ]
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[0].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab3']])
      wrapper.unmount()
    })

    it('goes to first tab with Home key', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab3', items: defaultItems },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[2].trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab1']])
      wrapper.unmount()
    })

    it('goes to last tab with End key', async () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems },
        attachTo: document.body
      })
      const tabs = wrapper.findAll('[role="tab"]')
      await tabs[0].trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['tab3']])
      wrapper.unmount()
    })
  })

  describe('Roving tabindex', () => {
    it('only active tab has tabindex 0', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab2', items: defaultItems }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      expect(tabs[0].attributes('tabindex')).toBe('-1')
      expect(tabs[1].attributes('tabindex')).toBe('0')
      expect(tabs[2].attributes('tabindex')).toBe('-1')
    })
  })

  describe('Variants', () => {
    it('applies line variant class by default', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      expect(wrapper.find('.ui-tabs__list--line').exists()).toBe(true)
    })

    it('applies pill variant class', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems, variant: 'pill' }
      })
      expect(wrapper.find('.ui-tabs__list--pill').exists()).toBe(true)
    })
  })

  describe('Block mode', () => {
    it('applies block class when block prop is true', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems, block: true }
      })
      expect(wrapper.find('.ui-tabs__list--block').exists()).toBe(true)
    })
  })

  describe('Slots', () => {
    it('renders named slot content for active tab', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems },
        slots: {
          tab1: '<div class="custom-content">Custom Content</div>'
        }
      })
      expect(wrapper.find('.custom-content').exists()).toBe(true)
    })

    it('slot name matches tab value', () => {
      const items = [
        { label: 'Account', value: 'account' },
        { label: 'Settings', value: 'settings' }
      ]
      const wrapper = mount(Tabs, {
        props: { modelValue: 'settings', items },
        slots: {
          account: '<div class="account-content">Account</div>',
          settings: '<div class="settings-content">Settings</div>'
        }
      })
      // Active panel has no display:none style, inactive has display:none
      const settingsPanel = wrapper.find('#tabpanel-settings')
      const accountPanel = wrapper.find('#tabpanel-account')
      expect(settingsPanel.attributes('style')).toBeUndefined()
      expect(accountPanel.attributes('style')).toContain('display: none')
    })
  })

  describe('Accessibility', () => {
    it('tabs have role="tab"', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      wrapper.findAll('button').forEach(btn => {
        expect(btn.attributes('role')).toBe('tab')
      })
    })

    it('panels have role="tabpanel"', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      wrapper.findAll('.ui-tabs__panel').forEach(panel => {
        expect(panel.attributes('role')).toBe('tabpanel')
      })
    })

    it('tabs have aria-controls linking to panels', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      const tabs = wrapper.findAll('[role="tab"]')
      expect(tabs[0].attributes('aria-controls')).toBe('tabpanel-tab1')
      expect(tabs[1].attributes('aria-controls')).toBe('tabpanel-tab2')
    })

    it('panels have matching ids', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      const panels = wrapper.findAll('[role="tabpanel"]')
      expect(panels[0].attributes('id')).toBe('tabpanel-tab1')
      expect(panels[1].attributes('id')).toBe('tabpanel-tab2')
    })

    it('panels are focusable with tabindex', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      const panels = wrapper.findAll('[role="tabpanel"]')
      panels.forEach(panel => {
        expect(panel.attributes('tabindex')).toBe('0')
      })
    })

    it('indicator is hidden from accessibility tree', () => {
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items: defaultItems }
      })
      expect(wrapper.find('.ui-tabs__indicator').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Icons', () => {
    it('renders icon when provided', () => {
      const MockIcon = { template: '<svg class="mock-icon"></svg>' }
      const items = [
        { label: 'Tab 1', value: 'tab1', icon: MockIcon }
      ]
      const wrapper = mount(Tabs, {
        props: { modelValue: 'tab1', items }
      })
      expect(wrapper.find('.ui-tabs__icon').exists()).toBe(true)
    })
  })
})
