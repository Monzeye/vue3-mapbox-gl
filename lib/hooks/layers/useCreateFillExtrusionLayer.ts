import type {
  Map,
  Expression,
  FillExtrusionLayer,
  FillExtrusionLayout,
  FillExtrusionPaint,
  AnySourceData,
  FillExtrusionLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = FillExtrusionLayer
type Layout = FillExtrusionLayout
type Paint = FillExtrusionPaint

const paintKeys: (keyof Paint)[] = [
  'fill-extrusion-ambient-occlusion-ground-attenuation',
  'fill-extrusion-ambient-occlusion-ground-radius',
  'fill-extrusion-ambient-occlusion-wall-radius',
  'fill-extrusion-base',
  'fill-extrusion-color',
  'fill-extrusion-cutoff-fade-range',
  'fill-extrusion-emissive-strength',
  'fill-extrusion-flood-light-color',
  'fill-extrusion-flood-light-ground-attenuation',
  'fill-extrusion-flood-light-ground-radius',
  'fill-extrusion-flood-light-intensity',
  'fill-extrusion-flood-light-wall-radius',
  'fill-extrusion-height',
  'fill-extrusion-opacity',
  'fill-extrusion-pattern',
  'fill-extrusion-rounded-roof',
  'fill-extrusion-translate',
  'fill-extrusion-translate-anchor',
  'fill-extrusion-vertical-gradient',
  'fill-extrusion-vertical-scale'
]
const layoutKeys: (keyof Layout)[] = ['visibility']

interface CreateFillExtrusionLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: FillExtrusionLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateFillExtrusionLayer(
  props: CreateFillExtrusionLayerProps
) {
  const layerType = MapboxLayerType.FillExtrusion
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

  function setStyle(styleVal: FillExtrusionLayerStyle = {}) {
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
