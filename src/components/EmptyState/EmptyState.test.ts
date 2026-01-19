import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state').exists()).toBe(true)
      expect(wrapper.find('.ui-empty-state--default').exists()).toBe(true)
    })

    it('renders title when provided', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'No data available' }
      })
      expect(wrapper.find('.ui-empty-state__title').exists()).toBe(true)
      expect(wrapper.find('.ui-empty-state__title').text()).toBe('No data available')
    })

    it('does not render title when not provided', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state__title').exists()).toBe(false)
    })

    it('renders description when provided', () => {
      const wrapper = mount(EmptyState, {
        props: { description: 'Try adjusting your filters' }
      })
      expect(wrapper.find('.ui-empty-state__description').exists()).toBe(true)
      expect(wrapper.find('.ui-empty-state__description').text()).toBe('Try adjusting your filters')
    })

    it('does not render description when not provided', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state__description').exists()).toBe(false)
    })

    it('renders default icon when no custom icon provided', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state__icon').exists()).toBe(true)
      expect(wrapper.find('.ui-empty-state__icon--default').exists()).toBe(true)
    })
  })

  describe('Variants', () => {
    it('applies default variant class', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state--default').exists()).toBe(true)
    })

    it('applies search variant class', () => {
      const wrapper = mount(EmptyState, {
        props: { variant: 'search' }
      })
      expect(wrapper.find('.ui-empty-state--search').exists()).toBe(true)
    })

    it('applies error variant class', () => {
      const wrapper = mount(EmptyState, {
        props: { variant: 'error' }
      })
      expect(wrapper.find('.ui-empty-state--error').exists()).toBe(true)
    })

    it('renders icon from registry for search variant', () => {
      const wrapper = mount(EmptyState, {
        props: { variant: 'search' }
      })
      const icon = wrapper.find('.ui-empty-state__icon--default .ui-empty-state__icon-svg')
      expect(icon.exists()).toBe(true)
    })

    it('renders icon from registry for error variant', () => {
      const wrapper = mount(EmptyState, {
        props: { variant: 'error' }
      })
      const icon = wrapper.find('.ui-empty-state__icon--default .ui-empty-state__icon-svg')
      expect(icon.exists()).toBe(true)
    })

    it('renders icon from registry for default variant', () => {
      const wrapper = mount(EmptyState, {
        props: { variant: 'default' }
      })
      const icon = wrapper.find('.ui-empty-state__icon--default .ui-empty-state__icon-svg')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('Compact Mode', () => {
    it('applies compact class when compact is true', () => {
      const wrapper = mount(EmptyState, {
        props: { compact: true }
      })
      expect(wrapper.find('.ui-empty-state--compact').exists()).toBe(true)
    })

    it('does not apply compact class by default', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state--compact').exists()).toBe(false)
    })
  })

  describe('Action Slot', () => {
    it('renders action slot when provided', () => {
      const wrapper = mount(EmptyState, {
        slots: {
          default: '<button class="test-action">Click me</button>'
        }
      })
      expect(wrapper.find('.ui-empty-state__action').exists()).toBe(true)
      expect(wrapper.find('.test-action').exists()).toBe(true)
    })

    it('does not render action container when no slot provided', () => {
      const wrapper = mount(EmptyState)
      expect(wrapper.find('.ui-empty-state__action').exists()).toBe(false)
    })

    it('renders multiple actions', () => {
      const wrapper = mount(EmptyState, {
        slots: {
          default: '<button>Action 1</button><button>Action 2</button>'
        }
      })
      expect(wrapper.findAll('.ui-empty-state__action button').length).toBe(2)
    })
  })

  describe('Full Example', () => {
    it('renders all elements together', () => {
      const wrapper = mount(EmptyState, {
        props: {
          title: 'No results found',
          description: 'Try adjusting your search',
          variant: 'search'
        },
        slots: {
          default: '<button>Clear filters</button>'
        }
      })

      expect(wrapper.find('.ui-empty-state--search').exists()).toBe(true)
      expect(wrapper.find('.ui-empty-state__icon').exists()).toBe(true)
      expect(wrapper.find('.ui-empty-state__title').text()).toBe('No results found')
      expect(wrapper.find('.ui-empty-state__description').text()).toBe('Try adjusting your search')
      expect(wrapper.find('.ui-empty-state__action button').exists()).toBe(true)
    })
  })

  describe('Structure', () => {
    it('has correct content wrapper', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'Test' }
      })
      expect(wrapper.find('.ui-empty-state__content').exists()).toBe(true)
    })

    it('maintains correct element order: icon, title, description, action', () => {
      const wrapper = mount(EmptyState, {
        props: {
          title: 'Title',
          description: 'Description'
        },
        slots: {
          default: '<button>Action</button>'
        }
      })

      const content = wrapper.find('.ui-empty-state__content')
      const children = content.element.children

      expect(children[0].classList.contains('ui-empty-state__icon')).toBe(true)
      expect(children[1].classList.contains('ui-empty-state__title')).toBe(true)
      expect(children[2].classList.contains('ui-empty-state__description')).toBe(true)
      expect(children[3].classList.contains('ui-empty-state__action')).toBe(true)
    })
  })
})
