import type { RefOrNo, ShallowRefOrNo } from '@/types'
import type { Ref, ShallowRef } from 'vue'
import { ref, shallowRef, isRef, isReadonly } from 'vue'

export function getRef<T, V extends T = any>(
  val: RefOrNo<T>,
  defaultVal: V
): Ref<NonNullable<T>>
export function getRef<T>(val: RefOrNo<T>): Ref<T>
export function getRef<T, V extends T = any>(
  val: RefOrNo<T>,
  defaultVal?: V
): Ref<T> | Ref<NonNullable<T>> {
  if (isRef<T>(val)) {
    if (!isReadonly(val)) {
      val.value = val.value ?? (defaultVal as V)
    }
    return val
  }
  return ref(val ?? (defaultVal as V)) as Ref<T>
}
export function getShallowRef<T, V extends T = any>(
  val: ShallowRefOrNo<T>,
  defaultVal: V
): ShallowRef<NonNullable<T>>
export function getShallowRef<T>(val: ShallowRefOrNo<T>): ShallowRef<T>
export function getShallowRef<T, V extends T = any>(
  val: ShallowRefOrNo<T>,
  defaultVal?: V
): ShallowRef<T> | ShallowRef<NonNullable<T>> {
  if (isRef<T>(val)) {
    if (!isReadonly(val)) {
      val.value = val.value ?? (defaultVal as V)
    }
    return val
  }
  return shallowRef(val ?? (defaultVal as V)) as Ref<T>
}
