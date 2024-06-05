import type { ShallowRef, Ref } from 'vue'
import { shallowRef, watchEffect, onUnmounted } from 'vue'
import type { ControlPosition } from 'mapbox-gl'
import { Map, FullscreenControl } from 'mapbox-gl'
import { getRef } from '@/helpers/getRef'
import type { Nullable } from '@/types'

interface FullscreenControlProps {
  map: ShallowRef<Nullable<Map>>
  container?:
    | Ref<HTMLElement | string | undefined | null>
    | HTMLElement
    | string
  position?: ControlPosition
}

export function useFullscreenControl({
  map,
  container: containerEl,
  position = 'bottom-right'
}: FullscreenControlProps) {
  const fullscreenControl = shallowRef<Nullable<FullscreenControl>>(null)
  const container = getRef(containerEl)
  const stopEffect = watchEffect(() => {
    if (map.value && !fullscreenControl.value) {
      let containerElement: HTMLElement | null | undefined
      if (typeof container.value === 'string') {
        containerElement = document.querySelector<HTMLElement>(container.value)
      } else {
        containerElement = container.value
      }
      fullscreenControl.value = new FullscreenControl({
        container: containerElement || document.body
      })
      map.value.addControl(fullscreenControl.value, position)
    }
  })
  function remove() {
    stopEffect()
    if (map.value && fullscreenControl.value) {
      map.value.removeControl(fullscreenControl.value)
    }
    fullscreenControl.value = null
  }
  onUnmounted(() => {
    remove()
  })
  return remove
}
