import { inject, type ComputedRef } from 'vue'
import { spireConfigKey, type SpireConfig } from '../components/SpireProvider/SpireProvider.vue'

/**
 * Access the current Spire UI configuration from a parent SpireProvider.
 *
 * @returns The current theme configuration, or undefined if no provider exists
 *
 * @example
 * ```vue
 * <script setup>
 * import { useSpireConfig } from 'spire-ui'
 *
 * const config = useSpireConfig()
 * // config?.theme, config?.mood, config?.depth, config?.motion
 * </script>
 *
 * <template>
 *   <div v-if="config">
 *     Current mood: {{ config.mood }}
 *   </div>
 * </template>
 * ```
 */
export function useSpireConfig(): ComputedRef<SpireConfig> | undefined {
  return inject(spireConfigKey, undefined)
}
