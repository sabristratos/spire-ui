/**
 * Time parsing and formatting utilities for TimePicker component
 */

export interface ParsedTime {
  hours: number
  minutes: number
}

/**
 * Parses fuzzy time input strings into structured time object.
 * Supports formats: "1p", "1:30pm", "13:00", "100pm", "1 30 am", etc.
 */
export function parseTime(input: string): ParsedTime | null {
  if (!input || typeof input !== 'string') {
    return null
  }

  const cleaned = input.toLowerCase().replace(/\s+/g, '').trim()

  if (!cleaned) {
    return null
  }

  const isPM = /p|pm$/.test(cleaned)
  const isAM = /a|am$/.test(cleaned)
  const timeStr = cleaned.replace(/[ap]m?$/i, '')

  let hours = 0
  let minutes = 0

  if (timeStr.includes(':')) {
    const parts = timeStr.split(':')
    hours = parseInt(parts[0], 10)
    minutes = parseInt(parts[1], 10) || 0
  } else {
    const num = parseInt(timeStr, 10)

    if (isNaN(num)) {
      return null
    }

    if (num <= 12) {
      hours = num
      minutes = 0
    } else if (num <= 99) {
      hours = Math.floor(num / 10)
      minutes = (num % 10) * 10
    } else if (num <= 2359) {
      hours = Math.floor(num / 100)
      minutes = num % 100
    } else {
      return null
    }
  }

  if (isNaN(hours) || isNaN(minutes)) {
    return null
  }

  if (isPM && hours < 12) {
    hours += 12
  } else if (isAM && hours === 12) {
    hours = 0
  }

  hours = Math.max(0, Math.min(23, hours))
  minutes = Math.max(0, Math.min(59, minutes))

  return { hours, minutes }
}

export type TimeFormat = '12h' | '24h'

/**
 * Formats hours and minutes into a time string.
 * @param hours - Hour value (0-23)
 * @param minutes - Minute value (0-59)
 * @param format - Output format ('12h' or '24h')
 */
export function formatTime(
  hours: number,
  minutes: number,
  format: TimeFormat = '24h'
): string {
  const h = Math.max(0, Math.min(23, hours))
  const m = Math.max(0, Math.min(59, minutes))

  if (format === '24h') {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h

  return `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`
}

/**
 * Generates an array of numbers within a range with optional step.
 * Used for generating hour (0-23 or 1-12) and minute (0-59) options.
 */
export function generateRange(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []

  for (let i = start; i <= end; i += step) {
    result.push(i)
  }

  return result
}

/**
 * Converts 24h hours to 12h format
 */
export function to12Hour(hours: number): { hour: number; period: 'AM' | 'PM' } {
  const period: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM'
  let hour = hours % 12

  if (hour === 0) {
    hour = 12
  }

  return { hour, period }
}

/**
 * Converts 12h format to 24h hours
 */
export function to24Hour(hour: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') {
    return hour === 12 ? 0 : hour
  }

  return hour === 12 ? 12 : hour + 12
}

/**
 * Validates if a string is a valid time format (HH:mm)
 */
export function isValidTimeString(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const match = value.match(/^(\d{1,2}):(\d{2})$/)

  if (!match) {
    return false
  }

  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}
