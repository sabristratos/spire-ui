<script setup lang="ts">
import { computed } from 'vue'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'
type HeadingSize = '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md'

export interface HeadingProps {
  /** Semantic HTML tag */
  as?: HeadingTag
  /** Visual hierarchy size */
  size?: HeadingSize
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Prevent wrapping with ellipsis */
  truncate?: boolean
}

const props = withDefaults(defineProps<HeadingProps>(), {
  as: 'h2',
  size: '2xl',
  align: 'left'
})

const classes = computed(() => [
  'ui-heading',
  `ui-heading--${props.size}`,
  `ui-heading--${props.align}`,
  { 'ui-heading--truncate': props.truncate }
])
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>

<style scoped>
.ui-heading {
  font-family: var(--font-sans);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0;
}

/* Sizes */
.ui-heading--4xl { font-size: var(--heading-4xl); }
.ui-heading--3xl { font-size: var(--heading-3xl); }
.ui-heading--2xl { font-size: var(--heading-2xl); }
.ui-heading--xl  { font-size: var(--heading-xl); }
.ui-heading--lg  { font-size: var(--heading-lg); }
.ui-heading--md  { font-size: var(--heading-md); }

/* Alignment */
.ui-heading--left   { text-align: left; }
.ui-heading--center { text-align: center; }
.ui-heading--right  { text-align: right; }

/* Truncation */
.ui-heading--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
