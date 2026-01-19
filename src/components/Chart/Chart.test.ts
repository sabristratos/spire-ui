import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseChart from './BaseChart.vue'
import LineChart from './LineChart.vue'
import BarChart from './BarChart.vue'
import DonutChart from './DonutChart.vue'

vi.mock('chart.js', () => {
  class MockChart {
    static register = vi.fn()
    destroy = vi.fn()
    update = vi.fn()
    resize = vi.fn()
    data: { datasets: unknown[] }
    options: unknown
    isDatasetVisible = vi.fn().mockReturnValue(true)
    setDatasetVisibility = vi.fn()

    constructor(
      _canvas: HTMLCanvasElement,
      config: { data?: { datasets?: unknown[] }; options?: unknown }
    ) {
      this.data = config.data && config.data.datasets
        ? config.data as { datasets: unknown[] }
        : { datasets: [] }
      this.options = config.options || {}
    }
  }

  return {
    Chart: MockChart,
    registerables: []
  }
})

const mockGetComputedStyle = vi.fn().mockReturnValue({
  getPropertyValue: vi.fn().mockReturnValue('')
})

class MockResizeObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal('getComputedStyle', mockGetComputedStyle)
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('BaseChart', () => {
  const defaultProps = {
    type: 'line' as const,
    data: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        { label: 'Sales', data: [10, 20, 30] }
      ]
    }
  }

  describe('Rendering', () => {
    it('renders canvas element', () => {
      const wrapper = mount(BaseChart, { props: defaultProps })
      expect(wrapper.find('canvas').exists()).toBe(true)
    })

    it('renders chart container', () => {
      const wrapper = mount(BaseChart, { props: defaultProps })
      expect(wrapper.find('.ui-chart').exists()).toBe(true)
    })

    it('renders canvas container with height', () => {
      const wrapper = mount(BaseChart, {
        props: { ...defaultProps, height: 400 }
      })
      const container = wrapper.find('.ui-chart__canvas-container')
      expect(container.attributes('style')).toContain('height: 400px')
    })

    it('accepts string height', () => {
      const wrapper = mount(BaseChart, {
        props: { ...defaultProps, height: '50vh' }
      })
      const container = wrapper.find('.ui-chart__canvas-container')
      expect(container.attributes('style')).toContain('height: 50vh')
    })
  })

  describe('Accessibility', () => {
    it('has role="img" on canvas', () => {
      const wrapper = mount(BaseChart, { props: defaultProps })
      expect(wrapper.find('canvas').attributes('role')).toBe('img')
    })

    it('sets aria-label on canvas', () => {
      const wrapper = mount(BaseChart, {
        props: { ...defaultProps, ariaLabel: 'Sales chart' }
      })
      expect(wrapper.find('canvas').attributes('aria-label')).toBe('Sales chart')
    })

    it('renders screen reader table fallback', () => {
      const wrapper = mount(BaseChart, { props: defaultProps })
      expect(wrapper.find('.ui-chart__sr-table').exists()).toBe(true)
    })

    it('populates fallback table with data', () => {
      const wrapper = mount(BaseChart, { props: defaultProps })
      const headers = wrapper.findAll('.ui-chart__sr-table th')
      expect(headers.length).toBeGreaterThan(0)
    })
  })

  describe('Props', () => {
    it('accepts different chart types', async () => {
      const wrapper = mount(BaseChart, {
        props: { ...defaultProps, type: 'bar' }
      })
      expect(wrapper.props('type')).toBe('bar')

      await wrapper.setProps({ type: 'doughnut' })
      expect(wrapper.props('type')).toBe('doughnut')
    })

    it('defaults height to 300', () => {
      const wrapper = mount(BaseChart, { props: defaultProps })
      const container = wrapper.find('.ui-chart__canvas-container')
      expect(container.attributes('style')).toContain('height: 300px')
    })
  })
})

