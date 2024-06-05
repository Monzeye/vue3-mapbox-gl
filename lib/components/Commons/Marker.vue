<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useCreateMarker } from '@/hooks/mapbox/useCreateMarker'
import { inject, ref, useSlots, watch } from 'vue'
import type {
  LngLatLike,
  Alignment,
  PointLike,
  MarkerOptions,
  Anchor,
  Popup
} from 'mapbox-gl'
interface MarkerProps {
  lnglat?: LngLatLike
  popup?: Popup
  options?: MarkerOptions
  draggable?: boolean
  element?: HTMLElement | undefined

  offset?: PointLike | undefined
  anchor?: Anchor | undefined

  color?: string | undefined
  clickTolerance?: number | null | undefined
  rotation?: number | undefined
  rotationAlignment?: Alignment | undefined
  pitchAlignment?: Alignment | undefined
  scale?: number | undefined
  occludedOpacity?: number | undefined
}

const props = withDefaults(defineProps<MarkerProps>(), {
  options: () => ({})
})
const emit = defineEmits<{
  (e: 'dragstart', ev: Event): void
  (e: 'drag', ev: Event): void
  (e: 'dragend', ev: Event): void
}>()
const slots = useSlots()

const mapInstance = inject(MapProvideKey, ref(null))
const markerElRef = ref<HTMLElement>()
const { setDraggable, setLngLat } = useCreateMarker({
  map: mapInstance,
  el: slots.default?.() ? markerElRef : undefined,
  lnglat: props.lnglat,
  popup: props.popup,
  options: {
    ...props.options,
    ...(props.draggable === undefined
      ? {}
      : {
          draggable: props.draggable
        })
  },
  on: {
    dragstart: ev => emit('dragstart', ev),
    drag: ev => emit('drag', ev),
    dragend: ev => emit('dragend', ev)
  }
})

watch(
  () => props.lnglat,
  lnglat => {
    lnglat && setLngLat(lnglat)
  }
)

watch(() => props.draggable, setDraggable)
</script>
<template>
  <div ref="markerElRef">
    <slot />
  </div>
</template>
