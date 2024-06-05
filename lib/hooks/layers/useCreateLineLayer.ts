import type {
  Map,
  Expression,
  AnySourceData,
  LineLayer,
  LineLayout,
  LinePaint,
  LineLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { findLayerDefaultStyleSetVal } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = LineLayer
type Layout = LineLayout
type Paint = LinePaint

const paintDefault: Paint = {
  'line-blur': 0,
  'line-color': '#000000',
  'line-dasharray': [],
  'line-emissive-strength': 0,
  'line-gap-width': 0,
  'line-gradient': ['all'],
  'line-offset': 0,
  'line-opacity': 1,
  'line-pattern': undefined,
  'line-translate': [0, 0],
  'line-translate-anchor': 'map',
  'line-trim-offset': [0, 0],
  'line-width': 1
}

const layoutDefault: Layout = {
  'line-cap': 'butt',
  'line-join': 'miter',
  'line-miter-limit': 2,
  'line-round-limit': 1.05,
  'line-sort-key': 0,
  visibility: 'visible'
}

interface CreateLineLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceData | object | null>
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
  const paint: Paint = findLayerDefaultStyleSetVal(props.style, paintDefault)
  const layout: Layout = findLayerDefaultStyleSetVal(props.style, layoutDefault)
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
        props.register &&
          props.register(
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
      if (Reflect.has(paintDefault, key as keyof Paint)) {
        setPaintProperty(key, styleVal[key as keyof Paint], { validate: false })
      }
      if (Reflect.has(layoutDefault, key as keyof Layout)) {
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
