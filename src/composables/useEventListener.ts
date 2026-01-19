import { onMounted, onUnmounted, unref, watch, isRef, type Ref } from 'vue'

type EventTarget = Window | Document | HTMLElement | null
type MaybeRef<T> = T | Ref<T>

/**
 * Attaches an event listener with automatic cleanup on unmount.
 * Prevents memory leaks from forgotten removeEventListener calls.
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: MaybeRef<EventTarget>,
  event: K,
  callback: (e: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): void

export function useEventListener(
  target: MaybeRef<EventTarget>,
  event: string,
  callback: (e: Event) => void,
  options?: AddEventListenerOptions
): void

export function useEventListener(
  target: MaybeRef<EventTarget>,
  event: string,
  callback: (e: Event) => void,
  options?: AddEventListenerOptions
) {
  const attach = (el: EventTarget) => {
    el?.addEventListener(event, callback, options)
  }

  const detach = (el: EventTarget) => {
    el?.removeEventListener(event, callback, options)
  }

  if (isRef(target)) {
    watch(target, (newEl, oldEl) => {
      if (oldEl) detach(oldEl)
      if (newEl) attach(newEl)
    }, { immediate: true })
  } else {
    onMounted(() => attach(target))
  }

  onUnmounted(() => detach(unref(target)))
}
