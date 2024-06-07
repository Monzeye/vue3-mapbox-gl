// 根据keys过滤出对象中的属性
export function filterStylePropertiesByKeys<
  T extends Record<string, any> = any
>(style: Record<string, any>, keys: (keyof T)[]): T {
  return Object.keys(style).reduce((newStyle, key) => {
    return keys.includes(key as keyof T)
      ? { ...newStyle, [key]: style[key] }
      : newStyle
  }, {} as T)
}
