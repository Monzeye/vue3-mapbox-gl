import { ref, unref } from 'vue'
import type { MaybeRef } from 'vue'
import type { Light, Map } from 'mapbox-gl'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import type { Nullable } from '@/types'

interface CreateFogProps {
  map: MaybeRef<Nullable<Map>>
  options?: Light
}

const defaultLight: Light = {
  anchor: 'viewport',
  color: '#ffffff',
  intensity: 0.5,
  position: [1.15, 210, 30]
}
// 物体底部的中心到其光的距离
// 物体的位置灯光相对于0°
// （light.anchor设置为0°时viewport对应视口的顶部，
// 或light.anchor设置为0°时map对应正北，
// 度数顺时针方向）
// 灯光的高度（从0开始°，正上方，到 180°，正下方）

export function useCreateLight({
  map: mapRef,
  options: optionsVal = defaultLight
}: CreateFogProps) {
  const options = ref(optionsVal)

  useMapReloadEvent(mapRef, {
    onLoad() {
      setLight(options.value)
    }
  })
  function setLight(optionsVal: Light) {
    const map = unref(mapRef)
    options.value = optionsVal
    map?.setLight(options.value)
  }
  function removeLight() {
    const map = unref(mapRef)
    map?.setLight({})
  }
  return {
    setLight,
    removeLight
  }
}
