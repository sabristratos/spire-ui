<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Popover from '../Popover/Popover.vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { useId } from '../../composables'
import { useInternalIcon } from '../../config/icons'
import {
  generateCalendarGrid,
  formatDate,
  parseDate,
  isSameDate,
  isDateInRange,
  getMonthName,
  getMonthNamesShort,
  getWeekdayNames,
  getRangeClass,
  normalizeRange,
  generateYearGrid,
  type CalendarDay,
  type RangeState
} from '../../utils'

export type ViewMode = 'day' | 'month' | 'year'

export interface DatePickerProps {
  /** Selected date in ISO format (single mode) or [start, end] tuple (range mode) */
  modelValue?: string | [string, string]
  /** Selection mode */
  mode?: 'single' | 'range'
  /** Minimum selectable date in ISO format */
  min?: string
  /** Maximum selectable date in ISO format */
  max?: string
  /** Label text above the input */
  label?: string
  /** Placeholder text when no date is selected */
  placeholder?: string
  /** Helper text below input */
  hint?: string
  /** Error message (also sets error state) */
  error?: string
  /** Input size - matches Button/Input heights */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Disabled state */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** HTML id attribute */
  id?: string
  /** HTML name attribute */
  name?: string
  /** Make input full width */
  block?: boolean
  /** Locale for month/day names (defaults to browser locale) */
  locale?: string
  /** Format function for displaying the selected date */
  formatDisplay?: (date: Date) => string
  /** Format function for displaying range (range mode only) */
  formatRangeDisplay?: (start: Date, end: Date) => string
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  mode: 'single',
  size: 'md',
  disabled: false,
  required: false,
  block: false,
  placeholder: 'Select date'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | [string, string]): void
}>()

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const calendarRef = ref<HTMLDivElement | null>(null)
const triggerRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const uid = useId('datepicker')
const inputId = computed(() => props.id || uid)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const gridId = computed(() => `${inputId.value}-grid`)

const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

const calendarIcon = useInternalIcon('calendar')
const chevronLeftIcon = useInternalIcon('chevronLeft')
const chevronRightIcon = useInternalIcon('chevronRight')
const closeIcon = useInternalIcon('close')

const isMobile = ref(false)
const hasPointer = ref(false)
const isOpen = ref(false)
const inputValue = ref('')
const inputError = ref('')

function checkMobile() {
  if (typeof window === 'undefined') return
  isMobile.value = window.matchMedia('(max-width: 640px)').matches
  hasPointer.value = window.matchMedia('(any-hover: hover)').matches
}

checkMobile()

