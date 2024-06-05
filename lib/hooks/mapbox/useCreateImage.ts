import { getShallowRef } from '@/helpers/getRef'
import type { ShallowRef } from 'vue'
import { onUnmounted, watchEffect } from 'vue'
import type { Map, ImageOptions, ImageDatas } from 'mapbox-gl'
import type { Nullable } from '@/types'

interface CreateImageProps {
  map: ShallowRef<Nullable<Map>>
  id: string
  image: ImageDatas | string
  options?: ImageOptions
}

export function useCreateImage(props: CreateImageProps) {
  const map = getShallowRef(props.map)
  let resolveFn: (value?: any) => void
  let rejectFn: (reason?: any) => void
  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve
    rejectFn = reject
  })
  const stopEffect = watchEffect(() => {
    if (map.value) {
      updateImage(props.image).then(resolveFn).catch(rejectFn)
    }
  })
  async function updateImage(image: ImageDatas | string) {
    if (map.value) {
      if (typeof image === 'string') {
        try {
          image = await loadImage(image)
          if (map.value!.hasImage(props.id)) {
            map.value!.updateImage(props.id, image)
          } else {
            map.value!.addImage(props.id, image, props.options)
          }
          Promise.resolve()
        } catch (error) {
          Promise.reject(error)
        }
      } else {
        if (map.value!.hasImage(props.id)) {
          map.value!.updateImage(props.id, image)
        } else {
          map.value!.addImage(props.id, image, props.options)
        }
        Promise.resolve()
      }
    } else {
      Promise.reject(new Error('Map is not defined'))
    }
  }

  function loadImage(image: string): Promise<ImageDatas> {
    return new Promise<ImageDatas>((resolve, reject) => {
      if (!map.value) {
        return reject(new Error('Map is not defined'))
      }
      map.value.loadImage(image, (error, image) => {
        if (error) reject(error)
        resolve(image as ImageDatas)
      })
    })
  }

  function remove() {
    if (map.value?.hasImage(props.id)) {
      map.value.removeImage(props.id)
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
