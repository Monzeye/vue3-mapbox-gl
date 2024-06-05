import type { MapEventTypes } from 'mapbox-gl'

export enum MapboxStatus {
  Disposed = -1,
  NotLoaded,
  Loading,
  Loaded,
  Error
}

export const MapboxEvents: (keyof MapEventTypes)[] = [
  'mousedown',
  'mouseup',
  'mouseover',
  'mousemove',
  'preclick',
  'click',
  'dblclick',
  'mouseenter',
  'mouseleave',
  'mouseout',
  'contextmenu',
  'wheel',
  'touchstart',
  'touchend',
  'touchmove',
  'touchcancel',
  'movestart',
  'move',
  'moveend',
  'dragstart',
  'drag',
  'dragend',
  'zoomstart',
  'zoom',
  'zoomend',
  'rotatestart',
  'rotate',
  'rotateend',
  'pitchstart',
  'pitch',
  'pitchend',
  'boxzoomstart',
  'boxzoomend',
  'boxzoomcancel',
  'load',
  'render',
  'idle',
  'error',
  'webglcontextlost',
  'webglcontextrestored',
  'data',
  'styledata',
  'sourcedata',
  'dataloading',
  'styledataloading',
  'sourcedataloading',
  'styleimagemissing'
]
