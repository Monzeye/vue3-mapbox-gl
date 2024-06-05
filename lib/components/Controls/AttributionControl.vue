<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useAttributionControl } from '@/hooks/control/useAttributionControl'
import { inject, ref } from 'vue'
import type { AttributionControlOptions, ControlPosition } from 'mapbox-gl'
interface AttributionControlProps {
  position?: ControlPosition
  compact?: AttributionControlOptions['compact']
  customAttribution?: AttributionControlOptions['customAttribution']
}
const props = defineProps<AttributionControlProps>()
const mapInstance = inject(MapProvideKey, ref(null))
useAttributionControl({
  map: mapInstance,
  ...props
})
</script>
<template></template>
