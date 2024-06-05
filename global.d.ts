declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Mapbox: (typeof import('vue3-mapbox-gl'))['Mapbox']
    CanvasSource: (typeof import('vue3-mapbox-gl'))['CanvasSource']
    GeoJsonSource: (typeof import('vue3-mapbox-gl'))['GeoJsonSource']
    ImageSource: (typeof import('vue3-mapbox-gl'))['ImageSource']
    RasterDemSource: (typeof import('vue3-mapbox-gl'))['RasterDemSource']
    RasterSource: (typeof import('vue3-mapbox-gl'))['RasterSource']
    VectorTileSource: (typeof import('vue3-mapbox-gl'))['VectorTileSource']
    VideoSource: (typeof import('vue3-mapbox-gl'))['VideoSource']

    BackgroundLayer: (typeof import('vue3-mapbox-gl'))['BackgroundLayer']
    CircleLayer: (typeof import('vue3-mapbox-gl'))['CircleLayer']
    CustomLayer: (typeof import('vue3-mapbox-gl'))['CustomLayer']
    FillExtrusionLayer: (typeof import('vue3-mapbox-gl'))['FillExtrusionLayer']
    FillLayer: (typeof import('vue3-mapbox-gl'))['FillLayer']
    HeatmapLayer: (typeof import('vue3-mapbox-gl'))['HeatmapLayer']
    HillshadeLayer: (typeof import('vue3-mapbox-gl'))['HillshadeLayer']
    LineLayer: (typeof import('vue3-mapbox-gl'))['LineLayer']
    RasterLayer: (typeof import('vue3-mapbox-gl'))['RasterLayer']
    SkyLayer: (typeof import('vue3-mapbox-gl'))['SkyLayer']
    SymbolLayer: (typeof import('vue3-mapbox-gl'))['SymbolLayer']

    AttributionControl: (typeof import('vue3-mapbox-gl'))['AttributionControl']
    CustomControl: (typeof import('vue3-mapbox-gl'))['CustomControl']
    FullscreenControl: (typeof import('vue3-mapbox-gl'))['FullscreenControl']
    GeolocateControl: (typeof import('vue3-mapbox-gl'))['GeolocateControl']
    NavigationControl: (typeof import('vue3-mapbox-gl'))['NavigationControl']
    ScaleControl: (typeof import('vue3-mapbox-gl'))['ScaleControl']

    Marker: (typeof import('vue3-mapbox-gl'))['Marker']
    Popup: (typeof import('vue3-mapbox-gl'))['Popup']

    Image: (typeof import('vue3-mapbox-gl'))['Image']
    Fog: (typeof import('vue3-mapbox-gl'))['Fog']
    Light: (typeof import('vue3-mapbox-gl'))['Light']
    Terrain: (typeof import('vue3-mapbox-gl'))['Terrain']
  }
}
export {}
