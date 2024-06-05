<template>
  <div style="width: 100%; height: 100%">
    <div class="radio_list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="radio_item"
        :class="{
          active: current === item.label
        }"
        @click="handleChange(item)">
        {{ item.label }}
      </div>
    </div>
    <Mapbox :options="options">
      <GeoJsonSource :data="geoJsonData">
        <LineLayer
          :style="{
            'line-join': 'round',
            'line-cap': 'round',
            'line-color': '#33bb6a',
            'line-width': 8
          }" />
      </GeoJsonSource>
    </Mapbox>
  </div>
</template>
<script lang="ts" setup>
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import type { MapboxOptions } from 'mapbox-gl'
import { reactive, ref } from 'vue'

interface Item {
  label: string
  value: string
}
const list: Item[] = [
  {
    label: 'streets-v11',
    value: 'mapbox://styles/mapbox/streets-v11'
  },
  {
    label: 'outdoors-v11',
    value: 'mapbox://styles/mapbox/outdoors-v11'
  },
  {
    label: 'light-v10',
    value: 'mapbox://styles/mapbox/light-v10'
  },
  {
    label: 'dark-v10',
    value: 'mapbox://styles/mapbox/dark-v10'
  },
  {
    label: 'satellite-v9',
    value: 'mapbox://styles/mapbox/satellite-v9'
  },
  {
    label: 'preview-day-v4',
    value: 'mapbox://styles/mapbox/navigation-preview-day-v4'
  },
  {
    label: 'preview-night-v4',
    value: 'mapbox://styles/mapbox/navigation-preview-night-v4'
  },
  {
    label: 'guidance-day-v4',
    value: 'mapbox://styles/mapbox/navigation-guidance-day-v4'
  },
  {
    label: 'guidance-night-v4',
    value: 'mapbox://styles/mapbox/navigation-guidance-night-v4'
  }
]
const current = ref('satellite-v9')
function handleChange(item: Item) {
  current.value = item.label
  options.style = item.value
}
const options: Omit<MapboxOptions, 'container'> = reactive({
  style: 'mapbox://styles/mapbox/satellite-v9', // style URL
  center: [-122.486052, 37.830348],
  zoom: 14,
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
})

const geoJsonData: Feature<Geometry, GeoJsonProperties> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-122.48369693756104, 37.83381888486939],
      [-122.48348236083984, 37.83317489144141],
      [-122.48339653015138, 37.83270036637107],
      [-122.48356819152832, 37.832056363179625],
      [-122.48404026031496, 37.83114119107971],
      [-122.48404026031496, 37.83049717427869],
      [-122.48348236083984, 37.829920943955045],
      [-122.48356819152832, 37.82954808664175],
      [-122.48507022857666, 37.82944639795659],
      [-122.48610019683838, 37.82880236636284],
      [-122.48695850372314, 37.82931081282506],
      [-122.48700141906738, 37.83080223556934],
      [-122.48751640319824, 37.83168351665737],
      [-122.48803138732912, 37.832158048267786],
      [-122.48888969421387, 37.83297152392784],
      [-122.48987674713133, 37.83263257682617],
      [-122.49043464660643, 37.832937629287755],
      [-122.49125003814696, 37.832429207817725],
      [-122.49163627624512, 37.832564787218985],
      [-122.49223709106445, 37.83337825839438],
      [-122.49378204345702, 37.83368330777276]
    ]
  }
}
</script>
<style lang="scss">
.radio_list {
  position: absolute;
  z-index: 10;
  top: 10px;
  left: 20px;
  display: flex;
  flex-flow: row wrap;
  .radio_item {
    width: 200px;
    line-height: 30px;
    text-align: center;
    // border: 1px solid #ccc;
    background-color: cornflowerblue;
    border-radius: 8px;
    margin: 10px;
    cursor: pointer;
    &.active {
      background-color: #33bb6a;
    }
  }
}
</style>
