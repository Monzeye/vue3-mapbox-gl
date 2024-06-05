import { getShallowRef } from '@/helpers/getRef'
import type { Nullable, ShallowRefOrNo } from '@/types'
import type { Map, MapEventTypes } from 'mapbox-gl'
import { onUnmounted, watchEffect } from 'vue'

interface LayerEventProps {
  map: ShallowRefOrNo<Nullable<Map>>
  event: keyof MapEventTypes
  on: <T extends keyof MapEventTypes>(e: MapEventTypes[T]) => void
}

export function useMapEventListener(props: LayerEventProps) {
  const mapInstance = getShallowRef(props.map)

  const layerEventFn = (e: MapEventTypes[keyof MapEventTypes]) => {
    props.on && props.on(e)
  }

  const stopEffect = watchEffect(() => {
    if (mapInstance.value) {
      mapInstance.value.on(props.event, layerEventFn)
    }
  })
  function remove() {
    if (mapInstance.value) {
      mapInstance.value.off(props.event, layerEventFn)
    }
  }

  onUnmounted(() => {
    stopEffect()
  })

  return {
    remove
  }
}
