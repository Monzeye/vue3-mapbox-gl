import type {
  Map,
  Expression,
  AnySourceData,
  SymbolLayer,
  SymbolLayout,
  SymbolPaint,
  SymbolLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { findLayerDefaultStyleSetVal } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = SymbolLayer
type Layout = SymbolLayout
type Paint = SymbolPaint

const paintDefault: Paint = {
  'icon-color': '#000000',
  'icon-color-brightness-max': 1,
  'icon-color-brightness-min': 0,
  'icon-color-contrast': 0,
  'icon-color-saturation': 0,
  'icon-emissive-strength': 1,
  'icon-halo-blur': 0,
  'icon-halo-color': 'rgba(0, 0, 0, 0)',
  'icon-halo-width': 0,
  'icon-opacity': 1,
  'icon-translate': [0, 0],
  'icon-translate-anchor': 'map',
  'icon-image-cross-fade': 0,
  'text-color': '#000000',
  'text-emissive-strength': 1,
  'text-halo-blur': 0,
  'text-halo-color': 'rgba(0, 0, 0, 0)',
  'text-halo-width': 0,
  'text-opacity': 1,
  'text-translate': [0, 0],
  'text-translate-anchor': 'map'
}

const layoutDefault: Layout = {
  'icon-allow-overlap': false,
  'icon-anchor': 'center',
  'icon-ignore-placement': false,
  'icon-image': undefined,
  'icon-keep-upright': false,
  'icon-offset': [0, 0],
  'icon-optional': false,
  'icon-padding': 2,
  'icon-pitch-alignment': 'auto',
  'icon-rotate': 0,
  'icon-rotation-alignment': 'auto',
  'icon-size': 1,
  'icon-text-fit': 'none',
  'icon-text-fit-padding': [0, 0, 0, 0],
  'symbol-avoid-edges': false,
  'symbol-placement': 'point',
  'symbol-sort-key': undefined,
  'symbol-spacing': 250,
  'symbol-z-elevate': false,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  'symbol-z-order': 'auto',
  'text-allow-overlap': false,
  'text-anchor': 'center',
  'text-field': '',
  'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
  'text-ignore-placement': false,
  'text-justify': 'center',
  'text-keep-upright': true,
  'text-letter-spacing': 0,
  'text-line-height': 1.2,
  'text-max-angle': 45,
  'text-max-width': 10,
  'text-offset': [0, 0],
  'text-optional': false,
  'text-padding': 2,
  'text-pitch-alignment': 'auto',
  'text-radial-offset': 0,
  'text-rotate': 0,
  'text-rotation-alignment': 'auto',
  'text-size': 16,
  'text-transform': 'none',
  'text-variable-anchor': [
    'center',
    'left',
    'right',
    'top',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ],
  'text-writing-mode': ['horizontal'],
  visibility: 'visible'
}

interface CreateSymbolLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: SymbolLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateSymbolLayer(props: CreateSymbolLayerProps) {
  const layerType = MapboxLayerType.Symbol
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

  function setStyle(styleVal: SymbolLayerStyle = {}) {
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
