import type {
  CreateBaseLayerActions,
  ILayer,
  Nullable,
  ShallowRefOrNo
} from '@/types'
import type { AnySourceImpl, Expression, LayerType, Map } from 'mapbox-gl'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { shallowRef, unref, computed, watch } from 'vue'
import { getNanoid } from '@/helpers/getNanoid'
import { getShallowRef } from '@/helpers/getRef'
import { hasLayer } from '@/helpers/mapUtils'
interface CreateBaseLayerProps<Layer extends ILayer> {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceImpl | object | null>
  type: LayerType
  beforeId?: string
  filter?: Expression
  layout?: Layer['layout']
  paint?: Layer['paint']
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  maxzoom?: number
  minzoom?: number
  id?: string
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateBaseLayerActions<Layer>, map: Map) => void
}

export function useCreateLayer<Layer extends ILayer>(
  cfg: CreateBaseLayerProps<Layer>
) {
  const {
    map,
    source: sourceRef,
    type,
    beforeId,
    filter = ['all'],
    layout = {},
    paint = {},
    renderingMode = '',
    slot = '',
    maxzoom = 24,
    minzoom = 0,
    id,
    metadata = {},
    sourceLayer = '',
    register
  } = cfg
  const mapInstance = getShallowRef(map)
  const source = getShallowRef(sourceRef)
  const layerId = getNanoid(id)
  const layer = shallowRef<Nullable<Layer>>(null)
  const getLayer = computed(() => layer.value)
  watch(source, source => {
    if (source) {
      createLayer()
    } else {
      removeLayer()
    }
  })
  useMapReloadEvent(mapInstance, {
    unLoad: removeLayer,
    onLoad: createLayer
  })

  function setBeforeId(beforeIdVal?: string) {
    if (
      mapInstance.value &&
      layer.value &&
      hasLayer(mapInstance.value, layerId)
    ) {
      mapInstance.value.moveLayer(layerId, beforeIdVal)
    }
  }
  function setFilter(filterVal: Expression = ['all']) {
    if (
      mapInstance.value &&
      layer.value &&
      hasLayer(mapInstance.value, layerId)
    ) {
      mapInstance.value.setFilter(layerId, filterVal)
    }
  }
  function setZoomRange(minzoomVal = 0, maxzoomVal = 24) {
    if (
      mapInstance.value &&
      layer.value &&
      hasLayer(mapInstance.value, layerId)
    ) {
      mapInstance.value.setLayerZoomRange(layerId, minzoomVal, maxzoomVal)
    }
  }
  function setPaintProperty(
    name: string,
    value: any,
    options = {
      validate: true
    }
  ) {
    if (
      mapInstance.value &&
      layer.value &&
      hasLayer(mapInstance.value, layerId)
    ) {
      mapInstance.value.setPaintProperty(layerId, name, value, options)
    }
  }
  function setLayoutProperty(
    name: string,
    value: any,
    options = {
      validate: true
    }
  ) {
    if (
      mapInstance.value &&
      layer.value &&
      hasLayer(mapInstance.value, layerId)
    ) {
      mapInstance.value.setLayoutProperty(layerId, name, value, options)
    }
  }
  function createLayer() {
    const map = unref(mapInstance.value)
    if (map && source.value && !layer.value && !hasLayer(map, layerId)) {
      let sourceData
      if (typeof source.value === 'string') {
        sourceData = source.value
      }
      if (typeof source.value === 'object') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sourceData = source.value.id
          ? (source.value as any).id
          : (source.value as any).type
            ? source.value
            : ''
      }
      map.addLayer(
        {
          id: layerId,
          type,
          layout: layout,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          paint: paint,
          renderingMode,
          slot,
          source: sourceData,
          'source-layer': sourceLayer,
          maxzoom,
          minzoom,
          filter,
          metadata
        },
        beforeId
      )
      layer.value = map.getLayer(layerId) as Layer
      register?.(
        {
          layerId,
          getLayer,
          // createLayer,
          removeLayer,
          setBeforeId,
          setFilter,
          setZoomRange,
          setPaintProperty,
          setLayoutProperty
        },
        map
      )
    }
  }

  function removeLayer() {
    layer.value = null
    const map = unref(mapInstance.value)
    if (map && hasLayer(map, layerId)) {
      map.removeLayer(layerId)
    }
  }

  return {
    layerId,
    getLayer,
    removeLayer,
    setBeforeId,
    setFilter,
    setZoomRange,
    setPaintProperty,
    setLayoutProperty
  }
}
