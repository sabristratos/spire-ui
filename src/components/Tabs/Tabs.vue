<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import Icon from '../Icon/Icon.vue'
import type { IconInput } from '../Icon/Icon.vue'

export interface TabItem {
  /** Display label */
  label: string
  /** Unique value (used for v-model and slot name) */
  value: string | number
  /** Disable this tab */
  disabled?: boolean
  /** Optional icon */
  icon?: IconInput
}

export interface TabsProps {
  /** Currently active tab value (v-model) */
  modelValue: string | number
  /** Tab items configuration */
  items: TabItem[]
  /** Visual variant */
  variant?: 'line' | 'pill'
  /** Full width tabs */
  block?: boolean
}

const props = withDefaults(defineProps<TabsProps>(), {
  variant: 'line',
  block: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const tabListRef = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLButtonElement[]>([])

const lineStyle = ref({ width: '0px', transform: 'translateX(0px)' })

let resizeObserver: ResizeObserver | null = null

/**
 * Calculate and update the magic line position
 */
function updateLine() {
  const activeIndex = props.items.findIndex(item => item.value === props.modelValue)
  if (activeIndex === -1 || !tabRefs.value[activeIndex]) return

  const activeTab = tabRefs.value[activeIndex]
  const width = activeTab.offsetWidth
  const left = activeTab.offsetLeft

  lineStyle.value = {
    width: `${width}px`,
    transform: `translateX(${left}px)`
  }
}

/**
 * Select a tab
 */
function selectTab(item: TabItem) {
  if (item.disabled) return
  emit('update:modelValue', item.value)
}

/**
 * Handle keyboard navigation (roving tabindex)
 */
function handleKeydown(e: KeyboardEvent, index: number) {
  const isRight = e.key === 'ArrowRight'
  const isLeft = e.key === 'ArrowLeft'
  const isHome = e.key === 'Home'
  const isEnd = e.key === 'End'

  if (!isRight && !isLeft && !isHome && !isEnd) return

  e.preventDefault()

  let nextIndex: number

  if (isHome) {
    nextIndex = props.items.findIndex(item => !item.disabled)
  } else if (isEnd) {
    nextIndex = props.items.length - 1 - [...props.items].reverse().findIndex(item => !item.disabled)
  } else {
    const direction = isRight ? 1 : -1
    nextIndex = index

    do {
      nextIndex = (nextIndex + direction + props.items.length) % props.items.length
    } while (props.items[nextIndex].disabled && nextIndex !== index)
  }

  const nextItem = props.items[nextIndex]
  if (!nextItem.disabled) {
    tabRefs.value[nextIndex]?.focus()
    emit('update:modelValue', nextItem.value)
  }
}

/**
 * Set tab ref at index
 */
function setTabRef(el: HTMLButtonElement | null, index: number) {
  if (el) {
    tabRefs.value[index] = el
  }
}

watch(() => props.modelValue, async () => {
  await nextTick()
  updateLine()
})

onMounted(() => {
  updateLine()

  resizeObserver = new ResizeObserver(() => {
    updateLine()
  })

  if (tabListRef.value) {
    resizeObserver.observe(tabListRef.value)
  }

  window.addEventListener('resize', updateLine)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateLine)
})
</script>

<template>
  <div class="ui-tabs">
    <div
      ref="tabListRef"
      class="ui-tabs__list"
      :class="[
        `ui-tabs__list--${variant}`,
        { 'ui-tabs__list--block': block }
      ]"
      role="tablist"
    >
      <button
        v-for="(item, index) in items"
        :key="item.value"
        :ref="(el) => setTabRef(el as HTMLButtonElement, index)"
        type="button"
        role="tab"
        class="ui-tabs__tab"
        :class="{ 'ui-tabs__tab--active': modelValue === item.value }"
        :aria-selected="modelValue === item.value"
        :aria-controls="`tabpanel-${item.value}`"
        :disabled="item.disabled"
        :tabindex="modelValue === item.value ? 0 : -1"
        @click="selectTab(item)"
        @keydown="handleKeydown($event, index)"
      >
        <Icon
          v-if="item.icon"
          :icon="item.icon"
          size="sm"
          class="ui-tabs__icon"
        />
        {{ item.label }}
      </button>

      <div
        class="ui-tabs__indicator"
        :style="lineStyle"
        aria-hidden="true"
      />
    </div>

    <div class="ui-tabs__panels">
      <div
        v-for="item in items"
        :key="item.value"
        v-show="modelValue === item.value"
        :id="`tabpanel-${item.value}`"
        role="tabpanel"
        class="ui-tabs__panel"
        :tabindex="0"
      >
        <slot :name="item.value" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-tabs {
  width: 100%;
}

.ui-tabs__list {
  position: relative;
  display: flex;
  gap: var(--space-1);
  border-bottom: 1px solid var(--tabs-border);
}

.ui-tabs__list--block {
  width: 100%;
}

.ui-tabs__list--block .ui-tabs__tab {
  flex: 1;
  justify-content: center;
}

.ui-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--tabs-text);
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--duration-fast) var(--ease-default);
  z-index: 2;
}

.ui-tabs__tab:hover:not(:disabled) {
  color: var(--tabs-text-hover);
}

.ui-tabs__tab--active {
  color: var(--tabs-text-active);
}

.ui-tabs__tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-tabs__tab:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: -2px;
  border-radius: var(--radius-sm);
}

.ui-tabs__icon {
  flex-shrink: 0;
}

.ui-tabs__indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  background-color: var(--tabs-indicator);
  border-radius: 1px;
  transition:
    width var(--duration-normal) var(--ease-out-expo),
    transform var(--duration-normal) var(--ease-out-expo);
  z-index: 1;
  pointer-events: none;
}

.ui-tabs__list--pill {
  border-bottom: none;
  background-color: var(--tabs-pill-bg);
  padding: var(--space-1);
  border-radius: var(--radius-lg);
  gap: var(--space-1);
}

.ui-tabs__list--pill .ui-tabs__tab {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--tabs-text);
}

.ui-tabs__list--pill .ui-tabs__tab--active {
  color: var(--tabs-text-active);
}

.ui-tabs__list--pill .ui-tabs__indicator {
  top: var(--space-1);
  bottom: var(--space-1);
  height: auto;
  background-color: var(--tabs-pill-indicator);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.ui-tabs__panels {
  padding-top: var(--space-4);
}

.ui-tabs__panel {
  outline: none;
  animation: tabs-fade-in var(--duration-normal) var(--ease-default);
}

@keyframes tabs-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
