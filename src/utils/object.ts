/**
 * Access a nested property in an object using dot notation.
 *
 * @param obj - The object to access
 * @param path - Dot-notation path (e.g., 'user.email', 'address.city')
 * @returns The value at the path, or undefined if not found
 *
 * @example
 * getNestedValue({ user: { email: 'a@b.com' } }, 'user.email') // 'a@b.com'
 * getNestedValue({ name: 'John' }, 'name') // 'John'
 * getNestedValue({}, 'missing.path') // undefined
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  if (!path) return undefined

  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}
