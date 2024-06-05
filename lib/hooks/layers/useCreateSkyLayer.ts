import type {
  Map,
  Expression,
  AnySourceData,
  SkyLayer,
  SkyLayout,
  SkyPaint,
  SkyLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { findLayerDefaultStyleSetVal } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = SkyLayer
type Layout = SkyLayout
type Paint = SkyPaint

const paintDefault: Paint = {
  'sky-atmosphere-color': 'white',
  'sky-atmosphere-halo-color': 'white',
  'sky-atmosphere-sun': [],
  'sky-atmosphere-sun-intensity': 10,
  'sky-gradient': [
    'interpolate',
    ['linear'],
    ['sky-radial-progress'],
    0.8,
    '#87ceeb',
    1,
    'white'
  ],
  'sky-gradient-center': undefined,
  'sky-gradient-radius': 90,
  'sky-opacity': 1,
  'sky-type': 'atmosphere'
}

const layoutDefault: Layout = {
  visibility: 'visible'
}

interface CreateSkyLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: SkyLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateSkyLayer(props: CreateSkyLayerProps) {
  const layerType = MapboxLayerType.Sky
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

  function setStyle(styleVal: SkyLayerStyle = {}) {
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
