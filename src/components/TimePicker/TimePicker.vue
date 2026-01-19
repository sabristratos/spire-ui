<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import Popover from '../Popover/Popover.vue'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import { useId } from '../../composables'
import { useInternalIcon } from '../../config/icons'
import {
  parseTime,
  formatTime,
  generateRange,
  to12Hour,
  to24Hour,
  isValidTimeString,
  type TimeFormat
} from '../../utils/time'

export interface TimePickerProps {
  /** Selected time in HH:mm format (24h) */
  modelValue?: string
  /** Time display format */
  format?: TimeFormat
  /** Minute step interval */
  minuteStep?: number
  /** Label text above the input */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Helper text below input */
  hint?: string
  /** Error message (also sets error state) */
  error?: string
  /** Input size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Disabled state */
  disabled?: boolean
  /** Required field */
  required?: boolean
  /** HTML id attribute */
  id?: string
  /** HTML name attribute */
  name?: string
  /** Make input full width */
  block?: boolean
  /** Close popover when time is selected */
  closeOnSelect?: boolean
}

const props = withDefaults(defineProps<TimePickerProps>(), {
  format: '12h',
  minuteStep: 1,
  size: 'md',
  disabled: false,
  required: false,
  block: false,
  closeOnSelect: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const uid = useId('timepicker')
const inputId = computed(() => props.id || uid)

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const hourColumnRef = ref<HTMLElement | null>(null)
const minuteColumnRef = ref<HTMLElement | null>(null)
const periodColumnRef = ref<HTMLElement | null>(null)

const inputValue = ref('')
const selectedHour = ref(12)
const selectedMinute = ref(0)
const selectedPeriod = ref<'AM' | 'PM'>('AM')

const isScrolling = ref(false)
const scrollTimeout = ref<number | null>(null)

const calendarIcon = useInternalIcon('calendar')

const hours = computed(() => {
  if (props.format === '12h') {
    return generateRange(1, 12)
  }
  return generateRange(0, 23)
})

const minutes = computed(() => generateRange(0, 59, props.minuteStep))

const periods: ('AM' | 'PM')[] = ['AM', 'PM']

const ITEM_HEIGHT = 40
const VISIBLE_ITEMS = 5
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS

function initializeFromModelValue() {
  if (props.modelValue && isValidTimeString(props.modelValue)) {
    const parsed = parseTime(props.modelValue)
    if (parsed) {
      if (props.format === '12h') {
        const converted = to12Hour(parsed.hours)
        selectedHour.value = converted.hour
        selectedPeriod.value = converted.period
      } else {
        selectedHour.value = parsed.hours
      }
      selectedMinute.value = findClosestMinute(parsed.minutes)
      updateInputDisplay()
    }
  }
}

function findClosestMinute(minute: number): number {
  const available = minutes.value
  return available.reduce((prev, curr) =>
    Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev
  )
}

function updateInputDisplay() {
  const h24 = props.format === '12h'
    ? to24Hour(selectedHour.value, selectedPeriod.value)
    : selectedHour.value
  inputValue.value = formatTime(h24, selectedMinute.value, props.format)
}

function emitValue() {
  const h24 = props.format === '12h'
    ? to24Hour(selectedHour.value, selectedPeriod.value)
    : selectedHour.value
  const value = formatTime(h24, selectedMinute.value, '24h')
  emit('update:modelValue', value)
}

function handleInputChange(value: string | number) {
  const strValue = String(value)
  inputValue.value = strValue

  const parsed = parseTime(strValue)
  if (parsed) {
    if (props.format === '12h') {
      const converted = to12Hour(parsed.hours)
      selectedHour.value = converted.hour
      selectedPeriod.value = converted.period
    } else {
      selectedHour.value = parsed.hours
    }
    selectedMinute.value = findClosestMinute(parsed.minutes)
    emitValue()
    scrollToSelected()
  }
}

function handleInputBlur(event: FocusEvent) {
  updateInputDisplay()
  emit('blur', event)
}

function handleInputFocus(event: FocusEvent) {
  emit('focus', event)
}

function scrollToSelected() {
  nextTick(() => {
    scrollColumnToValue(hourColumnRef.value, selectedHour.value, hours.value)
    scrollColumnToValue(minuteColumnRef.value, selectedMinute.value, minutes.value)
    if (props.format === '12h' && periodColumnRef.value) {
      scrollColumnToValue(periodColumnRef.value, selectedPeriod.value, periods)
    }
  })
}

function scrollColumnToValue<T>(column: HTMLElement | null, value: T, items: T[]) {
  if (!column) return

  const index = items.indexOf(value)
  if (index === -1) return

  const scrollTop = index * ITEM_HEIGHT
  column.scrollTop = scrollTop
}

function setupScrollObserver(
  column: HTMLElement | null,
  items: readonly (number | string)[],
  onSelect: (value: number | string) => void
) {
  if (!column) return () => {}

  const itemElements = column.querySelectorAll<HTMLElement>('[data-value]')
  if (itemElements.length === 0) return () => {}

  const observer = new IntersectionObserver(
    (entries) => {
      if (isScrolling.value) return

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const value = entry.target.getAttribute('data-value')
          if (value !== null) {
            const parsed = isNaN(Number(value)) ? value : Number(value)
            onSelect(parsed)
          }
        }
      }
    },
    {
      root: column,
      rootMargin: `-${CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2}px 0px`,
      threshold: 0.5
    }
  )

  itemElements.forEach(el => observer.observe(el))

  return () => observer.disconnect()
}

