<script setup lang="ts">
import { inject, onMounted, computed } from 'vue'

export type CardImagePosition = 'top' | 'bottom' | 'left' | 'right' | 'background'
export type CardImageAspectRatio = '16:9' | '4:3' | '3:2' | '1:1' | 'auto'
export type CardImageFit = 'cover' | 'contain' | 'fill'

export interface CardImageProps {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Aspect ratio constraint */
  aspectRatio?: CardImageAspectRatio
  /** Image position within card */
  position?: CardImagePosition
  /** Object-fit behavior */
  fit?: CardImageFit
  /** Loading attribute for native lazy loading */
  loading?: 'eager' | 'lazy'
}

const props = withDefaults(defineProps<CardImageProps>(), {
  aspectRatio: 'auto',
  position: 'top',
  fit: 'cover',
  loading: 'lazy'
})

const cardContext = inject<{
  horizontal: { value: boolean }
  registerTopImage: () => void
} | null>('card', null)

onMounted(() => {
  if (props.position === 'top') {
    cardContext?.registerTopImage()
  }
})

const aspectRatioValue = computed(() => {
  const ratioMap: Record<string, string> = {
    '16:9': '16 / 9',
    '4:3': '4 / 3',
    '3:2': '3 / 2',
    '1:1': '1 / 1',
    'auto': 'auto'
  }
  return ratioMap[props.aspectRatio]
})
</script>

<template>
  <div
    class="ui-card__image"
    :class="[`ui-card__image--${position}`]"
    :style="aspectRatio !== 'auto' ? { '--aspect-ratio': aspectRatioValue } : undefined"
  >
    <img
      :src="src"
      :alt="alt"
      :loading="loading"
      class="ui-card__image-img"
      :class="[`ui-card__image-img--${fit}`]"
    />
  </div>
</template>

<style scoped>
.ui-card__image {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.ui-card__image--top,
.ui-card__image--bottom {
  width: 100%;
  aspect-ratio: var(--aspect-ratio, auto);
}

.ui-card__image--left,
.ui-card__image--right {
  width: 40%;
  min-width: 120px;
  max-width: 300px;
}

.ui-card__image--background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.ui-card__image-img {
  width: 100%;
  height: 100%;
  display: block;
}

.ui-card__image-img--cover {
  object-fit: cover;
}

.ui-card__image-img--contain {
  object-fit: contain;
}

.ui-card__image-img--fill {
  object-fit: fill;
}

.ui-card__image--bottom {
  order: 999;
}

@media (max-width: 640px) {
  .ui-card__image--left,
  .ui-card__image--right {
    width: 100%;
    max-width: none;
  }
}
</style>
