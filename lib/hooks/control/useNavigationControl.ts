import type { ShallowRef } from 'vue'
import { shallowRef, watchEffect, onUnmounted } from 'vue'
import type { Map, NavigationControlOptions, ControlPosition } from 'mapbox-gl'
import { NavigationControl } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface NavigationControlProps {
  map: ShallowRef<Nullable<Map>>
  position?: ControlPosition
  showCompass?: boolean
  showZoom?: boolean
  visualizePitch?: boolean
}

export function useNavigationControl({
  map,
  position = 'top-right',
  showCompass = true,
  showZoom = true,
  visualizePitch = false
}: NavigationControlProps) {
  const navigationControl = shallowRef<Nullable<NavigationControl>>(null)
  const options: NavigationControlOptions = {
    showCompass,
    showZoom,
    visualizePitch
  }
  const stopEffect = watchEffect(() => {
    if (map.value && !navigationControl.value) {
      navigationControl.value = new NavigationControl(options)
      map.value.addControl(navigationControl.value, position)
    }
  })
  function remove() {
    stopEffect()
    if (map.value && navigationControl.value) {
      map.value.removeControl(navigationControl.value)
    }
    navigationControl.value = null
  }
  onUnmounted(() => {
    remove()
  })
  return remove
}
