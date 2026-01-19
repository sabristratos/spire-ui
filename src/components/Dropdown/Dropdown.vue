<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

export type DropdownPlacement =
  | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  | 'right-start' | 'right-end' | 'left-start' | 'left-end'

export interface DropdownProps {
  /** Menu placement relative to trigger */
  placement?: DropdownPlacement
  /** Offset from trigger (px) */
  offset?: number
  /** Disable the dropdown */
  disabled?: boolean
  /** Width of the menu ('auto', 'trigger', or px value) */
  menuWidth?: 'auto' | 'trigger' | number
}

export interface DropdownContext {
  close: () => void
  closeAll: () => void
  cancelClose: () => void
  registerItem: (el: HTMLElement) => void
  unregisterItem: (el: HTMLElement) => void
  registerSubmenu: (submenu: SubmenuRegistration) => void
  unregisterSubmenu: (id: string) => void
  isSubmenu: boolean
  depth: number
  isMobile: Ref<boolean>
  openSubmenuId: Ref<string | null>
  setOpenSubmenu: (id: string | null) => void
  safeTriangle: SafeTriangleState
  menuStack: Ref<string[]>
  pushMenu: (id: string, label: string) => void
  popMenu: () => void
}

export interface SubmenuRegistration {
  id: string
  triggerEl: HTMLElement
  open: () => void
  close: () => void
}

export interface SafeTriangleState {
  active: boolean
  points: { x: number; y: number }[]
  submenuId: string | null
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('dropdown')
</script>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  inject
} from 'vue'
import { useId } from '../../composables'

