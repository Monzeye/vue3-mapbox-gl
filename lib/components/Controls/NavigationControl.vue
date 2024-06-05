<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useNavigationControl } from '@/hooks/control/useNavigationControl'
import { inject, ref } from 'vue'
import type { ControlPosition } from 'mapbox-gl'
interface ScaleControlProps {
  position?: ControlPosition
  showCompass?: boolean
  showZoom?: boolean
  visualizePitch?: boolean
}

const props = withDefaults(defineProps<ScaleControlProps>(), {
  showCompass: true,
  showZoom: true,
  visualizePitch: false
})

const mapInstance = inject(MapProvideKey, ref(null))
useNavigationControl({
  map: mapInstance,
  ...props
})
</script>
<template></template>
