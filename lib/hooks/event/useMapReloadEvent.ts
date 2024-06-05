import { watchEffect, onUnmounted } from 'vue'
import type { ShallowRef } from 'vue'
import type { Map } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface CBFn {
  (map: ShallowRef<Map>): void
}
export function useMapReloadEvent(
  map: ShallowRef<Nullable<Map>>,
  cbObj: {
    unLoad?: CBFn
    onLoad: CBFn
  }
) {
  let isMapLoad = !!(map.value as any)?._loaded
  isMapLoad && cbObj.onLoad && cbObj.onLoad(map as ShallowRef<Map>)
  const unLoadEventFn = () => {
    if (!isMapLoad) return
    isMapLoad = false
    cbObj.unLoad && cbObj.unLoad(map as ShallowRef<Map>)
  }
  const loadEventFn = () => {
    if (isMapLoad) return
    isMapLoad = true
    cbObj.onLoad && cbObj.onLoad(map as ShallowRef<Map>)
  }
  function clear() {
    if (map.value) {
      map.value.off('styledata', loadEventFn)
      map.value.off('styledataloading', unLoadEventFn)
      map.value.off('load', loadEventFn)
    }
  }
  const stopEffect = watchEffect(onCleanUp => {
    if (!map.value) return
    if (!isMapLoad) {
      map.value.on('load', loadEventFn)
    }
    map.value.on('styledata', loadEventFn)
    map.value.on('styledataloading', unLoadEventFn)
    onCleanUp(clear)
  })
  onUnmounted(() => {
    unLoadEventFn()
    stopEffect()
    clear()
  })
  return {
    clear
  }
}
