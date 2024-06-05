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
import { findLayerDefaultStyleSetVal } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = FillExtrusionLayer
type Layout = FillExtrusionLayout
type Paint = FillExtrusionPaint

const paintDefault: Paint = {
  'fill-extrusion-ambient-occlusion-ground-attenuation': 0.69,
  'fill-extrusion-ambient-occlusion-ground-radius': 3,
  'fill-extrusion-ambient-occlusion-wall-radius': 3,
  'fill-extrusion-base': 0,
  'fill-extrusion-color': '#000000',
  'fill-extrusion-cutoff-fade-range': 0,
  'fill-extrusion-emissive-strength': 0,
  'fill-extrusion-flood-light-color': '#ffffff',
  'fill-extrusion-flood-light-ground-attenuation': 0.69,
  'fill-extrusion-flood-light-ground-radius': 0,
  'fill-extrusion-flood-light-intensity': 0,
  'fill-extrusion-flood-light-wall-radius': 0,
  'fill-extrusion-height': 0,
  'fill-extrusion-opacity': 1,
  'fill-extrusion-pattern': undefined,
  'fill-extrusion-rounded-roof': true,
  'fill-extrusion-translate': [0, 0],
  'fill-extrusion-translate-anchor': 'map',
  'fill-extrusion-vertical-gradient': true,
  'fill-extrusion-vertical-scale': 0
}

const layoutDefault: Layout = {
  visibility: 'visible'
}

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

  function setStyle(styleVal: FillExtrusionLayerStyle = {}) {
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
