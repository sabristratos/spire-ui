/**
 * Extract initials from a name string.
 *
 * @param name - Full name (e.g., "John Doe", "Madonna", "John von Doe")
 * @param limit - Maximum characters to return (default: 2)
 * @returns Uppercase initials (e.g., "JD", "M", "JD")
 *
 * @example
 * getInitials("John Doe")      // "JD"
 * getInitials("Madonna")       // "MA"
 * getInitials("John von Doe")  // "JD" (first + last)
 * getInitials("")              // ""
 */
export function getInitials(name?: string, limit = 2): string {
  if (!name) return ''

  // Split by spaces, filter empty (handles "John  Doe")
  const parts = name.trim().split(/\s+/)

  if (parts.length === 0 || parts[0] === '') return ''

  // Single name "Madonna" -> "MA" (first `limit` chars)
  if (parts.length === 1) {
    return parts[0].substring(0, limit).toUpperCase()
  }

  // Multi name "John von Doe" -> "JD" (First and Last)
  const first = parts[0][0]
  const last = parts[parts.length - 1][0]

  return (first + last).toUpperCase()
}
