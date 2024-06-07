import type { CreateBaseLayerActions, ILayer, Nullable } from '@/types'
import type {
  AnySourceData,
  AnySourceImpl,
  Expression,
  LayerType,
  Map
} from 'mapbox-gl'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { shallowRef, unref, computed, watch, type MaybeRef } from 'vue'
import { getNanoid } from '@/helpers/getNanoid'
import { hasLayer } from '@/helpers/mapUtils'
interface CreateBaseLayerProps<Layer extends ILayer> {
  map: MaybeRef<Nullable<Map>>
  source: MaybeRef<
    string | AnySourceImpl | AnySourceData | object | null | undefined
  >
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
    map: mapRef,
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
  const layerId = getNanoid(id)
  const layer = shallowRef<Nullable<Layer>>(null)
  const getLayer = computed(() => layer.value)
  watch(
    () => unref(sourceRef),
    source => {
      if (source) {
        createLayer()
      } else {
        removeLayer()
      }
    }
  )
  useMapReloadEvent(mapRef, {
    unLoad: removeLayer,
    onLoad: createLayer
  })

  function setBeforeId(beforeIdVal?: string) {
    const mapInstance = unref(mapRef)
    if (mapInstance && layer.value && hasLayer(mapInstance, layerId)) {
      mapInstance.moveLayer(layerId, beforeIdVal)
    }
  }
  function setFilter(filterVal: Expression = ['all']) {
    const mapInstance = unref(mapRef)
    if (mapInstance && layer.value && hasLayer(mapInstance, layerId)) {
      mapInstance.setFilter(layerId, filterVal)
    }
  }
  function setZoomRange(minzoomVal = 0, maxzoomVal = 24) {
    const mapInstance = unref(mapRef)
    if (mapInstance && layer.value && hasLayer(mapInstance, layerId)) {
      mapInstance.setLayerZoomRange(layerId, minzoomVal, maxzoomVal)
    }
  }
  function setPaintProperty(
    name: string,
    value: any,
    options = {
      validate: true
    }
  ) {
    const mapInstance = unref(mapRef)
    if (mapInstance && layer.value && hasLayer(mapInstance, layerId)) {
      mapInstance.setPaintProperty(layerId, name, value, options)
    }
  }
  function setLayoutProperty(
    name: string,
    value: any,
    options = {
      validate: true
    }
  ) {
    const mapInstance = unref(mapRef)
    if (mapInstance && layer.value && hasLayer(mapInstance, layerId)) {
      mapInstance.setLayoutProperty(layerId, name, value, options)
    }
  }
  function createLayer() {
    const mapInstance = unref(mapRef)
    const source = unref(sourceRef)
    if (
      mapInstance &&
      source &&
      !layer.value &&
      !hasLayer(mapInstance, layerId)
    ) {
      let sourceData
      if (typeof source === 'string') {
        sourceData = source
      }
      if (typeof source === 'object') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sourceData = source.id
          ? (source as any).id
          : (source as any).type
            ? source
            : ''
      }
      mapInstance.addLayer(
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
      layer.value = mapInstance.getLayer(layerId) as Layer
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
        mapInstance
      )
    }
  }

  function removeLayer() {
    const mapInstance = unref(mapRef)
    layer.value = null
    if (mapInstance && hasLayer(mapInstance, layerId)) {
      mapInstance.removeLayer(layerId)
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