onMounted(() => {
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const viewDate = ref(new Date())
const today = new Date()
const viewMode = ref<ViewMode>('day')

const rangeState = ref<RangeState>('idle')
const rangeStart = ref<Date | null>(null)
const hoverDate = ref<Date | null>(null)

const selectedDate = computed(() => {
  if (props.mode === 'range') return null
  return parseDate((props.modelValue as string) || '')
})

const selectedRange = computed(() => {
  if (props.mode !== 'range') return { start: null, end: null }
  const val = props.modelValue as [string, string] | undefined
  if (!val || !Array.isArray(val)) return { start: null, end: null }
  return {
    start: parseDate(val[0] || ''),
    end: parseDate(val[1] || '')
  }
})

const minDate = computed(() => parseDate(props.min || ''))
const maxDate = computed(() => parseDate(props.max || ''))

const viewYear = computed(() => viewDate.value.getFullYear())
const viewMonth = computed(() => viewDate.value.getMonth())
const monthName = computed(() => getMonthName(viewMonth.value, props.locale))
const weekdays = computed(() => getWeekdayNames(props.locale))
const monthNames = computed(() => getMonthNamesShort(props.locale))
const yearGrid = computed(() => generateYearGrid(viewYear.value))
const yearRangeLabel = computed(() => {
  const years = yearGrid.value
  return `${years[0]}–${years[years.length - 1]}`
})

const calendarGrid = computed<CalendarDay[]>(() => {
  return generateCalendarGrid(viewYear.value, viewMonth.value)
})

const displayValue = computed(() => {
  if (props.mode === 'range') {
    const { start, end } = selectedRange.value
    if (!start || !end) return ''
    if (props.formatRangeDisplay) return props.formatRangeDisplay(start, end)
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = start.toLocaleDateString(props.locale, opts)
    const endStr = end.toLocaleDateString(props.locale, { ...opts, year: 'numeric' })
    return `${startStr} – ${endStr}`
  }

  if (!selectedDate.value) return ''
  if (props.formatDisplay) return props.formatDisplay(selectedDate.value)
  return selectedDate.value.toLocaleDateString(props.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const hasValue = computed(() => {
  if (props.mode === 'range') {
    return selectedRange.value.start !== null && selectedRange.value.end !== null
  }
  return selectedDate.value !== null
})

const canNavigatePrev = computed(() => {
  if (viewMode.value === 'year') return true
  if (viewMode.value === 'month') {
    if (!minDate.value) return true
    return viewYear.value > minDate.value.getFullYear()
  }
  if (!minDate.value) return true
  const firstOfViewMonth = new Date(viewYear.value, viewMonth.value, 1)
  const firstOfMinMonth = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1)
  return firstOfViewMonth > firstOfMinMonth
})

const canNavigateNext = computed(() => {
  if (viewMode.value === 'year') return true
  if (viewMode.value === 'month') {
    if (!maxDate.value) return true
    return viewYear.value < maxDate.value.getFullYear()
  }
  if (!maxDate.value) return true
  const firstOfViewMonth = new Date(viewYear.value, viewMonth.value, 1)
  const firstOfMaxMonth = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1)
  return firstOfViewMonth < firstOfMaxMonth
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (props.mode === 'range') {
      const val = newVal as [string, string] | undefined
      if (val && Array.isArray(val) && val[0]) {
        const parsed = parseDate(val[0])
        if (parsed) viewDate.value = new Date(parsed)
      }
    } else {
      const parsed = parseDate((newVal as string) || '')
      if (parsed) viewDate.value = new Date(parsed)
    }
  },
  { immediate: true }
)

function navigateMonth(delta: number) {
  const newDate = new Date(viewDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  viewDate.value = newDate
}

function navigateYear(delta: number) {
  const newDate = new Date(viewDate.value)
  newDate.setFullYear(newDate.getFullYear() + delta)
  viewDate.value = newDate
}

function navigateYearGrid(delta: number) {
  const newDate = new Date(viewDate.value)
  newDate.setFullYear(newDate.getFullYear() + delta * 20)
  viewDate.value = newDate
}

function prevPeriod() {
  if (!canNavigatePrev.value) return
  if (viewMode.value === 'year') navigateYearGrid(-1)
  else if (viewMode.value === 'month') navigateYear(-1)
  else navigateMonth(-1)
}

function nextPeriod() {
  if (!canNavigateNext.value) return
  if (viewMode.value === 'year') navigateYearGrid(1)
  else if (viewMode.value === 'month') navigateYear(1)
  else navigateMonth(1)
}

function toggleViewMode() {
  if (viewMode.value === 'day') {
    viewMode.value = 'year'
  } else if (viewMode.value === 'year') {
    viewMode.value = 'day'
  } else {
    viewMode.value = 'day'
  }
}

function selectYear(year: number) {
  viewDate.value = new Date(year, viewMonth.value, 1)
  viewMode.value = 'month'
}

function selectMonth(monthIndex: number) {
  viewDate.value = new Date(viewYear.value, monthIndex, 1)
  viewMode.value = 'day'
}

function isYearDisabled(year: number): boolean {
  if (minDate.value && year < minDate.value.getFullYear()) return true
  if (maxDate.value && year > maxDate.value.getFullYear()) return true
  return false
}

function isMonthDisabled(monthIndex: number): boolean {
  if (minDate.value) {
    if (viewYear.value < minDate.value.getFullYear()) return true
    if (viewYear.value === minDate.value.getFullYear() && monthIndex < minDate.value.getMonth()) return true
  }
  if (maxDate.value) {
    if (viewYear.value > maxDate.value.getFullYear()) return true
    if (viewYear.value === maxDate.value.getFullYear() && monthIndex > maxDate.value.getMonth()) return true
  }
  return false
}

function selectDate(day: CalendarDay) {
  if (!isDateInRange(day.date, minDate.value, maxDate.value)) return

  if (props.mode === 'range') {
    if (rangeState.value === 'idle') {
      rangeState.value = 'selecting'
      rangeStart.value = day.date
    } else {
      const [start, end] = normalizeRange(rangeStart.value!, day.date)
      emit('update:modelValue', [formatDate(start), formatDate(end)])
      rangeState.value = 'idle'
      rangeStart.value = null
      hoverDate.value = null
      closeCalendar()
    }
  } else {
    emit('update:modelValue', formatDate(day.date))
    closeCalendar()
  }
}

function applyPreset(startDate: Date, endDate: Date) {
  if (props.mode === 'range') {
    const [start, end] = normalizeRange(startDate, endDate)
    emit('update:modelValue', [formatDate(start), formatDate(end)])
    closeCalendar()
  }
}

function handleDayHover(day: CalendarDay) {
  if (props.mode === 'range' && rangeState.value === 'selecting') {
    hoverDate.value = day.date
  }
}

function handleDayLeave() {
  if (props.mode === 'range') {
    hoverDate.value = null
  }
}

function isDayDisabled(day: CalendarDay): boolean {
  return !isDateInRange(day.date, minDate.value, maxDate.value)
}

function isDaySelected(day: CalendarDay): boolean {
  if (props.mode === 'range') {
    const { start, end } = selectedRange.value
    return isSameDate(day.date, start) || isSameDate(day.date, end)
  }
  return isSameDate(day.date, selectedDate.value)
}

function isDayToday(day: CalendarDay): boolean {
  return isSameDate(day.date, today)
}

function getDayRangeClass(day: CalendarDay): string | null {
  if (props.mode !== 'range') return null

  if (rangeState.value === 'selecting' && rangeStart.value) {
    return getRangeClass(day.date, rangeStart.value, null, hoverDate.value)
  }

  const { start, end } = selectedRange.value
  return getRangeClass(day.date, start, end, null)
}

function handleKeydown(event: KeyboardEvent) {
  if (!calendarRef.value || viewMode.value !== 'day') return

  const buttons = Array.from(
    calendarRef.value.querySelectorAll<HTMLButtonElement>('.ui-datepicker__day:not([disabled])')
  )
  const currentIndex = buttons.findIndex((btn) => btn === document.activeElement)
  if (currentIndex === -1) return

  let targetIndex = -1

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      targetIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1
      break
    case 'ArrowRight':
      event.preventDefault()
      targetIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0
      break
    case 'ArrowUp':
      event.preventDefault()
      targetIndex = currentIndex >= 7 ? currentIndex - 7 : currentIndex + 35
      while (targetIndex >= buttons.length) targetIndex -= 7
      break
    case 'ArrowDown':
      event.preventDefault()
      targetIndex = currentIndex + 7 < buttons.length ? currentIndex + 7 : currentIndex - 35
      while (targetIndex < 0) targetIndex += 7
      break
    case 'Home':
      event.preventDefault()
      targetIndex = 0
      break
    case 'End':
      event.preventDefault()
      targetIndex = buttons.length - 1
      break
    case 'Escape':
      event.preventDefault()
      closeCalendar()
      return
  }

  if (targetIndex >= 0 && targetIndex < buttons.length) {
    buttons[targetIndex].focus()
  }
}

function openCalendar() {
  if (props.disabled) return

  viewMode.value = 'day'
  rangeState.value = 'idle'
  rangeStart.value = null
  hoverDate.value = null
  inputError.value = ''

  if (props.mode === 'range') {
    const { start } = selectedRange.value
    viewDate.value = start ? new Date(start) : new Date()
    inputValue.value = ''
  } else {
    viewDate.value = selectedDate.value ? new Date(selectedDate.value) : new Date()
    inputValue.value = selectedDate.value ? formatDate(selectedDate.value) : ''
  }

  if (isMobile.value) {
    isOpen.value = true
    document.body.style.overflow = 'hidden'
    nextTick(() => focusCalendar())
  } else {
    popoverRef.value?.open()
  }
}

function closeCalendar() {
  viewMode.value = 'day'
  rangeState.value = 'idle'
  rangeStart.value = null
  hoverDate.value = null
  inputError.value = ''

  if (isMobile.value) {
    isOpen.value = false
    document.body.style.overflow = ''
    triggerRef.value?.focus()
  } else {
    popoverRef.value?.close()
  }
}

function handlePopoverOpen() {
  nextTick(() => focusCalendar())
}

function handlePopoverClose() {
  viewMode.value = 'day'
  rangeState.value = 'idle'
  rangeStart.value = null
  hoverDate.value = null
  inputError.value = ''
}

function focusCalendar() {
  if (viewMode.value !== 'day') return

  const selectedButton = calendarRef.value?.querySelector<HTMLButtonElement>(
    '.ui-datepicker__day--selected, .ui-datepicker__day--range-start'
  )
  const todayButton = calendarRef.value?.querySelector<HTMLButtonElement>(
    '.ui-datepicker__day--today'
  )
  const firstButton = calendarRef.value?.querySelector<HTMLButtonElement>(
    '.ui-datepicker__day:not([disabled])'
  )
  ;(selectedButton || todayButton || firstButton)?.focus()
}

function handleOverlayClick(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('ui-datepicker-sheet__overlay')) {
    closeCalendar()
  }
}

function handleTriggerClick() {
  if (isOpen.value) {
    closeCalendar()
  } else {
    openCalendar()
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openCalendar()
  }
}

function handleInputFocus() {
  if (!isOpen.value) {
    openCalendar()
  }
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
}

function handleInputBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement | null
  const popoverContent = calendarRef.value?.closest('.ui-popover__content')
  if (popoverContent && relatedTarget && popoverContent.contains(relatedTarget)) {
    return
  }
  validateAndApplyInput(false)
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    validateAndApplyInput(true)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeCalendar()
  }
}

