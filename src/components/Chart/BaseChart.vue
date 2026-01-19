<script setup lang="ts">
import {
  ref,
  shallowRef,
  watch,
  onMounted,
  onUnmounted,
  computed,
  nextTick
} from 'vue'
import {
  Chart,
  registerables,
  type ChartType,
  type ChartData,
  type ChartOptions,
  type TooltipModel
} from 'chart.js'
import { useChartTheme } from './useChartTheme'

Chart.register(...registerables)

export interface ChartDataset {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean | string
  tension?: number
}

export interface TooltipData {
  title: string
  items: Array<{
    label: string
    value: string
    color: string
  }>
  x: number
  y: number
}

export interface LegendItem {
  label: string
  color: string
  hidden: boolean
  datasetIndex: number
}

export interface PointClickData {
  datasetIndex: number
  index: number
  label: string
  value: number | string
  datasetLabel: string
}

export interface BaseChartProps {
  /** Chart type (line, bar, doughnut, pie, etc.) */
  type: ChartType
  /** Chart.js data configuration */
  data: ChartData | Record<string, unknown>
  /** Chart.js options configuration */
  options?: ChartOptions | Record<string, unknown>
  /** Chart height */
  height?: string | number
  /** Accessible label for screen readers */
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseChartProps>(), {
  height: 300
})

const emit = defineEmits<{
  legendClick: [item: LegendItem, index: number]
  pointClick: [data: PointClickData]
}>()

defineSlots<{
  legend?: (props: { items: LegendItem[]; toggle: (index: number) => void }) => unknown
  tooltip?: (props: { data: TooltipData | null }) => unknown
  fallback?: () => unknown
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const chartInstance = shallowRef<Chart | null>(null)

const { theme, themeVersion, getDefaultOptions } = useChartTheme()

const tooltipData = ref<TooltipData | null>(null)
const legendItems = ref<LegendItem[]>([])

const heightStyle = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})

function buildLegendItems(): LegendItem[] {
  if (!chartInstance.value) return []

  const chart = chartInstance.value
  const datasets = chart.data.datasets

  return datasets.map((dataset, index) => ({
    label: dataset.label || `Dataset ${index + 1}`,
    color: Array.isArray(dataset.backgroundColor)
      ? dataset.backgroundColor[0]
      : (dataset.backgroundColor as string) || (dataset.borderColor as string) || theme.value.palette[index],
    hidden: !chart.isDatasetVisible(index),
    datasetIndex: index
  }))
}

function toggleDataset(index: number) {
  if (!chartInstance.value) return

  const chart = chartInstance.value
  const isVisible = chart.isDatasetVisible(index)
  chart.setDatasetVisibility(index, !isVisible)
  chart.update()
  legendItems.value = buildLegendItems()

  emit('legendClick', legendItems.value[index], index)
}

function externalTooltipHandler(context: { chart: Chart; tooltip: TooltipModel<ChartType> }) {
  const { chart, tooltip } = context

  // Hide tooltip when not active
  if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
    tooltipData.value = null
    return
  }

  const position = chart.canvas.getBoundingClientRect()
  const items = tooltip.dataPoints.map((point) => ({
    label: point.dataset.label || '',
    value: String(point.formattedValue),
    color: (point.dataset.borderColor as string) ||
           (Array.isArray(point.dataset.backgroundColor)
             ? point.dataset.backgroundColor[point.dataIndex]
             : point.dataset.backgroundColor as string) || ''
  }))

  tooltipData.value = {
    title: tooltip.title?.[0] || '',
    items,
    x: position.left + tooltip.caretX,
    y: position.top + tooltip.caretY
  }
}

function handleChartClick(event: MouseEvent) {
  if (!chartInstance.value || !canvasRef.value) return

  const chart = chartInstance.value
  const elements = chart.getElementsAtEventForMode(
    event,
    'nearest',
    { intersect: true },
    false
  )

  if (elements.length > 0) {
    const element = elements[0]
    const datasetIndex = element.datasetIndex
    const index = element.index
    const dataset = chart.data.datasets[datasetIndex]
    const labels = chart.data.labels || []
    const value = Array.isArray(dataset.data[index])
      ? dataset.data[index]
      : dataset.data[index]

    emit('pointClick', {
      datasetIndex,
      index,
      label: String(labels[index] || ''),
      value: value as number | string,
      datasetLabel: dataset.label || ''
    })
  }
}

function mergeOptions(): ChartOptions {
  const defaults = getDefaultOptions() as Record<string, unknown>
  const userOptions = (props.options || {}) as Record<string, unknown>

  const defaultPlugins = (defaults.plugins || {}) as Record<string, unknown>
  const userPlugins = (userOptions.plugins || {}) as Record<string, unknown>

  const merged: Record<string, unknown> = {
    ...defaults,
    ...userOptions,
    plugins: {
      ...defaultPlugins,
      ...userPlugins,
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
        mode: 'index',
        intersect: false,
        animation: false,
        ...(userPlugins.tooltip as Record<string, unknown> || {})
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
      ...(userOptions.interaction as Record<string, unknown> || {})
    }
  }

  if (props.type !== 'doughnut' && props.type !== 'pie') {
    merged.scales = {
      ...(defaults.scales as Record<string, unknown> || {}),
      ...(userOptions.scales as Record<string, unknown> || {})
    }
  }

  return merged as ChartOptions
}

