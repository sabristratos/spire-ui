import { describe, it, expect, beforeEach } from 'vitest'
import { h, type FunctionalComponent } from 'vue'
import {
  configureIcons,
  resetIcons,
  useInternalIcon,
  getIconRegistry
} from './icons'

const MockIcon: FunctionalComponent = () => h('svg', { class: 'mock-icon' })

describe('Icon Registry', () => {
  beforeEach(() => {
    resetIcons()
  })

  describe('useInternalIcon', () => {
    it('returns default icon for sortAsc', () => {
      const icon = useInternalIcon('sortAsc')
      expect(icon).toBeDefined()
      expect(typeof icon).toBe('function')
    })

    it('returns default icon for all semantic keys', () => {
      const keys = [
        'sortAsc', 'sortDesc', 'sortNeutral',
        'expand', 'collapse', 'close', 'search', 'check',
        'info', 'success', 'warning', 'error',
        'emptyData', 'emptySearch'
      ] as const

      keys.forEach(key => {
        const icon = useInternalIcon(key)
        expect(icon).toBeDefined()
      })
    })
  })

  describe('configureIcons', () => {
    it('overrides a single icon', () => {
      configureIcons({ sortAsc: MockIcon })
      const icon = useInternalIcon('sortAsc')
      expect(icon).toBe(MockIcon)
    })

    it('overrides multiple icons', () => {
      configureIcons({
        sortAsc: MockIcon,
        sortDesc: MockIcon,
        close: MockIcon
      })

      expect(useInternalIcon('sortAsc')).toBe(MockIcon)
      expect(useInternalIcon('sortDesc')).toBe(MockIcon)
      expect(useInternalIcon('close')).toBe(MockIcon)
    })

    it('preserves non-overridden icons', () => {
      const originalExpand = useInternalIcon('expand')
      configureIcons({ sortAsc: MockIcon })
      expect(useInternalIcon('expand')).toBe(originalExpand)
    })

    it('allows partial updates', () => {
      configureIcons({ sortAsc: MockIcon })
      const originalSortDesc = useInternalIcon('sortDesc')

      const AnotherMockIcon: FunctionalComponent = () => h('svg', { class: 'another-mock' })
      configureIcons({ sortDesc: AnotherMockIcon })

      expect(useInternalIcon('sortAsc')).toBe(MockIcon)
      expect(useInternalIcon('sortDesc')).toBe(AnotherMockIcon)
    })
  })

  describe('resetIcons', () => {
    it('resets all icons to defaults', () => {
      const originalSortAsc = useInternalIcon('sortAsc')
      configureIcons({ sortAsc: MockIcon })
      expect(useInternalIcon('sortAsc')).toBe(MockIcon)

      resetIcons()
      expect(useInternalIcon('sortAsc')).not.toBe(MockIcon)
      expect(typeof useInternalIcon('sortAsc')).toBe('function')
    })
  })

  describe('getIconRegistry', () => {
    it('returns all icons', () => {
      const registry = getIconRegistry()
      expect(registry.sortAsc).toBeDefined()
      expect(registry.sortDesc).toBeDefined()
      expect(registry.emptyData).toBeDefined()
    })

    it('reflects configuration changes', () => {
      configureIcons({ sortAsc: MockIcon })
      const registry = getIconRegistry()
      expect(registry.sortAsc).toBe(MockIcon)
    })
  })

  describe('Default Icons', () => {
    it('default icons are functional components', () => {
      const icon = useInternalIcon('sortAsc')
      expect(typeof icon).toBe('function')
    })

    it('default icons render SVG elements', () => {
      const icon = useInternalIcon('emptyData')
      const vnode = (icon as FunctionalComponent)({}, { attrs: {}, slots: {}, emit: () => {} })
      expect(vnode.type).toBe('svg')
    })
  })
})
