import { onUnmounted, watchEffect } from 'vue'
import { getShallowRef } from '@/helpers/getRef'
import type { CreateRasterDemSourceProps } from '@/hooks/sources/useCreateRasterDemSource'
import { useCreateRasterDemSource } from '@/hooks/sources/useCreateRasterDemSource'

export interface CreateTerrainProps extends CreateRasterDemSourceProps {
  exaggeration?: number
}

export function useCreateTerrain(props: CreateTerrainProps) {
  const mapInstance = getShallowRef(props.map)

  const {
    removeSource,
    sourceId,
    getSource: getTerrainSource,
    setTiles: setTerrainTiles,
    setUrl: setTerrainUrl
  } = useCreateRasterDemSource({
    map: mapInstance,
    id: props.id,
    url: props.url,
    tiles: props.tiles,
    options: props.options
  })
  const stopEffect = watchEffect(() => {
    if (mapInstance.value && getTerrainSource.value) {
      mapInstance.value.setTerrain({
        source: sourceId,
        exaggeration: props.exaggeration ?? 1
      })
    }
  })
  function removeTerrain() {
    if (mapInstance.value && mapInstance.value.getTerrain()) {
      mapInstance.value?.setTerrain(null)
    }
    removeSource()
  }

  onUnmounted(() => {
    stopEffect()
    removeTerrain()
  })
  return {
    removeTerrain,
    setTerrainUrl,
    setTerrainTiles
  }
}
