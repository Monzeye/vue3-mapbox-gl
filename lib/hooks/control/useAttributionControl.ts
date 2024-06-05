import type { ShallowRef } from 'vue'
import { shallowRef, watchEffect, onUnmounted } from 'vue'
import type { Map, AttributionControlOptions, ControlPosition } from 'mapbox-gl'
import { AttributionControl } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface AttributionControlProps {
  map: ShallowRef<Nullable<Map>>
  position?: ControlPosition
  compact?: AttributionControlOptions['compact']
  customAttribution?: AttributionControlOptions['customAttribution']
}

export function useAttributionControl({
  map,
  position = 'bottom-right',
  compact = false,
  customAttribution = ''
}: AttributionControlProps) {
  const attributionControl = shallowRef<Nullable<AttributionControl>>(null)
  const options: AttributionControlOptions = {
    compact,
    customAttribution
  }
  const stopEffect = watchEffect(() => {
    if (map.value && !attributionControl.value) {
      attributionControl.value = new AttributionControl(options)
      map.value.addControl(attributionControl.value, position)
    }
  })
  function remove() {
    stopEffect()
    if (map.value && attributionControl.value) {
      map.value.removeControl(attributionControl.value)
    }
    attributionControl.value = null
  }
  onUnmounted(() => {
    remove()
  })
  return remove
}
