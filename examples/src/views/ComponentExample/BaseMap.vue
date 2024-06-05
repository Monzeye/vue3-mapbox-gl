<template>
  <Mapbox :options="options">
    <CustomControl> asdkljaskldjsklajdklas </CustomControl>
  </Mapbox>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'

const options: Partial<MapboxOptions> = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [107.132759, 34.784138],
  zoom: 4,
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
}
</script>
