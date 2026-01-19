<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import BaseChart from './BaseChart.vue'
import type { LegendItem, TooltipData, PointClickData } from './BaseChart.vue'
import { useChartTheme } from './useChartTheme'

type DonutChartData = ChartData<'doughnut'>
type DonutChartOptions = ChartOptions<'doughnut'>

export interface DonutChartSegment {
  label: string
  value: number
  color?: string
}

export interface SegmentClickData {
  segment: DonutChartSegment
  index: number
  percentage: number
}

export interface DonutChartProps {
  /** Chart segments */
  segments: DonutChartSegment[]
  /** Chart height */
  height?: string | number
  /** Donut cutout percentage (0-100, 0 = pie chart) */
  cutout?: number
  /** Accessible label */
  ariaLabel?: string
  /** Show built-in legend */
  showLegend?: boolean
  /** Legend position */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** Center label (for donut charts) */
  centerLabel?: string
  /** Center value (for donut charts) */
  centerValue?: string
}

const props = withDefaults(defineProps<DonutChartProps>(), {
  height: 300,
  cutout: 65,
  showLegend: true,
  legendPosition: 'right'
})

defineSlots<{
  legend?: (props: { items: LegendItem[]; toggle: (index: number) => void }) => unknown
  tooltip?: (props: { data: TooltipData | null }) => unknown
  center?: () => unknown
}>()

const emit = defineEmits<{
  segmentClick: [data: SegmentClickData]
}>()

const { getColor } = useChartTheme()

const chartData = computed(() => ({
  labels: props.segments.map((s) => s.label),
  datasets: [
    {
      data: props.segments.map((s) => s.value),
      backgroundColor: props.segments.map((s, i) => s.color || getColor(i)),
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
}) as DonutChartData)

const chartOptions = computed(() => ({
  cutout: `${props.cutout}%`,
  plugins: {
    legend: {
      display: false
    }
  },
  interaction: {
    mode: 'nearest' as const,
    intersect: true
  }
}) as DonutChartOptions)

const total = computed(() =>
  props.segments.reduce((sum, s) => sum + s.value, 0)
)

const legendItems = computed<LegendItem[]>(() =>
  props.segments.map((segment, index) => ({
    label: segment.label,
    color: segment.color || getColor(index),
    hidden: false,
    datasetIndex: index
  }))
)

function formatPercent(value: number): string {
  return `${Math.round((value / total.value) * 100)}%`
}

function handlePointClick(data: PointClickData) {
  const index = data.index
  const segment = props.segments[index]
  if (segment) {
    emit('segmentClick', {
      segment,
      index,
      percentage: Math.round((segment.value / total.value) * 100)
    })
  }
}
</script>

<template>
  <div
    class="ui-donut-chart"
    :class="[`ui-donut-chart--legend-${legendPosition}`]"
  >
    <!-- Legend (conditional position) -->
    <slot v-if="showLegend && (legendPosition === 'top' || legendPosition === 'left')" name="legend" :items="legendItems" :toggle="() => {}">
      <div class="ui-donut-chart__legend">
        <div
          v-for="(segment, index) in segments"
          :key="index"
          class="ui-donut-chart__legend-item"
        >
          <span
            class="ui-donut-chart__legend-color"
            :style="{ backgroundColor: segment.color || getColor(index) }"
          />
          <span class="ui-donut-chart__legend-label">{{ segment.label }}</span>
          <span class="ui-donut-chart__legend-value">{{ formatPercent(segment.value) }}</span>
        </div>
      </div>
    </slot>

    <!-- Chart Container -->
    <div class="ui-donut-chart__container">
      <BaseChart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        :height="height"
        :aria-label="ariaLabel"
        @point-click="handlePointClick"
      >
        <template #legend>
          <!-- Disable BaseChart legend, we render our own -->
        </template>
        <template #tooltip="{ data }">
          <slot name="tooltip" :data="data" />
        </template>
      </BaseChart>

      <!-- Center Content -->
      <div v-if="centerLabel || centerValue || $slots.center" class="ui-donut-chart__center">
        <slot name="center">
          <div v-if="centerValue" class="ui-donut-chart__center-value">
            {{ centerValue }}
          </div>
          <div v-if="centerLabel" class="ui-donut-chart__center-label">
            {{ centerLabel }}
          </div>
        </slot>
      </div>
    </div>

    <!-- Legend (conditional position) -->
    <slot v-if="showLegend && (legendPosition === 'bottom' || legendPosition === 'right')" name="legend" :items="legendItems" :toggle="() => {}">
      <div class="ui-donut-chart__legend">
        <div
          v-for="(segment, index) in segments"
          :key="index"
          class="ui-donut-chart__legend-item"
        >
          <span
            class="ui-donut-chart__legend-color"
            :style="{ backgroundColor: segment.color || getColor(index) }"
          />
          <span class="ui-donut-chart__legend-label">{{ segment.label }}</span>
          <span class="ui-donut-chart__legend-value">{{ formatPercent(segment.value) }}</span>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.ui-donut-chart {
  display: flex;
  font-family: var(--font-sans);
}

.ui-donut-chart--legend-top,
.ui-donut-chart--legend-bottom {
  flex-direction: column;
  gap: var(--space-4);
}

.ui-donut-chart--legend-left,
.ui-donut-chart--legend-right {
  flex-direction: row;
  gap: var(--space-6);
  align-items: center;
}

.ui-donut-chart--legend-left {
  flex-direction: row-reverse;
}

.ui-donut-chart__container {
  position: relative;
  flex-shrink: 0;
}

.ui-donut-chart--legend-left .ui-donut-chart__container,
.ui-donut-chart--legend-right .ui-donut-chart__container {
  flex: 1;
  max-width: 50%;
}

.ui-donut-chart__center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.ui-donut-chart__center-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--chart-text, var(--text-primary));
  line-height: 1;
}

.ui-donut-chart__center-label {
  font-size: var(--text-sm);
  color: var(--chart-text-muted, var(--text-secondary));
  margin-top: var(--space-1);
}

.ui-donut-chart__legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ui-donut-chart--legend-top .ui-donut-chart__legend,
.ui-donut-chart--legend-bottom .ui-donut-chart__legend {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.ui-donut-chart__legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.ui-donut-chart__legend-color {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.ui-donut-chart__legend-label {
  color: var(--chart-legend-text, var(--text-secondary));
  flex: 1;
}

.ui-donut-chart__legend-value {
  color: var(--chart-text, var(--text-primary));
  font-weight: var(--font-medium);
  font-variant-numeric: tabular-nums;
}
</style>
