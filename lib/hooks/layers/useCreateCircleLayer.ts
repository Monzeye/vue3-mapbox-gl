import type {
  Map,
  Expression,
  CircleLayer,
  CircleLayout,
  CirclePaint,
  AnySourceData,
  CircleLayerStyle,
  AnySourceImpl
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'
import type { MaybeRef } from 'vue'
type Layer = CircleLayer
type Layout = CircleLayout
type Paint = CirclePaint
const paintKeys: (keyof Paint)[] = [
  'circle-blur',
  'circle-color',
  'circle-emissive-strength',
  'circle-opacity',
  'circle-pitch-alignment',
  'circle-pitch-scale',
  'circle-radius',
  'circle-stroke-color',
  'circle-stroke-opacity',
  'circle-stroke-width',
  'circle-translate',
  'circle-translate-anchor'
]
const layoutKeys: (keyof Layout)[] = ['circle-sort-key', 'visibility']

interface CreateCircleLayerProps {
  map: MaybeRef<Nullable<Map>>
  source: MaybeRef<string | AnySourceImpl | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: CircleLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateCircleLayer(props: CreateCircleLayerProps) {
  const layerType = MapboxLayerType.Circle
  props.style = props.style || {}
  const paint: Paint = filterStylePropertiesByKeys(props.style, paintKeys)
  const layout: Layout = filterStylePropertiesByKeys(props.style, layoutKeys)
  const { setLayoutProperty, setPaintProperty, ...actions } =
    useCreateLayer<Layer>({
      map: props.map,
      source: props.source,
      type: layerType,
      id: props.id,
      beforeId: props.beforeId,
      filter: props.filter,
      layout: layout,
      paint: paint,
      renderingMode: props.renderingMode,
      slot: props.slot,
      maxzoom: props.maxzoom,
      minzoom: props.minzoom,
      metadata: props.metadata,
      sourceLayer: props.sourceLayer,
      register: (actions, map) => {
        props.register?.(
          {
            ...actions,
            setStyle
          },
          map
        )
      }
    })

  function setStyle(styleVal: CircleLayerStyle = {}) {
    Object.keys(styleVal).forEach(key => {
      if (paintKeys.includes(key as keyof Paint)) {
        setPaintProperty(key, styleVal[key as keyof Paint], { validate: false })
      }
      if (layoutKeys.includes(key as keyof Layout)) {
        setLayoutProperty(key, styleVal[key as keyof Layout], {
          validate: false
        })
      }
    })
  }

  return {
    ...actions,
    setStyle,
    setLayoutProperty,
    setPaintProperty
  }
}
