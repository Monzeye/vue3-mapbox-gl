import type { Nullable } from '@/types'
import type { Map, MapEventTypes } from 'mapbox-gl'
import { onUnmounted, unref, watchEffect, type MaybeRef } from 'vue'

interface LayerEventProps {
  map: MaybeRef<Nullable<Map>>
  event: keyof MapEventTypes
  on: <T extends keyof MapEventTypes>(e: MapEventTypes[T]) => void
}

export function useMapEventListener(props: LayerEventProps) {
  const layerEventFn = (e: MapEventTypes[keyof MapEventTypes]) => {
    props.on && props.on(e)
  }

  const stopEffect = watchEffect(onCleanUp => {
    const map = unref(props.map)
    if (map) {
      map.on(props.event, layerEventFn)
    }
    onCleanUp(remove)
  })
  function remove() {
    const map = unref(props.map)
    if (map) {
      map.off(props.event, layerEventFn)
    }
  }

  onUnmounted(() => {
    stopEffect()
  })

  return {
    remove
  }
}
