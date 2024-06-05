<script lang="ts" setup>
import { ref, provide, computed, unref, onUnmounted } from 'vue'
import { MapProvideKey } from '@/enums/MapProvideKey'
import { MapboxEvents, MapboxStatus } from '@/enums/MapboxEnum'
import { watch } from 'vue'

import { useCreateMapbox } from '@/hooks/mapbox/useCreateMapbox'
import type {
  MapboxEvent,
  MapboxOptions,
  MapBoxZoomEvent,
  MapContextEvent,
  MapDataEvent,
  MapEventTypes,
  MapMouseEvent,
  MapSourceDataEvent,
  MapStyleDataEvent,
  MapTouchEvent,
  MapWheelEvent
} from 'mapbox-gl'
import { useCreateStats } from '@/hooks/mapbox/useCreateStats'
import type { CreateMapboxActions, MapboxActions } from '@/types'
import { useMapEventListener } from '@/hooks/event/useMapEventListener'
interface MapboxProps {
  width?: string
  height?: string
  showStats?: boolean
  options?: Partial<MapboxOptions>
}

const props = withDefaults(
  defineProps<
    MapboxProps & {
      register?: (mapboxComponentAction: MapboxActions) => void
    }
  >(),
  {
    width: '100%',
    height: '100%',
    showStats: false,
    options: () => ({}) as Partial<MapboxOptions>
  }
)

const innerOptions = ref<Partial<MapboxOptions>>({})
const mapOptions = computed(() => {
  return {
    ...props.options,
    ...innerOptions.value
  }
})

function setMapOptions(options: Partial<MapboxOptions>) {
  innerOptions.value = {
    ...unref(mapOptions),
    ...options
  }
}

const emit = defineEmits<{
  (e: keyof MapEventTypes, ev: any): void
  (e: 'register', mapboxComponentAction: MapboxActions): void
  (e: 'error', ev: ErrorEvent): void
  (e: 'load', ev: MapboxEvent): void
  (e: 'idle', ev: MapboxEvent): void
  (e: 'remove', ev: MapboxEvent): void
  (e: 'render', ev: MapboxEvent): void
  (e: 'resize', ev: MapboxEvent): void
  (e: 'webglcontextlost', ev: MapContextEvent): void
  (e: 'webglcontextrestored', ev: MapContextEvent): void
  (e: 'dataloading', ev: MapDataEvent): void
  (e: 'data', ev: MapDataEvent): void
  (e: 'tiledataloading', ev: MapDataEvent): void
  (e: 'sourcedataloading', ev: MapSourceDataEvent): void
  (e: 'styledataloading', ev: MapStyleDataEvent): void
  (e: 'sourcedata', ev: MapSourceDataEvent): void
  (e: 'styledata', ev: MapStyleDataEvent): void
  (e: 'boxzoomcancel', ev: MapBoxZoomEvent): void
  (e: 'boxzoomstart', ev: MapBoxZoomEvent): void
  (e: 'boxzoomend', ev: MapBoxZoomEvent): void
  (e: 'touchcancel', ev: MapTouchEvent): void
  (e: 'touchmove', ev: MapTouchEvent): void
  (e: 'touchend', ev: MapTouchEvent): void
  (e: 'touchstart', ev: MapTouchEvent): void
  (e: 'click', ev: MapMouseEvent): void
  (e: 'contextmenu', ev: MapMouseEvent): void
  (e: 'dblclick', ev: MapMouseEvent): void
  (e: 'mousemove', ev: MapMouseEvent): void
  (e: 'mouseup', ev: MapMouseEvent): void
  (e: 'mousedown', ev: MapMouseEvent): void
  (e: 'mouseout', ev: MapMouseEvent): void
  (e: 'mouseover', ev: MapMouseEvent): void
  (
    e: 'movestart',
    ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ): void
  (
    e: 'move',
    ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ): void
  (
    e: 'moveend',
    ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ): void
  (
    e: 'zoomstart',
    ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ): void
  (
    e: 'zoom',
    ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ): void
  (
    e: 'zoomend',
    ev: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ): void
  (e: 'rotatestart', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'rotate', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'rotateend', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'dragstart', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'drag', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'dragend', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'pitchstart', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'pitch', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'pitchend', ev: MapboxEvent<MouseEvent | TouchEvent | undefined>): void
  (e: 'wheel', ev: MapWheelEvent): void
}>()

const statsElRef = ref<HTMLElement>()
const mapboxElRef = ref<HTMLElement>()

const eventFnMap: {
  [propName in keyof MapEventTypes]: (ev: any) => void
} = {} as any

const {
  // initMap,
  getMapInstance,
  getMapStatus,
  setCenter,
  setBearing,
  setZoom,
  setPitch,
  setStyle,
  setMaxBounds,
  setMaxPitch,
  setMaxZoom,
  setMinPitch,
  setMinZoom,
  setProjection,
  setRenderWorldCopies
  // setConfigProperty
} = useCreateMapbox(mapboxElRef, {
  ...unref(mapOptions),
  register: (actions: CreateMapboxActions) => {
    props.register?.({
      ...actions,
      setMapOptions
    })
    emit('register', {
      ...actions,
      setMapOptions
    })
  }
})

MapboxEvents.map(eventName => {
  useMapEventListener({
    map: getMapInstance,
    event: eventName,
    on: data => {
      emit(eventName, data)
    }
  })
})

provide(MapProvideKey, getMapInstance)

props.showStats && useCreateStats(statsElRef)

onUnmounted(() => {
  MapboxEvents.forEach(event => {
    getMapInstance.value?.off(event, eventFnMap[event])
  })
})

watch(() => unref(mapOptions).center!, setCenter)
watch(() => unref(mapOptions).bearing!, setBearing)
watch(() => unref(mapOptions).zoom!, setZoom)
watch(() => unref(mapOptions).pitch!, setPitch)
watch(() => unref(mapOptions).style!, setStyle)
watch(() => unref(mapOptions).maxBounds!, setMaxBounds)
watch(() => unref(mapOptions).maxPitch!, setMaxPitch)
watch(() => unref(mapOptions).maxZoom!, setMaxZoom)
watch(() => unref(mapOptions).minPitch!, setMinPitch)
watch(() => unref(mapOptions).minZoom!, setMinZoom)
watch(() => unref(mapOptions).projection!, setProjection)
watch(() => unref(mapOptions).renderWorldCopies!, setRenderWorldCopies)
</script>
<template>
  <div
    class="mapbox_wrapper"
    :style="{
      width: props.width,
      height: props.height
    }">
    <div ref="mapboxElRef" class="mapbox_container" />
    <slot v-if="getMapStatus >= MapboxStatus.Loading" name="beforeLoad" />
    <slot v-if="getMapStatus >= MapboxStatus.Loaded" name="default" />
    <div v-if="props.showStats" ref="statsElRef" class="mapbox_stats" />
  </div>
</template>
<style lang="scss">
.mapbox_wrapper {
  position: relative;
  .mapbox_container {
    width: 100%;
    height: 100%;
  }
  .mapbox_stats {
    & > div {
      position: absolute !important;
    }
  }
}
</style>
