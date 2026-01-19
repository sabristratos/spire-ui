import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Card from './Card.vue'
import CardHeader from './CardHeader.vue'
import CardContent from './CardContent.vue'
import CardFooter from './CardFooter.vue'
import CardImage from './CardImage.vue'

describe('Card', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(Card)
      expect(wrapper.find('.ui-card').exists()).toBe(true)
      expect(wrapper.find('.ui-card--elevated').exists()).toBe(true)
      expect(wrapper.find('.ui-card--padding-md').exists()).toBe(true)
    })

    it('renders slot content', () => {
      const wrapper = mount(Card, {
        slots: {
          default: '<p>Card content</p>'
        }
      })
      expect(wrapper.text()).toContain('Card content')
    })

    it('renders as different element via as prop', () => {
      const wrapper = mount(Card, {
        props: { as: 'article' }
      })
      expect(wrapper.element.tagName).toBe('ARTICLE')
    })

    it('renders as section element', () => {
      const wrapper = mount(Card, {
        props: { as: 'section' }
      })
      expect(wrapper.element.tagName).toBe('SECTION')
    })
  })

  describe('Variants', () => {
    it('applies elevated variant by default', () => {
      const wrapper = mount(Card)
      expect(wrapper.find('.ui-card--elevated').exists()).toBe(true)
    })

    it('applies outline variant', () => {
      const wrapper = mount(Card, {
        props: { variant: 'outline' }
      })
      expect(wrapper.find('.ui-card--outline').exists()).toBe(true)
    })

    it('applies ghost variant', () => {
      const wrapper = mount(Card, {
        props: { variant: 'ghost' }
      })
      expect(wrapper.find('.ui-card--ghost').exists()).toBe(true)
    })
  })

  describe('Padding', () => {
    it('applies medium padding by default', () => {
      const wrapper = mount(Card)
      expect(wrapper.find('.ui-card--padding-md').exists()).toBe(true)
    })

    it('applies small padding', () => {
      const wrapper = mount(Card, {
        props: { padding: 'sm' }
      })
      expect(wrapper.find('.ui-card--padding-sm').exists()).toBe(true)
    })

    it('applies large padding', () => {
      const wrapper = mount(Card, {
        props: { padding: 'lg' }
      })
      expect(wrapper.find('.ui-card--padding-lg').exists()).toBe(true)
    })

    it('applies no padding', () => {
      const wrapper = mount(Card, {
        props: { padding: 'none' }
      })
      expect(wrapper.find('.ui-card--padding-none').exists()).toBe(true)
    })
  })

  describe('Interactive', () => {
    it('applies interactive class when interactive', () => {
      const wrapper = mount(Card, {
        props: { interactive: true }
      })
      expect(wrapper.find('.ui-card--interactive').exists()).toBe(true)
    })

    it('emits click event when interactive and clicked', async () => {
      const wrapper = mount(Card, {
        props: { interactive: true }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('does not emit click when not interactive', async () => {
      const wrapper = mount(Card)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(Card, {
        props: { interactive: true, disabled: true }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount(Card, {
        props: { interactive: true, loading: true }
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('sets tabindex when interactive', () => {
      const wrapper = mount(Card, {
        props: { interactive: true }
      })
      expect(wrapper.attributes('tabindex')).toBe('0')
    })

    it('sets role button when interactive', () => {
      const wrapper = mount(Card, {
        props: { interactive: true }
      })
      expect(wrapper.attributes('role')).toBe('button')
    })

    it('handles Enter key when interactive', async () => {
      const wrapper = mount(Card, {
        props: { interactive: true }
      })
      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('handles Space key when interactive', async () => {
      const wrapper = mount(Card, {
        props: { interactive: true }
      })
      await wrapper.trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Horizontal Layout', () => {
    it('applies horizontal class', () => {
      const wrapper = mount(Card, {
        props: { horizontal: true }
      })
      expect(wrapper.find('.ui-card--horizontal').exists()).toBe(true)
    })
  })

  describe('States', () => {
    it('applies disabled class', () => {
      const wrapper = mount(Card, {
        props: { disabled: true }
      })
      expect(wrapper.find('.ui-card--disabled').exists()).toBe(true)
    })

    it('sets aria-disabled when disabled', () => {
      const wrapper = mount(Card, {
        props: { disabled: true }
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('applies loading class', () => {
      const wrapper = mount(Card, {
        props: { loading: true }
      })
      expect(wrapper.find('.ui-card--loading').exists()).toBe(true)
    })

    it('shows skeleton overlay when loading', () => {
      const wrapper = mount(Card, {
        props: { loading: true }
      })
      expect(wrapper.find('.ui-card__skeleton').exists()).toBe(true)
    })

    it('sets aria-busy when loading', () => {
      const wrapper = mount(Card, {
        props: { loading: true }
      })
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })
})

describe('CardHeader', () => {
  describe('Rendering', () => {
    it('renders header element', () => {
      const wrapper = mount(CardHeader)
      expect(wrapper.find('.ui-card__header').exists()).toBe(true)
    })

    it('renders title from prop', () => {
      const wrapper = mount(CardHeader, {
        props: { title: 'Test Title' }
      })
      expect(wrapper.find('.ui-card__title').text()).toBe('Test Title')
    })

    it('renders subtitle from prop', () => {
      const wrapper = mount(CardHeader, {
        props: { subtitle: 'Test Subtitle' }
      })
      expect(wrapper.find('.ui-card__subtitle').text()).toBe('Test Subtitle')
    })

    it('renders title slot', () => {
      const wrapper = mount(CardHeader, {
        slots: {
          title: '<span class="custom-title">Custom Title</span>'
        }
      })
      expect(wrapper.find('.custom-title').exists()).toBe(true)
    })

    it('renders subtitle slot', () => {
      const wrapper = mount(CardHeader, {
        slots: {
          subtitle: '<span class="custom-subtitle">Custom Subtitle</span>'
        }
      })
      expect(wrapper.find('.custom-subtitle').exists()).toBe(true)
    })

    it('renders actions slot', () => {
      const wrapper = mount(CardHeader, {
        slots: {
          actions: '<button class="action-btn">Action</button>'
        }
      })
      expect(wrapper.find('.action-btn').exists()).toBe(true)
      expect(wrapper.find('.ui-card__header-actions').exists()).toBe(true)
    })
  })

  describe('Alignment', () => {
    it('applies start alignment by default', () => {
      const wrapper = mount(CardHeader)
      expect(wrapper.find('.ui-card__header--start').exists()).toBe(true)
    })

    it('applies center alignment', () => {
      const wrapper = mount(CardHeader, {
        props: { align: 'center' }
      })
      expect(wrapper.find('.ui-card__header--center').exists()).toBe(true)
    })
  })
})

describe('CardContent', () => {
  describe('Rendering', () => {
    it('renders content element', () => {
      const wrapper = mount(CardContent)
      expect(wrapper.find('.ui-card__content').exists()).toBe(true)
    })

    it('renders slot content', () => {
      const wrapper = mount(CardContent, {
        slots: {
          default: '<p>Content here</p>'
        }
      })
      expect(wrapper.text()).toContain('Content here')
    })
  })

  describe('Flush mode', () => {
    it('applies flush class when flush prop is true', () => {
      const wrapper = mount(CardContent, {
        props: { flush: true }
      })
      expect(wrapper.find('.ui-card__content--flush').exists()).toBe(true)
    })

    it('does not apply flush class by default', () => {
      const wrapper = mount(CardContent)
      expect(wrapper.find('.ui-card__content--flush').exists()).toBe(false)
    })
  })

  describe('Context-aware spacing', () => {
    it('removes top padding when header exists in card context', async () => {
      const wrapper = mount({
        components: { Card, CardHeader, CardContent },
        template: `
          <Card>
            <CardHeader title="Title" />
            <CardContent>Content</CardContent>
          </Card>
        `
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.ui-card__content--no-top-padding').exists()).toBe(true)
    })
  })
})

describe('CardFooter', () => {
  describe('Rendering', () => {
    it('renders footer element', () => {
      const wrapper = mount(CardFooter)
      expect(wrapper.find('.ui-card__footer').exists()).toBe(true)
    })

    it('renders slot content', () => {
      const wrapper = mount(CardFooter, {
        slots: {
          default: '<button>Submit</button>'
        }
      })
      expect(wrapper.text()).toContain('Submit')
    })
  })

  describe('Alignment', () => {
    it('applies end alignment by default', () => {
      const wrapper = mount(CardFooter)
      expect(wrapper.find('.ui-card__footer--end').exists()).toBe(true)
    })

    it('applies start alignment', () => {
      const wrapper = mount(CardFooter, {
        props: { align: 'start' }
      })
      expect(wrapper.find('.ui-card__footer--start').exists()).toBe(true)
    })

    it('applies center alignment', () => {
      const wrapper = mount(CardFooter, {
        props: { align: 'center' }
      })
      expect(wrapper.find('.ui-card__footer--center').exists()).toBe(true)
    })

    it('applies between alignment', () => {
      const wrapper = mount(CardFooter, {
        props: { align: 'between' }
      })
      expect(wrapper.find('.ui-card__footer--between').exists()).toBe(true)
    })
  })

  describe('Borderless', () => {
    it('does not apply borderless class by default', () => {
      const wrapper = mount(CardFooter)
      expect(wrapper.find('.ui-card__footer--borderless').exists()).toBe(false)
    })

    it('applies borderless class when prop is true', () => {
      const wrapper = mount(CardFooter, {
        props: { borderless: true }
      })
      expect(wrapper.find('.ui-card__footer--borderless').exists()).toBe(true)
    })
  })
})

describe('CardImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image'
  }

  describe('Rendering', () => {
    it('renders image element', () => {
      const wrapper = mount(CardImage, {
        props: defaultProps
      })
      expect(wrapper.find('.ui-card__image').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(true)
    })

    it('sets src attribute', () => {
      const wrapper = mount(CardImage, {
        props: defaultProps
      })
      expect(wrapper.find('img').attributes('src')).toBe('/test-image.jpg')
    })

    it('sets alt attribute', () => {
      const wrapper = mount(CardImage, {
        props: defaultProps
      })
      expect(wrapper.find('img').attributes('alt')).toBe('Test image')
    })

    it('sets loading attribute to lazy by default', () => {
      const wrapper = mount(CardImage, {
        props: defaultProps
      })
      expect(wrapper.find('img').attributes('loading')).toBe('lazy')
    })

    it('sets loading attribute to eager when specified', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, loading: 'eager' }
      })
      expect(wrapper.find('img').attributes('loading')).toBe('eager')
    })
  })

  describe('Position', () => {
    it('applies top position by default', () => {
      const wrapper = mount(CardImage, {
        props: defaultProps
      })
      expect(wrapper.find('.ui-card__image--top').exists()).toBe(true)
    })

    it('applies bottom position', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, position: 'bottom' }
      })
      expect(wrapper.find('.ui-card__image--bottom').exists()).toBe(true)
    })

    it('applies left position', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, position: 'left' }
      })
      expect(wrapper.find('.ui-card__image--left').exists()).toBe(true)
    })

    it('applies right position', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, position: 'right' }
      })
      expect(wrapper.find('.ui-card__image--right').exists()).toBe(true)
    })

    it('applies background position', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, position: 'background' }
      })
      expect(wrapper.find('.ui-card__image--background').exists()).toBe(true)
    })
  })

  describe('Aspect Ratio', () => {
    it('does not set aspect ratio style when auto', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, aspectRatio: 'auto' }
      })
      expect(wrapper.find('.ui-card__image').attributes('style')).toBeUndefined()
    })

    it('sets 16:9 aspect ratio', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, aspectRatio: '16:9' }
      })
      expect(wrapper.find('.ui-card__image').attributes('style')).toContain('--aspect-ratio: 16 / 9')
    })

    it('sets 4:3 aspect ratio', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, aspectRatio: '4:3' }
      })
      expect(wrapper.find('.ui-card__image').attributes('style')).toContain('--aspect-ratio: 4 / 3')
    })

    it('sets 1:1 aspect ratio', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, aspectRatio: '1:1' }
      })
      expect(wrapper.find('.ui-card__image').attributes('style')).toContain('--aspect-ratio: 1 / 1')
    })
  })

  describe('Object Fit', () => {
    it('applies cover fit by default', () => {
      const wrapper = mount(CardImage, {
        props: defaultProps
      })
      expect(wrapper.find('.ui-card__image-img--cover').exists()).toBe(true)
    })

    it('applies contain fit', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, fit: 'contain' }
      })
      expect(wrapper.find('.ui-card__image-img--contain').exists()).toBe(true)
    })

    it('applies fill fit', () => {
      const wrapper = mount(CardImage, {
        props: { ...defaultProps, fit: 'fill' }
      })
      expect(wrapper.find('.ui-card__image-img--fill').exists()).toBe(true)
    })
  })
})