function validateAndApplyInput(shouldClose: boolean) {
  if (!inputValue.value) {
    inputError.value = ''
    return
  }

  const parsed = parseDate(inputValue.value)
  if (!parsed) {
    inputError.value = 'Invalid date format (use YYYY-MM-DD)'
    return
  }

  if (!isDateInRange(parsed, minDate.value, maxDate.value)) {
    inputError.value = 'Date is outside allowed range'
    return
  }

  inputError.value = ''
  emit('update:modelValue', formatDate(parsed))
  viewDate.value = new Date(parsed)
  if (shouldClose) {
    closeCalendar()
  }
}

const iconSizeMap: Record<string, string> = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)'
}
const iconSize = computed(() => iconSizeMap[props.size])

function getFocusedDayIndex(): number {
  if (props.mode === 'range') {
    const { start } = selectedRange.value
    if (start) {
      const idx = calendarGrid.value.findIndex((d) => isSameDate(d.date, start))
      if (idx !== -1) return idx
    }
  } else if (selectedDate.value) {
    const idx = calendarGrid.value.findIndex((d) => isSameDate(d.date, selectedDate.value))
    if (idx !== -1) return idx
  }

  const todayIdx = calendarGrid.value.findIndex((d) => isSameDate(d.date, today))
  if (todayIdx !== -1) return todayIdx

  return calendarGrid.value.findIndex((d) => d.currentMonth)
}

