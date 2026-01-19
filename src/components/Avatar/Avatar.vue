<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getInitials } from '../../utils/string'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarShape = 'circle' | 'square'
type AvatarVariant = 'neutral' | 'primary' | 'soft'

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** User name - used for alt text AND initials fallback */
  name?: string
  /** Override alt text (defaults to name) */
  alt?: string
  /** Avatar size */
  size?: AvatarSize
  /** Avatar shape */
  shape?: AvatarShape
  /** Background variant when showing initials/icon */
  variant?: AvatarVariant
  /** Add border for avatar groups (cutout effect) */
  bordered?: boolean
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  variant: 'soft',
  bordered: false
})

const hasImageError = ref(false)

watch(() => props.src, () => {
  hasImageError.value = false
})

function handleError() {
  hasImageError.value = true
}

const initials = computed(() => getInitials(props.name))

const showImage = computed(() => props.src && !hasImageError.value)

const showInitials = computed(() => !showImage.value && initials.value)

const showFallback = computed(() => !showImage.value && !initials.value)

const classes = computed(() => [
  'ui-avatar',
  `ui-avatar--${props.size}`,
  `ui-avatar--${props.shape}`,
  `ui-avatar--${props.variant}`,
  { 'ui-avatar--bordered': props.bordered }
])

const ariaLabel = computed(() => props.alt || props.name || 'Avatar')
</script>

<template>
  <div :class="classes" role="img" :aria-label="ariaLabel">
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || name"
      class="ui-avatar__img"
      @error="handleError"
    />

    <span v-else-if="showInitials" class="ui-avatar__text">
      {{ initials }}
    </span>

    <svg
      v-else
      class="ui-avatar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  </div>
</template>

<style scoped>
.ui-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
  vertical-align: middle;
  font-family: var(--font-sans);
  font-weight: 600;
  line-height: 1;
}

.ui-avatar--circle { border-radius: 50%; }
.ui-avatar--square { border-radius: var(--radius-md); }

.ui-avatar--xs { width: 1.5rem; height: 1.5rem; font-size: 0.625rem; }
.ui-avatar--sm { width: 2rem; height: 2rem; font-size: 0.75rem; }
.ui-avatar--md { width: 2.5rem; height: 2.5rem; font-size: 0.875rem; }
.ui-avatar--lg { width: 3rem; height: 3rem; font-size: 1rem; }
.ui-avatar--xl { width: 4rem; height: 4rem; font-size: 1.25rem; }

.ui-avatar--neutral {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

.ui-avatar--primary {
  background-color: var(--action-primary);
  color: var(--action-primary-text);
}

.ui-avatar--soft {
  background-color: var(--avatar-soft-bg);
  color: var(--avatar-soft-text);
}

.ui-avatar--bordered {
  box-shadow: 0 0 0 2px var(--bg-primary);
}

.ui-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ui-avatar__text {
  text-transform: uppercase;
}

.ui-avatar__icon {
  width: 60%;
  height: 60%;
  opacity: 0.6;
}
</style>
