<template>
  <div style="width: 100%; height: 100%">
    <Mapbox :options="options">
      <VectorTileSource url="mapbox://mapbox.2opop9hr">
        <CircleLayer
          :visible="circleVisible"
          :style="{
            'circle-radius': 8,
            'circle-color': 'rgba(55,148,179,1)'
          }"
          source-layer="museum-cusco" />
      </VectorTileSource>
    </Mapbox>
    <div style="position: fixed; z-index: 100; top: 50px; right: 50px">
      <button
        style="height: 50px; background-color: aqua"
        @click="circleVisible = !circleVisible">
        CircleLayer
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
import { ref } from 'vue'

const options: Omit<MapboxOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 15,
  center: [-71.97722138410576, -13.517379300798098],
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
}
const circleVisible = ref(true)
</script>
