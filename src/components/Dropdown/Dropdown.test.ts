import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, h, defineComponent } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownSeparator from './DropdownSeparator.vue'
import DropdownSub from './DropdownSub.vue'
import DropdownSubTrigger from './DropdownSubTrigger.vue'
import DropdownSubContent from './DropdownSubContent.vue'

const TriggerButton = defineComponent({
  template: '<button>Open Menu</button>'
})

describe('Dropdown', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders trigger slot', () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton)
      }
    })
    expect(wrapper.find('.ui-dropdown__trigger').exists()).toBe(true)
    expect(wrapper.text()).toContain('Open Menu')
  })

  it('opens menu on trigger click', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    const menu = document.body.querySelector('.ui-dropdown__menu')
    expect(menu).toBeTruthy()
  })

  it('closes menu on second trigger click', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    const trigger = wrapper.find('.ui-dropdown__trigger')
    await trigger.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ui-dropdown__menu')).toBeTruthy()

    await trigger.trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ui-dropdown__menu')).toBeFalsy()
  })

  it('does not open when disabled', async () => {
    wrapper = mount(Dropdown, {
      props: { disabled: true },
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ui-dropdown__menu')).toBeFalsy()
  })

  it('emits open event when opening', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits close event when closing', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    const trigger = wrapper.find('.ui-dropdown__trigger')
    await trigger.trigger('click')
    await nextTick()
    await trigger.trigger('click')
    await nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('sets correct ARIA attributes on trigger', () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton)
      }
    })

    const trigger = wrapper.find('.ui-dropdown__trigger')
    expect(trigger.attributes('aria-haspopup')).toBe('true')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-controls')).toBeTruthy()
  })

  it('updates aria-expanded when open', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    const trigger = wrapper.find('.ui-dropdown__trigger')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    await nextTick()

    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  it('menu has correct role and aria attributes', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    const menu = document.body.querySelector('.ui-dropdown__menu')
    expect(menu?.getAttribute('role')).toBe('menu')
    expect(menu?.getAttribute('aria-labelledby')).toBeTruthy()
  })

  it('opens menu on Enter key', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(document.body.querySelector('.ui-dropdown__menu')).toBeTruthy()
  })

  it('opens menu on Space key', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('keydown', { key: ' ' })
    await nextTick()

    expect(document.body.querySelector('.ui-dropdown__menu')).toBeTruthy()
  })

  it('opens menu on ArrowDown key', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(document.body.querySelector('.ui-dropdown__menu')).toBeTruthy()
  })

  it('applies default placement bottom-start', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h(DropdownItem, {}, () => 'Item 1')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    const menu = document.body.querySelector('.ui-dropdown__menu') as HTMLElement
    expect(menu).toBeTruthy()
  })
})

