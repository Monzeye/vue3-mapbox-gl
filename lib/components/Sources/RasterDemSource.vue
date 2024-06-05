<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue'
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey'
import { useCreateRasterDemSource } from '@/hooks/sources/useCreateRasterDemSource'
import type { RasterDemSourceOptions } from 'mapbox-gl'
interface RasterDemSourceProps {
  url?: string
  tiles?: string[]
  id?: string
  options?: Partial<RasterDemSourceOptions>
}

const props = defineProps<RasterDemSourceProps>()
const mapInstance = inject(MapProvideKey, ref(null))
const { getSource, setTiles, setUrl } = useCreateRasterDemSource({
  map: mapInstance,
  id: props.id,
  url: props.url,
  tiles: props.tiles,
  options: props.options
})
provide(SourceProvideKey, getSource)

watch(() => props.url, setUrl)

watch(() => props.tiles, setTiles, {
  deep: true,
  immediate: true
})
</script>
<template>
  <slot />
</template>
