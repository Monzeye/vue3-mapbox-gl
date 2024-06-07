<script lang="ts" setup>
import { ref, inject, watch } from 'vue'
import { MapProvideKey, SourceProvideKey } from '@/enums/MapProvideKey'
import { useCreateFillExtrusionLayer } from '@/hooks/layers/useCreateFillExtrusionLayer'
import { MapboxLayerEvents } from '@/enums/MapboxLayerEnum'
import { useLayerEventListener } from '@/hooks/event/useLayerEventListener'
import type {
  Map,
  Expression,
  MapLayerEventType,
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  AnyLayout,
  FillExtrusionLayer,
  FillExtrusionLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions } from '@/types'
interface LayerProps {
  id?: string
  filter?: Expression
  style?: FillExtrusionLayerStyle
  renderingMode?: string
  slotName?: 'bottom' | 'middle' | 'top'
  maxzoom?: number
  minzoom?: number
  metadata?: object
  source?: string | object
  sourceLayer?: string
  beforeId?: string
  visible?: boolean
}

const props = withDefaults(
  defineProps<
    LayerProps & {
      register?: (
        actions: CreateLayerActions<FillExtrusionLayer>,
        map: Map
      ) => any
    }
  >(),
  {
    visible: undefined
  }
)
const emit = defineEmits<{
  (e: keyof MapLayerEventType, ev: any): any
  (
    e: 'register',
    actions: CreateLayerActions<FillExtrusionLayer>,
    map: Map
  ): any
  (e: 'click', ev: MapLayerMouseEvent): any
  (e: 'dblclick', ev: MapLayerMouseEvent): any
  (e: 'mousedown', ev: MapLayerMouseEvent): any
  (e: 'mouseup', ev: MapLayerMouseEvent): any
  (e: 'mousemove', ev: MapLayerMouseEvent): any
  (e: 'mouseenter', ev: MapLayerMouseEvent): any
  (e: 'mouseleave', ev: MapLayerMouseEvent): any
  (e: 'mouseover', ev: MapLayerMouseEvent): any
  (e: 'mouseout', ev: MapLayerMouseEvent): any
  (e: 'contextmenu', ev: MapLayerMouseEvent): any
  (e: 'touchstart', ev: MapLayerTouchEvent): any
  (e: 'touchend', ev: MapLayerTouchEvent): any
  (e: 'touchcancel', ev: MapLayerTouchEvent): any
}>()
// eslint-disable-next-line vue/no-dupe-keys
const source = inject(SourceProvideKey, ref(null))
const mapInstance = inject(MapProvideKey, ref(null))
const visibleStyle: AnyLayout = {}
if (props.visible !== undefined) {
  visibleStyle['visibility'] = props.visible ? 'visible' : 'none'
}
const {
  getLayer,
  setBeforeId,
  setFilter,
  setStyle,
  setZoomRange,
  setLayoutProperty
} = useCreateFillExtrusionLayer({
  map: mapInstance,
  source: props.source || source,
  style: { ...props.style, ...visibleStyle },
  renderingMode: props.renderingMode,
  slot: props.slotName,
  filter: props.filter,
  id: props.id,
  maxzoom: props.maxzoom,
  minzoom: props.minzoom,
  metadata: props.metadata,
  sourceLayer: props.sourceLayer,
  register: (actions, map) => {
    props.register?.(actions, map)
    emit('register', actions, map)
  }
})
MapboxLayerEvents.map(eventName => {
  useLayerEventListener({
    map: mapInstance,
    layer: getLayer,
    event: eventName,
    on: data => {
      emit(eventName, data)
    }
  })
})
watch(() => props.filter, setFilter)
watch(() => props.style, setStyle)
watch(() => props.maxzoom, setZoomRange)
watch(() => props.minzoom, setZoomRange)
watch(() => props.beforeId, setBeforeId)
watch(
  () => props.visible,
  visible => {
    setLayoutProperty('visibility', visible ? 'visible' : 'none')
  }
)
</script>
<template></template>
