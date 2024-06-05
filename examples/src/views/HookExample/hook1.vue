<template>
  <div class="map_wrapper">
    <Mapbox :options="options" :show-stats="true" :register="register">
      <Popup>
        <div>Popup</div>
        <template #marker>
          <Marker class="">
            <div>Marker</div>
          </Marker>
        </template>
      </Popup>
    </Mapbox>
  </div>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
import { ref } from 'vue'
import {
  useMapbox,
  useCreateTerrain,
  useCreateFog,
  useCreateLight
} from 'vue3-mapbox-gl'

const options = ref<Omit<MapboxOptions, 'container'>>({
  zoom: 14,
  center: [-114.26608, 32.7213],
  pitch: 80,
  bearing: 41,
  style: 'mapbox://styles/mapbox/satellite-streets-v12'
})
const [register, { getMapInstance }] = useMapbox()
useCreateTerrain({
  map: getMapInstance,
  url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  exaggeration: 1.5,
  options: {
    tileSize: 512,
    maxzoom: 14
  }
})
useCreateFog({
  map: getMapInstance,
  options: {
    range: [0.8, 8],
    color: '#dc9f9f',
    'horizon-blend': 0.5,
    'high-color': '#245bde',
    'space-color': '#000000',
    'star-intensity': 0.15
  }
})
const { setLight } = useCreateLight({
  map: getMapInstance,
  options: {
    anchor: 'map',
    color: '#ff0000',
    intensity: 0,
    position: [1.15, 30, 180]
  }
})

setTimeout(() => {
  setLight({
    anchor: 'viewport',
    color: '#000',
    intensity: 0,
    position: [1.15, 30, 180]
  })
  //   setFog({
  //     range: [0.8, 8],
  //     color: "#000",
  //     "horizon-blend": 0.5,
  //     "high-color": "#000",
  //     "space-color": "#000000",
  //     "star-intensity": 0.15,
  //   });
}, 3000)
</script>
<style lang="css" scoped>
.map_wrapper {
  width: 100%;
  height: 100%;
}
</style>
