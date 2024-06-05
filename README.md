# vue3-mapbox-gl

一个基于Vue3+Typescript封装的Mapbox地图组件

### 安装

```bash
yarn add mapbox-gl vue3-mapbox-gl
```

### 引入

入口文件

```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vue3-mapbox-gl/dist/style.css'
import mapbox from 'vue3-mapbox-gl'
const app = createApp(App)
app.use(mapbox, {
  accessToken: 'pk.xxxxxxxxxxxxx'
})
app.mount('#app')
```

对于ts项目需要在tsconfig.json里面配置types

```json
{
  "compilerOptions": {
    "types": [
      // ...
      "vue3-mapbox-gl/global"
    ]
  }
}
```

### BaseMap

```vue
<template>
  <Mapbox :options="options"></Mapbox>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl';
const options: Partial<MapboxOptions> = {
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [0，0],
	zoom: 4
};
</script>
```

### SourceAndLayer

```vue
<template>
  <Mapbox :options="options">
    <VectorTileSource url="mapbox://examples.8fgz4egr">
      <CircleLayer
        source-layer="sf2010"
        :style="{
          'circle-radius': {
            base: 1.75,
            stops: [
              [12, 2],
              [22, 180]
            ]
          },
          'circle-color': [
            'match',
            ['get', 'ethnicity'],
            'White',
            '#fbb03b',
            'Black',
            '#223b53',
            'Hispanic',
            '#e55e5e',
            'Asian',
            '#3bb2d0',
            '#ccc'
          ]
        }"></CircleLayer>
    </VectorTileSource>
  </Mapbox>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
const options: Omit<MapboxOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/light-v11',
  zoom: 12,
  center: [-122.4473, 37.7535]
}
</script>
```

### Hooks

```vue
<template>
  <Mapbox :options="options" :register="register">
    <Terrain
      url="mapbox://mapbox.mapbox-terrain-dem-v1"
      :exaggeration="1.5"></Terrain>
  </Mapbox>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
import { useMapbox, useChainCamera } from 'vue3-mapbox-gl'

const options: Partial<MapboxOptions> = {
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [107.132759, 34.784138],
  zoom: 4
}

const [register, { getMapInstance }] = useMapbox()
useChainCamera({
  map: getMapInstance,
  autoplay: true,
  list: [
    {
      lngLat: [138.73375, 35.41914],
      lookAtLngLat: [138.73036, 35.36197],
      altitude: 7000,
      duration: 0
    },
    {
      lngLat: [138.72649, 35.33974],
      lookAtLngLat: [138.73036, 35.36197],
      altitude: 6000.0,
      duration: 20000
    },
    {
      lngLat: [138.72623, 35.31977],
      lookAtLngLat: [138.73036, 35.36197],
      altitude: 6000,
      duration: 15000
    },
    {
      lngLat: [138.73375, 35.41914],
      lookAtLngLat: [138.73036, 35.36197],
      altitude: 7000,
      duration: 15000
    }
  ]
})
</script>
```

### Components

Fog.vue

Image.vue

Light.vue

Marker.vue

Popup.vue

Terrain.vue

AttributionControl.vue

CustomControl.vue

FullscreenControl.vue

GeolocateControl.vue

NavigationControl.vue

ScaleControl.vue

BackgroundLayer.vue

CircleLayer.vue

CustomLayer.vue

FillExtrusionLayer.vue

FillLayer.vue

HeatmapLayer.vue

HillshadeLayer.vue

LineLayer.vue

RasterLayer.vue

SkyLayer.vue

SymbolLayer.vue

Mapbox.vue

CanvasSource.vue

GeoJsonSource.vue

ImageSource.vue

RasterDemSource.vue

RasterSource.vue

VectorTileSource.vue

VideoSource.vue

### Hooks

useChainCamera.ts

useEaseTo.ts

useFitBounds.ts

useFitScreenCoordinates.ts

useFlyTo.ts

useJumpTo.ts

useAttributionControl.ts

useCustomControl.ts

useFullscreenControl.ts

useGeolocateControl.ts

useNavigationControl.ts

useScaleControl.ts

useLayerEventListener.ts

useMapEventListener.ts

useMapReloadEvent.ts

useCreateBackgroundLayer.ts

useCreateCircleLayer.ts

useCreateCustomLayer.ts

useCreateFillExtrusionLayer.ts

useCreateFillLayer.ts

useCreateHeatmapLayer.ts

useCreateHillshadeLayer.ts

useCreateLayer.ts

useCreateLineLayer.ts

useCreateRasterLayer.ts

useCreateSkyLayer.ts

useCreateSymbolLayer.ts

useCreateFog.ts

useCreateImage.ts

useCreateLight.ts

useCreateMapbox.ts

useCreateMarker.ts

useCreatePopup.ts

useCreateTerrain.ts

useCreateCanvasSource.ts

useCreateGeoJsonSource.ts

useCreateImageSource.ts

useCreateRasterDemSource.ts

useCreateRasterSource.ts

useCreateVectorTileSource.ts

useCreateVideoSource.ts

useGeoJsonSource.ts

useLayer.ts

useMapbox.ts
