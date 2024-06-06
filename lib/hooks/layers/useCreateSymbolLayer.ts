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
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = SymbolLayer
type Layout = SymbolLayout
type Paint = SymbolPaint

const paintKeys: (keyof Paint)[] = [
  'icon-color',
  'icon-color-brightness-max',
  'icon-color-brightness-min',
  'icon-color-contrast',
  'icon-color-saturation',
  'icon-emissive-strength',
  'icon-halo-blur',
  'icon-halo-color',
  'icon-halo-width',
  'icon-opacity',
  'icon-translate',
  'icon-translate-anchor',
  'icon-image-cross-fade',
  'text-color',
  'text-emissive-strength',
  'text-halo-blur',
  'text-halo-color',
  'text-halo-width',
  'text-opacity',
  'text-translate',
  'text-translate-anchor'
]

const layoutKeys: (keyof Layout)[] = [
  'icon-allow-overlap',
  'icon-anchor',
  'icon-ignore-placement',
  'icon-image',
  'icon-keep-upright',
  'icon-offset',
  'icon-optional',
  'icon-padding',
  'icon-pitch-alignment',
  'icon-rotate',
  'icon-rotation-alignment',
  'icon-size',
  'icon-text-fit',
  'icon-text-fit-padding',
  'symbol-avoid-edges',
  'symbol-placement',
  'symbol-sort-key',
  'symbol-spacing',
  'symbol-z-elevate',
  'symbol-z-order',
  'text-allow-overlap',
  'text-anchor',
  'text-field',
  'text-font',
  'text-ignore-placement',
  'text-justify',
  'text-keep-upright',
  'text-letter-spacing',
  'text-line-height',
  'text-max-angle',
  'text-max-width',
  'text-offset',
  'text-optional',
  'text-padding',
  'text-pitch-alignment',
  'text-radial-offset',
  'text-rotate',
  'text-rotation-alignment',
  'text-size',
  'text-transform',
  'text-variable-anchor',
  'text-writing-mode',
  'visibility'
]

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

  function setStyle(styleVal: SymbolLayerStyle = {}) {
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
