<template>
  <Mapbox :options="options" :register="register">
    <Terrain url="mapbox://mapbox.mapbox-terrain-dem-v1" :exaggeration="1.5" />
  </Mapbox>
</template>
<script lang="ts" setup>
import { useChainCamera } from 'vue3-mapbox-gl'
import { useMapbox } from 'vue3-mapbox-gl'
import type { MapboxOptions } from 'mapbox-gl'

const options: Partial<MapboxOptions> = {
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [107.132759, 34.784138],
  zoom: 4,
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
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
      duration: 15000,
      easing: 'easeOutCubic'
    },
    {
      lngLat: [138.73375, 35.41914],
      lookAtLngLat: [138.73036, 35.36197],
      altitude: 7000,
      duration: 15000,
      easing: 'easeInOutCubic'
    }
  ]
})
</script>
