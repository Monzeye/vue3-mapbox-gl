import { ref, unref, shallowRef, computed, onUnmounted } from 'vue'
import type { ShallowRef } from 'vue'
import type {
  Map,
  MapSourceDataEvent,
  RasterDemSource,
  RasterDemSourceOptions
} from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { MapboxSourceType } from '@/enums/MapboxSourceEnum'
import { hasSource } from '@/helpers/mapUtils'
import type { Nullable, ShallowRefOrNo } from '@/types'
import { getShallowRef } from '@/helpers/getRef'
import { isV1Map } from '@/helpers/mapVersion'

export interface CreateRasterDemSourceProps {
  map: ShallowRefOrNo<Nullable<Map>>
  url?: string
  tiles?: string[]
  id?: string
  options?: Partial<RasterDemSourceOptions>
  register?: (actions: CreateRasterDemSourceActions, map: Map) => void
}

interface CreateRasterDemSourceActions {
  sourceId: string
  getSource: ShallowRef<Nullable<RasterDemSource>>
  setUrl: (url: string) => void
  setTiles: (tiles: string[]) => void
  reload: () => void
}

export function useCreateRasterDemSource({
  map,
  id,
  register,
  url: urlVal,
  tiles: tilesVal,
  options: optionsVal = {}
}: CreateRasterDemSourceProps) {
  const mapInstance = getShallowRef(map)
  const sourceType = MapboxSourceType.RasterDem
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<RasterDemSource>>(null)
  const getSource = computed(() => source.value)
  const url = ref<string>(urlVal ?? '')
  const tiles = ref<string[]>(tilesVal ?? [])

  function sourcedataEventFn(e: MapSourceDataEvent) {
    let isSourceLoaded = e.isSourceLoaded
    if (isV1Map()) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = mapInstance.value!.getSource(sourceId) as RasterDemSource
      register?.(
        {
          sourceId,
          getSource,
          setUrl,
          setTiles,
          reload
        },
        mapInstance.value!
      )
      mapInstance.value!.off('sourcedata', sourcedataEventFn)
    }
  }

  function createSource() {
    const map = unref(mapInstance.value)
    if (
      !source.value &&
      map &&
      !hasSource(map, sourceId) &&
      (url.value || tiles.value.length)
    ) {
      map.addSource(sourceId, {
        ...optionsVal,
        type: sourceType,
        url: url.value,
        tiles: tiles.value
      })
      map.on('sourcedata', sourcedataEventFn)
    }
  }

  function setUrl(urlVal = '') {
    url.value = urlVal
    if (!source.value) {
      createSource()
      return
    }
    urlVal && (source.value as any).setUrl(urlVal)
  }
  function setTiles(tilesVal?: string[]) {
    tiles.value = tilesVal ? tilesVal : []
    if (!source.value) {
      createSource()
      return
    }
    tiles.value.length && (source.value as any).setTiles(tilesVal)
  }
  function reload() {
    ;(source.value as any)?.reload()
  }
  useMapReloadEvent(mapInstance, {
    unLoad: removeSource,
    onLoad: createSource
  })

  function removeSource() {
    const map = unref(mapInstance?.value)
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
    setUrl,
    setTiles,
    reload,
    removeSource
  }
}
