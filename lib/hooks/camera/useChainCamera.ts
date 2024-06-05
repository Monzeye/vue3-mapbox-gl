import type { ShallowRef } from 'vue'
import type { LngLatLike, Map } from 'mapbox-gl'
import type { ChainCameraItem, Nullable } from '@/types'
import { MercatorCoordinate } from 'mapbox-gl'
import { shallowRef, watchEffect } from 'vue'

type LerpParams = [number, number] | number

const easingFuncs: {
  [PropType in NonNullable<ChainCameraItem['easing']>]: (t: number) => number
} = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => {
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t
    }
    return 0.5 * ((t -= 2) * t * t + 2)
  }
}

class ChainCamera {
  map: Map
  chainCameraList: ChainCameraItem[] = []
  animationIndex: number
  animationTime: number
  lastTime: number
  animationFrame: number
  currentMapCenter: LngLatLike | null
  isPlay: boolean
  constructor(config: { map: Map; chainCameraList: ChainCameraItem[] }) {
    this.map = config.map
    this.chainCameraList = config.chainCameraList
    this.animationIndex = 0
    this.animationTime = 0.0
    this.lastTime = 0.0
    this.animationFrame = undefined!
    this.currentMapCenter = null
    this.isPlay = false
  }
  play() {
    if (this.isPlay) {
      return
    }
    this.pause()
    this.currentMapCenter = this.map.getCenter()
    window.requestAnimationFrame(this._frame.bind(this))
    this.isPlay = true
  }
  replay() {
    this.pause()
    this.animationIndex = 0
    this.animationTime = 0.0
    this.lastTime = 0.0
    this.animationFrame = undefined!
    this.currentMapCenter = null
    this.play()
  }
  pause() {
    this.animationFrame && window.cancelAnimationFrame(this.animationFrame)
    this.isPlay = false
  }
  remove() {
    this.pause()
    this.animationIndex = 0
    this.animationTime = 0.0
    this.lastTime = 0.0
    this.animationFrame = undefined!
    this.currentMapCenter = null
    this.isPlay = false
    this.chainCameraList = null!
    this.map = null!
  }
  _lerp<T extends LerpParams>(a: T, b: T, t: number): T {
    if (Array.isArray(a) && Array.isArray(b)) {
      const result: [number, number] = [0, 0]
      for (let i = 0; i < Math.min(a.length, b.length); i++)
        result[i] = a[i] * (1.0 - t) + b[i] * t
      return result as T
    } else {
      return (<number>a * (1.0 - t) + <number>b * t) as T
    }
  }
  _lnglatTransform(lngLat: LngLatLike): [number, number] {
    if (Array.isArray(lngLat)) {
      return lngLat
    } else if ((lngLat as any).lng) {
      return [(lngLat as any).lng, (lngLat as any).lat]
    } else if ((lngLat as any).lon) {
      return [(lngLat as any).lon, (lngLat as any).lat]
    } else {
      return [0, 0]
    }
  }
  _animate(phase: number) {
    let prevItem: ChainCameraItem
    let currentItem: ChainCameraItem
    if (this.animationIndex === 0) {
      currentItem = this.chainCameraList[this.animationIndex]
      prevItem = this.chainCameraList[this.animationIndex]
    } else {
      prevItem = this.chainCameraList[this.animationIndex - 1]
      currentItem = this.chainCameraList[this.animationIndex]
    }
    prevItem.altitude = prevItem.altitude || 0
    prevItem.lngLat = this._lnglatTransform(prevItem.lngLat)
    prevItem.lookAtLngLat = this._lnglatTransform(prevItem.lookAtLngLat)

    currentItem.altitude = currentItem.altitude || 0
    currentItem.lngLat = this._lnglatTransform(currentItem.lngLat)
    currentItem.lookAtLngLat = this._lnglatTransform(currentItem.lookAtLngLat)
    const easingFn =
      (currentItem.easing && easingFuncs[currentItem.easing]) ||
      easingFuncs.linear
    const lngLat = this._lerp(
      prevItem.lngLat as [number, number],
      currentItem.lngLat as [number, number],
      easingFn(phase)
    )
    const altitude = this._lerp(
      prevItem.altitude,
      currentItem.altitude,
      easingFn(phase)
    )
    const lookAtLngLat = this._lerp(
      prevItem.lookAtLngLat as [number, number],
      currentItem.lookAtLngLat as [number, number],
      easingFn(phase)
    )
    const camera = this.map.getFreeCameraOptions()
    camera.position = MercatorCoordinate.fromLngLat(lngLat, altitude)
    camera.lookAtPoint(lookAtLngLat)
    this.map.setFreeCameraOptions(camera)
  }
  _frame(time: number) {
    this.animationIndex %= this.chainCameraList.length
    const currentItem = this.chainCameraList[this.animationIndex]
    if (this.animationTime < currentItem.duration) {
      const phase = Math.min(this.animationTime / currentItem.duration, 1)
      this._animate(phase)
    }
    const elapsed = time - this.lastTime
    this.animationTime += elapsed
    this.lastTime = time
    if (this.animationTime > currentItem.duration) {
      this.animationIndex++
      this.animationTime = 0
    }
    this.animationFrame = window.requestAnimationFrame(this._frame.bind(this))
  }
}

export function useChainCamera({
  map,
  list,
  autoplay = false
}: {
  map: ShallowRef<Nullable<Map>>
  autoplay?: boolean
  list: ChainCameraItem[]
}) {
  const chainCamera = shallowRef<ChainCamera>()
  watchEffect(() => {
    if (map.value) {
      chainCamera.value = new ChainCamera({
        map: map.value,
        chainCameraList: list
      })
      autoplay && chainCamera.value.play()
    }
  })
  function play() {
    chainCamera.value?.play()
  }
  function pause() {
    chainCamera.value?.pause()
  }
  function replay() {
    chainCamera.value?.replay()
  }
  function remove() {
    chainCamera.value?.remove()
  }
  return {
    play,
    pause,
    replay,
    remove
  }
}