let hourObserverCleanup = () => {}
let minuteObserverCleanup = () => {}
let periodObserverCleanup = () => {}

function setupObservers() {
  hourObserverCleanup()
  minuteObserverCleanup()
  periodObserverCleanup()

  hourObserverCleanup = setupScrollObserver(
    hourColumnRef.value,
    hours.value,
    (val) => {
      selectedHour.value = val as number
      updateInputDisplay()
      emitValue()
    }
  )

  minuteObserverCleanup = setupScrollObserver(
    minuteColumnRef.value,
    minutes.value,
    (val) => {
      selectedMinute.value = val as number
      updateInputDisplay()
      emitValue()
    }
  )

  if (props.format === '12h') {
    periodObserverCleanup = setupScrollObserver(
      periodColumnRef.value,
      periods,
      (val) => {
        selectedPeriod.value = val as 'AM' | 'PM'
        updateInputDisplay()
        emitValue()
      }
    )
  }
}

function handleScroll() {
  isScrolling.value = true

  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }

  scrollTimeout.value = window.setTimeout(() => {
    isScrolling.value = false
  }, 150)
}

function handleItemClick(column: 'hour' | 'minute' | 'period', value: number | string) {
  if (column === 'hour') {
    selectedHour.value = value as number
    scrollColumnToValue(hourColumnRef.value, value, hours.value)
  } else if (column === 'minute') {
    selectedMinute.value = value as number
    scrollColumnToValue(minuteColumnRef.value, value, minutes.value)
  } else if (column === 'period') {
    selectedPeriod.value = value as 'AM' | 'PM'
    scrollColumnToValue(periodColumnRef.value, value, periods)
  }

  updateInputDisplay()
  emitValue()

  if (props.closeOnSelect && column === 'minute') {
    popoverRef.value?.close()
  }
}

function handlePopoverOpen() {
  nextTick(() => {
    scrollToSelected()
    setupObservers()
  })
}

function handlePopoverClose() {
  hourObserverCleanup()
  minuteObserverCleanup()
  periodObserverCleanup()
}

function padValue(value: number): string {
  return value.toString().padStart(2, '0')
}

watch(() => props.modelValue, () => {
  initializeFromModelValue()
}, { immediate: true })

onMounted(() => {
  initializeFromModelValue()
})

onUnmounted(() => {
  hourObserverCleanup()
  minuteObserverCleanup()
  periodObserverCleanup()
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})

defineExpose({
  open: () => popoverRef.value?.open(),
  close: () => popoverRef.value?.close(),
  toggle: () => popoverRef.value?.toggle()
})
</script>

