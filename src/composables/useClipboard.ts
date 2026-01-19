import { ref } from 'vue'

/**
 * Copy text to clipboard with success state tracking.
 * @param timeout Reset duration for copied state (ms)
 */
export function useClipboard(timeout = 2000) {
  const copied = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const copy = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true

      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        copied.value = false
      }, timeout)

      return true
    } catch (e) {
      console.error('Failed to copy:', e)
      copied.value = false
      return false
    }
  }

  return { copy, copied }
}
