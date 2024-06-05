declare namespace mapboxgl {
  export interface Map {
    addImage(id: string, image: ImageDatas, options?: ImageOptions): void
    setConfig(importId: string, config: MapboxOptionsConfig): Map
  }

  export interface MapboxOptionsConfig {
    showPlaceLabels?: boolean
    showRoadLabels?: boolean
    showPointOfInterestLabels?: boolean
    showBuildingLabels?: boolean
    lightPreset?: string
    font?: string
    [propName: string]: any
  }
  export interface MapboxOptions {
    config?: {
      [propName: string]: MapboxOptionsConfig
    }
  }

  export interface MapEventTypes extends MapEventType {
    styleimagemissing: { id: string }
    preclick: MapMouseEvent
    mouseleave: MapMouseEvent
    mouseenter: MapMouseEvent
  }

  export interface Fog {
    color?: string | Expression | undefined
    'horizon-blend'?: number | Expression | undefined
    range?: number[] | Expression | undefined
    'high-color'?: string
    'space-color'?: string | Expression
    'star-intensity'?: number | Expression
  }
  export interface SymbolPaint {
    'icon-color-brightness-max'?: number
    'icon-color-brightness-min'?: number
    'icon-color-contrast'?: number
    'icon-color-saturation'?: number
  }

  export interface RasterPaint {
    'raster-array-band'?: string
    'raster-elevation'?: number
    'raster-emissive-strength'?: number
  }

  export interface FillExtrusionPaint {
    'fill-extrusion-ambient-occlusion-ground-attenuation'?: number
    'fill-extrusion-ambient-occlusion-ground-radius'?: number
    'fill-extrusion-ambient-occlusion-wall-radius'?: number
    'fill-extrusion-flood-light-color'?: string | Expression
    'fill-extrusion-flood-light-ground-attenuation'?: number
    'fill-extrusion-flood-light-ground-radius'?: number
    'fill-extrusion-flood-light-intensity'?: number
    'fill-extrusion-flood-light-wall-radius'?: number
    'fill-extrusion-vertical-scale'?: number
    'fill-extrusion-cutoff-fade-range'?: number
    'fill-extrusion-emissive-strength'?: number
    'fill-extrusion-rounded-roof'?: boolean
  }

  export interface HillshadePaint {
    'hillshade-emissive-strength'?: number
  }

  export type SourceType =
    | 'vector'
    | 'raster'
    | 'raster-dem'
    | 'geojson'
    | 'image'
    | 'video'
    | 'canvas'
    | 'custom'

  export type LayerType =
    | 'background'
    | 'fill'
    | 'line'
    | 'symbol'
    | 'raster'
    | 'circle'
    | 'fill-extrusion'
    | 'heatmap'
    | 'hillshade'
    | 'sky'

  export interface GeoJSONSourceOptions {
    data: GeoJSON.GeoJSON | string
  }

  export interface GeoJSONSource {
    setData(data: GeoJSON.GeoJSON | string): this
  }

  export interface VectorSourceOptions {
    attribution?: string
    bounds?: [number, number, number, number]
    maxzoom?: number // 0-22
    minzoom?: number // 0-22
    promteId?: string
    scheme?: 'xyz' | 'tms' // xyz
    tiles?: string[]
    url?: string
    volatile?: boolean // false
  }

  export interface RasterDemSourceOptions {
    attribution?: string
    bounds?: [number, number, number, number]
    maxzoom?: number // 0-22
    minzoom?: number // 0-22
    encoding?: 'terrarium' | 'mapbox' // mapbox
    tiles?: string[]
    tileSize?: number
    url?: string
    volatile?: boolean // false
  }

  export interface RasterSourceOptions {
    attribution?: string
    bounds?: [number, number, number, number]
    maxzoom?: number // 0-22
    minzoom?: number // 0-22
    scheme?: 'xyz' | 'tms' // xyz
    tiles?: string[]
    tileSize?: number
    url?: string
    volatile?: boolean // false
  }

  export interface AttributionControlOptions {
    compact?: boolean // false
    customAttribution?: string | string[]
  }

  export type ControlPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'

  export interface GeolocateControlOptions {
    positionOptions?: PositionOptions | undefined
    fitBoundsOptions?: FitBoundsOptions | undefined
    trackUserLocation?: boolean | undefined
    showAccuracyCircle?: boolean | undefined
    showUserLocation?: boolean | undefined
    showUserHeading?: boolean | undefined
    geolocation?: Geolocation | undefined
  }
  export interface NavigationControlOptions {
    showCompass?: boolean
    showZoom?: boolean
    visualizePitch?: boolean
  }

  export interface ScaleControlOptions {
    maxWidth?: number
    unit?: 'imperial' | 'metric' | 'nautical'
  }
  export interface LinePaint {
    'line-trim-offset'?: number[]
  }
  export interface SymbolLayout {
    'symbol-z-order'?: 'auto' | 'source' | 'viewport-y'
    'symbol-z-elevate'?: boolean
  }

  export type BackgroundLayerStyle = BackgroundLayout & BackgroundPaint
  export type FillLayerStyle = FillLayout & FillPaint
  export type LineLayerStyle = LineLayout & LinePaint
  export type SymbolLayerStyle = SymbolLayout & SymbolPaint
  export type RasterLayerStyle = RasterLayout & RasterPaint
  export type CircleLayerStyle = CircleLayout & CirclePaint
  export type FillExtrusionLayerStyle = FillExtrusionLayout & FillExtrusionPaint
  export type HeatmapLayerStyle = HeatmapLayout & HeatmapPaint
  export type HillshadeLayerStyle = HillshadeLayout & HillshadePaint
  export type SkyLayerStyle = SkyLayout & SkyPaint

  export interface Marker {
    setOccludedOpacity(opacity: number): void
  }
  export interface StyleImageInterface {
    width: number
    height: number
    data: Uint8Array | Uint8ClampedArray
    onAdd(map: Map): void
    render(): void
    onRemove(): void
  }

  export type ImageDatas =
    | HTMLImageElement
    | ImageBitmap
    | ImageData
    | { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
    | StyleImageInterface
  export interface ImageOptions {
    pixelRatio?: number | undefined
    sdf?: boolean | undefined
    stretchX?: [number, number][]
    stretchY?: [number, number][]
    content?: [number, number, number, number]
  }
}
