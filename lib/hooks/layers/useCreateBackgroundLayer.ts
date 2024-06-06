import type {
  Map,
  Expression,
  BackgroundLayer,
  AnySourceData,
  BackgroundPaint,
  BackgroundLayout,
  BackgroundLayerStyle
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable, ShallowRefOrNo } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'
import { getShallowRef } from '@/helpers/getRef'

type Layer = BackgroundLayer
type Layout = BackgroundLayout
type Paint = BackgroundPaint

const paintKeys: (keyof Paint)[] = [
  'background-color',
  'background-emissive-strength',
  'background-opacity',
  'background-pattern'
]
const layoutKeys: (keyof Layout)[] = ['visibility']

interface CreateBackgroundLayerProps {
  map: ShallowRefOrNo<Nullable<Map>>
  source?: ShallowRefOrNo<string | AnySourceData | object | null>
  renderingMode?: string
  slot?: 'bottom' | 'middle' | 'top'
  id?: string
  beforeId?: string
  filter?: Expression
  style?: BackgroundLayerStyle
  maxzoom?: number
  minzoom?: number
  metadata?: object
  sourceLayer?: string // 仅 vector 是必须的
  register?: (actions: CreateLayerActions<Layer>, map: Map) => void
}

export function useCreateBackgroundLayer(props: CreateBackgroundLayerProps) {
  const layerType = MapboxLayerType.Background
  props.style = props.style || {}
  const paint: Paint = filterStylePropertiesByKeys(props.style, paintKeys)
  const layout: Layout = filterStylePropertiesByKeys(props.style, layoutKeys)
  const source = getShallowRef(props.source, {})
  const { setLayoutProperty, setPaintProperty, ...actions } =
    useCreateLayer<Layer>({
      map: props.map,
      source: source,
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

  function setStyle(styleVal: BackgroundLayerStyle = {}) {
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
