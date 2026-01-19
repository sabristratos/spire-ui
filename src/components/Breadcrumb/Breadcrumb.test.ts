import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import BreadcrumbRoot from './BreadcrumbRoot.vue'
import BreadcrumbList from './BreadcrumbList.vue'
import BreadcrumbItem from './BreadcrumbItem.vue'
import BreadcrumbLink from './BreadcrumbLink.vue'
import BreadcrumbPage from './BreadcrumbPage.vue'
import BreadcrumbSeparator from './BreadcrumbSeparator.vue'
import BreadcrumbEllipsis from './BreadcrumbEllipsis.vue'

describe('BreadcrumbRoot', () => {
  it('renders as nav element', () => {
    const wrapper = mount(BreadcrumbRoot, {
      slots: {
        default: 'Content'
      }
    })
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('has aria-label for accessibility', () => {
    const wrapper = mount(BreadcrumbRoot)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
  })

  it('applies breadcrumb class', () => {
    const wrapper = mount(BreadcrumbRoot)
    expect(wrapper.find('nav').classes()).toContain('ui-breadcrumb')
  })

  it('renders slot content', () => {
    const wrapper = mount(BreadcrumbRoot, {
      slots: {
        default: '<span data-testid="content">Test</span>'
      }
    })
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)
  })
})

describe('BreadcrumbList', () => {
  it('renders as ordered list', () => {
    const wrapper = mount(BreadcrumbList)
    expect(wrapper.find('ol').exists()).toBe(true)
  })

  it('applies list class', () => {
    const wrapper = mount(BreadcrumbList)
    expect(wrapper.find('ol').classes()).toContain('ui-breadcrumb__list')
  })

  it('renders slot content', () => {
    const wrapper = mount(BreadcrumbList, {
      slots: {
        default: '<li data-testid="item">Item</li>'
      }
    })
    expect(wrapper.find('[data-testid="item"]').exists()).toBe(true)
  })
})

describe('BreadcrumbItem', () => {
  it('renders as list item', () => {
    const wrapper = mount(BreadcrumbItem)
    expect(wrapper.find('li').exists()).toBe(true)
  })

  it('applies item class', () => {
    const wrapper = mount(BreadcrumbItem)
    expect(wrapper.find('li').classes()).toContain('ui-breadcrumb__item')
  })

  it('renders slot content', () => {
    const wrapper = mount(BreadcrumbItem, {
      slots: {
        default: '<a data-testid="link" href="/">Link</a>'
      }
    })
    expect(wrapper.find('[data-testid="link"]').exists()).toBe(true)
  })
})

describe('BreadcrumbLink', () => {
  it('renders as anchor by default', () => {
    const wrapper = mount(BreadcrumbLink, {
      props: { href: '/' },
      slots: { default: 'Home' }
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('applies href attribute', () => {
    const wrapper = mount(BreadcrumbLink, {
      props: { href: '/products' },
      slots: { default: 'Products' }
    })
    expect(wrapper.find('a').attributes('href')).toBe('/products')
  })

  it('renders as router-link when to prop is provided', () => {
    const wrapper = mount(BreadcrumbLink, {
      props: { to: '/settings' },
      slots: { default: 'Settings' },
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>'
          }
        }
      }
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('applies link class', () => {
    const wrapper = mount(BreadcrumbLink, {
      props: { href: '/' },
      slots: { default: 'Home' }
    })
    expect(wrapper.find('a').classes()).toContain('ui-breadcrumb__link')
  })

  it('renders slot content', () => {
    const wrapper = mount(BreadcrumbLink, {
      props: { href: '/' },
      slots: { default: '<span data-testid="text">Home</span>' }
    })
    expect(wrapper.find('[data-testid="text"]').exists()).toBe(true)
  })

  it('renders custom component via as prop', () => {
    const CustomLink = {
      template: '<span class="custom-link"><slot /></span>'
    }
    const wrapper = mount(BreadcrumbLink, {
      props: { as: CustomLink },
      slots: { default: 'Custom' }
    })
    expect(wrapper.find('.custom-link').exists()).toBe(true)
  })
})

describe('BreadcrumbPage', () => {
  it('renders as span', () => {
    const wrapper = mount(BreadcrumbPage, {
      slots: { default: 'Current Page' }
    })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('has aria-current page attribute', () => {
    const wrapper = mount(BreadcrumbPage, {
      slots: { default: 'Current Page' }
    })
    expect(wrapper.find('span').attributes('aria-current')).toBe('page')
  })

  it('has aria-disabled attribute', () => {
    const wrapper = mount(BreadcrumbPage, {
      slots: { default: 'Current Page' }
    })
    expect(wrapper.find('span').attributes('aria-disabled')).toBe('true')
  })

  it('has role link', () => {
    const wrapper = mount(BreadcrumbPage, {
      slots: { default: 'Current Page' }
    })
    expect(wrapper.find('span').attributes('role')).toBe('link')
  })

  it('applies page class', () => {
    const wrapper = mount(BreadcrumbPage, {
      slots: { default: 'Current Page' }
    })
    expect(wrapper.find('span').classes()).toContain('ui-breadcrumb__page')
  })
})

describe('BreadcrumbSeparator', () => {
  it('renders as list item', () => {
    const wrapper = mount(BreadcrumbSeparator)
    expect(wrapper.find('li').exists()).toBe(true)
  })

  it('has aria-hidden for accessibility', () => {
    const wrapper = mount(BreadcrumbSeparator)
    expect(wrapper.find('li').attributes('aria-hidden')).toBe('true')
  })

  it('has presentation role', () => {
    const wrapper = mount(BreadcrumbSeparator)
    expect(wrapper.find('li').attributes('role')).toBe('presentation')
  })

  it('applies separator class', () => {
    const wrapper = mount(BreadcrumbSeparator)
    expect(wrapper.find('li').classes()).toContain('ui-breadcrumb__separator')
  })

  it('renders default separator from root', () => {
    const wrapper = mount(BreadcrumbRoot, {
      props: { separator: '>' },
      slots: {
        default: () => h(BreadcrumbSeparator)
      }
    })
    expect(wrapper.text()).toContain('>')
  })

  it('renders custom slot content', () => {
    const wrapper = mount(BreadcrumbSeparator, {
      slots: {
        default: '<span data-testid="custom">/</span>'
      }
    })
    expect(wrapper.find('[data-testid="custom"]').exists()).toBe(true)
  })
})

describe('BreadcrumbEllipsis', () => {
  it('renders as list item', () => {
    const wrapper = mount(BreadcrumbEllipsis)
    expect(wrapper.find('li').exists()).toBe(true)
  })

  it('renders static ellipsis without items', () => {
    const wrapper = mount(BreadcrumbEllipsis)
    expect(wrapper.find('.ui-breadcrumb__ellipsis-static').exists()).toBe(true)
  })

  it('renders dropdown trigger with items', () => {
    const wrapper = mount(BreadcrumbEllipsis, {
      props: {
        items: [
          { label: 'Products', href: '/products' },
          { label: 'Category', href: '/products/category' }
        ]
      }
    })
    expect(wrapper.find('.ui-breadcrumb__ellipsis').exists()).toBe(true)
  })

  it('has aria-label on ellipsis button', () => {
    const wrapper = mount(BreadcrumbEllipsis, {
      props: {
        items: [{ label: 'Products', href: '/products' }]
      }
    })
    expect(wrapper.find('.ui-breadcrumb__ellipsis').attributes('aria-label')).toBe('Show more breadcrumbs')
  })
})

describe('Breadcrumb composition', () => {
  it('renders full breadcrumb structure', () => {
    const wrapper = mount(BreadcrumbRoot, {
      slots: {
        default: () => h(BreadcrumbList, {}, () => [
          h(BreadcrumbItem, {}, () => h(BreadcrumbLink, { href: '/' }, () => 'Home')),
          h(BreadcrumbSeparator),
          h(BreadcrumbItem, {}, () => h(BreadcrumbLink, { href: '/products' }, () => 'Products')),
          h(BreadcrumbSeparator),
          h(BreadcrumbItem, {}, () => h(BreadcrumbPage, {}, () => 'Widget'))
        ])
      }
    })

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('ol').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBe(5)
    expect(wrapper.findAll('.ui-breadcrumb__link').length).toBe(2)
    expect(wrapper.find('.ui-breadcrumb__page').exists()).toBe(true)
    expect(wrapper.findAll('.ui-breadcrumb__separator').length).toBe(2)
  })

  it('renders with custom separator', () => {
    const ChevronIcon = {
      template: '<svg data-testid="chevron">→</svg>'
    }

    const wrapper = mount(BreadcrumbRoot, {
      props: { separator: ChevronIcon },
      slots: {
        default: () => h(BreadcrumbList, {}, () => [
          h(BreadcrumbItem, {}, () => h(BreadcrumbLink, { href: '/' }, () => 'Home')),
          h(BreadcrumbSeparator),
          h(BreadcrumbItem, {}, () => h(BreadcrumbPage, {}, () => 'Current'))
        ])
      }
    })

    expect(wrapper.find('[data-testid="chevron"]').exists()).toBe(true)
  })

  it('renders with ellipsis for collapsed items', () => {
    const wrapper = mount(BreadcrumbRoot, {
      slots: {
        default: () => h(BreadcrumbList, {}, () => [
          h(BreadcrumbItem, {}, () => h(BreadcrumbLink, { href: '/' }, () => 'Home')),
          h(BreadcrumbSeparator),
          h(BreadcrumbEllipsis, {
            items: [
              { label: 'Products', href: '/products' },
              { label: 'Category', href: '/products/category' }
            ]
          }),
          h(BreadcrumbSeparator),
          h(BreadcrumbItem, {}, () => h(BreadcrumbPage, {}, () => 'Widget'))
        ])
      }
    })

    expect(wrapper.find('.ui-breadcrumb__ellipsis').exists()).toBe(true)
    expect(wrapper.find('.ui-breadcrumb__page').text()).toBe('Widget')
  })
})

describe('Breadcrumb accessibility', () => {
  it('has proper landmark role', () => {
    const wrapper = mount(BreadcrumbRoot)
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
  })

  it('uses ordered list for semantic structure', () => {
    const wrapper = mount(BreadcrumbList)
    expect(wrapper.find('ol').exists()).toBe(true)
  })

  it('current page has aria-current', () => {
    const wrapper = mount(BreadcrumbPage, {
      slots: { default: 'Current' }
    })
    expect(wrapper.find('[aria-current="page"]').exists()).toBe(true)
  })

  it('separators are hidden from screen readers', () => {
    const wrapper = mount(BreadcrumbSeparator)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })
})
