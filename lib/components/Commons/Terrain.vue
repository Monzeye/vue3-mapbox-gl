<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { inject, onBeforeUnmount, ref, watch } from 'vue'
import { useCreateTerrain } from '@/hooks/mapbox/useCreateTerrain'
import type { RasterDemSourceOptions } from 'mapbox-gl'
interface TerrainProps {
  url?: string
  tiles?: string[]
  id?: string
  options?: Partial<RasterDemSourceOptions>
  exaggeration?: number
}

const props = defineProps<TerrainProps>()

const mapInstance = inject(MapProvideKey, ref(null))
const { setTerrainUrl, setTerrainTiles, removeTerrain } = useCreateTerrain({
  map: mapInstance,
  exaggeration: props.exaggeration,
  url: props.url,
  tiles: props.tiles,
  options: props.options
})

onBeforeUnmount(removeTerrain)

watch(
  () => props.url,
  url => {
    setTerrainUrl(url)
  }
)
watch(
  () => props.tiles,
  tiles => {
    setTerrainTiles(tiles)
  }
)
</script>
<template></template>
