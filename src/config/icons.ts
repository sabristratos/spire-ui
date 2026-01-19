import { shallowRef, h, type Component, type FunctionalComponent } from 'vue'

/**
 * Semantic icon keys used internally by Spire UI components.
 * Components request icons by function, not by name.
 */
export interface IconMap {
  sortAsc: Component
  sortDesc: Component
  sortNeutral: Component
  expand: Component
  collapse: Component
  close: Component
  search: Component
  check: Component
  info: Component
  success: Component
  warning: Component
  error: Component
  emptyData: Component
  emptySearch: Component
}

type SVGProps = { class?: string }

function createSvgIcon(paths: string[], viewBox = '0 0 24 24'): FunctionalComponent<SVGProps> {
  return (props) => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    class: props.class
  }, paths.map(d => h('path', { d })))
}

function createFilledSvgIcon(paths: string[], viewBox = '0 0 24 24'): FunctionalComponent<SVGProps> {
  return (props) => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox,
    fill: 'currentColor',
    class: props.class
  }, paths.map(d => h('path', { d })))
}

const defaultIcons: IconMap = {
  sortAsc: createSvgIcon(['M4 10l4-4 4 4'], '0 0 16 16'),

  sortDesc: createSvgIcon(['M4 6l4 4 4-4'], '0 0 16 16'),

  sortNeutral: createSvgIcon([
    'M4 6l4-3 4 3',
    'M4 10l4 3 4-3'
  ], '0 0 16 16'),

  expand: createSvgIcon(['M6 9l6 6 6-6']),

  collapse: createSvgIcon(['M18 15l-6-6-6 6']),

  close: createSvgIcon(['M18 6L6 18', 'M6 6l12 12']),

  search: createSvgIcon([
    'M11 19a8 8 0 100-16 8 8 0 000 16z',
    'M21 21l-4.35-4.35'
  ]),

  check: createSvgIcon(['M20 6L9 17l-5-5']),

  info: createSvgIcon([
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 16v-4',
    'M12 8h.01'
  ]),

  success: createSvgIcon([
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M9 12l2 2 4-4'
  ]),

  warning: createSvgIcon([
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 8v4',
    'M12 16h.01'
  ]),

  error: createSvgIcon([
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M15 9l-6 6',
    'M9 9l6 6'
  ]),

  emptyData: createSvgIcon([
    'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
  ]),

  emptySearch: createSvgIcon([
    'M11 19a8 8 0 100-16 8 8 0 000 16z',
    'M21 21l-4.35-4.35'
  ])
}

const iconRegistry = shallowRef<IconMap>({ ...defaultIcons })

/**
 * Configure internal icons used by Spire UI components.
 * Call this before mounting your app to customize icons globally.
 *
 * @example
 * ```ts
 * import { configureIcons } from 'spire-ui'
 * import { ArrowUp, ArrowDown, X } from 'lucide-vue-next'
 *
 * configureIcons({
 *   sortAsc: ArrowUp,
 *   sortDesc: ArrowDown,
 *   close: X
 * })
 * ```
 */
export function configureIcons(userIcons: Partial<IconMap>): void {
  iconRegistry.value = { ...iconRegistry.value, ...userIcons }
}

/**
 * Reset icons to defaults. Useful for testing.
 */
export function resetIcons(): void {
  iconRegistry.value = { ...defaultIcons }
}

/**
 * Get an internal icon by semantic key.
 * Used internally by Spire UI components.
 */
export function useInternalIcon(key: keyof IconMap): Component {
  return iconRegistry.value[key]
}

/**
 * Get all currently configured icons.
 */
export function getIconRegistry(): Readonly<IconMap> {
  return iconRegistry.value
}
