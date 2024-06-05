import type { Map, CustomLayerInterface, AnyLayer } from 'mapbox-gl'
import type { Nullable, ShallowRefOrNo } from '@/types'
import { getShallowRef } from '@/helpers/getRef'
import { useMapReloadEvent } from '@/index'
import { computed, ref, shallowRef, unref } from 'vue'
import { hasLayer } from '@/helpers/mapUtils'

interface CreateCustomLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  customLayer: ShallowRefOrNo<
    CustomLayerInterface | (new () => CustomLayerInterface)
  >
  beforeId?: string
}

export function useCreateCustomLayer({
  map,
  beforeId,
  customLayer: customLayerVal
}: CreateCustomLayerProps) {
  const mapInstance = getShallowRef(map)
  const customLayer = getShallowRef(customLayerVal)
  const layerId = ref<string | undefined>()
  const layer = shallowRef<any>(null)
  const getLayer = computed(() => layer.value)
  useMapReloadEvent(mapInstance, {
    unLoad: removeLayer,
    onLoad: createLayer
  })

  function createLayer() {
    const map = unref(mapInstance.value)
    let sourceLayer = customLayer.value
    if (
      typeof customLayer.value === 'function' &&
      customLayer.value instanceof Object
    ) {
      sourceLayer = new customLayer.value()
    }
    layerId.value = (sourceLayer as CustomLayerInterface).id!
    if (map && layerId && !layer.value && !hasLayer(map, layerId.value)) {
      map.addLayer(sourceLayer as CustomLayerInterface, beforeId)
      layer.value = map.getLayer(layerId.value) as AnyLayer
    }
  }
  function removeLayer() {
    layer.value = null
    const map = unref(mapInstance.value)
    if (map && layerId.value && hasLayer(map, layerId.value)) {
      map.removeLayer(layerId.value)
    }
  }

  function setBeforeId(beforeIdVal?: string) {
    if (
      mapInstance.value &&
      layerId.value &&
      layer.value &&
      hasLayer(mapInstance.value, layerId.value)
    ) {
      mapInstance.value.moveLayer(layerId.value, beforeIdVal)
    }
  }
  return {
    layerId,
    getLayer,
    removeLayer,
    setBeforeId
  }
}
