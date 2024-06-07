import { onUnmounted, unref, watchEffect } from 'vue'
import type { CreateRasterDemSourceProps } from '@/hooks/sources/useCreateRasterDemSource'
import { useCreateRasterDemSource } from '@/hooks/sources/useCreateRasterDemSource'

export interface CreateTerrainProps extends CreateRasterDemSourceProps {
  exaggeration?: number
}

export function useCreateTerrain(props: CreateTerrainProps) {
  const {
    removeSource,
    sourceId,
    getSource: getTerrainSource,
    setTiles: setTerrainTiles,
    setUrl: setTerrainUrl
  } = useCreateRasterDemSource({
    map: props.map,
    id: props.id,
    url: props.url,
    tiles: props.tiles,
    options: props.options
  })
  const stopEffect = watchEffect(() => {
    const map = unref(props.map)
    if (map && getTerrainSource.value) {
      map.setTerrain({
        source: sourceId,
        exaggeration: props.exaggeration ?? 1
      })
    }
  })
  function removeTerrain() {
    const map = unref(props.map)
    if (map && map.getTerrain()) {
      map?.setTerrain(null)
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
