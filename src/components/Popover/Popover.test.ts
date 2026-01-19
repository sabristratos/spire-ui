import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, h, defineComponent } from 'vue'
import Popover from './Popover.vue'

const TriggerButton = defineComponent({
  template: '<button type="button">Open Popover</button>'
})

describe('Popover', () => {
  let wrapper: VueWrapper

  afterEach(() => {
    wrapper?.unmount()
    document.body.innerHTML = ''
  })

  it('renders trigger slot', () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Popover content')
      }
    })

    expect(wrapper.find('.ui-popover__trigger').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Open Popover')
  })

  it('opens popover on trigger click', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', { class: 'content' }, 'Popover content')
      },
      attachTo: document.body
    })

    expect(document.body.querySelector('.ui-popover__content')).toBeFalsy()

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const content = document.body.querySelector('.ui-popover__content')
    expect(content).toBeTruthy()
    expect(content?.getAttribute('role')).toBe('dialog')
  })

  it('closes popover on second trigger click', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Popover content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.ui-popover__content')).toBeTruthy()

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.ui-popover__content')).toBeFalsy()
  })

  it('does not close on content click', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', { class: 'inner' }, 'Click me')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const content = document.body.querySelector('.ui-popover__content')
    expect(content).toBeTruthy()

    const inner = content?.querySelector('.inner') as HTMLElement
    inner?.click()
    await nextTick()

    expect(document.body.querySelector('.ui-popover__content')).toBeTruthy()
  })

  it('closes on Escape key', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const content = document.body.querySelector('.ui-popover__content')
    expect(content).toBeTruthy()

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    content?.dispatchEvent(event)
    await nextTick()

    expect(document.body.querySelector('.ui-popover__content')).toBeFalsy()
  })

  it('does not close on Escape when closeOnEscape is false', async () => {
    wrapper = mount(Popover, {
      props: { closeOnEscape: false },
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const content = document.body.querySelector('.ui-popover__content')
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    content?.dispatchEvent(event)
    await nextTick()

    expect(document.body.querySelector('.ui-popover__content')).toBeTruthy()
  })

  it('has aria-haspopup="dialog" on trigger', () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      }
    })

    expect(wrapper.find('.ui-popover__trigger').attributes('aria-haspopup')).toBe('dialog')
  })

  it('has role="dialog" on content', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const content = document.body.querySelector('.ui-popover__content')
    expect(content?.getAttribute('role')).toBe('dialog')
  })

  it('renders arrow when arrow prop is true', async () => {
    wrapper = mount(Popover, {
      props: { arrow: true },
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ui-popover__arrow')).toBeTruthy()
  })

  it('does not render arrow by default', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ui-popover__arrow')).toBeFalsy()
  })

  it('does not open when disabled', async () => {
    wrapper = mount(Popover, {
      props: { disabled: true },
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ui-popover__content')).toBeFalsy()
  })

  it('emits open and close events', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()
    expect(wrapper.emitted('open')).toHaveLength(1)

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('applies custom width when provided', async () => {
    wrapper = mount(Popover, {
      props: { width: 300 },
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const content = document.body.querySelector('.ui-popover__content') as HTMLElement
    expect(content?.style.width).toBe('300px')
  })

  it('exposes open, close, toggle methods via ref', async () => {
    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: () => h('div', 'Content')
      },
      attachTo: document.body
    })

    const vm = wrapper.vm as any

    expect(typeof vm.open).toBe('function')
    expect(typeof vm.close).toBe('function')
    expect(typeof vm.toggle).toBe('function')

    vm.open()
    await nextTick()
    expect(document.body.querySelector('.ui-popover__content')).toBeTruthy()

    vm.close()
    await nextTick()
    expect(document.body.querySelector('.ui-popover__content')).toBeFalsy()
  })

  it('provides close function to default slot', async () => {
    const closeFn = vi.fn()

    wrapper = mount(Popover, {
      slots: {
        trigger: () => h(TriggerButton),
        default: (props: { close: () => void }) => h('button', { onClick: props.close }, 'Close')
      },
      attachTo: document.body
    })

    await wrapper.find('.ui-popover__trigger').trigger('click')
    await nextTick()

    const closeBtn = document.body.querySelector('.ui-popover__content button') as HTMLElement
    closeBtn?.click()
    await nextTick()

    expect(document.body.querySelector('.ui-popover__content')).toBeFalsy()
  })
})