function createChart() {
  if (!canvasRef.value) return

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  chartInstance.value = new Chart(canvasRef.value, {
    type: props.type,
    data: props.data as ChartData,
    options: mergeOptions() as ChartOptions
  })

  legendItems.value = buildLegendItems()
}

function updateChart() {
  if (!chartInstance.value) return

  chartInstance.value.data = props.data as ChartData
  chartInstance.value.options = mergeOptions() as ChartOptions
  chartInstance.value.update()
  legendItems.value = buildLegendItems()
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  createChart()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      chartInstance.value?.resize()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chartInstance.value?.destroy()
  chartInstance.value = null
})

watch(() => props.data, updateChart, { deep: true })
watch(() => props.type, createChart)
watch(themeVersion, () => {
  nextTick(updateChart)
})

defineExpose({
  chart: chartInstance,
  toggleDataset,
  legendItems
})
</script>

<template>
  <div class="ui-chart" ref="containerRef">
    <!-- Custom Legend Slot -->
    <slot name="legend" :items="legendItems" :toggle="toggleDataset" />

    <!-- Chart Container -->
    <div class="ui-chart__canvas-container" :style="{ height: heightStyle }">
      <canvas ref="canvasRef" :aria-label="ariaLabel" role="img" @click="handleChartClick">
        <!-- Accessibility Fallback Table -->
        <slot name="fallback">
          <table class="ui-chart__sr-table">
            <caption>{{ ariaLabel || 'Chart data' }}</caption>
            <thead>
              <tr>
                <th scope="col">Label</th>
                <th
                  v-for="(dataset, index) in (data as ChartData).datasets || []"
                  :key="index"
                  scope="col"
                >
                  {{ (dataset as ChartDataset).label || `Series ${index + 1}` }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(label, labelIndex) in (data as ChartData).labels || []"
                :key="labelIndex"
              >
                <th scope="row">{{ label }}</th>
                <td
                  v-for="(dataset, datasetIndex) in (data as ChartData).datasets || []"
                  :key="datasetIndex"
                >
                  {{ (dataset as ChartDataset).data?.[labelIndex] }}
                </td>
              </tr>
            </tbody>
          </table>
        </slot>
      </canvas>
    </div>

    <!-- Custom Tooltip Slot -->
    <Teleport to="body">
      <slot name="tooltip" :data="tooltipData">
        <div
          v-if="tooltipData"
          class="ui-chart__tooltip"
          :style="{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`
          }"
        >
          <div v-if="tooltipData.title" class="ui-chart__tooltip-title">
            {{ tooltipData.title }}
          </div>
          <div
            v-for="(item, index) in tooltipData.items"
            :key="index"
            class="ui-chart__tooltip-item"
          >
            <span
              class="ui-chart__tooltip-color"
              :style="{ backgroundColor: item.color }"
            />
            <span class="ui-chart__tooltip-label">{{ item.label }}</span>
            <span class="ui-chart__tooltip-value">{{ item.value }}</span>
          </div>
        </div>
      </slot>
    </Teleport>
  </div>
</template>

<style scoped>
.ui-chart {
  width: 100%;
  font-family: var(--font-sans);
}

.ui-chart__canvas-container {
  position: relative;
  width: 100%;
}

.ui-chart__canvas-container canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Screen reader only table */
.ui-chart__sr-table {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<!-- Tooltip styles must be unscoped because content is teleported to body -->
<style>
.ui-chart__tooltip {
  position: fixed;
  z-index: var(--z-tooltip, 100);
  padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
  background-color: var(--chart-tooltip-bg, var(--tooltip-bg, #1c1917));
  color: var(--chart-tooltip-text, var(--tooltip-text, #fafaf9));
  border-radius: var(--radius-md, 0.375rem);
  font-size: var(--text-sm, 0.875rem);
  font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 8px));
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
  min-width: 120px;
}

.ui-chart__tooltip-title {
  font-weight: var(--font-medium, 500);
  margin-bottom: var(--space-1, 0.25rem);
  padding-bottom: var(--space-1, 0.25rem);
  border-bottom: 1px solid var(--chart-tooltip-border, rgba(255, 255, 255, 0.1));
}

.ui-chart__tooltip-item {
  display: flex;
  align-items: center;
  gap: var(--space-2, 0.5rem);
  padding: var(--space-1, 0.25rem) 0;
}

.ui-chart__tooltip-color {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-sm, 0.25rem);
  flex-shrink: 0;
}

.ui-chart__tooltip-label {
  flex: 1;
  opacity: 0.8;
}

.ui-chart__tooltip-value {
  font-weight: var(--font-medium, 500);
  font-variant-numeric: tabular-nums;
}

[data-theme='dark'] .ui-chart__tooltip {
  background-color: var(--chart-tooltip-bg, #fafaf9);
  color: var(--chart-tooltip-text, #1c1917);
}

[data-theme='dark'] .ui-chart__tooltip-title {
  border-bottom-color: var(--chart-tooltip-border, rgba(0, 0, 0, 0.1));
}
</style>
