<template>
  <Mapbox :options="options" :show-stats="true">
    <Terrain url="mapbox://mapbox.mapbox-terrain-dem-v1" :exaggeration="1.5" />
  </Mapbox>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
const options: Omit<MapboxOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  zoom: 14,
  center: [-114.26608, 32.7213],
  pitch: 80,
  bearing: 41,
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
}
</script>
