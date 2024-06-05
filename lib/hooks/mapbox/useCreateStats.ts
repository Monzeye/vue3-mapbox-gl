import { unref, watchEffect, type MaybeRef } from 'vue'
import Stats from 'stats.js'
// 帧数显示
export function useCreateStats(el: MaybeRef<HTMLElement | undefined>) {
  let animationFrame: number | undefined
  let stats: Stats | undefined

  const stopWatchEffect = watchEffect(() => {
    remove()
    if (unref(el) && !stats) {
      init()
      stopWatchEffect()
    }
  })

  function init() {
    const elDom = unref(el)
    if (elDom) {
      stats = new Stats()
      stats.showPanel(0)
      elDom.appendChild(stats.dom)

      animationFrame = requestAnimationFrame(_animate)
    }
  }

  function _animate() {
    stats!.begin()
    stats!.end()
    animationFrame = requestAnimationFrame(_animate)
  }

  function remove() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = undefined
    }
    stats = undefined
  }

  return {
    init,
    remove
  }
}