const headerTitle = computed(() => {
  if (viewMode.value === 'year') return yearRangeLabel.value
  if (viewMode.value === 'month') return String(viewYear.value)
  return `${monthName.value} ${viewYear.value}`
})

defineExpose({
  open: openCalendar,
  close: closeCalendar,
  toggle: () => (isOpen.value || popoverRef.value ? closeCalendar() : openCalendar()),
  applyPreset
})
</script>

<template>
  <div
    class="ui-datepicker-field"
    :class="[
      `ui-datepicker-field--${size}`,
      {
        'ui-datepicker-field--block': block,
        'ui-datepicker-field--disabled': disabled,
        'ui-datepicker-field--error': error || inputError
      }
    ]"
  >
    <label v-if="label" :for="inputId" class="ui-datepicker-field__label">
      {{ label }}
      <span v-if="required" class="ui-datepicker-field__required" aria-hidden="true">*</span>
    </label>

    <!-- Desktop: Popover -->
    <Popover
      v-if="!isMobile"
      ref="popoverRef"
      placement="bottom-start"
      :disabled="disabled"
      :width="mode === 'range' ? 'auto' : 308"
      :close-on-escape="true"
      :close-on-click-outside="true"
      :trap-focus="true"
      @open="handlePopoverOpen"
      @close="handlePopoverClose"
    >
      <template #trigger>
        <div
          ref="triggerRef"
          class="ui-datepicker-trigger"
          :class="[
            `ui-datepicker-trigger--${size}`,
            {
              'ui-datepicker-trigger--disabled': disabled,
              'ui-datepicker-trigger--error': error || inputError,
              'ui-datepicker-trigger--has-value': hasValue
            }
          ]"
        >
          <!-- Editable input on desktop (single mode only) -->
          <input
            v-if="hasPointer && mode === 'single'"
            ref="inputRef"
            :id="inputId"
            type="text"
            class="ui-datepicker-trigger__input"
            :value="inputValue || displayValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :aria-describedby="describedBy"
            :aria-invalid="(error || inputError) ? 'true' : undefined"
            autocomplete="off"
            @click.stop
            @focus="handleInputFocus"
            @input="handleInputChange"
            @blur="handleInputBlur"
            @keydown="handleInputKeydown"
          />
          <!-- Non-editable trigger for touch or range mode -->
          <div
            v-else
            :id="inputId"
            role="combobox"
            aria-haspopup="grid"
            :aria-expanded="false"
            :aria-controls="gridId"
            :aria-describedby="describedBy"
            :aria-invalid="(error || inputError) ? 'true' : undefined"
            :aria-disabled="disabled"
            tabindex="0"
            class="ui-datepicker-trigger__value-wrapper"
            @click.stop="openCalendar"
            @keydown="handleTriggerKeydown"
          >
            <span class="ui-datepicker-trigger__value">
              {{ displayValue || placeholder }}
            </span>
          </div>
          <Icon :icon="calendarIcon" :size="iconSize" class="ui-datepicker-trigger__icon" @click.stop="openCalendar" />
          <input
            v-if="mode === 'single'"
            type="hidden"
            :name="name"
            :value="modelValue"
            :required="required"
          />
          <template v-else-if="name">
            <input
              type="hidden"
              :name="`${name}[0]`"
              :value="(modelValue as [string, string])?.[0] || ''"
            />
            <input
              type="hidden"
              :name="`${name}[1]`"
              :value="(modelValue as [string, string])?.[1] || ''"
            />
          </template>
        </div>
      </template>

      <template #default>
        <div class="ui-datepicker-content" :class="{ 'ui-datepicker-content--with-sidebar': mode === 'range' && $slots.sidebar }">
          <!-- Sidebar slot for presets -->
          <div v-if="mode === 'range' && $slots.sidebar" class="ui-datepicker-sidebar">
            <slot name="sidebar" :apply-preset="applyPreset" />
          </div>

          <div class="ui-datepicker" role="application" aria-label="Date picker">
            <div class="ui-datepicker__header">
              <Button
                variant="ghost"
                size="sm"
                :icon-left="chevronLeftIcon"
                :disabled="!canNavigatePrev"
                aria-label="Previous"
                @click="prevPeriod"
              />
              <button
                type="button"
                class="ui-datepicker__title-btn"
                aria-live="polite"
                @click="toggleViewMode"
              >
                {{ headerTitle }}
              </button>
              <Button
                variant="ghost"
                size="sm"
                :icon-left="chevronRightIcon"
                :disabled="!canNavigateNext"
                aria-label="Next"
                @click="nextPeriod"
              />
            </div>

            <!-- Year Grid -->
            <div v-if="viewMode === 'year'" class="ui-datepicker__year-grid">
              <button
                v-for="year in yearGrid"
                :key="year"
                type="button"
                class="ui-datepicker__year"
                :class="{
                  'ui-datepicker__year--selected': year === viewYear,
                  'ui-datepicker__year--current': year === today.getFullYear()
                }"
                :disabled="isYearDisabled(year)"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>

            <!-- Month Grid -->
            <div v-else-if="viewMode === 'month'" class="ui-datepicker__month-grid">
              <button
                v-for="(month, index) in monthNames"
                :key="index"
                type="button"
                class="ui-datepicker__month"
                :class="{
                  'ui-datepicker__month--selected': index === viewMonth,
                  'ui-datepicker__month--current': index === today.getMonth() && viewYear === today.getFullYear()
                }"
                :disabled="isMonthDisabled(index)"
                @click="selectMonth(index)"
              >
                {{ month }}
              </button>
            </div>

            <!-- Day Grid -->
            <template v-else>
              <div class="ui-datepicker__weekdays" role="row">
                <span
                  v-for="day in weekdays"
                  :key="day"
                  class="ui-datepicker__weekday"
                  role="columnheader"
                  :abbr="day"
                >
                  {{ day }}
                </span>
              </div>

              <div
                ref="calendarRef"
                :id="gridId"
                class="ui-datepicker__grid"
                role="grid"
                :aria-label="`${monthName} ${viewYear}`"
                @keydown="handleKeydown"
              >
                <button
                  v-for="(day, index) in calendarGrid"
                  :key="index"
                  type="button"
                  class="ui-datepicker__day"
                  :class="[
                    {
                      'ui-datepicker__day--other-month': !day.currentMonth,
                      'ui-datepicker__day--selected': isDaySelected(day),
                      'ui-datepicker__day--today': isDayToday(day),
                      'ui-datepicker__day--disabled': isDayDisabled(day)
                    },
                    getDayRangeClass(day) ? `ui-datepicker__day--range-${getDayRangeClass(day)}` : ''
                  ]"
                  role="gridcell"
                  :disabled="isDayDisabled(day)"
                  :aria-selected="isDaySelected(day) || undefined"
                  :aria-current="isDayToday(day) ? 'date' : undefined"
                  :aria-disabled="isDayDisabled(day) || undefined"
                  :tabindex="index === getFocusedDayIndex() ? 0 : -1"
                  @click="selectDate(day)"
                  @mouseenter="handleDayHover(day)"
                  @mouseleave="handleDayLeave"
                >
                  {{ day.day }}
                </button>
              </div>

              <div v-if="mode === 'range' && rangeState === 'selecting'" class="ui-datepicker__hint">
                Select end date
              </div>
            </template>
          </div>
        </div>
      </template>
    </Popover>

    <!-- Mobile: Trigger only (sheet is separate) -->
    <div
      v-else
      ref="triggerRef"
      :id="inputId"
      class="ui-datepicker-trigger"
      :class="[
        `ui-datepicker-trigger--${size}`,
        {
          'ui-datepicker-trigger--disabled': disabled,
          'ui-datepicker-trigger--error': error,
          'ui-datepicker-trigger--has-value': hasValue
        }
      ]"
      role="combobox"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-controls="gridId"
      :aria-describedby="describedBy"
      :aria-invalid="error ? 'true' : undefined"
      :aria-disabled="disabled"
      tabindex="0"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <span class="ui-datepicker-trigger__value">
        {{ displayValue || placeholder }}
      </span>
      <Icon :icon="calendarIcon" :size="iconSize" class="ui-datepicker-trigger__icon" />
      <input
        v-if="mode === 'single'"
        type="hidden"
        :name="name"
        :value="modelValue"
        :required="required"
      />
      <template v-else-if="name">
        <input
          type="hidden"
          :name="`${name}[0]`"
          :value="(modelValue as [string, string])?.[0] || ''"
        />
        <input
          type="hidden"
          :name="`${name}[1]`"
          :value="(modelValue as [string, string])?.[1] || ''"
        />
      </template>
    </div>

    <!-- Mobile: Bottom Sheet -->
    <Teleport to="body">
      <Transition name="ui-datepicker-sheet">
        <div
          v-if="isMobile && isOpen"
          class="ui-datepicker-sheet__overlay"
          @click="handleOverlayClick"
        >
          <div
            class="ui-datepicker-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Date picker"
          >
            <div class="ui-datepicker-sheet__header">
              <span class="ui-datepicker-sheet__title">
                {{ label || (mode === 'range' ? 'Select dates' : 'Select date') }}
              </span>
              <Button
                variant="ghost"
                size="sm"
                :icon-left="closeIcon"
                aria-label="Close"
                @click="closeCalendar"
              />
            </div>

            <!-- Mobile sidebar for range presets -->
            <div v-if="mode === 'range' && $slots.sidebar" class="ui-datepicker-sheet__presets">
              <slot name="sidebar" :apply-preset="applyPreset" />
            </div>

            <div class="ui-datepicker ui-datepicker--mobile">
              <div class="ui-datepicker__header">
                <Button
                  variant="ghost"
                  size="md"
                  :icon-left="chevronLeftIcon"
                  :disabled="!canNavigatePrev"
                  aria-label="Previous"
                  @click="prevPeriod"
                />
                <button
                  type="button"
                  class="ui-datepicker__title-btn"
                  aria-live="polite"
                  @click="toggleViewMode"
                >
                  {{ headerTitle }}
                </button>
                <Button
                  variant="ghost"
                  size="md"
                  :icon-left="chevronRightIcon"
                  :disabled="!canNavigateNext"
                  aria-label="Next"
                  @click="nextPeriod"
                />
              </div>

              <!-- Year Grid (Mobile) -->
              <div v-if="viewMode === 'year'" class="ui-datepicker__year-grid ui-datepicker__year-grid--mobile">
                <button
                  v-for="year in yearGrid"
                  :key="year"
                  type="button"
                  class="ui-datepicker__year"
                  :class="{
                    'ui-datepicker__year--selected': year === viewYear,
                    'ui-datepicker__year--current': year === today.getFullYear()
                  }"
                  :disabled="isYearDisabled(year)"
                  @click="selectYear(year)"
                >
                  {{ year }}
                </button>
              </div>

              <!-- Month Grid (Mobile) -->
              <div v-else-if="viewMode === 'month'" class="ui-datepicker__month-grid ui-datepicker__month-grid--mobile">
                <button
                  v-for="(month, index) in monthNames"
                  :key="index"
                  type="button"
                  class="ui-datepicker__month"
                  :class="{
                    'ui-datepicker__month--selected': index === viewMonth,
                    'ui-datepicker__month--current': index === today.getMonth() && viewYear === today.getFullYear()
                  }"
                  :disabled="isMonthDisabled(index)"
                  @click="selectMonth(index)"
                >
                  {{ month }}
                </button>
              </div>

              <!-- Day Grid (Mobile) -->
              <template v-else>
                <div class="ui-datepicker__weekdays" role="row">
                  <span
                    v-for="day in weekdays"
                    :key="day"
                    class="ui-datepicker__weekday"
                    role="columnheader"
                    :abbr="day"
                  >
                    {{ day }}
                  </span>
                </div>

                <div
                  ref="calendarRef"
                  :id="gridId"
                  class="ui-datepicker__grid"
                  role="grid"
                  :aria-label="`${monthName} ${viewYear}`"
                  @keydown="handleKeydown"
                >
                  <button
                    v-for="(day, index) in calendarGrid"
                    :key="index"
                    type="button"
                    class="ui-datepicker__day"
                    :class="[
                      {
                        'ui-datepicker__day--other-month': !day.currentMonth,
                        'ui-datepicker__day--selected': isDaySelected(day),
                        'ui-datepicker__day--today': isDayToday(day),
                        'ui-datepicker__day--disabled': isDayDisabled(day)
                      },
                      getDayRangeClass(day) ? `ui-datepicker__day--range-${getDayRangeClass(day)}` : ''
                    ]"
                    role="gridcell"
                    :disabled="isDayDisabled(day)"
                    :aria-selected="isDaySelected(day) || undefined"
                    :aria-current="isDayToday(day) ? 'date' : undefined"
                    :aria-disabled="isDayDisabled(day) || undefined"
                    :tabindex="index === getFocusedDayIndex() ? 0 : -1"
                    @click="selectDate(day)"
                  >
                    {{ day.day }}
                  </button>
                </div>

                <div v-if="mode === 'range' && rangeState === 'selecting'" class="ui-datepicker__hint">
                  Select end date
                </div>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <p
      v-if="error || inputError"
      :id="errorId"
      class="ui-datepicker-field__message ui-datepicker-field__message--error"
      role="alert"
    >
      {{ error || inputError }}
    </p>
    <p
      v-else-if="hint"
      :id="hintId"
      class="ui-datepicker-field__message ui-datepicker-field__message--hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.ui-datepicker-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-family: var(--font-sans);
}

