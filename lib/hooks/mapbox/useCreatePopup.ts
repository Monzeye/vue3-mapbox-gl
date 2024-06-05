import { computed, onUnmounted, watchEffect } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import type { LngLatLike, Map, PopupOptions } from 'mapbox-gl'
import { Popup } from 'mapbox-gl'
import { getShallowRef } from '@/helpers/getRef'
import type { Nullable } from '@/types'
import { lngLatLikeHasValue } from '@/helpers/mapUtils'

interface CreatePopupProps {
  map: ShallowRef<Nullable<Map>>
  options?: PopupOptions
  el?: Ref<HTMLElement | undefined>
  lnglat?: LngLatLike
  show?: boolean
  on?: {
    open?: (popup: Popup) => void
    close?: (popup: Popup) => void
  }
}

export function useCreatePopup({
  map,
  lnglat: lnglatVal,
  el,
  show: showVal = false,
  options = {},
  on = {}
}: CreatePopupProps) {
  const mapInstance = getShallowRef(map)
  const popup = getShallowRef<Nullable<Popup>>(null)
  const getPopup = computed(() => popup.value)
  const stopEffect = watchEffect(onCleanUp => {
    if (mapInstance.value && el?.value && !popup.value) {
      popup.value = new Popup({
        ...options
      })
      popup.value.setDOMContent(el.value)
      lngLatLikeHasValue(lnglatVal) && setLngLat(lnglatVal)
      showVal && show()
      popup.value.on('close', closeEventFn)
      popup.value.on('open', openEventFn)
    }
    onCleanUp(() => {
      remove()
    })
  })

  function openEventFn() {
    if (popup.value) {
      on.open?.(popup.value)
    }
  }
  async function closeEventFn() {
    if (popup.value) {
      await new Promise(resolve => resolve(true))
      on.close?.(popup.value)
    }
  }
  function setLngLat(lnglat: LngLatLike) {
    if (popup.value) {
      popup.value.setLngLat(lnglat)
    }
  }
  function setOffset(offset: [number, number]) {
    if (popup.value) {
      popup.value.setOffset(offset)
    }
  }

  function addClassName(className: string) {
    if (popup.value) {
      popup.value.addClassName(className)
    }
  }

  function removeClassName(className: string) {
    if (popup.value) {
      popup.value.removeClassName(className)
    }
  }
  function setMaxWidth(width: string) {
    if (popup.value) {
      popup.value.setMaxWidth(width)
    }
  }

  function show() {
    if (mapInstance.value && popup.value && !popup.value.isOpen()) {
      popup.value.addTo(mapInstance.value)
    }
  }
  function remove() {
    removeEvent()
    hide()
    popup.value = null
  }
  function hide() {
    if (popup.value && popup.value.isOpen()) {
      popup.value.remove()
    }
  }
  function removeEvent() {
    if (popup.value) {
      popup.value.off('close', closeEventFn)
      popup.value.off('open', openEventFn)
    }
  }
  onUnmounted(() => {
    stopEffect()
  })

  return {
    getPopup,
    setLngLat,
    setOffset,
    addClassName,
    removeClassName,
    remove,
    show,
    hide,
    setMaxWidth
  }
}
