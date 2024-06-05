<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue'
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey'
import { useCreateVectorTileSource } from '@/hooks/sources/useCreateVectorTileSource'
import type { VectorSourceOptions } from 'mapbox-gl'
interface VectorTileSourceProps {
  url?: string
  tiles?: string[]
  id?: string
  options?: Partial<VectorSourceOptions>
}

const props = defineProps<VectorTileSourceProps>()
const mapInstance = inject(MapProvideKey, ref(null))
const { getSource, setTiles, setUrl } = useCreateVectorTileSource({
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