.ui-datepicker-field--block {
  width: 100%;
}

.ui-datepicker-field__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--input-label);
  line-height: var(--leading-tight);
}

.ui-datepicker-field__required {
  color: var(--input-error);
  margin-left: var(--space-1);
}

.ui-datepicker-field__message {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  margin: 0;
}

.ui-datepicker-field__message--hint {
  color: var(--input-hint);
}

.ui-datepicker-field__message--error {
  color: var(--input-error);
}

.ui-datepicker-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-default),
    box-shadow var(--duration-fast) var(--ease-default);
}

.ui-datepicker-trigger:focus-within {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring);
}

.ui-datepicker-trigger:not(.ui-datepicker-trigger--disabled):hover {
  border-color: var(--input-border-hover);
}

.ui-datepicker-trigger--error {
  border-color: var(--input-border-error);
}

.ui-datepicker-trigger--error:focus-within {
  border-color: var(--input-border-error);
  box-shadow: 0 0 0 3px var(--input-ring-error);
}

.ui-datepicker-trigger--disabled {
  background-color: var(--input-bg-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-datepicker-trigger--xs {
  height: var(--input-height-xs);
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.ui-datepicker-trigger--sm {
  height: var(--input-height-sm);
  padding: 0 var(--space-2);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.ui-datepicker-trigger--md {
  height: var(--input-height-md);
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.ui-datepicker-trigger--lg {
  height: var(--input-height-lg);
  padding: 0 var(--space-3);
  font-size: var(--text-base);
  border-radius: var(--radius-md);
}

.ui-datepicker-trigger--xl {
  height: var(--input-height-xl);
  padding: 0 var(--space-4);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
}

.ui-datepicker-trigger__input {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  color: var(--input-text);
  outline: none;
  padding: 0;
}

.ui-datepicker-trigger__input::placeholder {
  color: var(--input-placeholder);
}

.ui-datepicker-trigger__value-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  outline: none;
}

.ui-datepicker-trigger__value {
  flex: 1;
  text-align: left;
  color: var(--input-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-datepicker-trigger:not(.ui-datepicker-trigger--has-value) .ui-datepicker-trigger__value {
  color: var(--input-placeholder);
}

.ui-datepicker-trigger__icon {
  flex-shrink: 0;
  color: var(--input-icon);
  margin-left: var(--space-2);
  cursor: pointer;
}

/* Content layout with optional sidebar */
.ui-datepicker-content {
  display: flex;
}

.ui-datepicker-content--with-sidebar {
  min-width: 420px;
}

.ui-datepicker-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-2);
  border-right: 1px solid var(--border-default);
  min-width: 140px;
}

/* Calendar shared styles */
.ui-datepicker {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 280px;
}

.ui-datepicker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.ui-datepicker__title-btn {
  flex: 1;
  text-align: center;
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  color: var(--text-primary);
  background: transparent;
  border: none;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.ui-datepicker__title-btn:hover {
  background-color: var(--action-secondary);
}

.ui-datepicker__title-btn:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-datepicker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
}

.ui-datepicker__weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.ui-datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
}

.ui-datepicker__day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.ui-datepicker__day:hover:not(:disabled):not(.ui-datepicker__day--selected):not(.ui-datepicker__day--range-start):not(.ui-datepicker__day--range-end) {
  background-color: var(--action-secondary);
}

.ui-datepicker__day:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
  z-index: 1;
}

.ui-datepicker__day--other-month {
  color: var(--text-quaternary);
  opacity: 0.5;
}

.ui-datepicker__day--today:not(.ui-datepicker__day--selected):not(.ui-datepicker__day--range-start):not(.ui-datepicker__day--range-end) {
  font-weight: var(--font-semibold);
  color: var(--action-primary);
}

.ui-datepicker__day--selected,
.ui-datepicker__day--range-start,
.ui-datepicker__day--range-end {
  background-color: var(--action-primary);
  color: var(--action-primary-text);
  font-weight: var(--font-medium);
}

.ui-datepicker__day--selected:hover,
.ui-datepicker__day--range-start:hover,
.ui-datepicker__day--range-end:hover {
  background-color: var(--action-primary-hover);
}

.ui-datepicker__day--range-in-range {
  background-color: var(--action-primary-subtle, oklch(from var(--action-primary) l c h / 0.15));
  border-radius: 0;
}

.ui-datepicker__day--range-start {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.ui-datepicker__day--range-end {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.ui-datepicker__day--range-start.ui-datepicker__day--range-end {
  border-radius: var(--radius-md);
}

.ui-datepicker__day--disabled,
.ui-datepicker__day:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-datepicker__hint {
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  padding-top: var(--space-1);
}

/* Year Grid */
.ui-datepicker__year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-1);
}

.ui-datepicker__year {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.ui-datepicker__year:hover:not(:disabled):not(.ui-datepicker__year--selected) {
  background-color: var(--action-secondary);
}

.ui-datepicker__year:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-datepicker__year--current:not(.ui-datepicker__year--selected) {
  font-weight: var(--font-semibold);
  color: var(--action-primary);
}

.ui-datepicker__year--selected {
  background-color: var(--action-primary);
  color: var(--action-primary-text);
  font-weight: var(--font-medium);
}

.ui-datepicker__year:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

/* Month Grid */
.ui-datepicker__month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-1);
}

.ui-datepicker__month {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-default),
    color var(--duration-fast) var(--ease-default);
}

