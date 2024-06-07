import { ref, unref, shallowRef, computed, onUnmounted } from 'vue'
import type { MaybeRef, ShallowRef } from 'vue'
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
import type { Nullable } from '@/types'
import { getMainVersion } from '@/helpers/mapVersion'

export interface CreateRasterDemSourceProps {
  map: MaybeRef<Nullable<Map>>
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
  map: mapRef,
  id,
  register,
  url: urlVal,
  tiles: tilesVal,
  options: optionsVal = {}
}: CreateRasterDemSourceProps) {
  const sourceType = MapboxSourceType.RasterDem
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<RasterDemSource>>(null)
  const getSource = computed(() => source.value)
  const url = ref<string>(urlVal ?? '')
  const tiles = ref<string[]>(tilesVal ?? [])

  function sourcedataEventFn(e: MapSourceDataEvent) {
    const map = unref(mapRef)!
    let isSourceLoaded = e.isSourceLoaded
    if (getMainVersion() === 1) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = map?.getSource(sourceId) as RasterDemSource
      register?.(
        {
          sourceId,
          getSource,
          setUrl,
          setTiles,
          reload
        },
        map
      )
      map?.off('sourcedata', sourcedataEventFn)
    }
  }

  function createSource() {
    const map = unref(mapRef)
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
  useMapReloadEvent(mapRef, {
    unLoad: removeSource,
    onLoad: createSource
  })

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
    setUrl,
    setTiles,
    reload,
    removeSource
  }
}
