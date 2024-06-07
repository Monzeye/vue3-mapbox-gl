import mapboxgl from 'mapbox-gl'

export function getVersion() {
  return mapboxgl.version
}

export function getMainVersion() {
  return parseInt(getVersion().split('.')[0], 10)
}
