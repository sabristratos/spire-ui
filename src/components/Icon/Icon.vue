<script setup lang="ts">
import { computed, h, type Component, type VNode } from 'vue'

type HugeIconData = [string, Record<string, unknown>][]

export type IconInput = Component | HugeIconData

export interface IconProps {
  /** The icon - Vue component OR HugeIcons data array */
  icon: IconInput
  /** Predefined size or custom value */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string
  /** Stroke width (for stroke-based icons like Lucide) */
  strokeWidth?: number | string
  /** Accessible label - required for standalone icons */
  label?: string
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  strokeWidth: 1.5
})

const sizeMap: Record<string, string> = {
  xs: 'var(--icon-xs)',
  sm: 'var(--icon-sm)',
  md: 'var(--icon-md)',
  lg: 'var(--icon-lg)',
  xl: 'var(--icon-xl)'
}

const resolvedSize = computed(() => sizeMap[props.size] ?? props.size)
const ariaHidden = computed(() => !props.label)

const isHugeIconData = computed(() => {
  return Array.isArray(props.icon) &&
         props.icon.length > 0 &&
         Array.isArray(props.icon[0])
})

function renderHugeIcon(): VNode {
  const data = props.icon as HugeIconData
  const children = data.map(([tag, attrs]) => {
    if (props.strokeWidth && attrs['stroke-width']) {
      return h(tag, { ...attrs, 'stroke-width': props.strokeWidth })
    }
    return h(tag, attrs)
  })

  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    class: 'ui-icon',
    style: { '--icon-size': resolvedSize.value },
    'aria-label': props.label,
    'aria-hidden': ariaHidden.value,
    role: 'img'
  }, children)
}
</script>

<template>
  <component
    v-if="!isHugeIconData"
    :is="icon"
    class="ui-icon"
    :style="{ '--icon-size': resolvedSize }"
    :stroke-width="strokeWidth"
    :aria-label="label"
    :aria-hidden="ariaHidden"
    role="img"
  />
  <component v-else :is="renderHugeIcon" />
</template>

<style scoped>
.ui-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  flex-shrink: 0;
  color: currentColor;
  display: inline-block;
  vertical-align: middle;
}
</style>
