<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue'
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey'
import { useCreateRasterSource } from '@/hooks/sources/useCreateRasterSource'
import type { RasterSourceOptions } from 'mapbox-gl'
interface RasterSourceProps {
  url?: string
  tiles?: string[]
  id?: string
  options?: Partial<RasterSourceOptions>
}

const props = defineProps<RasterSourceProps>()
const mapInstance = inject(MapProvideKey, ref(null))
const { getSource, setTiles, setUrl } = useCreateRasterSource({
  map: mapInstance,
  id: props.id,
  url: props.url,
  tiles: props.tiles,
  options: props.options
})
provide(SourceProvideKey, getSource as any)

watch(() => props.url, setUrl)

watch(() => props.tiles, setTiles, {
  deep: true,
  immediate: true
})
</script>
<template>
  <slot />
</template>
