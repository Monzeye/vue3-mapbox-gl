import type { ShallowRef } from 'vue'
import { shallowRef, watchEffect, onUnmounted } from 'vue'
import type { Map, ScaleControlOptions, ControlPosition } from 'mapbox-gl'
import { ScaleControl } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface ScaleControlProps {
  map: ShallowRef<Nullable<Map>>
  position?: ControlPosition
  maxWidth?: ScaleControlOptions['maxWidth']
  unit?: ScaleControlOptions['unit']
}

export function useScaleControl({
  map,
  position = 'bottom-right',
  maxWidth = 100,
  unit = 'metric'
}: ScaleControlProps) {
  const scaleControl = shallowRef<Nullable<ScaleControl>>(null)
  const options: ScaleControlOptions = {
    maxWidth,
    unit
  }
  const stopEffect = watchEffect(() => {
    if (map.value && !scaleControl.value) {
      scaleControl.value = new ScaleControl(options)
      map.value.addControl(scaleControl.value, position)
    }
  })

  function remove() {
    stopEffect()
    if (map.value && scaleControl.value) {
      map.value.removeControl(scaleControl.value)
    }
    scaleControl.value = null
  }
  onUnmounted(() => {
    remove()
  })
  return remove
}
