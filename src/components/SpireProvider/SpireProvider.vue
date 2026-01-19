<script lang="ts">
import type { InjectionKey, ComputedRef } from 'vue'

export type Theme = 'light' | 'dark'
export type Mood = 'warm' | 'cool' | 'vibrant' | 'muted' | 'earthy'
export type Depth = 'flat' | 'subtle' | 'elevated' | 'dimensional'
export type Motion = 'minimal' | 'smooth' | 'spring' | 'snappy'
export type Texture = 'none' | 'subtle' | 'medium'

export interface SpireConfig {
  theme?: Theme
  mood?: Mood
  depth?: Depth
  motion?: Motion
  texture?: Texture
}

export interface SpireProviderProps {
  theme?: Theme
  mood?: Mood
  depth?: Depth
  motion?: Motion
  texture?: Texture
  tag?: string
}

export const spireConfigKey: InjectionKey<ComputedRef<SpireConfig>> = Symbol('spire-config')
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'

const props = withDefaults(defineProps<SpireProviderProps>(), {
  tag: 'div'
})

const config = computed<SpireConfig>(() => ({
  theme: props.theme,
  mood: props.mood,
  depth: props.depth,
  motion: props.motion,
  texture: props.texture
}))

provide(spireConfigKey, config)

const dataAttributes = computed(() => {
  const attrs: Record<string, string | undefined> = {}

  if (props.theme) attrs['data-theme'] = props.theme
  if (props.mood) attrs['data-mood'] = props.mood
  if (props.depth) attrs['data-depth'] = props.depth
  if (props.motion) attrs['data-motion'] = props.motion
  if (props.texture) attrs['data-texture'] = props.texture

  return attrs
})
</script>

<template>
  <component :is="tag" class="spire-provider" v-bind="dataAttributes">
    <slot />
  </component>
</template>

<style scoped>
.spire-provider {
  display: block;
  min-height: inherit;
}
</style>