describe('LineChart', () => {
  const defaultProps = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    series: [
      { name: 'Revenue', data: [100, 200, 150, 300] },
      { name: 'Expenses', data: [80, 120, 100, 180] }
    ]
  }

  describe('Rendering', () => {
    it('renders BaseChart with type line', () => {
      const wrapper = mount(LineChart, { props: defaultProps })
      const baseChart = wrapper.findComponent(BaseChart)
      expect(baseChart.exists()).toBe(true)
    })

    it('renders legend by default', () => {
      const wrapper = mount(LineChart, { props: defaultProps })
      expect(wrapper.find('.ui-line-chart__legend').exists()).toBe(true)
    })

    it('renders legend items for each series', async () => {
      const wrapper = mount(LineChart, { props: defaultProps })
      await nextTick()
      const items = wrapper.findAll('.ui-line-chart__legend-item')
      expect(items.length).toBe(2)
    })

    it('hides legend when showLegend is false', () => {
      const wrapper = mount(LineChart, {
        props: { ...defaultProps, showLegend: false }
      })
      expect(wrapper.find('.ui-line-chart__legend').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('passes height to BaseChart', () => {
      const wrapper = mount(LineChart, {
        props: { ...defaultProps, height: 500 }
      })
      const baseChart = wrapper.findComponent(BaseChart)
      expect(baseChart.props('height')).toBe(500)
    })

    it('passes ariaLabel to BaseChart', () => {
      const wrapper = mount(LineChart, {
        props: { ...defaultProps, ariaLabel: 'Revenue over time' }
      })
      const baseChart = wrapper.findComponent(BaseChart)
      expect(baseChart.props('ariaLabel')).toBe('Revenue over time')
    })

    it('accepts fill prop', () => {
      const wrapper = mount(LineChart, {
        props: { ...defaultProps, fill: true }
      })
      expect(wrapper.props('fill')).toBe(true)
    })

    it('accepts tension prop', () => {
      const wrapper = mount(LineChart, {
        props: { ...defaultProps, tension: 0.2 }
      })
      expect(wrapper.props('tension')).toBe(0.2)
    })
  })

  describe('Legend interaction', () => {
    it('legend items are clickable', async () => {
      const wrapper = mount(LineChart, { props: defaultProps })
      await nextTick()
      const legendItem = wrapper.find('.ui-line-chart__legend-item')
      expect(legendItem.element.tagName).toBe('BUTTON')
    })
  })
})

describe('BarChart', () => {
  const defaultProps = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Sales', data: [100, 150, 120, 200] }
    ]
  }

  describe('Rendering', () => {
    it('renders BaseChart with type bar', () => {
      const wrapper = mount(BarChart, { props: defaultProps })
      const baseChart = wrapper.findComponent(BaseChart)
      expect(baseChart.exists()).toBe(true)
      expect(baseChart.props('type')).toBe('bar')
    })

    it('renders legend by default', () => {
      const wrapper = mount(BarChart, { props: defaultProps })
      expect(wrapper.find('.ui-bar-chart__legend').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('accepts horizontal prop', () => {
      const wrapper = mount(BarChart, {
        props: { ...defaultProps, horizontal: true }
      })
      expect(wrapper.props('horizontal')).toBe(true)
    })

    it('accepts stacked prop', () => {
      const wrapper = mount(BarChart, {
        props: { ...defaultProps, stacked: true }
      })
      expect(wrapper.props('stacked')).toBe(true)
    })

    it('accepts borderRadius prop', () => {
      const wrapper = mount(BarChart, {
        props: { ...defaultProps, borderRadius: 8 }
      })
      expect(wrapper.props('borderRadius')).toBe(8)
    })
  })
})

describe('DonutChart', () => {
  const defaultProps = {
    segments: [
      { label: 'Direct', value: 300 },
      { label: 'Referral', value: 200 },
      { label: 'Social', value: 100 }
    ]
  }

  describe('Rendering', () => {
    it('renders BaseChart with type doughnut', () => {
      const wrapper = mount(DonutChart, { props: defaultProps })
      const baseChart = wrapper.findComponent(BaseChart)
      expect(baseChart.exists()).toBe(true)
      expect(baseChart.props('type')).toBe('doughnut')
    })

    it('renders legend by default', () => {
      const wrapper = mount(DonutChart, { props: defaultProps })
      expect(wrapper.find('.ui-donut-chart__legend').exists()).toBe(true)
    })

    it('renders legend items for each segment', () => {
      const wrapper = mount(DonutChart, { props: defaultProps })
      const items = wrapper.findAll('.ui-donut-chart__legend-item')
      expect(items.length).toBe(3)
    })

    it('displays percentage values in legend', () => {
      const wrapper = mount(DonutChart, { props: defaultProps })
      const values = wrapper.findAll('.ui-donut-chart__legend-value')
      expect(values[0].text()).toBe('50%')
      expect(values[1].text()).toBe('33%')
      expect(values[2].text()).toBe('17%')
    })
  })

  describe('Center content', () => {
    it('renders center value when provided', () => {
      const wrapper = mount(DonutChart, {
        props: { ...defaultProps, centerValue: '600' }
      })
      expect(wrapper.find('.ui-donut-chart__center-value').text()).toBe('600')
    })

    it('renders center label when provided', () => {
      const wrapper = mount(DonutChart, {
        props: { ...defaultProps, centerLabel: 'Total' }
      })
      expect(wrapper.find('.ui-donut-chart__center-label').text()).toBe('Total')
    })

    it('renders center slot content', () => {
      const wrapper = mount(DonutChart, {
        props: defaultProps,
        slots: {
          center: '<div data-testid="custom-center">Custom</div>'
        }
      })
      expect(wrapper.find('[data-testid="custom-center"]').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('accepts cutout prop', () => {
      const wrapper = mount(DonutChart, {
        props: { ...defaultProps, cutout: 50 }
      })
      expect(wrapper.props('cutout')).toBe(50)
    })

    it('accepts legendPosition prop', async () => {
      const wrapper = mount(DonutChart, {
        props: { ...defaultProps, legendPosition: 'bottom' }
      })
      expect(wrapper.find('.ui-donut-chart--legend-bottom').exists()).toBe(true)

      await wrapper.setProps({ legendPosition: 'left' })
      expect(wrapper.find('.ui-donut-chart--legend-left').exists()).toBe(true)
    })

    it('accepts custom segment colors', () => {
      const wrapper = mount(DonutChart, {
        props: {
          segments: [
            { label: 'A', value: 100, color: '#ff0000' },
            { label: 'B', value: 200, color: '#00ff00' }
          ]
        }
      })
      const colors = wrapper.findAll('.ui-donut-chart__legend-color')
      expect(colors[0].attributes('style')).toContain('background-color: #ff0000')
      expect(colors[1].attributes('style')).toContain('background-color: #00ff00')
    })
  })
})
