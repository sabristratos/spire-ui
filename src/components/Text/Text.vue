<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

type TextTag = 'p' | 'span' | 'div' | 'label' | 'li'
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

export interface TextProps {
  /** Semantic HTML tag */
  as?: TextTag
  /** Font size */
  size?: TextSize
  /** Font weight */
  weight?: TextWeight
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify'
  /** Use secondary (muted) color */
  muted?: boolean
  /** Single-line truncation with ellipsis */
  truncate?: boolean
  /** Multi-line clamping (number of lines) */
  clamp?: number
}

const props = withDefaults(defineProps<TextProps>(), {
  as: 'p',
  size: 'md',
  weight: 'regular',
  align: 'left'
})

const classes = computed(() => [
  'ui-text',
  `ui-text--${props.size}`,
  `ui-text--${props.weight}`,
  `ui-text--${props.align}`,
  {
    'ui-text--muted': props.muted,
    'ui-text--truncate': props.truncate && !props.clamp,
    'ui-text--clamp': props.clamp
  }
])

const clampStyle = computed(() =>
  props.clamp ? { WebkitLineClamp: props.clamp } as CSSProperties : undefined
)
</script>

<template>
  <component :is="as" :class="classes" :style="clampStyle">
    <slot />
  </component>
</template>

<style scoped>
.ui-text {
  font-family: var(--font-sans);
  color: var(--text-primary);
  margin: 0;
}

/* Sizes */
.ui-text--xs { font-size: var(--text-xs); line-height: 1.4; }
.ui-text--sm { font-size: var(--text-sm); line-height: 1.4; }
.ui-text--md { font-size: var(--text-md); line-height: 1.5; }
.ui-text--lg { font-size: var(--text-lg); line-height: 1.5; }
.ui-text--xl { font-size: var(--text-xl); line-height: 1.4; }

/* Weights */
.ui-text--regular  { font-weight: 400; }
.ui-text--medium   { font-weight: 500; }
.ui-text--semibold { font-weight: 600; }
.ui-text--bold     { font-weight: 700; }

/* Alignment */
.ui-text--left    { text-align: left; }
.ui-text--center  { text-align: center; }
.ui-text--right   { text-align: right; }
.ui-text--justify { text-align: justify; }

/* Muted variant */
.ui-text--muted {
  color: var(--text-secondary);
}

/* Single-line truncation */
.ui-text--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line clamping */
.ui-text--clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
