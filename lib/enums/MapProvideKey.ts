import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'
import type { Map, AnySourceImpl } from 'mapbox-gl'
import type { Nullable } from '@/types'

export const MapProvideKey = Symbol() as InjectionKey<
  ShallowRef<Nullable<Map>> | ComputedRef<Nullable<Map>>
>

export const SourceProvideKey = Symbol() as InjectionKey<
  ShallowRef<Nullable<AnySourceImpl>> | ComputedRef<Nullable<AnySourceImpl>>
>
