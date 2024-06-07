import { computed, effectScope, ref, shallowRef, unref, watch } from 'vue'
import type { ComputedRef, EffectScope } from 'vue'
import type { CreateGeoJsonSourceActions } from '@/hooks/sources/useCreateGeoJsonSource'
import type { GeoJSONSource, GeoJSONSourceOptions } from 'mapbox-gl'
import type { Point, Feature, GeoJsonProperties } from 'geojson'
import type { Nullable } from '@/types'

interface Methods {
  sourceId: ComputedRef<string | undefined>
  getSource: ComputedRef<Nullable<GeoJSONSource>>
  setData: (dataVal: GeoJSONSourceOptions['data']) => void
  getClusterExpansionZoom: (clusterId: number) => Promise<number>
  getClusterChildren: <T extends GeoJsonProperties = any>(
    clusterId: number
  ) => Promise<Feature<Point, T>[]>
  getClusterLeaves: <T extends GeoJsonProperties = any>(
    clusterId: number,
    limit?: number,
    offset?: number
  ) => Promise<Feature<Point, T>[]>
}

export function useGeoJsonSource(): [
  (componentAction: CreateGeoJsonSourceActions) => void,
  Methods
] {
  const instanceRef = ref<CreateGeoJsonSourceActions>()
  const loadedRef = ref<boolean>(false)

  const sourceRef = shallowRef<Nullable<GeoJSONSource>>(null)
  const sourceIdRef = ref<string>()
  let watchScope: EffectScope

  let componentMethods: CreateGeoJsonSourceActions

  function register(instance: CreateGeoJsonSourceActions) {
    if (unref(loadedRef) && instance === unref(instanceRef)) return
    instanceRef.value = instance

    loadedRef.value = true

    watchScope?.stop()

    watchScope = effectScope()
    watchScope.run(() => {
      watch(
        () => instance.getSource.value,
        source => {
          sourceRef.value = source
          sourceIdRef.value = instance.sourceId
        },
        {
          immediate: true
        }
      )
    })
  }
  // function getInstance(): CreateGeoJsonSourceActions | undefined {
  //   const instance = unref(instanceRef)
  //   if (!instance) {
  //     console.warn('useGeoJsonSource: The Actions is undefined')
  //   }
  //   return instance
  // }
  function getSourceInstance(): GeoJSONSource | null | undefined {
    const sourceInstance = unref(sourceRef)
    if (!sourceInstance) {
      console.warn('useGeoJsonSource: The GeoJSONSource is undefined')
    }
    return sourceInstance
  }

  const methods: Methods = {
    sourceId: computed(() => sourceIdRef.value),
    getSource: computed(() => sourceRef.value),
    setData: (dataVal: GeoJSONSourceOptions['data']) => {
      componentMethods.setData?.(dataVal)
    },
    getClusterExpansionZoom: (clusterId: number) => {
      return new Promise((resolve, reject) => {
        getSourceInstance()?.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return reject(err)
          resolve(zoom)
        })
      })
    },
    getClusterChildren: <T extends GeoJsonProperties = any>(
      clusterId: number
    ) => {
      return new Promise<Feature<Point, T>[]>((resolve, reject) => {
        getSourceInstance()?.getClusterChildren(clusterId, (err, features) => {
          if (err) return reject(err)
          resolve(features as Feature<Point, T>[])
        })
      })
    },
    getClusterLeaves: <T extends GeoJsonProperties = any>(
      clusterId: number,
      limit = 10,
      offset = 0
    ) => {
      return new Promise<Feature<Point, T>[]>((resolve, reject) => {
        getSourceInstance()?.getClusterLeaves(
          clusterId,
          limit,
          offset,
          (err, features) => {
            if (err) return reject(err)
            resolve(features as Feature<Point, T>[])
          }
        )
      })
    }
  }

  return [register, methods]
}