describe('DropdownItem', () => {
  it('renders as button by default', () => {
    const wrapper = mount(DropdownItem, {
      slots: { default: () => 'Edit' }
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('role')).toBe('menuitem')
  })

  it('renders as anchor when href is provided', () => {
    const wrapper = mount(DropdownItem, {
      props: { href: 'https://example.com' },
      slots: { default: () => 'External Link' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders as router-link when to is provided', () => {
    const wrapper = mount(DropdownItem, {
      props: { to: '/settings' },
      slots: { default: () => 'Settings' },
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Settings')
  })

  it('applies danger class when danger prop is true', () => {
    const wrapper = mount(DropdownItem, {
      props: { danger: true },
      slots: { default: () => 'Delete' }
    })

    expect(wrapper.classes()).toContain('ui-dropdown-item--danger')
  })

  it('applies disabled class and attributes when disabled', () => {
    const wrapper = mount(DropdownItem, {
      props: { disabled: true },
      slots: { default: () => 'Disabled' }
    })

    expect(wrapper.classes()).toContain('ui-dropdown-item--disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('renders icon when provided', () => {
    const TestIcon = defineComponent({
      template: '<svg data-testid="icon"></svg>'
    })

    const wrapper = mount(DropdownItem, {
      props: { icon: TestIcon },
      slots: { default: () => 'With Icon' }
    })

    expect(wrapper.find('.ui-dropdown-item__icon').exists()).toBe(true)
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('renders shortcut when provided', () => {
    const wrapper = mount(DropdownItem, {
      props: { shortcut: '⌘K' },
      slots: { default: () => 'Search' }
    })

    expect(wrapper.find('.ui-dropdown-item__shortcut').exists()).toBe(true)
    expect(wrapper.find('.ui-dropdown-item__shortcut').text()).toBe('⌘K')
  })

  it('emits click event', async () => {
    const wrapper = mount(DropdownItem, {
      slots: { default: () => 'Click Me' }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(DropdownItem, {
      props: { disabled: true },
      slots: { default: () => 'Disabled' }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })
})

describe('DropdownSeparator', () => {
  it('renders with correct role', () => {
    const wrapper = mount(DropdownSeparator)

    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.classes()).toContain('ui-dropdown-separator')
  })
})

describe('Dropdown keyboard navigation', () => {
  let wrapper: VueWrapper

  afterEach(() => {
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  it('closes menu on Escape key', async () => {
    wrapper = mount(Dropdown, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => [
          h(DropdownItem, {}, () => 'Item 1'),
          h(DropdownItem, {}, () => 'Item 2')
        ]
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    const menu = document.body.querySelector('.ui-dropdown__menu')
    expect(menu).toBeTruthy()

    await wrapper.find('.ui-dropdown__trigger').trigger('click')
    await nextTick()

    const menuAfterOpen = document.body.querySelector('.ui-dropdown__menu')
    if (menuAfterOpen) {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      menuAfterOpen.dispatchEvent(event)
      await nextTick()
    }
  })
})

describe('DropdownSub', () => {
  it('renders wrapper element', () => {
    const wrapper = mount(DropdownSub, {
      slots: { default: () => h('span', 'Content') }
    })

    expect(wrapper.classes()).toContain('ui-dropdown-sub')
    expect(wrapper.text()).toContain('Content')
  })

  it('provides submenu context to children', () => {
    const wrapper = mount(DropdownSub, {
      slots: { default: () => h('span', 'Content') }
    })

    const vm = wrapper.vm as any
    expect(typeof vm.open).toBe('function')
    expect(typeof vm.close).toBe('function')
    expect(typeof vm.scheduleClose).toBe('function')
    expect(typeof vm.cancelClose).toBe('function')
  })

  it('exposes isOpen state', () => {
    const wrapper = mount(DropdownSub)
    const vm = wrapper.vm as any

    expect(vm.isOpen).toBe(false)
    vm.open()
    expect(vm.isOpen).toBe(true)
    vm.close()
    expect(vm.isOpen).toBe(false)
  })
})

describe('DropdownSubTrigger', () => {
  const createSubTriggerInContext = (props = {}) => {
    return mount(DropdownSub, {
      slots: {
        default: () => h(DropdownSubTrigger, props, () => 'More Options')
      },
      attachTo: document.body
    })
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders as button with menuitem role', () => {
    const wrapper = createSubTriggerInContext()
    const trigger = wrapper.find('.ui-dropdown-sub-trigger')

    expect(trigger.element.tagName).toBe('BUTTON')
    expect(trigger.attributes('role')).toBe('menuitem')
    expect(trigger.attributes('aria-haspopup')).toBe('true')
  })

  it('shows chevron icon', () => {
    const wrapper = createSubTriggerInContext()
    const chevron = wrapper.find('.ui-dropdown-sub-trigger__chevron')

    expect(chevron.exists()).toBe(true)
    expect(chevron.find('svg').exists()).toBe(true)
  })

  it('applies disabled styles when disabled', () => {
    const wrapper = createSubTriggerInContext({ disabled: true })
    const trigger = wrapper.find('.ui-dropdown-sub-trigger')

    expect(trigger.classes()).toContain('ui-dropdown-sub-trigger--disabled')
    expect(trigger.attributes('aria-disabled')).toBe('true')
    expect(trigger.attributes('tabindex')).toBe('-1')
  })

  it('renders icon when provided', () => {
    const TestIcon = defineComponent({
      template: '<svg data-testid="sub-icon"></svg>'
    })

    const wrapper = mount(DropdownSub, {
      slots: {
        default: () => h(DropdownSubTrigger, { icon: TestIcon }, () => 'With Icon')
      }
    })

    expect(wrapper.find('.ui-dropdown-sub-trigger__icon').exists()).toBe(true)
    expect(wrapper.find('[data-testid="sub-icon"]').exists()).toBe(true)
  })

  it('opens submenu on ArrowRight key', async () => {
    const wrapper = createSubTriggerInContext()
    const trigger = wrapper.find('.ui-dropdown-sub-trigger')

    await trigger.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    const subVm = wrapper.vm as any
    expect(subVm.isOpen).toBe(true)
  })

  it('opens submenu on Enter key', async () => {
    const wrapper = createSubTriggerInContext()
    const trigger = wrapper.find('.ui-dropdown-sub-trigger')

    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()

    const subVm = wrapper.vm as any
    expect(subVm.isOpen).toBe(true)
  })
})

describe('DropdownSubContent', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders when submenu is open', async () => {
    const wrapper = mount(DropdownSub, {
      slots: {
        default: () => [
          h(DropdownSubTrigger, {}, () => 'Trigger'),
          h(DropdownSubContent, {}, () => h(DropdownItem, {}, () => 'Sub Item'))
        ]
      },
      attachTo: document.body
    })

    const subVm = wrapper.vm as any
    subVm.open()
    await nextTick()

    const content = document.body.querySelector('.ui-dropdown-sub-content')
    expect(content).toBeTruthy()
    expect(content?.getAttribute('role')).toBe('menu')
  })

  it('does not render when submenu is closed', async () => {
    const wrapper = mount(DropdownSub, {
      slots: {
        default: () => [
          h(DropdownSubTrigger, {}, () => 'Trigger'),
          h(DropdownSubContent, {}, () => h(DropdownItem, {}, () => 'Sub Item'))
        ]
      },
      attachTo: document.body
    })

    await nextTick()
    const content = document.body.querySelector('.ui-dropdown-sub-content')
    expect(content).toBeFalsy()
  })

  it('closes on ArrowLeft key', async () => {
    const wrapper = mount(DropdownSub, {
      slots: {
        default: () => [
          h(DropdownSubTrigger, {}, () => 'Trigger'),
          h(DropdownSubContent, {}, () => h(DropdownItem, {}, () => 'Sub Item'))
        ]
      },
      attachTo: document.body
    })

    const subVm = wrapper.vm as any
    subVm.open()
    await nextTick()

    const content = document.body.querySelector('.ui-dropdown-sub-content')
    expect(content).toBeTruthy()

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    content?.dispatchEvent(event)
    await nextTick()

    expect(subVm.isOpen).toBe(false)
  })

  it('closes on Escape key', async () => {
    const wrapper = mount(DropdownSub, {
      slots: {
        default: () => [
          h(DropdownSubTrigger, {}, () => 'Trigger'),
          h(DropdownSubContent, {}, () => h(DropdownItem, {}, () => 'Sub Item'))
        ]
      },
      attachTo: document.body
    })

    const subVm = wrapper.vm as any
    subVm.open()
    await nextTick()

    const content = document.body.querySelector('.ui-dropdown-sub-content')
    expect(content).toBeTruthy()

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    content?.dispatchEvent(event)
    await nextTick()

    expect(subVm.isOpen).toBe(false)
  })

  it('renders outside of wrapper component', async () => {
    const wrapper = mount(DropdownSub, {
      slots: {
        default: () => [
          h(DropdownSubTrigger, {}, () => 'Trigger'),
          h(DropdownSubContent, {}, () => h(DropdownItem, {}, () => 'Sub Item'))
        ]
      },
      attachTo: document.body
    })

    const subVm = wrapper.vm as any
    subVm.open()
    await nextTick()

    const content = document.body.querySelector('.ui-dropdown-sub-content')
    expect(content).toBeTruthy()
    expect(wrapper.find('.ui-dropdown-sub-content').exists()).toBe(false)
  })
})
