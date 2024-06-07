import type { ShallowRef } from 'vue'
import { onUnmounted, unref, watchEffect } from 'vue'
import type { Map, ImageOptions, ImageDatas } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface CreateImageProps {
  map: ShallowRef<Nullable<Map>>
  id: string
  image: ImageDatas | string
  options?: ImageOptions
}

export function useCreateImage(props: CreateImageProps) {
  let resolveFn: (value?: any) => void
  let rejectFn: (reason?: any) => void
  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve
    rejectFn = reject
  })
  const stopEffect = watchEffect(() => {
    const map = unref(props.map)
    if (map) {
      updateImage(props.image).then(resolveFn).catch(rejectFn)
    }
  })
  async function updateImage(image: ImageDatas | string) {
    const map = unref(props.map)
    if (map) {
      if (typeof image === 'string') {
        try {
          image = await loadImage(image)
          if (map!.hasImage(props.id)) {
            map!.updateImage(props.id, image)
          } else {
            map!.addImage(props.id, image, props.options)
          }
          Promise.resolve()
        } catch (error) {
          Promise.reject(error)
        }
      } else {
        if (map!.hasImage(props.id)) {
          map!.updateImage(props.id, image)
        } else {
          map!.addImage(props.id, image, props.options)
        }
        Promise.resolve()
      }
    } else {
      Promise.reject(new Error('Map is not defined'))
    }
  }

  function loadImage(image: string): Promise<ImageDatas> {
    const map = unref(props.map)
    return new Promise<ImageDatas>((resolve, reject) => {
      if (!map) {
        return reject(new Error('Map is not defined'))
      }
      map.loadImage(image, (error, image) => {
        if (error) reject(error)
        resolve(image as ImageDatas)
      })
    })
  }

  function remove() {
    const map = unref(props.map)
    if (map?.hasImage(props.id)) {
      map.removeImage(props.id)
    }
    rejectFn()
  }

  onUnmounted(() => {
    remove()
    stopEffect()
  })

  return {
    remove,
    loadImage,
    updateImage,
    loadPromise: promise
  }
}