const props = withDefaults(defineProps<DropdownProps>(), {
  placement: 'bottom-start',
  offset: 4,
  disabled: false,
  menuWidth: 'auto'
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const parentContext = inject(dropdownContextKey, null)
const isSubmenu = !!parentContext
const depth = parentContext ? parentContext.depth + 1 : 0

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuItems = ref<HTMLElement[]>([])
const submenus = ref<Map<string, SubmenuRegistration>>(new Map())
const focusedIndex = ref(-1)
const openSubmenuId = ref<string | null>(null)

const triggerId = useId('dropdown-trigger')
const menuId = useId('dropdown-menu')
const submenuId = useId('submenu')

const isMobile = ref(false)
const menuStack = ref<string[]>([])
const menuLabels = ref<Map<string, string>>(new Map())

let closeTimeout: ReturnType<typeof setTimeout> | null = null
let hoverIntent: { x: number; y: number } | null = null

const safeTriangle = reactive<SafeTriangleState>({
  active: false,
  points: [],
  submenuId: null
})

function checkMobile() {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (isSubmenu && parentContext) {
    parentContext.registerSubmenu({
      id: submenuId,
      triggerEl: triggerRef.value!,
      open,
      close
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (isSubmenu && parentContext) {
    parentContext.unregisterSubmenu(submenuId)
  }
})

const effectivePlacement = computed(() => {
  if (isSubmenu && props.placement === 'bottom-start') {
    return 'right-start'
  }
  return props.placement
})

function registerItem(el: HTMLElement) {
  if (!menuItems.value.includes(el)) {
    menuItems.value.push(el)
  }
}

function unregisterItem(el: HTMLElement) {
  const index = menuItems.value.indexOf(el)
  if (index > -1) {
    menuItems.value.splice(index, 1)
  }
}

function registerSubmenu(submenu: SubmenuRegistration) {
  submenus.value.set(submenu.id, submenu)
}

function unregisterSubmenu(id: string) {
  submenus.value.delete(id)
}

function setOpenSubmenu(id: string | null) {
  if (openSubmenuId.value && openSubmenuId.value !== id) {
    const prev = submenus.value.get(openSubmenuId.value)
    prev?.close()
  }
  openSubmenuId.value = id
}

function pushMenu(id: string, label: string) {
  menuLabels.value.set(id, label)
  menuStack.value.push(id)
}

function popMenu() {
  const id = menuStack.value.pop()
  if (id) {
    menuLabels.value.delete(id)
    const submenu = submenus.value.get(id)
    submenu?.close()
  }
}

provide(dropdownContextKey, {
  close,
  closeAll,
  cancelClose,
  registerItem,
  unregisterItem,
  registerSubmenu,
  unregisterSubmenu,
  isSubmenu,
  depth,
  isMobile,
  openSubmenuId,
  setOpenSubmenu,
  safeTriangle,
  menuStack,
  pushMenu,
  popMenu
})

function open() {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  emit('open')

  if (isSubmenu && parentContext) {
    parentContext.setOpenSubmenu(submenuId)
  }

  nextTick(() => {
    updatePosition()
    requestAnimationFrame(() => {
      focusFirstItem()
    })
  })
}

function close() {
  if (!isOpen.value) return

  submenus.value.forEach(sub => sub.close())
  openSubmenuId.value = null

  isOpen.value = false
  focusedIndex.value = -1
  emit('close')

  if (!isSubmenu) {
    menuStack.value = []
    menuLabels.value.clear()
  }

  if (isSubmenu && parentContext) {
    parentContext.setOpenSubmenu(null)
  }

  nextTick(() => {
    triggerRef.value?.focus()
  })
}

function closeAll() {
  close()
  parentContext?.closeAll()
}

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function scheduleClose() {
  if (closeTimeout) clearTimeout(closeTimeout)
  closeTimeout = setTimeout(() => {
    close()
  }, 150)
}

function cancelClose() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

function focusFirstItem() {
  if (!menuRef.value) return
  const firstItem = menuRef.value.querySelector<HTMLElement>(
    ':scope > .ui-dropdown-item:not([disabled]):not([aria-disabled="true"]), :scope > .ui-dropdown > .ui-dropdown__trigger .ui-dropdown-item:not([disabled]):not([aria-disabled="true"])'
  )
  if (firstItem) {
    focusedIndex.value = 0
    firstItem.focus()
  }
}

function getFocusableItems(): HTMLElement[] {
  if (!menuRef.value) return []
  return Array.from(
    menuRef.value.querySelectorAll<HTMLElement>(
      ':scope > .ui-dropdown-item:not([disabled]):not([aria-disabled="true"]), :scope > .ui-dropdown > .ui-dropdown__trigger .ui-dropdown-item:not([disabled]):not([aria-disabled="true"])'
    )
  )
}

function focusItem(index: number) {
  const focusableItems = getFocusableItems()
  if (focusableItems.length === 0) return

  if (index < 0) index = focusableItems.length - 1
  if (index >= focusableItems.length) index = 0

  focusedIndex.value = index
  focusableItems[index].focus()
}

function handleTriggerClick(event: MouseEvent) {
  if (isSubmenu && !isMobile.value) {
    return
  }
  toggle()
}

function handleTriggerMouseEnter() {
  if (!isSubmenu || isMobile.value) return
  cancelClose()
  parentContext?.cancelClose?.()
  open()
}

function handleTriggerMouseLeave(event: MouseEvent) {
  if (!isSubmenu || isMobile.value) return

  if (menuRef.value) {
    const menuRect = menuRef.value.getBoundingClientRect()
    hoverIntent = { x: event.clientX, y: event.clientY }

    safeTriangle.active = true
    safeTriangle.submenuId = submenuId
    safeTriangle.points = [
      { x: event.clientX, y: event.clientY },
      { x: menuRect.left, y: menuRect.top },
      { x: menuRect.left, y: menuRect.bottom }
    ]
  }

  scheduleClose()
}

function handleMenuMouseEnter() {
  cancelClose()
  parentContext?.cancelClose?.()
  safeTriangle.active = false
}

function handleMenuMouseLeave() {
  if (isSubmenu) {
    scheduleClose()
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (isSubmenu) {
    switch (event.key) {
      case 'ArrowRight':
      case 'Enter':
        event.preventDefault()
        event.stopPropagation()
        open()
        break
    }
    return
  }

  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      event.preventDefault()
      open()
      break
    case 'ArrowUp':
      event.preventDefault()
      open()
      nextTick(() => {
        const items = getFocusableItems()
        if (items.length > 0) {
          focusedIndex.value = items.length - 1
          items[items.length - 1].focus()
        }
      })
      break
  }
}

function handleMenuKeydown(event: KeyboardEvent) {
  const focusableItems = getFocusableItems()
  const currentIndex = focusableItems.findIndex(el => el === document.activeElement)

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      focusItem(currentIndex + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusItem(currentIndex - 1)
      break
    case 'ArrowLeft':
      if (isSubmenu) {
        event.preventDefault()
        event.stopPropagation()
        close()
      }
      break
    case 'Home':
      event.preventDefault()
      focusItem(0)
      break
    case 'End':
      event.preventDefault()
      focusItem(focusableItems.length - 1)
      break
    case 'Escape':
      event.preventDefault()
      event.stopPropagation()
      close()
      break
    case 'Tab':
      closeAll()
      break
  }
}

const menuStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.menuWidth === 'trigger' && triggerRef.value) {
    style.minWidth = `${triggerRef.value.offsetWidth}px`
  } else if (typeof props.menuWidth === 'number') {
    style.width = `${props.menuWidth}px`
  }

  return style
})

const positionStyle = ref<{ top: string; left: string }>({ top: '0', left: '0' })

function updatePosition() {
  if (!triggerRef.value || !menuRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const menuRect = menuRef.value.getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }

  let top: number
  let left: number
  let placement = effectivePlacement.value

  if (placement.startsWith('right') || placement.startsWith('left')) {
    const spaceRight = viewport.width - triggerRect.right
    const spaceLeft = triggerRect.left
    const needsFlipHorizontal =
      (placement.startsWith('right') && spaceRight < menuRect.width && spaceLeft > spaceRight) ||
      (placement.startsWith('left') && spaceLeft < menuRect.width && spaceRight > spaceLeft)

    if (needsFlipHorizontal) {
      placement = placement.startsWith('right')
        ? placement.replace('right', 'left') as DropdownPlacement
        : placement.replace('left', 'right') as DropdownPlacement
    }

    if (placement.startsWith('right')) {
      left = triggerRect.right + props.offset
    } else {
      left = triggerRect.left - menuRect.width - props.offset
    }

    if (placement.endsWith('start')) {
      top = triggerRect.top
    } else {
      top = triggerRect.bottom - menuRect.height
    }
  } else {
    const spaceBelow = viewport.height - triggerRect.bottom
    const spaceAbove = triggerRect.top
    const needsFlipVertical =
      (placement.startsWith('bottom') && spaceBelow < menuRect.height && spaceAbove > spaceBelow) ||
      (placement.startsWith('top') && spaceAbove < menuRect.height && spaceBelow > spaceAbove)

    if (needsFlipVertical) {
      placement = placement.startsWith('bottom')
        ? placement.replace('bottom', 'top') as DropdownPlacement
        : placement.replace('top', 'bottom') as DropdownPlacement
    }

    if (placement.startsWith('bottom')) {
      top = triggerRect.bottom + props.offset
    } else {
      top = triggerRect.top - menuRect.height - props.offset
    }

    if (placement.endsWith('start')) {
      left = triggerRect.left
    } else {
      left = triggerRect.right - menuRect.width
    }
  }

  left = Math.max(8, Math.min(left, viewport.width - menuRect.width - 8))
  top = Math.max(8, Math.min(top, viewport.height - menuRect.height - 8))

  positionStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

function isPointInTriangle(px: number, py: number, points: { x: number; y: number }[]): boolean {
  if (points.length < 3) return false

  const [p0, p1, p2] = points

  const area = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
  const sign = area < 0 ? -1 : 1

  const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * px + (p0.x - p2.x) * py) * sign
  const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * px + (p1.x - p0.x) * py) * sign

  return s > 0 && t > 0 && (s + t) < 2 * area * sign
}

