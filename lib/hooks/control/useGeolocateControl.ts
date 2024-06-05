import type { ShallowRef } from 'vue'
import { shallowRef, watchEffect, onUnmounted } from 'vue'
import type { Map, GeolocateControlOptions, ControlPosition } from 'mapbox-gl'
import { GeolocateControl } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface GeolocateControlProps {
  map: ShallowRef<Nullable<Map>>
  position?: ControlPosition
  options?: GeolocateControlOptions
}

export function useGeolocateControl({
  map,
  position = 'bottom-right',
  options = {}
}: GeolocateControlProps) {
  const geolocateControl = shallowRef<Nullable<GeolocateControl>>(null)
  const stopEffect = watchEffect(() => {
    if (map.value && !geolocateControl.value) {
      geolocateControl.value = new GeolocateControl(options)
      map.value.addControl(geolocateControl.value, position)
    }
  })
  function remove() {
    stopEffect()
    if (map.value && geolocateControl.value) {
      map.value.removeControl(geolocateControl.value)
    }
    geolocateControl.value = null
  }
  onUnmounted(() => {
    remove()
  })
  return remove
}
