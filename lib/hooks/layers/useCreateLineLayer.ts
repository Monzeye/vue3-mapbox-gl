import type {
  Map,
  Expression,
  AnySourceData,
  LineLayer,
  LineLayout,
  LinePaint,
  LineLayerStyle,
  AnySourceImpl
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'
import type { MaybeRef } from 'vue'

type Layer = LineLayer
type Layout = LineLayout
type Paint = LinePaint

const paintKeys: (keyof Paint)[] = [
  'line-blur',
  'line-color',
  'line-dasharray',
  'line-emissive-strength',
  'line-gap-width',
  'line-gradient',
  'line-offset',
  'line-opacity',
  'line-pattern',
  'line-translate',
  'line-translate-anchor',
  'line-trim-offset',
  'line-width'
]

const layoutKeys: (keyof Layout)[] = [
  'line-cap',
  'line-join',
  'line-miter-limit',
  'line-round-limit',
  'line-sort-key',
  'visibility'
]

interface CreateLineLayerProps {
  map: MaybeRef<Nullable<Map>>
  source: MaybeRef<string | AnySourceImpl | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: LineLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateLineLayer(props: CreateLineLayerProps) {
  const layerType = MapboxLayerType.Line
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

  function setStyle(styleVal: LineLayerStyle = {}) {
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
