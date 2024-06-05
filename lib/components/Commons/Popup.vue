<script lang="ts" setup>
import { MapProvideKey } from '@/enums/MapProvideKey'
import { useCreatePopup } from '@/hooks/mapbox/useCreatePopup'
import { inject, ref, watch } from 'vue'
import type { LngLatLike, PopupOptions } from 'mapbox-gl'
interface PopupProps {
  className?: string
  lnglat?: LngLatLike
  show?: boolean
  options?: PopupOptions
}

const props = withDefaults(defineProps<PopupProps>(), {
  show: false
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'open'): void
  (event: 'update:show', show: boolean): void
}>()
const mapInstance = inject(MapProvideKey, ref(null))
const popupElRef = ref<HTMLElement>()

const { setLngLat, show, hide } = useCreatePopup({
  map: mapInstance,
  el: popupElRef,
  lnglat: props.lnglat,
  show: props.show,
  options: {
    ...props.options,
    className: `v__mapbox__popup${props.className ? ' ' + props.className : ''}`
  },
  on: {
    open: () => {
      emit('open')
      emit('update:show', true)
    },
    close: async () => {
      emit('close')
      emit('update:show', false)
    }
  }
})
watch(
  () => props.show,
  isShow => {
    isShow ? show() : hide()
  }
)

watch(
  () => props.lnglat,
  lnglat => {
    lnglat && setLngLat(lnglat)
  }
)
</script>
<template>
  <div ref="popupElRef" class="mapboxgl-popup-content-inner">
    <slot />
  </div>
</template>
