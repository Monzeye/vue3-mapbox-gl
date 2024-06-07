import { ref, unref, shallowRef, computed, onUnmounted } from 'vue'
import type { MaybeRef, ShallowRef } from 'vue'
import type {
  Map,
  CanvasSource,
  CanvasSourceOptions,
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
  canvas?: string | HTMLCanvasElement
  animate?: boolean
  coordinates?: CanvasSourceOptions['coordinates']
  register?: (actions: CreateImageSourceActions, map: Map) => void
}

interface CreateImageSourceActions {
  sourceId: string
  setPlay: (isPlay: boolean) => void
  getSource: ShallowRef<Nullable<CanvasSource>>
  getCanvas: () => HTMLCanvasElement | undefined
  setCoordinates: (
    coordinates: Required<CanvasSourceOptions>['coordinates']
  ) => void
}

export function useCreateCanvasSource({
  map: mapRef,
  id,
  register,
  animate = false,
  canvas: canvasVal,
  coordinates: coordinatesVal
}: CreateImageSourceProps) {
  const sourceType = MapboxSourceType.Canvas
  const sourceId = getNanoid(id)
  const source = shallowRef<Nullable<CanvasSource>>(null)
  const coordinates = ref<CanvasSourceOptions['coordinates'] | undefined>(
    coordinatesVal
  )
  const getSource = computed(() => source.value)

  useMapReloadEvent(mapRef, {
    unLoad: removeSource,
    onLoad: createSource
  })

  function sourcedataEventFn(e: MapSourceDataEvent) {
    const map = unref(mapRef)!
    let isSourceLoaded = e.isSourceLoaded
    if (getMainVersion() === 1) {
      isSourceLoaded = true
    }
    if (!source.value && e.sourceId === sourceId && isSourceLoaded) {
      source.value = map?.getSource(sourceId) as CanvasSource
      register?.(
        {
          sourceId,
          setPlay,
          getSource,
          setCoordinates,
          getCanvas
        },
        map
      )
      map?.off('sourcedata', sourcedataEventFn)
    }
  }

  function createSource() {
    const map = unref(mapRef)
    if (!canvasVal) {
      canvasVal = document.createElement('canvas')
    }
    if (!source.value && map && canvasVal && coordinates.value?.length) {
      map.addSource(sourceId, {
        type: sourceType,
        canvas: canvasVal,
        animate,
        coordinates: coordinates.value
      })
      map.on('sourcedata', sourcedataEventFn)
    }
  }

  function setCoordinates(
    coordinatesVal: Required<CanvasSourceOptions>['coordinates']
  ) {
    if (coordinatesVal.length) {
      coordinates.value = coordinatesVal
    }
    if (!source.value) {
      createSource()
      return
    }
    coordinates.value && source.value.setCoordinates(coordinatesVal)
  }

  function setPlay(playVal: boolean) {
    if (source.value) {
      if (playVal) {
        ;(source.value as any).play()
      } else {
        ;(source.value as any).pause()
      }
    }
  }

  function getCanvas() {
    return source.value?.getCanvas()
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
    setPlay,
    getCanvas,
    getSource,
    setCoordinates,
    removeSource
  }
}