<template>
  <div
    class="ui-timepicker"
    :class="[
      `ui-timepicker--${size}`,
      {
        'ui-timepicker--block': block,
        'ui-timepicker--disabled': disabled
      }
    ]"
  >
    <Popover
      ref="popoverRef"
      placement="bottom-start"
      :disabled="disabled"
      :close-on-click-outside="true"
      :close-on-escape="true"
      :trap-focus="true"
      @open="handlePopoverOpen"
      @close="handlePopoverClose"
    >
      <template #trigger>
        <Input
          :id="inputId"
          v-model="inputValue"
          :label="label"
          :placeholder="placeholder || (format === '12h' ? 'hh:mm AM/PM' : 'HH:mm')"
          :hint="hint"
          :error="error"
          :size="size"
          :disabled="disabled"
          :required="required"
          :name="name"
          :block="block"
          :icon-right="calendarIcon"
          autocomplete="off"
          @update:model-value="handleInputChange"
          @blur="handleInputBlur"
          @focus="handleInputFocus"
        />
      </template>

      <div class="ui-timepicker__panel">
        <div class="ui-timepicker__columns">
          <div class="ui-timepicker__highlight" />

          <div
            ref="hourColumnRef"
            class="ui-timepicker__column"
            @scroll="handleScroll"
          >
            <div class="ui-timepicker__spacer" />
            <div
              v-for="hour in hours"
              :key="hour"
              :data-value="hour"
              class="ui-timepicker__item"
              :class="{ 'ui-timepicker__item--selected': hour === selectedHour }"
              @click="handleItemClick('hour', hour)"
            >
              {{ padValue(hour) }}
            </div>
            <div class="ui-timepicker__spacer" />
          </div>

          <div class="ui-timepicker__separator">:</div>

          <div
            ref="minuteColumnRef"
            class="ui-timepicker__column"
            @scroll="handleScroll"
          >
            <div class="ui-timepicker__spacer" />
            <div
              v-for="minute in minutes"
              :key="minute"
              :data-value="minute"
              class="ui-timepicker__item"
              :class="{ 'ui-timepicker__item--selected': minute === selectedMinute }"
              @click="handleItemClick('minute', minute)"
            >
              {{ padValue(minute) }}
            </div>
            <div class="ui-timepicker__spacer" />
          </div>

          <template v-if="format === '12h'">
            <div
              ref="periodColumnRef"
              class="ui-timepicker__column ui-timepicker__column--period"
              @scroll="handleScroll"
            >
              <div class="ui-timepicker__spacer" />
              <div
                v-for="period in periods"
                :key="period"
                :data-value="period"
                class="ui-timepicker__item"
                :class="{ 'ui-timepicker__item--selected': period === selectedPeriod }"
                @click="handleItemClick('period', period)"
              >
                {{ period }}
              </div>
              <div class="ui-timepicker__spacer" />
            </div>
          </template>
        </div>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.ui-timepicker {
  display: inline-block;
  font-family: var(--font-sans);
}

.ui-timepicker--block {
  display: block;
  width: 100%;
}

.ui-timepicker__panel {
  padding: 0;
  min-width: 180px;
}

.ui-timepicker__columns {
  display: flex;
  align-items: center;
  height: 200px;
  position: relative;
  background: linear-gradient(
    to bottom,
    var(--popover-bg, var(--dropdown-bg)) 0%,
    transparent 40%,
    transparent 60%,
    var(--popover-bg, var(--dropdown-bg)) 100%
  );
}

.ui-timepicker__highlight {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 40px;
  transform: translateY(-50%);
  border-top: 1px solid var(--input-border);
  border-bottom: 1px solid var(--input-border);
  background-color: var(--input-bg);
  pointer-events: none;
  z-index: 0;
}

.ui-timepicker__column {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  position: relative;
  z-index: 1;
}

.ui-timepicker__column::-webkit-scrollbar {
  display: none;
}

.ui-timepicker__column--period {
  flex: 0 0 auto;
  min-width: 50px;
}

.ui-timepicker__spacer {
  height: 80px;
  scroll-snap-align: none;
}

.ui-timepicker__item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  cursor: pointer;
  font-size: var(--text-md);
  font-weight: var(--font-normal);
  color: var(--input-text);
  transition: color var(--duration-fast) var(--ease-default);
  user-select: none;
}

.ui-timepicker__item:hover {
  color: var(--action-primary);
}

.ui-timepicker__item--selected {
  font-weight: var(--font-medium);
  color: var(--action-primary);
}

.ui-timepicker__separator {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--input-text);
  padding: 0 var(--space-1);
}

@media (max-width: 640px) {
  .ui-timepicker__panel {
    min-width: 100%;
  }

  .ui-timepicker__columns {
    height: 240px;
  }

  .ui-timepicker__spacer {
    height: 100px;
  }
}
</style>
