export function findLayerDefaultStyleSetVal<
  T extends Record<string, any> = any
>(obj: T, defaultVal: T) {
  return Object.keys(obj).reduce(
    (style, key) => {
      if (Reflect.has(defaultVal, key)) {
        style[key] = obj[key]
      }
      return style
    },
    {} as Record<string, any>
  )
}
