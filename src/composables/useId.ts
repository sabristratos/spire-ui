let count = 0

/**
 * Generates a unique ID for accessibility attributes.
 * Links labels to inputs, aria-labelledby to modals, etc.
 * @param prefix Optional prefix (default: 'ui')
 */
export function useId(prefix = 'ui'): string {
  return `${prefix}-${++count}`
}
