import type {
  MapboxEvent,
  MapboxOptions,
  Style,
  LngLatBoundsLike,
  LngLatLike,
  Projection
} from 'mapbox-gl'
import { Map } from 'mapbox-gl'
import { ref, shallowRef, computed, watchEffect, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { MapboxStatus } from '@/enums/MapboxEnum'
import type { CreateMapboxActions } from '@/types'

interface CreateMapboxProps extends MapboxOptions {
  register?: (actions: CreateMapboxActions) => void
}

export function useCreateMapbox(
  elRef: MaybeRef<HTMLElement | undefined>,
  props: Omit<CreateMapboxProps, 'container'> = {}
) {
  const mapInstance = shallowRef<Map | null>(null)
  const mapStatus = ref<MapboxStatus>(MapboxStatus.NotLoaded)
  const { register, ...options } = props
  const mapOptions = ref<Omit<MapboxOptions, 'container'>>(options)

  const stopWatchEffect = watchEffect(() => {
    removeMap()
    if (!unref(mapInstance) && unref(elRef)) {
      initMap()
      stopWatchEffect()
    }
  })
  function checkInitMap() {
    if (!options.center && !options.bounds) {
      console.warn('center or bounds is not exist')
      return
    }
    initMap()
  }
  function initMap() {
    mapStatus.value = MapboxStatus.NotLoaded
    const options = unref(mapOptions)
    const el = unref(elRef)
    if (!el) {
      console.warn('el is not exist')
      return
    }
    mapInstance.value = new Map({
      attributionControl: false,
      ...options,
      container: el
    })
    mapStatus.value = MapboxStatus.Loading
    register?.(methods)
    mapInstance.value.on('load', mapEventLoad)
    mapInstance.value.on('error', mapEventError)
  }

  function removeMap() {
    const map = unref(mapInstance)
    if (map) {
      map.off('load', mapEventLoad)
      map.off('error', mapEventError)
      map.remove()
    }
    mapInstance.value = null
  }

  function mapEventLoad() {
    mapStatus.value = MapboxStatus.Loaded
  }
  function mapEventError(ev: MapboxEvent) {
    console.warn('map error', ev)
  }

  function setCenter(centerVal: LngLatLike) {
    mapInstance.value?.setCenter(centerVal)
    mapOptions.value.center = centerVal
  }
  function setBearing(bearing = 0) {
    mapInstance.value?.setBearing(bearing)
    mapOptions.value.bearing = bearing
  }
  function setZoom(zoom: number) {
    mapInstance.value?.setZoom(zoom)
    mapOptions.value.zoom = zoom
  }
  function setPitch(pitch: number) {
    mapInstance.value?.setPitch(pitch)
    mapOptions.value.pitch = pitch
  }
  function setStyle(style: string | Style) {
    mapInstance.value?.setStyle(style, {
      diff: true
    })
    mapOptions.value.style = style
  }
  function setMaxBounds(bounds?: LngLatBoundsLike) {
    mapInstance.value?.setMaxBounds(bounds)
    mapOptions.value.maxBounds = bounds
  }
  function setMaxPitch(pitch = 60) {
    mapInstance.value?.setMaxPitch(pitch)
    mapOptions.value.maxPitch = pitch
  }
  function setMaxZoom(zoom = 24) {
    mapInstance.value?.setMaxZoom(zoom)
    mapOptions.value.maxZoom = zoom
  }
  function setMinPitch(pitch = 0) {
    mapInstance.value?.setMinPitch(pitch)
    mapOptions.value.minPitch = pitch
  }
  function setMinZoom(zoom = 0) {
    mapInstance.value?.setMinZoom(zoom)
    mapOptions.value.minZoom = zoom
  }
  function setProjection(
    projection: Projection = {
      name: 'mercator'
    }
  ) {
    mapInstance.value?.setProjection(projection)
    mapOptions.value.projection = projection
  }
  function setRenderWorldCopies(renderWorldCopies = true) {
    mapInstance.value?.setRenderWorldCopies(renderWorldCopies)
    mapOptions.value.renderWorldCopies = renderWorldCopies
  }

  function setConfig(config: NonNullable<MapboxOptions['config']>) {
    Object.keys(config).forEach(importId => {
      const itemConfig = config[importId]
      mapInstance.value?.setConfig(importId, itemConfig)
    })
    mapOptions.value.config = { ...config }
  }

  const methods: CreateMapboxActions = {
    getMapInstance: computed(() => mapInstance.value),
    getMapStatus: computed(() => mapStatus.value),
    setRenderWorldCopies,
    setProjection,
    setMinZoom,
    setMinPitch,
    setMaxZoom,
    setMaxPitch,
    setMaxBounds,
    setStyle,
    setPitch,
    setZoom,
    setBearing,
    setCenter,
    setConfig
  }

  return {
    initMap,
    removeMap,
    checkInitMap,
    ...methods
  }
}
