<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useCreateFog } from '@/hooks/mapbox/useCreateFog'
import { inject, ref, watch } from 'vue'
import type { Fog } from 'mapbox-gl'
interface FogProps {
  options?: Fog
}

const props = defineProps<FogProps>()
const mapInstance = inject(MapProvideKey, ref(null))
const { setFog } = useCreateFog({
  map: mapInstance,
  options: props.options
})
watch(
  () => props.options,
  options => {
    setFog(options ?? {})
  }
)
</script>
<template></template>
