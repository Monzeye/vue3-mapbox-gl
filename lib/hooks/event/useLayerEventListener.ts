import { getShallowRef } from '@/helpers/getRef'
import type { Nullable, ShallowRefOrNo } from '@/types'
import type { Map, AnyLayer, MapLayerEventType } from 'mapbox-gl'
import { onUnmounted, watchEffect } from 'vue'

interface LayerEventProps<T extends keyof MapLayerEventType> {
  map: ShallowRefOrNo<Nullable<Map>>
  layer: ShallowRefOrNo<Nullable<AnyLayer | string>>
  event: keyof MapLayerEventType
  on: (e: MapLayerEventType[T]) => void
}

export function useLayerEventListener<T extends keyof MapLayerEventType>(
  props: LayerEventProps<T>
) {
  const mapInstance = getShallowRef(props.map)
  const layer = getShallowRef(props.layer)

  const layerEventFn = <K extends T>(e: MapLayerEventType[K]) => {
    // if (e.defaultPrevented) return
    props.on && props.on(e)
  }

  const stopEffect = watchEffect(onCleanUp => {
    if (mapInstance.value && layer.value) {
      const layerId =
        typeof layer.value === 'string' ? layer.value : layer.value.id
      mapInstance.value.on<T>(props.event as T, layerId, layerEventFn)
    }
    onCleanUp(remove)
  })
  function remove() {
    if (mapInstance.value && layer.value) {
      const layerId =
        typeof layer.value === 'string' ? layer.value : layer.value.id
      mapInstance.value.off<T>(props.event as T, layerId, layerEventFn)
    }
  }

  onUnmounted(() => {
    stopEffect()
  })

  return {
    remove
  }
}
