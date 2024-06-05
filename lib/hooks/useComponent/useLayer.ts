import { hasLayer } from '@/helpers/mapUtils'
import type { CreateLayerActions, ILayer, Nullable } from '@/types'
import type { AnyLayer, Expression, Map } from 'mapbox-gl'
import { computed, type ComputedRef } from 'vue'
import { ref, shallowRef } from 'vue'

interface Methods<T extends ILayer> {
  layerId: ComputedRef<string | undefined>
  getLayer: ComputedRef<Nullable<AnyLayer>>
  getFilter: () => any[] | undefined
  getLayoutProperty: (name: keyof T['layout']) => any
  getPaintProperty: (name: keyof T['paint']) => any
  setBeforeId: (beforeId?: string) => void
  setFilter: (filter?: Expression) => void
  setPaintProperty: (
    name: string,
    value: any,
    options?: {
      validate: boolean
    }
  ) => void
  setLayoutProperty: (
    name: string,
    value: any,
    options?: {
      validate: boolean
    }
  ) => void
  setZoomRange: (minzoom?: number, maxzoom?: number) => void
  removeLayer: () => void

  setStyle: (styleVal: T['layout'] & T['paint']) => void
}

export function useLayer<T extends ILayer>(): [
  (componentAction: CreateLayerActions<T>, map: Map) => void,
  Methods<T>
] {
  const layer = shallowRef<Nullable<AnyLayer>>(null)
  const layerId = ref<string>()
  const mapInstance = ref<Nullable<Map>>()
  let componentMethods: CreateLayerActions<T> | null = null

  function register(componentAction: CreateLayerActions<T>, map: Map) {
    layer.value = componentAction.getLayer.value
    layerId.value = componentAction.layerId
    componentMethods = componentAction
    mapInstance.value = map
  }

  const methods: Methods<T> = {
    layerId: computed(() => layerId.value),
    getLayer: computed(() => layer.value),
    getFilter: () => {
      if (
        mapInstance.value &&
        layerId.value &&
        hasLayer(mapInstance.value, layerId.value)
      ) {
        return mapInstance.value.getFilter(layerId.value)
      }
    },
    getLayoutProperty: (name: keyof T['layout']) => {
      if (
        mapInstance.value &&
        layerId.value &&
        hasLayer(mapInstance.value, layerId.value)
      ) {
        return mapInstance.value.getLayoutProperty(
          layerId.value,
          name as string
        )
      }
    },
    getPaintProperty: (name: keyof T['paint']) => {
      if (
        mapInstance.value &&
        layerId.value &&
        hasLayer(mapInstance.value, layerId.value)
      ) {
        return mapInstance.value.getPaintProperty(layerId.value, name as string)
      }
    },
    setBeforeId: (beforeId?: string) => {
      componentMethods?.setBeforeId(beforeId)
    },
    setFilter: (filter?: Expression) => {
      componentMethods?.setFilter(filter)
    },
    setPaintProperty: (
      name: string,
      value: any,
      options?: { validate: boolean }
    ) => {
      componentMethods?.setPaintProperty(name, value, options)
    },
    setLayoutProperty: (
      name: string,
      value: any,
      options?: { validate: boolean }
    ) => {
      componentMethods?.setLayoutProperty(name, value, options)
    },
    setZoomRange: (minzoom?: number, maxzoom?: number) => {
      componentMethods?.setZoomRange(minzoom, maxzoom)
    },
    removeLayer: () => {
      componentMethods?.removeLayer()
    },
    setStyle: (styleVal: T['layout'] & T['paint']) => {
      componentMethods?.setStyle(styleVal)
    }
  }

  return [register, methods]
}