describe('Card Composition', () => {
  it('renders complete card with all sub-components', () => {
    const wrapper = mount({
      components: { Card, CardHeader, CardContent, CardFooter },
      template: `
        <Card>
          <CardHeader title="Title" subtitle="Subtitle" />
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      `
    })

    expect(wrapper.find('.ui-card').exists()).toBe(true)
    expect(wrapper.find('.ui-card__header').exists()).toBe(true)
    expect(wrapper.find('.ui-card__content').exists()).toBe(true)
    expect(wrapper.find('.ui-card__footer').exists()).toBe(true)
  })

  it('renders card with image', () => {
    const wrapper = mount({
      components: { Card, CardImage, CardContent },
      template: `
        <Card>
          <CardImage src="/test.jpg" alt="Test" />
          <CardContent>Content</CardContent>
        </Card>
      `
    })

    expect(wrapper.find('.ui-card__image').exists()).toBe(true)
    expect(wrapper.find('.ui-card__content').exists()).toBe(true)
  })

  it('renders horizontal card', () => {
    const wrapper = mount({
      components: { Card, CardImage, CardContent },
      template: `
        <Card horizontal>
          <CardImage src="/test.jpg" alt="Test" position="left" />
          <CardContent>Content</CardContent>
        </Card>
      `
    })

    expect(wrapper.find('.ui-card--horizontal').exists()).toBe(true)
    expect(wrapper.find('.ui-card__image--left').exists()).toBe(true)
  })
})
