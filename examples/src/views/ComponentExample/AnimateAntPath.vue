<template>
  <Mapbox ref="map" :options="options" :show-stats="true">
    <GeoJsonSource :data="geojson">
      <LineLayer
        :style="{
          'line-color': 'yellow',
          'line-width': 6,
          'line-opacity': 0.4
        }" />
      <LineLayer :style="style" />
    </GeoJsonSource>
  </Mapbox>
</template>
<script lang="ts" setup>
import type { LineLayerStyle, MapboxOptions } from 'mapbox-gl'
import { onUnmounted, reactive, ref } from 'vue'
import type { FeatureCollection, GeoJsonProperties, LineString } from 'geojson'

const options = ref<Omit<MapboxOptions, 'container'>>({
  style: 'mapbox://styles/mapbox/dark-v11', // style URL
  center: [-73.9709, 40.6712], // starting position [lng, lat]
  zoom: 15.773 // starting zoom
})

const geojson: FeatureCollection<LineString, GeoJsonProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [-73.97003, 40.67264],
          [-73.96985, 40.67235],
          [-73.96974, 40.67191],
          [-73.96972, 40.67175],
          [-73.96975, 40.67154],
          [-73.96987, 40.67134],
          [-73.97015, 40.67117],
          [-73.97045, 40.67098],
          [-73.97064, 40.67078],
          [-73.97091, 40.67038],
          [-73.97107, 40.67011],
          [-73.97121, 40.66994],
          [-73.97149, 40.66969],
          [-73.97169, 40.66985],
          [-73.97175, 40.66994],
          [-73.97191, 40.66998],
          [-73.97206, 40.66998],
          [-73.97228, 40.67008]
        ],
        type: 'LineString'
      }
    }
  ]
}

const style = reactive<LineLayerStyle>({
  'line-color': 'yellow',
  'line-width': 6,
  'line-dasharray': [0, 4, 3]
})

const dashArraySequence = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5]
]

let step = 0
let animationFrame: number
function animateDashArray(timestamp: number) {
  // Update line-dasharray using the next value in dashArraySequence. The
  // divisor in the expression `timestamp / 50` controls the animation speed.
  const newStep = parseInt(((timestamp / 50) % dashArraySequence.length) as any)

  if (newStep !== step) {
    style['line-dasharray'] = dashArraySequence[newStep]
    // map.setPaintProperty('line-dashed', 'line-dasharray', dashArraySequence[step]);
    step = newStep
  }
  // Request the next frame of the animation.
  animationFrame = requestAnimationFrame(animateDashArray)
}

// start the animation
animateDashArray(0)

onUnmounted(() => {
  animationFrame && cancelAnimationFrame(animationFrame)
})
</script>
<style lang="css" scoped></style>