.ui-datepicker__month:hover:not(:disabled):not(.ui-datepicker__month--selected) {
  background-color: var(--action-secondary);
}

.ui-datepicker__month:focus-visible {
  outline: 2px solid var(--ring-color);
  outline-offset: 2px;
}

.ui-datepicker__month--current:not(.ui-datepicker__month--selected) {
  font-weight: var(--font-semibold);
  color: var(--action-primary);
}

.ui-datepicker__month--selected {
  background-color: var(--action-primary);
  color: var(--action-primary-text);
  font-weight: var(--font-medium);
}

.ui-datepicker__month:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

/* Mobile sheet styles */
.ui-datepicker-sheet__overlay {
  position: fixed;
  inset: 0;
  background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
  z-index: var(--z-modal, 100);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ui-datepicker-sheet {
  width: 100%;
  max-height: 85vh;
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ui-datepicker-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-default);
}

.ui-datepicker-sheet__title {
  font-weight: var(--font-semibold);
  font-size: var(--text-md);
  color: var(--text-primary);
}

.ui-datepicker-sheet__presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-default);
}

.ui-datepicker--mobile {
  padding: var(--space-4);
}

.ui-datepicker--mobile .ui-datepicker__title-btn {
  font-size: var(--text-md);
}

.ui-datepicker--mobile .ui-datepicker__day {
  width: 100%;
  height: 2.75rem;
  font-size: var(--text-md);
}

