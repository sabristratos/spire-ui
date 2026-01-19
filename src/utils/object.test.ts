import { describe, it, expect } from 'vitest'
import { getNestedValue } from './object'

describe('getNestedValue', () => {
  it('returns undefined for empty path', () => {
    expect(getNestedValue({ name: 'John' }, '')).toBeUndefined()
  })

  it('returns top-level property', () => {
    expect(getNestedValue({ name: 'John' }, 'name')).toBe('John')
  })

  it('returns nested property', () => {
    const obj = { user: { email: 'a@b.com' } }
    expect(getNestedValue(obj, 'user.email')).toBe('a@b.com')
  })

  it('returns deeply nested property', () => {
    const obj = { a: { b: { c: { d: 'deep' } } } }
    expect(getNestedValue(obj, 'a.b.c.d')).toBe('deep')
  })

  it('returns undefined for missing property', () => {
    expect(getNestedValue({}, 'missing')).toBeUndefined()
  })

  it('returns undefined for missing nested property', () => {
    expect(getNestedValue({ user: {} }, 'user.email')).toBeUndefined()
  })

  it('returns undefined when intermediate path is missing', () => {
    expect(getNestedValue({}, 'user.email.domain')).toBeUndefined()
  })

  it('handles null values in path', () => {
    const obj = { user: null }
    expect(getNestedValue(obj as Record<string, unknown>, 'user.email')).toBeUndefined()
  })

  it('returns arrays', () => {
    const obj = { items: [1, 2, 3] }
    expect(getNestedValue(obj, 'items')).toEqual([1, 2, 3])
  })

  it('returns objects', () => {
    const obj = { user: { name: 'John', age: 30 } }
    expect(getNestedValue(obj, 'user')).toEqual({ name: 'John', age: 30 })
  })

  it('returns boolean false', () => {
    const obj = { active: false }
    expect(getNestedValue(obj, 'active')).toBe(false)
  })

  it('returns number zero', () => {
    const obj = { count: 0 }
    expect(getNestedValue(obj, 'count')).toBe(0)
  })

  it('returns empty string', () => {
    const obj = { name: '' }
    expect(getNestedValue(obj, 'name')).toBe('')
  })
})
