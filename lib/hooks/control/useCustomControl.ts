import type { ShallowRef, Ref } from 'vue'
import { shallowRef, watchEffect, onUnmounted, unref } from 'vue'
import type { Map, IControl, ControlPosition } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface CustomControlProps {
  map: ShallowRef<Nullable<Map>>
  container?: Ref<HTMLElement | undefined | null> | HTMLElement
  position?: ControlPosition
  className?: string
  on?: {
    add?: (map: Map, container: HTMLElement) => void
    remove?: (map: Map, container: HTMLElement) => void
  }
}

interface CustomControlOptions {
  className?: string
  el: HTMLElement
  on?: {
    add?: (map: Map, container: HTMLElement) => void
    remove?: (map: Map, container: HTMLElement) => void
  }
}

class CustomControl implements IControl {
  container: HTMLElement
  defaultClassName = 'mapboxgl__custom__control'
  on: {
    add?: (map: Map, container: HTMLElement) => void
    remove?: (map: Map, container: HTMLElement) => void
  } = {}
  constructor(options: CustomControlOptions) {
    this.container = document.createElement('div')
    this.on = options.on || {}
    options.el && this.container.appendChild(options.el)
    this.container.className = `${this.defaultClassName}${options.className ? ' ' + options.className : ''}`
  }
  onAdd(map: Map) {
    this.on.add && this.on.add(map, this.container)
    return this.container
  }
  onRemove(map: Map) {
    this.on.remove && this.on.remove(map, this.container)
    if (this.container) {
      this.container.parentNode?.removeChild(this.container)
    }
    this.container = null!
    this.on = null!
  }
  getDefaultPosition() {
    return 'top-right'
  }
}

export function useCustomControl({
  map,
  container,
  className,
  position = 'top-right',
  on = {}
}: CustomControlProps) {
  const customControl = shallowRef<Nullable<CustomControl>>(null)

  const stopEffect = watchEffect(() => {
    if (map.value && unref(container) && !customControl.value) {
      customControl.value = new CustomControl({
        el: unref(container)!,
        className,
        on: {
          add: (map, constructor) => {
            on.add && on.add(map, constructor)
          },
          remove: (map, constructor) => {
            on.remove && on.remove(map, constructor)
          }
        }
      })
      map.value.addControl(customControl.value, position)
    }
  })
  function remove() {
    stopEffect()
    if (map.value && customControl.value) {
      map.value.removeControl(customControl.value)
    }
    customControl.value = null
  }
  onUnmounted(() => {
    remove()
  })
  return remove
}