function handleDocumentMouseMove(event: MouseEvent) {
  if (!safeTriangle.active || !safeTriangle.points.length) return

  const inTriangle = isPointInTriangle(event.clientX, event.clientY, safeTriangle.points)

  if (inTriangle) {
    cancelClose()
  } else {
    safeTriangle.active = false
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node

  let isInsideAnySubmenu = false
  submenus.value.forEach(sub => {
    const submenuEl = document.getElementById(`dropdown-menu-${sub.id.split('-').pop()}`)
    if (submenuEl?.contains(target)) {
      isInsideAnySubmenu = true
    }
  })

  if (
    !triggerRef.value?.contains(target) &&
    !menuRef.value?.contains(target) &&
    !isInsideAnySubmenu
  ) {
    closeAll()
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('mousemove', handleDocumentMouseMove)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('mousemove', handleDocumentMouseMove)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
    safeTriangle.active = false
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('mousemove', handleDocumentMouseMove)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  if (closeTimeout) clearTimeout(closeTimeout)
})

const currentMenuLabel = computed(() => {
  if (menuStack.value.length === 0) return null
  const currentId = menuStack.value[menuStack.value.length - 1]
  return menuLabels.value.get(currentId) || null
})

const showMobileDrilldown = computed(() => {
  return isMobile.value && !isSubmenu && menuStack.value.length > 0
})
</script>

<template>
  <div
    class="ui-dropdown"
    :class="{ 'ui-dropdown--submenu': isSubmenu }"
  >
    <div
      ref="triggerRef"
      class="ui-dropdown__trigger"
      :id="triggerId"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      @click="handleTriggerClick"
      @mouseenter="handleTriggerMouseEnter"
      @mouseleave="handleTriggerMouseLeave"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle" />
    </div>

    <Teleport to="body">
      <Transition :name="isSubmenu ? 'ui-dropdown-sub' : 'ui-dropdown'">
        <div
          v-if="isOpen"
          ref="menuRef"
          class="ui-dropdown__menu"
          :class="{
            'ui-dropdown__menu--submenu': isSubmenu,
            'ui-dropdown__menu--mobile': isMobile && !isSubmenu
          }"
          :id="menuId"
          role="menu"
          :aria-labelledby="triggerId"
          :style="isMobile && !isSubmenu ? {} : [menuStyle, positionStyle]"
          @mouseenter="handleMenuMouseEnter"
          @mouseleave="handleMenuMouseLeave"
          @keydown="handleMenuKeydown"
        >
          <!-- Mobile drill-down header -->
          <div
            v-if="isMobile && !isSubmenu && menuStack.length > 0"
            class="ui-dropdown__mobile-header"
          >
            <button
              type="button"
              class="ui-dropdown__back-btn"
              @click="popMenu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <span class="ui-dropdown__mobile-title">{{ currentMenuLabel }}</span>
          </div>

          <slot />
        </div>
      </Transition>

      <!-- Mobile overlay -->
      <Transition name="ui-dropdown-overlay">
        <div
          v-if="isOpen && isMobile && !isSubmenu"
          class="ui-dropdown__overlay"
          @click="closeAll"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ui-dropdown {
  display: inline-block;
  position: relative;
}

