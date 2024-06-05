import { getShallowRef } from '@/helpers/getRef'
import type { Map, Fog } from 'mapbox-gl'
import type { ShallowRef } from 'vue'
import { ref } from 'vue'
import { useMapReloadEvent } from '../event/useMapReloadEvent'
import type { Nullable } from '@/types'

interface CreateFogProps {
  map: ShallowRef<Nullable<Map>>
  options?: Fog
}
const defaultFog: Fog = {
  color: '#ffffff',
  'high-color': '#245cdf',
  'horizon-blend': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 7, 0.1],
  range: [0.5, 10],
  'space-color': [
    'interpolate',
    ['linear'],
    ['zoom'],
    4,
    '#010b19',
    7,
    '#367ab9'
  ],
  'star-intensity': ['interpolate', ['linear'], ['zoom'], 5, 0.35, 6, 0]
}
export function useCreateFog({
  map,
  options: optionsVal = defaultFog
}: CreateFogProps) {
  const mapInstance = getShallowRef(map)
  const options = ref(optionsVal)
  useMapReloadEvent(mapInstance, {
    onLoad() {
      setFog(options.value)
    },
    unLoad() {
      removeFog()
    }
  })
  function setFog(optionsVal: Fog) {
    options.value = optionsVal
    mapInstance.value && mapInstance.value.setFog(options.value)
  }
  function removeFog() {
    mapInstance.value && mapInstance.value.setFog(null!)
  }
  return {
    setFog,
    removeFog
  }
}