.ui-datepicker--mobile .ui-datepicker__weekday {
  height: 2.5rem;
  font-size: var(--text-sm);
}

.ui-datepicker__year-grid--mobile .ui-datepicker__year,
.ui-datepicker__month-grid--mobile .ui-datepicker__month {
  height: 3rem;
  font-size: var(--text-md);
}

/* Sheet transitions */
.ui-datepicker-sheet-enter-active,
.ui-datepicker-sheet-leave-active {
  transition: opacity var(--duration-normal) var(--ease-default);
}

.ui-datepicker-sheet-enter-active .ui-datepicker-sheet,
.ui-datepicker-sheet-leave-active .ui-datepicker-sheet {
  transition: transform var(--duration-normal) var(--ease-default);
}

.ui-datepicker-sheet-enter-from,
.ui-datepicker-sheet-leave-to {
  opacity: 0;
}

.ui-datepicker-sheet-enter-from .ui-datepicker-sheet,
.ui-datepicker-sheet-leave-to .ui-datepicker-sheet {
  transform: translateY(100%);
}

/* Label size variants */
.ui-datepicker-field--xs .ui-datepicker-field__label {
  font-size: var(--text-xs);
}

.ui-datepicker-field--sm .ui-datepicker-field__label,
.ui-datepicker-field--md .ui-datepicker-field__label {
  font-size: var(--text-sm);
}

.ui-datepicker-field--lg .ui-datepicker-field__label,
.ui-datepicker-field--xl .ui-datepicker-field__label {
  font-size: var(--text-md);
}
</style>
