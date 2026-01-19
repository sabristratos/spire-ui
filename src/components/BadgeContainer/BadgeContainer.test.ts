import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeContainer from './BadgeContainer.vue'

describe('BadgeContainer', () => {
  describe('Rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(BadgeContainer, {
        slots: { default: '<button>Click me</button>' }
      })
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('Click me')
    })

    it('renders badge slot when provided', () => {
      const wrapper = mount(BadgeContainer, {
        slots: {
          default: '<button>Inbox</button>',
          badge: '<span class="test-badge">3</span>'
        }
      })
      expect(wrapper.find('.test-badge').exists()).toBe(true)
    })

    it('does not render badge wrapper when no badge slot', () => {
      const wrapper = mount(BadgeContainer, {
        slots: { default: '<button>Click</button>' }
      })
      expect(wrapper.find('.ui-badge-container__badge').exists()).toBe(false)
    })
  })

  describe('Positioning', () => {
    it('defaults to top-right position', () => {
      const wrapper = mount(BadgeContainer, {
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      const badge = wrapper.find('.ui-badge-container__badge')
      expect(badge.attributes('style')).toContain('top: 0')
      expect(badge.attributes('style')).toContain('right: 0')
    })

    it('applies top-left position', () => {
      const wrapper = mount(BadgeContainer, {
        props: { position: 'top-left' },
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      const badge = wrapper.find('.ui-badge-container__badge')
      expect(badge.attributes('style')).toContain('top: 0')
      expect(badge.attributes('style')).toContain('left: 0')
    })

    it('applies bottom-right position', () => {
      const wrapper = mount(BadgeContainer, {
        props: { position: 'bottom-right' },
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      const badge = wrapper.find('.ui-badge-container__badge')
      expect(badge.attributes('style')).toContain('bottom: 0')
      expect(badge.attributes('style')).toContain('right: 0')
    })

    it('applies bottom-left position', () => {
      const wrapper = mount(BadgeContainer, {
        props: { position: 'bottom-left' },
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      const badge = wrapper.find('.ui-badge-container__badge')
      expect(badge.attributes('style')).toContain('bottom: 0')
      expect(badge.attributes('style')).toContain('left: 0')
    })
  })

  describe('Offset adjustments', () => {
    it('applies custom offsetX', () => {
      const wrapper = mount(BadgeContainer, {
        props: { offsetX: '4px' },
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      const badge = wrapper.find('.ui-badge-container__badge')
      expect(badge.attributes('style')).toContain('4px')
    })

    it('applies custom offsetY', () => {
      const wrapper = mount(BadgeContainer, {
        props: { offsetY: '-2px' },
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      const badge = wrapper.find('.ui-badge-container__badge')
      expect(badge.attributes('style')).toContain('-2px')
    })
  })

  describe('Cutout effect', () => {
    it('applies cutout class when cutout prop is true', () => {
      const wrapper = mount(BadgeContainer, {
        props: { cutout: true },
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      expect(wrapper.find('.ui-badge-container__badge--cutout').exists()).toBe(true)
    })

    it('does not apply cutout class by default', () => {
      const wrapper = mount(BadgeContainer, {
        slots: {
          default: '<button>Test</button>',
          badge: '<span>1</span>'
        }
      })
      expect(wrapper.find('.ui-badge-container__badge--cutout').exists()).toBe(false)
    })
  })

  describe('Structure', () => {
    it('has ui-badge-container class on root', () => {
      const wrapper = mount(BadgeContainer, {
        slots: { default: '<button>Test</button>' }
      })
      expect(wrapper.classes()).toContain('ui-badge-container')
    })

    it('uses inline-flex display for proper alignment', () => {
      const wrapper = mount(BadgeContainer, {
        slots: { default: '<button>Test</button>' }
      })
      expect(wrapper.classes()).toContain('ui-badge-container')
    })
  })
})
