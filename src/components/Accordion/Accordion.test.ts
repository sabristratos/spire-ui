import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref, defineComponent } from 'vue'
import AccordionRoot from './AccordionRoot.vue'
import AccordionItem from './AccordionItem.vue'
import AccordionTrigger from './AccordionTrigger.vue'
import AccordionContent from './AccordionContent.vue'

function createAccordion(props: Record<string, unknown> = {}) {
  return mount(AccordionRoot, {
    props,
    slots: {
      default: () => [
        h(AccordionItem, { value: 'item-1' }, {
          default: () => [
            h(AccordionTrigger, null, { default: () => 'Item 1' }),
            h(AccordionContent, null, { default: () => 'Content 1' })
          ]
        }),
        h(AccordionItem, { value: 'item-2' }, {
          default: () => [
            h(AccordionTrigger, null, { default: () => 'Item 2' }),
            h(AccordionContent, null, { default: () => 'Content 2' })
          ]
        }),
        h(AccordionItem, { value: 'item-3', disabled: true }, {
          default: () => [
            h(AccordionTrigger, null, { default: () => 'Item 3' }),
            h(AccordionContent, null, { default: () => 'Content 3' })
          ]
        })
      ]
    }
  })
}

describe('Accordion', () => {
  describe('Rendering', () => {
    it('renders all accordion items', () => {
      const wrapper = createAccordion()
      expect(wrapper.findAll('.ui-accordion__item')).toHaveLength(3)
    })

    it('renders triggers with correct text', () => {
      const wrapper = createAccordion()
      const triggers = wrapper.findAll('.ui-accordion__trigger')
      expect(triggers[0].text()).toContain('Item 1')
      expect(triggers[1].text()).toContain('Item 2')
      expect(triggers[2].text()).toContain('Item 3')
    })

    it('renders chevron by default', () => {
      const wrapper = createAccordion()
      expect(wrapper.find('.ui-accordion__chevron').exists()).toBe(true)
    })
  })

  describe('Single mode (default)', () => {
    it('opens item when clicked', async () => {
      const wrapper = createAccordion()
      const trigger = wrapper.find('.ui-accordion__trigger')

      await trigger.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['item-1'])
    })

    it('closes open item when clicked again (collapsible)', async () => {
      const wrapper = createAccordion({
        modelValue: 'item-1',
        collapsible: true
      })

      const trigger = wrapper.find('.ui-accordion__trigger')
      await trigger.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    })

    it('does not close last item when not collapsible', async () => {
      const wrapper = createAccordion({
        modelValue: 'item-1',
        collapsible: false
      })

      const trigger = wrapper.find('.ui-accordion__trigger')
      await trigger.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('closes other items when opening a new one', async () => {
      const wrapper = createAccordion({
        modelValue: 'item-1'
      })

      const triggers = wrapper.findAll('.ui-accordion__trigger')
      await triggers[1].trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['item-2'])
    })
  })

  describe('Multiple mode', () => {
    it('can open multiple items', async () => {
      const wrapper = createAccordion({
        modelValue: ['item-1'],
        multiple: true
      })

      const triggers = wrapper.findAll('.ui-accordion__trigger')
      await triggers[1].trigger('click')

      const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as string[]
      expect(emitted).toContain('item-1')
      expect(emitted).toContain('item-2')
    })

    it('can close one item while others remain open', async () => {
      const wrapper = createAccordion({
        modelValue: ['item-1', 'item-2'],
        multiple: true
      })

      const triggers = wrapper.findAll('.ui-accordion__trigger')
      await triggers[0].trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['item-2']])
    })
  })

  describe('Disabled state', () => {
    it('applies disabled class to item', () => {
      const wrapper = createAccordion()
      const items = wrapper.findAll('.ui-accordion__item')
      expect(items[2].classes()).toContain('ui-accordion__item--disabled')
    })

    it('does not toggle when disabled item is clicked', async () => {
      const wrapper = createAccordion()
      const triggers = wrapper.findAll('.ui-accordion__trigger')

      await triggers[2].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Accessibility', () => {
    it('trigger has aria-expanded attribute', () => {
      const wrapper = createAccordion({
        modelValue: 'item-1'
      })

      const triggers = wrapper.findAll('.ui-accordion__trigger')
      expect(triggers[0].attributes('aria-expanded')).toBe('true')
      expect(triggers[1].attributes('aria-expanded')).toBe('false')
    })

    it('trigger has aria-controls pointing to content', () => {
      const wrapper = createAccordion()
      const trigger = wrapper.find('.ui-accordion__trigger')
      const content = wrapper.find('.ui-accordion__content')

      expect(trigger.attributes('aria-controls')).toBe(content.attributes('id'))
    })

    it('content has role="region"', () => {
      const wrapper = createAccordion()
      const content = wrapper.find('.ui-accordion__content')
      expect(content.attributes('role')).toBe('region')
    })

    it('content has aria-labelledby pointing to trigger', () => {
      const wrapper = createAccordion()
      const trigger = wrapper.find('.ui-accordion__trigger')
      const content = wrapper.find('.ui-accordion__content')

      expect(content.attributes('aria-labelledby')).toBe(trigger.attributes('id'))
    })

    it('trigger is a button element', () => {
      const wrapper = createAccordion()
      const trigger = wrapper.find('.ui-accordion__trigger')
      expect(trigger.element.tagName).toBe('BUTTON')
    })

    it('trigger has type="button"', () => {
      const wrapper = createAccordion()
      const trigger = wrapper.find('.ui-accordion__trigger')
      expect(trigger.attributes('type')).toBe('button')
    })
  })

  describe('Data attributes', () => {
    it('item has data-state attribute', () => {
      const wrapper = createAccordion({
        modelValue: 'item-1'
      })

      const items = wrapper.findAll('.ui-accordion__item')
      expect(items[0].attributes('data-state')).toBe('open')
      expect(items[1].attributes('data-state')).toBe('closed')
    })
  })

  describe('Chevron', () => {
    it('rotates chevron when open', () => {
      const wrapper = createAccordion({
        modelValue: 'item-1'
      })

      const chevrons = wrapper.findAll('.ui-accordion__chevron')
      expect(chevrons[0].classes()).toContain('ui-accordion__chevron--open')
      expect(chevrons[1].classes()).not.toContain('ui-accordion__chevron--open')
    })
  })
})
