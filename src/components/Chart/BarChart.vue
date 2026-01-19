<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import BaseChart from './BaseChart.vue'
import type { LegendItem, TooltipData, PointClickData } from './BaseChart.vue'
import { useChartTheme } from './useChartTheme'

type BarChartData = ChartData<'bar'>
type BarChartOptions = ChartOptions<'bar'>

export interface BarChartSeries {
  name: string
  data: number[]
}

export interface BarChartProps {
  /** X-axis labels */
  labels: string[]
  /** Data series */
  series: BarChartSeries[]
  /** Chart height */
  height?: string | number
  /** Horizontal bar orientation */
  horizontal?: boolean
  /** Stack bars on top of each other */
  stacked?: boolean
  /** Bar border radius */
  borderRadius?: number
  /** Show grid lines */
  showGrid?: boolean
  /** Show X axis */
  showXAxis?: boolean
  /** Show Y axis */
  showYAxis?: boolean
  /** Accessible label */
  ariaLabel?: string
  /** Show built-in legend */
  showLegend?: boolean
}

const props = withDefaults(defineProps<BarChartProps>(), {
  height: 300,
  horizontal: false,
  stacked: false,
  borderRadius: 4,
  showGrid: true,
  showXAxis: true,
  showYAxis: true,
  showLegend: true
})

defineSlots<{
  legend?: (props: { items: LegendItem[]; toggle: (index: number) => void }) => unknown
  tooltip?: (props: { data: TooltipData | null }) => unknown
}>()

const emit = defineEmits<{
  pointClick: [data: PointClickData]
}>()

const { theme, getColor } = useChartTheme()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.series.map((series, index) => ({
    label: series.name,
    data: series.data,
    backgroundColor: getColor(index),
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: props.borderRadius,
    borderSkipped: false as const
  }))
}) as BarChartData)

const chartOptions = computed(() => ({
  indexAxis: props.horizontal ? 'y' as const : 'x' as const,
  scales: {
    x: {
      display: props.showXAxis,
      stacked: props.stacked,
      grid: {
        display: props.horizontal ? props.showGrid : false,
        color: theme.value.colors.gridLines
      },
      border: {
        display: false
      },
      ticks: {
        color: theme.value.colors.textMuted,
        font: {
          family: theme.value.fontFamily,
          size: 12
        }
      }
    },
    y: {
      display: props.showYAxis,
      stacked: props.stacked,
      grid: {
        display: props.horizontal ? false : props.showGrid,
        color: theme.value.colors.gridLines
      },
      border: {
        display: false
      },
      ticks: {
        color: theme.value.colors.textMuted,
        font: {
          family: theme.value.fontFamily,
          size: 12
        }
      }
    }
  },
  interaction: {
    mode: 'index' as const,
    axis: props.horizontal ? 'y' as const : 'x' as const,
    intersect: false
  }
}) as BarChartOptions)
</script>

<template>
  <BaseChart
    type="bar"
    :data="chartData"
    :options="chartOptions"
    :height="height"
    :aria-label="ariaLabel"
    @point-click="emit('pointClick', $event)"
  >
    <template v-if="showLegend || $slots.legend" #legend="{ items, toggle }">
      <slot name="legend" :items="items" :toggle="toggle">
        <div class="ui-bar-chart__legend">
          <button
            v-for="(item, index) in items"
            :key="index"
            type="button"
            class="ui-bar-chart__legend-item"
            :class="{ 'ui-bar-chart__legend-item--hidden': item.hidden }"
            @click="toggle(index)"
          >
            <span
              class="ui-bar-chart__legend-color"
              :style="{ backgroundColor: item.color }"
            />
            <span class="ui-bar-chart__legend-label">{{ item.label }}</span>
          </button>
        </div>
      </slot>
    </template>
    <template #tooltip="{ data }">
      <slot name="tooltip" :data="data" />
    </template>
  </BaseChart>
</template>

<style scoped>
.ui-bar-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.ui-bar-chart__legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--chart-legend-text, var(--text-secondary));
  transition: opacity var(--duration-fast) var(--ease-default);
}

.ui-bar-chart__legend-item:hover {
  background-color: var(--color-stone-100);
}

[data-theme='dark'] .ui-bar-chart__legend-item:hover {
  background-color: var(--color-stone-800);
}

.ui-bar-chart__legend-item--hidden {
  opacity: 0.4;
}

.ui-bar-chart__legend-item--hidden .ui-bar-chart__legend-color {
  opacity: 0.3;
}

.ui-bar-chart__legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.ui-bar-chart__legend-label {
  white-space: nowrap;
}
</style>
