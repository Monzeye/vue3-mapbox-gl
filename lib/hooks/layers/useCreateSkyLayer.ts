import type {
  Map,
  Expression,
  AnySourceData,
  SkyLayer,
  SkyLayout,
  SkyPaint,
  SkyLayerStyle,
  AnySourceImpl
} from 'mapbox-gl'
import type { CreateLayerActions, Nullable } from '@/types'
import { useCreateLayer } from '@/hooks/layers/useCreateLayer'
import { filterStylePropertiesByKeys } from '@/helpers/layerUtils'
import { MapboxLayerType } from '@/enums/MapboxLayerEnum'
import type { MaybeRef } from 'vue'

type Layer = SkyLayer
type Layout = SkyLayout
type Paint = SkyPaint

const paintKeys: (keyof Paint)[] = [
  'sky-atmosphere-color',
  'sky-atmosphere-halo-color',
  'sky-atmosphere-sun',
  'sky-atmosphere-sun-intensity',
  'sky-gradient',
  'sky-gradient-center',
  'sky-gradient-radius',
  'sky-opacity',
  'sky-type'
]

const layoutKeys: (keyof Layout)[] = ['visibility']

interface CreateSkyLayerProps {
  map: MaybeRef<Nullable<Map>>
  source: MaybeRef<string | AnySourceImpl | AnySourceData | object | null>
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

  function setStyle(styleVal: SkyLayerStyle = {}) {
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
