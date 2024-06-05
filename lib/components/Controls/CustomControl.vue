<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useCustomControl } from '@/hooks'
import { inject, ref } from 'vue'
import type { Map, ControlPosition } from 'mapbox-gl'
interface AttributionControlProps {
  position?: ControlPosition
  className?: string
  add?: (map: Map, container: HTMLElement) => void
  remove?: (map: Map, container: HTMLElement) => void
}
const props = defineProps<AttributionControlProps>()
const customControlElRef = ref<HTMLElement>()
const mapInstance = inject(MapProvideKey, ref(null))

useCustomControl({
  map: mapInstance,
  container: customControlElRef,
  on: {
    add: props.add,
    remove: props.remove
  },
  position: props.position,
  className: props.className
})
</script>
<template>
  <div ref="customControlElRef">
    <slot />
  </div>
</template>
