import { ref, unref, shallowRef, computed, onUnmounted } from 'vue'
import type { ShallowRef } from 'vue'
import type {
  Map,
  MapSourceDataEvent,
  VectorSourceImpl,
  VectorSourceOptions
} from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { MapboxSourceType } from '@/enums/MapboxSourceEnum'
import { hasSource } from '@/helpers/mapUtils'
import { getShallowRef } from '@/helpers/getRef'
import type { Nullable, ShallowRefOrNo } from '@/types'
import { isV1Map } from '@/helpers/mapVersion'

interface CreateVectorTileSourceProps {
  map: ShallowRefOrNo<Nullable<Map>>
  url?: string
  tiles?: string[]
  id?: string
  options?: Partial<VectorSourceOptions>
  register?: (actions: CreateVectorTileSourceActions, map: Map) => void
}

interface CreateVectorTileSourceActions {
  sourceId: string
  getSource: ShallowRef<Nullable<VectorSourceImpl>>
  setUrl: (url: string) => void
  setTiles: (tiles: string[]) => void
  reload: () => void
}

export function useCreateVectorTileSource({
  map,
  id,
  register,
  url: urlVal,
  tiles: tilesVal,
  options: optionsVal = {}
}: CreateVectorTileSourceProps) {
  const mapInstance = getShallowRef(map)
  const sourceType = MapboxSourceType.Vector
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<VectorSourceImpl>>(null)
  const getSource = computed(() => source.value)
  const url = ref<string>(urlVal ?? '')
  const tiles = ref<string[]>(tilesVal ?? [])

  function sourcedataEventFn(e: MapSourceDataEvent) {
    let isSourceLoaded = e.isSourceLoaded
    if (isV1Map()) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = mapInstance.value!.getSource(sourceId) as VectorSourceImpl
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

  function initVectorTileSource() {
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
        tiles: tiles.value?.length ? tiles.value : [url.value]
      })
      map.on('sourcedata', sourcedataEventFn)
    }
  }

  function setUrl(urlVal = '') {
    url.value = urlVal
    if (!source.value) {
      initVectorTileSource()
      return
    }
    if (urlVal) {
      ;(source.value as any).setUrl(urlVal)
      reload()
    }
  }
  function setTiles(tilesVal?: string[]) {
    tiles.value = tilesVal ? tilesVal : []
    if (!source.value) {
      initVectorTileSource()
      return
    }
    if (tiles.value.length) {
      ;(source.value as any).setTiles(tilesVal)
      reload()
    }
  }
  function reload() {
    ;(source.value as any)?.reload()
  }
  useMapReloadEvent(mapInstance, {
    unLoad: removeSource,
    onLoad: initVectorTileSource
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
    getSource,
    sourceId,
    setUrl,
    setTiles,
    reload,
    removeSource
  }
}
