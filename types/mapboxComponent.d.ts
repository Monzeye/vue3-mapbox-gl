import Mapbox from '@/components/Mapbox.vue'
import CanvasSource from '@/components/Sources/CanvasSource.vue'
import GeoJsonSource from '@/components/Sources/GeoJsonSource.vue'
import ImageSource from '@/components/Sources/ImageSource.vue'
import RasterDemSource from '@/components/Sources/RasterDemSource.vue'
import RasterSource from '@/components/Sources/RasterSource.vue'
import VectorTileSource from '@/components/Sources/VectorTileSource.vue'
import VideoSource from '@/components/Sources/VideoSource.vue'

import BackgroundLayer from '@/components/Layers/BackgroundLayer.vue'
import CircleLayer from '@/components/Layers/CircleLayer.vue'
import CustomLayer from '@/components/Layers/CustomLayer.vue'
import FillExtrusionLayer from '@/components/Layers/FillExtrusionLayer.vue'
import FillLayer from '@/components/Layers/FillLayer.vue'
import HeatmapLayer from '@/components/Layers/HeatmapLayer.vue'
import HillshadeLayer from '@/components/Layers/HillshadeLayer.vue'
import LineLayer from '@/components/Layers/LineLayer.vue'
import RasterLayer from '@/components/Layers/RasterLayer.vue'
import SkyLayer from '@/components/Layers/SkyLayer.vue'
import SymbolLayer from '@/components/Layers/SymbolLayer.vue'

import AttributionControl from '@/components/Controls/AttributionControl.vue'
import CustomControl from '@/components/Controls/CustomControl.vue'
import FullscreenControl from '@/components/Controls/FullscreenControl.vue'
import GeolocateControl from '@/components/Controls/GeolocateControl.vue'
import NavigationControl from '@/components/Controls/NavigationControl.vue'
import ScaleControl from '@/components/Controls/ScaleControl.vue'

import Marker from '@/components/Commons/Marker.vue'
import Popup from '@/components/Commons/Popup.vue'

import Image from '@/components/Commons/Image.vue'

import Fog from '@/components/Commons/Fog.vue'
import Light from '@/components/Commons/Light.vue'
import Terrain from '@/components/Commons/Terrain.vue'

declare module 'vue' {
  export interface GlobalComponents {
    Mapbox: typeof Mapbox
    CanvasSource: typeof CanvasSource
    GeoJsonSource: typeof GeoJsonSource
    ImageSource: typeof ImageSource
    RasterDemSource: typeof RasterDemSource
    RasterSource: typeof RasterSource
    VectorTileSource: typeof VectorTileSource
    VideoSource: typeof VideoSource

    BackgroundLayer: typeof BackgroundLayer
    CircleLayer: typeof CircleLayer
    CustomLayer: typeof CustomLayer
    FillExtrusionLayer: typeof FillExtrusionLayer
    FillLayer: typeof FillLayer
    HeatmapLayer: typeof HeatmapLayer
    HillshadeLayer: typeof HillshadeLayer
    LineLayer: typeof LineLayer
    RasterLayer: typeof RasterLayer
    SkyLayer: typeof SkyLayer
    SymbolLayer: typeof SymbolLayer

    AttributionControl: typeof AttributionControl
    CustomControl: typeof CustomControl
    FullscreenControl: typeof FullscreenControl
    GeolocateControl: typeof GeolocateControl
    NavigationControl: typeof NavigationControl
    ScaleControl: typeof ScaleControl

    Marker: typeof Marker
    Popup: typeof Popup

    Image: typeof Image
    Fog: typeof Fog
    Light: typeof Light
    Terrain: typeof Terrain
  }
}
