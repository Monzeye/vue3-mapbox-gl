<template>
  <Mapbox :options="options" :register="registerMap">
    <GeoJsonSource
      :data="'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'"
      :options="{
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      }"
      :register="registerGeoJsonSource">
      <CircleLayer
        :filter="['has', 'point_count']"
        :style="{
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }"
        @click="handleCircleLayer1" />
      <CircleLayer
        :filter="['!', ['has', 'point_count']]"
        :style="{
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }"
        @click="handleCircleLayer2" />
      <SymbolLayer
        :filter="['has', 'point_count']"
        :style="{
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Arial Unicode MS Bold'],
          'text-size': 12
        }" />
    </GeoJsonSource>
    <Popup v-model:show="popupInfo.show" :lnglat="popupInfo.lnglat">
      <div>{{ popupInfo.msg }}</div>
    </Popup>
  </Mapbox>
</template>
<script lang="ts" setup>
import { useEaseTo, useGeoJsonSource, useMapbox } from 'vue3-mapbox-gl'

import type { MapboxOptions, MapLayerMouseEvent } from 'mapbox-gl'
import { reactive } from 'vue'

const options: Omit<MapboxOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-140.5917, 40.6699],
  zoom: 3,
  accessToken:
    'pk.eyJ1IjoiamFycnltZW5nIiwiYSI6ImNqcGpsenhvMjA4YWUzcG4wbDZsazIyZjcifQ.V4CpgVR5ldNaOuobSYfKtw'
}

const popupInfo = reactive({
  show: false,
  lnglat: undefined,
  msg: ''
})
const [registerMap, { queryRenderedFeatures, getMapInstance }] = useMapbox()

const [registerGeoJsonSource, { getClusterExpansionZoom }] = useGeoJsonSource()
const { easeTo } = useEaseTo(getMapInstance)

async function handleCircleLayer1(ev: MapLayerMouseEvent) {
  const features = queryRenderedFeatures(ev.point)
  if (features) {
    const clusterId = features[0]?.properties?.cluster_id
    const zoom = await getClusterExpansionZoom(clusterId)
    easeTo({
      center: (features?.[0].geometry as any).coordinates as [number, number],
      zoom
    })
  }
}

async function handleCircleLayer2(e: MapLayerMouseEvent) {
  const features = e.features
  if (features) {
    const feature = features[0]
    const coordinates = (feature.geometry as any).coordinates.slice()
    popupInfo.msg = feature.properties?.mag
    popupInfo.lnglat = coordinates
    popupInfo.show = true
  }
}
</script>
