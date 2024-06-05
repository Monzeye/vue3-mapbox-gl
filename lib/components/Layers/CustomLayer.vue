<script lang="ts" setup>
import { ref, inject, watch } from 'vue'
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useCreateCustomLayer } from '@/hooks/layers/useCreateCustomLayer'
import type { CustomLayerInterface } from 'mapbox-gl'

interface LayerProps {
  customLayer: CustomLayerInterface | (new () => CustomLayerInterface)
  beforeId?: string
}

const props = defineProps<LayerProps>()

const mapInstance = inject(MapProvideKey, ref(null))

const { setBeforeId } = useCreateCustomLayer({
  map: mapInstance,
  customLayer: props.customLayer
})

watch(() => props.beforeId, setBeforeId)
</script>
<template></template>
