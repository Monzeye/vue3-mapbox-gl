import { ref, unref, shallowRef, computed, onUnmounted } from 'vue'
import type { MaybeRef, ShallowRef } from 'vue'
import type {
  Map,
  ImageSource,
  ImageSourceOptions,
  MapSourceDataEvent
} from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { MapboxSourceType } from '@/enums/MapboxSourceEnum'
import { hasSource } from '@/helpers/mapUtils'
import type { Nullable } from '@/types'
import { getMainVersion } from '@/helpers/mapVersion'

interface CreateImageSourceProps {
  map: MaybeRef<Nullable<Map>>
  id?: string
  url?: string
  coordinates?: ImageSourceOptions['coordinates']
  register?: (actions: CreateImageSourceActions, map: Map) => void
}

interface CreateImageSourceActions {
  sourceId: string
  getSource: ShallowRef<Nullable<ImageSource>>
  updateSource: (options: Partial<ImageSourceOptions>) => void
}

export function useCreateImageSource({
  map: mapRef,
  id,
  register,
  url: urlVal,
  coordinates: coordinatesVal
}: CreateImageSourceProps) {
  const sourceType = MapboxSourceType.Image
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<ImageSource>>(null)
  const getSource = computed(() => source.value)

  const url = ref(urlVal)
  const coordinates = ref<ImageSourceOptions['coordinates']>(coordinatesVal)

  function updateImage(options: ImageSourceOptions) {
    const map = unref(mapRef)
    if (map && source.value && hasSource(map, sourceId)) {
      source.value.updateImage(options)
    }
  }
  function setCoordinates(coordinates: ImageSourceOptions['coordinates']) {
    const map = unref(mapRef)
    if (map && source.value && hasSource(map, sourceId)) {
      coordinates && source.value.setCoordinates(coordinates)
    }
  }
  function updateSource(options: Partial<ImageSourceOptions>) {
    url.value = options.url ? options.url : ''
    if (options.coordinates) {
      coordinates.value = options.coordinates
    }
    if (!source.value) {
      createSource()
      return
    }
    if (options.url) {
      updateImage(options)
    } else {
      options.coordinates && setCoordinates(options.coordinates)
    }
  }

  function sourcedataEventFn(e: MapSourceDataEvent) {
    const map = unref(mapRef)!
    let isSourceLoaded = e.isSourceLoaded
    if (getMainVersion() === 1) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = map?.getSource(sourceId) as ImageSource
      register?.(
        {
          sourceId,
          getSource,
          updateSource
        },
        map
      )
      map?.off('sourcedata', sourcedataEventFn)
    }
  }

  function createSource() {
    const map = unref(mapRef)
    if (!map) return
    if (
      !source.value &&
      url.value &&
      coordinates.value?.length &&
      !hasSource(map, sourceId)
    ) {
      map.addSource(sourceId, {
        type: sourceType,
        url: url.value,
        coordinates: coordinates.value
      })
      map.on('sourcedata', sourcedataEventFn)
    }
  }
  useMapReloadEvent(mapRef, {
    unLoad: () => {
      removeSource()
    },
    onLoad: () => {
      createSource()
    }
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
    updateSource,
    removeSource
  }
}
