import { describe, it, expect, beforeEach } from 'vitest'
import { toasts, toastActions } from './toastState'

describe('toastState', () => {
  beforeEach(() => {
    // Clear all toasts before each test
    toastActions.clear()
  })

  describe('add', () => {
    it('adds a toast with required properties', () => {
      const id = toastActions.add({ variant: 'success', title: 'Test' })

      expect(toasts.length).toBe(1)
      expect(toasts[0].id).toBe(id)
      expect(toasts[0].variant).toBe('success')
      expect(toasts[0].title).toBe('Test')
    })

    it('adds toast with message', () => {
      toastActions.add({ variant: 'info', title: 'Title', message: 'Description' })

      expect(toasts[0].message).toBe('Description')
    })

    it('uses default duration of 5000ms', () => {
      toastActions.add({ variant: 'success', title: 'Test' })

      expect(toasts[0].duration).toBe(5000)
    })

    it('uses custom duration', () => {
      toastActions.add({ variant: 'success', title: 'Test', duration: 10000 })

      expect(toasts[0].duration).toBe(10000)
    })

    it('generates unique IDs', () => {
      const id1 = toastActions.add({ variant: 'success', title: 'Test 1' })
      const id2 = toastActions.add({ variant: 'success', title: 'Test 2' })

      expect(id1).not.toBe(id2)
    })

    it('sets createdAt timestamp', () => {
      const before = Date.now()
      toastActions.add({ variant: 'success', title: 'Test' })
      const after = Date.now()

      expect(toasts[0].createdAt).toBeGreaterThanOrEqual(before)
      expect(toasts[0].createdAt).toBeLessThanOrEqual(after)
    })

    it('enforces max limit of 5 toasts', () => {
      for (let i = 0; i < 7; i++) {
        toastActions.add({ variant: 'info', title: `Toast ${i}` })
      }

      expect(toasts.length).toBe(5)
      // Oldest should be removed
      expect(toasts[0].title).toBe('Toast 2')
      expect(toasts[4].title).toBe('Toast 6')
    })

    it('returns toast ID', () => {
      const id = toastActions.add({ variant: 'success', title: 'Test' })

      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe('remove', () => {
    it('removes toast by ID', () => {
      const id = toastActions.add({ variant: 'success', title: 'Test' })
      expect(toasts.length).toBe(1)

      toastActions.remove(id)
      expect(toasts.length).toBe(0)
    })

    it('does nothing if ID not found', () => {
      toastActions.add({ variant: 'success', title: 'Test' })
      expect(toasts.length).toBe(1)

      toastActions.remove('non-existent-id')
      expect(toasts.length).toBe(1)
    })

    it('removes correct toast from multiple', () => {
      toastActions.add({ variant: 'success', title: 'Toast 1' })
      const id2 = toastActions.add({ variant: 'error', title: 'Toast 2' })
      toastActions.add({ variant: 'info', title: 'Toast 3' })

      toastActions.remove(id2)

      expect(toasts.length).toBe(2)
      expect(toasts[0].title).toBe('Toast 1')
      expect(toasts[1].title).toBe('Toast 3')
    })
  })

  describe('clear', () => {
    it('removes all toasts', () => {
      toastActions.add({ variant: 'success', title: 'Test 1' })
      toastActions.add({ variant: 'error', title: 'Test 2' })
      toastActions.add({ variant: 'info', title: 'Test 3' })
      expect(toasts.length).toBe(3)

      toastActions.clear()
      expect(toasts.length).toBe(0)
    })

    it('does nothing if already empty', () => {
      expect(toasts.length).toBe(0)
      toastActions.clear()
      expect(toasts.length).toBe(0)
    })
  })

  describe('convenience methods', () => {
    it('success() creates success toast', () => {
      toastActions.success('Success!')

      expect(toasts[0].variant).toBe('success')
      expect(toasts[0].title).toBe('Success!')
    })

    it('error() creates error toast', () => {
      toastActions.error('Error!')

      expect(toasts[0].variant).toBe('error')
      expect(toasts[0].title).toBe('Error!')
    })

    it('warning() creates warning toast', () => {
      toastActions.warning('Warning!')

      expect(toasts[0].variant).toBe('warning')
      expect(toasts[0].title).toBe('Warning!')
    })

    it('info() creates info toast', () => {
      toastActions.info('Info!')

      expect(toasts[0].variant).toBe('info')
      expect(toasts[0].title).toBe('Info!')
    })

    it('convenience methods accept options', () => {
      toastActions.success('Title', { message: 'Message', duration: 3000 })

      expect(toasts[0].title).toBe('Title')
      expect(toasts[0].message).toBe('Message')
      expect(toasts[0].duration).toBe(3000)
    })

    it('convenience methods return ID', () => {
      const id = toastActions.success('Test')

      expect(typeof id).toBe('string')
      expect(toasts[0].id).toBe(id)
    })
  })
})
