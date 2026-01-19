import { describe, it, expect } from 'vitest'
import { getInitials } from './string'

describe('getInitials', () => {
  describe('basic functionality', () => {
    it('returns initials for two-word name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('returns initials for single name (first N chars)', () => {
      expect(getInitials('Madonna')).toBe('MA')
    })

    it('returns first and last initials for multi-word names', () => {
      expect(getInitials('John von Doe')).toBe('JD')
      expect(getInitials('Mary Jane Watson')).toBe('MW')
    })
  })

  describe('edge cases', () => {
    it('returns empty string for undefined', () => {
      expect(getInitials(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      expect(getInitials('')).toBe('')
    })

    it('returns empty string for whitespace only', () => {
      expect(getInitials('   ')).toBe('')
    })

    it('handles multiple spaces between words', () => {
      expect(getInitials('John    Doe')).toBe('JD')
    })

    it('handles leading/trailing whitespace', () => {
      expect(getInitials('  John Doe  ')).toBe('JD')
    })

    it('handles single character name', () => {
      expect(getInitials('X')).toBe('X')
    })
  })

  describe('limit parameter', () => {
    it('respects custom limit for single names', () => {
      expect(getInitials('Madonna', 1)).toBe('M')
      expect(getInitials('Madonna', 3)).toBe('MAD')
    })

    it('limit does not affect multi-word names (always 2 chars)', () => {
      expect(getInitials('John Doe', 1)).toBe('JD')
    })
  })

  describe('case handling', () => {
    it('returns uppercase regardless of input case', () => {
      expect(getInitials('john doe')).toBe('JD')
      expect(getInitials('JOHN DOE')).toBe('JD')
      expect(getInitials('jOhN dOe')).toBe('JD')
    })
  })
})
