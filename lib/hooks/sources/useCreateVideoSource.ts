import { watch, ref, unref, shallowRef, computed, onUnmounted } from 'vue'
import type { MaybeRef, Ref } from 'vue'
import type {
  Map,
  MapSourceDataEvent,
  VideoSource,
  VideoSourceOptions
} from 'mapbox-gl'
import { getNanoid } from '@/helpers/getNanoid'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { MapboxSourceType } from '@/enums/MapboxSourceEnum'
import { hasSource } from '@/helpers/mapUtils'
import type { Nullable } from '@/types'
import { getMainVersion } from '@/helpers/mapVersion'

interface CreateImageSourceProps {
  map: MaybeRef<Nullable<Map>>
  urls: string[]
  id?: string
  coordinates?: VideoSourceOptions['coordinates']
  register?: (actions: CreateImageSourceActions, map: Map) => void
}

interface CreateImageSourceActions {
  sourceId: string
  play: Ref<boolean>
  setPlay: (isPlay: boolean) => void
  tooglePlay: () => void
  getVideo: () => HTMLVideoElement | undefined
  getSource: Ref<Nullable<VideoSource>>
  setCoordinates: (
    coordinates: Required<VideoSourceOptions>['coordinates']
  ) => void
}

export function useCreateVideoSource({
  map: mapRef,
  id,
  register,
  urls,
  coordinates: coordinatesVal
}: CreateImageSourceProps) {
  const sourceType = MapboxSourceType.Video
  const sourceId = getNanoid(id)
  const play = ref<boolean>(true)
  const source = shallowRef<Nullable<VideoSource>>(null)
  const coordinates = ref<VideoSourceOptions['coordinates']>(coordinatesVal)
  const getSource = computed(() => source.value)

  function setCoordinates(
    coordinatesVal: Required<VideoSourceOptions>['coordinates']
  ) {
    if (coordinatesVal.length) {
      coordinates.value = coordinatesVal
    }
    if (!source.value) {
      initImageSource()
      return
    }
    coordinatesVal && coordinates && source.value.setCoordinates(coordinatesVal)
  }
  function sourcedataEventFn(e: MapSourceDataEvent) {
    const map = unref(mapRef)!
    let isSourceLoaded = e.isSourceLoaded
    if (getMainVersion() === 1) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = map?.getSource(sourceId) as VideoSource
      register?.(
        {
          sourceId,
          play,
          setPlay,
          tooglePlay,
          getVideo,
          getSource,
          setCoordinates
        },
        map
      )
      map?.off('sourcedata', sourcedataEventFn)
    }
  }

  function initImageSource() {
    const map = unref(mapRef)
    if (
      !source.value &&
      map &&
      !hasSource(map, sourceId) &&
      urls.length &&
      coordinates.value?.length
    ) {
      map.addSource(sourceId, {
        type: sourceType,
        urls: urls,
        coordinates: coordinates.value
      })
      map.on('sourcedata', sourcedataEventFn)
    }
  }

  function setPlay(playVal: boolean) {
    play.value = playVal
    if (source.value) {
      if (play.value) {
        ;(source.value as any).play()
      } else {
        ;(source.value as any).pause()
      }
    }
  }
  function tooglePlay() {
    setPlay(!play.value)
  }
  function getVideo() {
    return source.value?.getVideo()
  }

  watch(play, val => {
    setPlay(val)
  })

  useMapReloadEvent(mapRef, {
    unLoad: removeSource,
    onLoad: initImageSource
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
    play,
    setPlay,
    tooglePlay,
    getVideo,
    getSource,
    setCoordinates,
    removeSource
  }
}
