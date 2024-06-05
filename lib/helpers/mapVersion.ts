import mapboxgl from 'mapbox-gl'

export function getVersion() {
  return mapboxgl.version
}

export function isV1Map() {
  return mapboxgl.version.startsWith('1')
}
