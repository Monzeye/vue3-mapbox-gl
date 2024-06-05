<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useGeolocateControl } from '@/hooks/control/useGeolocateControl'
import { inject, ref } from 'vue'
import type { ControlPosition, GeolocateControlOptions } from 'mapbox-gl'
interface GeolocateControlProps {
  position?: ControlPosition
  options?: GeolocateControlOptions
}

const props = defineProps<GeolocateControlProps>()

const mapInstance = inject(MapProvideKey, ref(null))
useGeolocateControl({
  map: mapInstance,
  ...props
})
</script>
<template></template>
