<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import BaseChart from './BaseChart.vue'
import type { LegendItem, TooltipData, PointClickData } from './BaseChart.vue'
import { useChartTheme } from './useChartTheme'

type LineChartData = ChartData<'line'>
type LineChartOptions = ChartOptions<'line'>

export interface LineChartSeries {
  name: string
  data: number[]
}

export interface LineChartProps {
  /** X-axis labels */
  labels: string[]
  /** Data series */
  series: LineChartSeries[]
  /** Chart height */
  height?: string | number
  /** Show area fill under lines */
  fill?: boolean
  /** Line curve tension (0 = straight, 0.4 = smooth) */
  tension?: number
  /** Show points on the line */
  showPoints?: boolean
  /** Point radius */
  pointRadius?: number
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

const props = withDefaults(defineProps<LineChartProps>(), {
  height: 300,
  fill: false,
  tension: 0.4,
  showPoints: true,
  pointRadius: 4,
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

const { theme, getColor, getColorWithOpacity } = useChartTheme()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.series.map((series, index) => ({
    label: series.name,
    data: series.data,
    borderColor: getColor(index),
    backgroundColor: props.fill ? getColorWithOpacity(index, 0.1) : 'transparent',
    borderWidth: 2,
    fill: props.fill,
    tension: props.tension,
    pointRadius: props.showPoints ? props.pointRadius : 0,
    pointHoverRadius: props.showPoints ? props.pointRadius + 2 : 4,
    pointBackgroundColor: getColor(index),
    pointBorderColor: theme.value.colors.tooltipText,
    pointBorderWidth: 2
  }))
}) as LineChartData)

const chartOptions = computed(() => ({
  scales: {
    x: {
      display: props.showXAxis,
      grid: {
        display: false
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
      grid: {
        display: props.showGrid,
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
    intersect: false
  }
}) as LineChartOptions)
</script>

<template>
  <BaseChart
    type="line"
    :data="chartData"
    :options="chartOptions"
    :height="height"
    :aria-label="ariaLabel"
    @point-click="emit('pointClick', $event)"
  >
    <template v-if="showLegend || $slots.legend" #legend="{ items, toggle }">
      <slot name="legend" :items="items" :toggle="toggle">
        <div class="ui-line-chart__legend">
          <button
            v-for="(item, index) in items"
            :key="index"
            type="button"
            class="ui-line-chart__legend-item"
            :class="{ 'ui-line-chart__legend-item--hidden': item.hidden }"
            @click="toggle(index)"
          >
            <span
              class="ui-line-chart__legend-color"
              :style="{ backgroundColor: item.color }"
            />
            <span class="ui-line-chart__legend-label">{{ item.label }}</span>
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
.ui-line-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.ui-line-chart__legend-item {
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

.ui-line-chart__legend-item:hover {
  background-color: var(--color-stone-100);
}

[data-theme='dark'] .ui-line-chart__legend-item:hover {
  background-color: var(--color-stone-800);
}

.ui-line-chart__legend-item--hidden {
  opacity: 0.4;
}

.ui-line-chart__legend-item--hidden .ui-line-chart__legend-color {
  opacity: 0.3;
}

.ui-line-chart__legend-color {
  width: 12px;
  height: 3px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.ui-line-chart__legend-label {
  white-space: nowrap;
}
</style>