.ui-dropdown--submenu {
  width: 100%;
}

.ui-dropdown__trigger {
  display: inline-flex;
}

.ui-dropdown--submenu .ui-dropdown__trigger {
  display: flex;
  width: 100%;
}

.ui-dropdown__menu {
  position: fixed;
  z-index: var(--z-dropdown, 50);
  min-width: 160px;
  padding: var(--space-1);
  background: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  outline: none;
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ui-dropdown__menu--submenu {
  z-index: calc(var(--z-dropdown, 50) + 1);
}

.ui-dropdown__menu--mobile {
  position: fixed;
  top: auto !important;
  left: 0 !important;
  right: 0;
  bottom: 0;
  width: 100%;
  max-height: 80vh;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--space-2);
  overflow-y: auto;
  z-index: calc(var(--z-dropdown, 50) + 10);
}

.ui-dropdown__mobile-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-bottom: 1px solid var(--dropdown-border);
  margin: calc(-1 * var(--space-2));
  margin-bottom: var(--space-2);
}

.ui-dropdown__back-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-sm);
  color: var(--dropdown-item-text);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.ui-dropdown__back-btn:hover {
  background: var(--dropdown-item-hover);
}

.ui-dropdown__mobile-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dropdown-item-text);
}

.ui-dropdown__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: calc(var(--z-dropdown, 50) + 9);
}

.ui-dropdown-enter-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-dropdown-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-dropdown-enter-from,
.ui-dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.ui-dropdown-sub-enter-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-dropdown-sub-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.ui-dropdown-sub-enter-from,
.ui-dropdown-sub-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

.ui-dropdown-overlay-enter-active,
.ui-dropdown-overlay-leave-active {
  transition: opacity var(--duration-normal) var(--ease-default);
}

.ui-dropdown-overlay-enter-from,
.ui-dropdown-overlay-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .ui-dropdown__menu--mobile {
    animation: ui-dropdown-slide-up var(--duration-normal) var(--ease-default);
  }
}

@keyframes ui-dropdown-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
