<template>
  <div class="map_wrapper">
    <Mapbox
      :options="options"
      :show-stats="true"
      :register="register"
      @load="mapLoad">
      <template #beforeLoad>
        <Image
          :images="[
            {
              id: 'cat',
              image: 'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png'
            }
          ]" />
      </template>
      <GeoJsonSource
        :data="{
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [-74.00923587095748, 40.70294276920271]
              }
            }
          ]
        }">
        <SymbolLayer
          slot-name="top"
          :style="{
            'icon-image': 'cat',
            'icon-size': 0.1,
            'symbol-placement': 'point',
            'symbol-z-elevate': true
          }" />
      </GeoJsonSource>
    </Mapbox>
  </div>
</template>
<script lang="ts" setup>
import type { MapboxOptions } from 'mapbox-gl'
import { nextTick, onMounted, ref, watchEffect } from 'vue'
import { useMapbox } from 'vue3-mapbox-gl'

const options = ref<Omit<MapboxOptions, 'container'>>({
  style: 'mapbox://styles/mapbox/standard',
  center: [-74.010499, 40.705441],
  zoom: 15.1,
  pitch: 60
})
onMounted(() => {
  console.log('onMounted')
})
nextTick(() => {
  console.log('nextTick')
})
watchEffect(() => {
  console.log('watchEffect')
})

const [register, { getMapInstance }] = useMapbox()
const mapLoad = () => {
  const map = getMapInstance.value!
  console.log('mapLoad', map)
  let lastTime = 0.0
  let animationTime = 0.0
  let cycleTime = 0.0
  let night = true

  const initialBearing = map.getBearing()

  function frame(time: number) {
    const elapsedTime = (time - lastTime) / 1000.0

    animationTime += elapsedTime
    cycleTime += elapsedTime

    if (cycleTime >= 10.0) {
      if (night) {
        // night fog styling
        map.setFog({
          range: [-1, 2],
          'horizon-blend': 0.3,
          color: '#242B4B',
          'high-color': '#161B36',
          'space-color': '#0B1026',
          'star-intensity': 0.8
        })
      } else {
        // day fog styling
        map.setFog({
          range: [-1, 2],
          'horizon-blend': 0.3,
          color: 'white',
          'high-color': '#add8e6',
          'space-color': '#d8f2ff',
          'star-intensity': 0.0
        })
      }

      night = !night
      cycleTime = 0.0
    }

    const rotation = initialBearing + animationTime * 2.0
    map.setBearing(rotation % 360)

    lastTime = time

    window.requestAnimationFrame(frame)
  }
  window.requestAnimationFrame(frame)
}
</script>
<style lang="css" scoped>
.map_wrapper {
  width: 100%;
  height: 100%;
}
</style>
