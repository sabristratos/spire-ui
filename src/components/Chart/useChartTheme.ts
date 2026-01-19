import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export interface ChartThemeColors {
  primary: string
  success: string
  warning: string
  error: string
  info: string
  text: string
  textMuted: string
  gridLines: string
  tooltipBg: string
  tooltipText: string
  tooltipBorder: string
  legendText: string
}

export interface ChartTheme {
  colors: ChartThemeColors
  fontFamily: string
  palette: string[]
}

function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function extractTheme(): ChartTheme {
  const colors: ChartThemeColors = {
    primary: getCSSVariable('--chart-1') || getCSSVariable('--action-primary') || '#6366f1',
    success: getCSSVariable('--chart-2') || getCSSVariable('--status-success') || '#14b8a6',
    warning: getCSSVariable('--chart-3') || getCSSVariable('--status-warning') || '#f59e0b',
    error: getCSSVariable('--chart-4') || getCSSVariable('--status-error') || '#f87171',
    info: getCSSVariable('--chart-5') || getCSSVariable('--status-info') || '#3b82f6',
    text: getCSSVariable('--chart-text') || getCSSVariable('--text-primary') || '#1c1917',
    textMuted: getCSSVariable('--chart-text-muted') || getCSSVariable('--text-secondary') || '#78716c',
    gridLines: getCSSVariable('--chart-grid') || getCSSVariable('--border-default') || '#e7e5e4',
    tooltipBg: getCSSVariable('--chart-tooltip-bg') || getCSSVariable('--tooltip-bg') || '#1c1917',
    tooltipText: getCSSVariable('--chart-tooltip-text') || getCSSVariable('--tooltip-text') || '#fafaf9',
    tooltipBorder: getCSSVariable('--chart-tooltip-border') || 'transparent',
    legendText: getCSSVariable('--chart-legend-text') || getCSSVariable('--text-secondary') || '#78716c'
  }

  const fontFamily = getCSSVariable('--font-sans') || 'system-ui, -apple-system, sans-serif'

  const palette = [
    getCSSVariable('--chart-1') || colors.primary,
    getCSSVariable('--chart-2') || colors.success,
    getCSSVariable('--chart-3') || colors.warning,
    getCSSVariable('--chart-4') || colors.error,
    getCSSVariable('--chart-5') || colors.info,
    getCSSVariable('--chart-6') || '#8b5cf6',
    getCSSVariable('--chart-7') || '#ec4899',
    getCSSVariable('--chart-8') || '#06b6d4'
  ]

  return { colors, fontFamily, palette }
}

/**
 * Composable that extracts CSS variables and provides reactive chart theming.
 * Automatically updates when the theme changes (dark mode toggle).
 */
export function useChartTheme() {
  const theme = ref<ChartTheme>(extractTheme())
  const themeVersion = ref(0)

  let observer: MutationObserver | null = null

  function updateTheme() {
    theme.value = extractTheme()
    themeVersion.value++
  }

  onMounted(() => {
    updateTheme()

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')
        ) {
          setTimeout(updateTheme, 50)
          break
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  const gridColor = computed(() => theme.value.colors.gridLines)
  const textColor = computed(() => theme.value.colors.text)
  const mutedTextColor = computed(() => theme.value.colors.textMuted)

  function getDefaultOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      scales: {
        x: {
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
          grid: {
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
      }
    }
  }

  function getColor(index: number): string {
    return theme.value.palette[index % theme.value.palette.length]
  }

  function getColorWithOpacity(index: number, opacity: number): string {
    const color = getColor(index)
    if (color.startsWith('oklch') || color.startsWith('rgb')) {
      return color.replace(')', ` / ${opacity})`).replace('rgb(', 'rgba(').replace('oklch(', 'oklch(')
    }
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    return color
  }

  return {
    theme,
    themeVersion,
    gridColor,
    textColor,
    mutedTextColor,
    getDefaultOptions,
    getColor,
    getColorWithOpacity,
    updateTheme
  }
}
