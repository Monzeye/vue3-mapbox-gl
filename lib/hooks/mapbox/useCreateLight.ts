import { ref } from 'vue'
import type { ShallowRef } from 'vue'
import type { Light, Map } from 'mapbox-gl'
import { useMapReloadEvent } from '@/hooks/event/useMapReloadEvent'
import { getShallowRef } from '@/helpers/getRef'
import type { Nullable } from '@/types'

interface CreateFogProps {
  map: ShallowRef<Nullable<Map>>
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
  map,
  options: optionsVal = defaultLight
}: CreateFogProps) {
  const mapInstance = getShallowRef(map)
  const options = ref(optionsVal)

  useMapReloadEvent(mapInstance, {
    onLoad() {
      setLight(options.value)
    }
  })
  function setLight(optionsVal: Light) {
    options.value = optionsVal
    mapInstance.value && mapInstance.value.setLight(options.value)
  }
  function removeLight() {
    mapInstance.value && mapInstance.value.setLight({})
  }
  return {
    setLight,
    removeLight
  }
}
