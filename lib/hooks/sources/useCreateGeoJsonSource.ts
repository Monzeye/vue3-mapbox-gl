import { unref, shallowRef, computed, onUnmounted } from 'vue'
import type { MaybeRef, ShallowRef } from 'vue'
import type {
  Map,
  GeoJSONSource,
  GeoJSONSourceOptions,
  MapSourceDataEvent
} from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { MapboxSourceType } from '@/enums/MapboxSourceEnum'
import { hasSource } from '@/helpers/mapUtils'
import type { Nullable } from '@/types'
import { getMainVersion } from '@/helpers/mapVersion'

interface CreateGeoJsonSourceProps {
  map: MaybeRef<Nullable<Map>>
  id?: string
  data?: GeoJSONSourceOptions['data']
  options?: Partial<GeoJSONSourceOptions>
  register?: (actions: CreateGeoJsonSourceActions, map: Map) => void
}

export interface CreateGeoJsonSourceActions {
  sourceId: string
  getSource: ShallowRef<Nullable<GeoJSONSource>>
  setData: (data: GeoJSONSourceOptions['data']) => void
}

const defaultData: GeoJSONSourceOptions['data'] = {
  type: 'FeatureCollection',
  features: []
}

export function useCreateGeoJsonSource({
  map: mapRef,
  id,
  register,
  options = {},
  data = defaultData
}: CreateGeoJsonSourceProps) {
  const sourceId = getNanoid(id)
  const sourceType = MapboxSourceType.Geojson
  const source = shallowRef<Nullable<GeoJSONSource>>(null)
  const getSource = computed(() => source.value)

  useMapReloadEvent(mapRef, {
    unLoad: removeSource,
    onLoad: initSource
  })

  function sourcedataEventFn(e: MapSourceDataEvent) {
    const map = unref(mapRef)!
    let isSourceLoaded = e.isSourceLoaded
    if (getMainVersion() === 1) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = map?.getSource(sourceId) as GeoJSONSource

      register?.(
        {
          sourceId,
          getSource,
          setData
        },
        map
      )
      map?.off('sourcedata', sourcedataEventFn)
    }
  }

  function initSource() {
    const map = unref(mapRef)
    if (map && !source.value && !hasSource(map, sourceId)) {
      map.addSource(sourceId, {
        ...options,
        type: sourceType,
        data
      })
      map.on('sourcedata', sourcedataEventFn)
    }
  }
  function setData(dataVal: GeoJSONSourceOptions['data']) {
    const map = unref(mapRef)
    if (map && source.value && hasSource(map, sourceId)) {
      dataVal && source.value.setData(dataVal)
    }
  }

  function removeSource() {
    const map = unref(mapRef)
    source.value = null
    if (map && hasSource(map, sourceId)) {
      map.removeSource(sourceId)
      map.off('sourcedata', sourcedataEventFn)
    }
  }
  onUnmounted(removeSource)

  return {
    sourceId,
    getSource,
    setData,
    removeSource
  }
}
