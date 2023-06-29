export function localGet(key: string) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key) as string)
  } catch {
    return value
  }
}

/**
 * 存储localStorage
 * @param key Storage名称
 * @param value Storage值
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 清除localStorage
 * @param key Storage名称
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key)
}

/**
 * 时间转换
 * @param time 时间
 * @param cFormat 格式
 */
export function parseTime(time: any, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat
  let date: any = ''
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = Number.parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
  return timeStr
}

export const setAttributeValue = <T>(
  origin: T,
  prop: string,
  value: unknown
) => {
  const properties = prop.replace(/\[/g, '.').replace(/\]/g, '').split('.')
  const [key] = properties.splice(-1, 1)
  const data = properties.reduce((data: any, key) => data[key], origin)
  if (data) data[key] = value
  return origin
}

export const getAttributeValue = <T>(origin: T, prop: string) => {
  if (!origin) return
  const properties = prop.replace(/\[/g, '.').replace(/\]/g, '').split('.')
  return properties.reduce((data: any, key) => data[key], origin)
}
