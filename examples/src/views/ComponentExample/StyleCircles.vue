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
        }" />
    </VectorTileSource>
  </Mapbox>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
const options: Omit<MapboxOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/light-v11',
  zoom: 12,
  center: [-122.4473, 37.7535],
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
}
</script>
