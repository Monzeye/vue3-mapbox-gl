import type {
  Map,
  Expression,
  AnySourceData,
  RasterLayer,
  RasterLayout,
  RasterPaint,
  RasterLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { findLayerDefaultStyleSetVal } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = RasterLayer
type Layout = RasterLayout
type Paint = RasterPaint

const paintDefault: Paint = {
  'raster-array-band': undefined,
  'raster-brightness-max': 1,
  'raster-brightness-min': 0,
  'raster-color': undefined,
  'raster-color-mix': [0.2126, 0.7152, 0.0722, 0],
  'raster-color-range': undefined,
  'raster-contrast': 0,
  'raster-elevation': 0,
  'raster-emissive-strength': 0,
  'raster-fade-duration': 300,
  'raster-hue-rotate': 0,
  'raster-opacity': 1,
  'raster-resampling': 'linear',
  'raster-saturation': 0
}

const layoutDefault: Layout = {
  visibility: 'visible'
}

interface CreateRasterLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: RasterLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateRasterLayer(props: CreateRasterLayerProps) {
  const layerType = MapboxLayerType.Raster
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

  function setStyle(styleVal: RasterLayerStyle = {}) {
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
