<script lang="ts" setup>
import { inject, watch, ref, provide } from 'vue'
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey'
import { useCreateGeoJsonSource } from '@/hooks/sources/useCreateGeoJsonSource'
import type { GeoJSONSourceOptions } from 'mapbox-gl'
import type { CreateGeoJsonSourceActions } from '@/hooks/sources/useCreateGeoJsonSource'
interface GeoJsonSourceProps {
  id?: string
  data?: GeoJSONSourceOptions['data']
  options?: Partial<GeoJSONSourceOptions>
}

const props = withDefaults(
  defineProps<
    GeoJsonSourceProps & {
      register?: (actions: CreateGeoJsonSourceActions) => void
    }
  >(),
  {
    options: () => ({}),
    data: () => ({
      type: 'FeatureCollection',
      features: []
    })
  }
)
const emit = defineEmits<{
  (e: 'register', actions: CreateGeoJsonSourceActions): void
}>()
const mapInstance = inject(MapProvideKey, ref(null))
const { setData, getSource } = useCreateGeoJsonSource({
  map: mapInstance,
  id: props.id,
  data: props.data,
  options: props.options,
  register: actions => {
    props.register?.(actions)
    emit('register', actions)
  }
})

provide(SourceProvideKey, getSource)
watch(() => props.data, setData, {
  deep: true,
  immediate: true
})
</script>
<template>
  <slot />
</template>
