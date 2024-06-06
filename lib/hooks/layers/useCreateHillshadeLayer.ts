import type {
  Map,
  Expression,
  AnySourceData,
  HillshadeLayer,
  HillshadeLayout,
  HillshadePaint,
  HillshadeLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'

type Layer = HillshadeLayer
type Layout = HillshadeLayout
type Paint = HillshadePaint

const paintKeys: (keyof Paint)[] = [
  'hillshade-accent-color',
  'hillshade-emissive-strength',
  'hillshade-exaggeration',
  'hillshade-highlight-color',
  'hillshade-illumination-anchor',
  'hillshade-illumination-direction',
  'hillshade-shadow-color'
]

const layoutKeys: (keyof Layout)[] = ['visibility']

interface CreateHillshadeLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source: ShallowRefOrNo<string | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: HillshadeLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateHillshadeLayer(props: CreateHillshadeLayerProps) {
  const layerType = MapboxLayerType.Hillshade
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

  function setStyle(styleVal: HillshadeLayerStyle = {}) {
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
