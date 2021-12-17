// 数据格式转换 json转formData
export const formData = data =>
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

// 判断浏览器类型
export const myBrowser = () => {
  const { userAgent } = window.navigator
  // 判断是否IE浏览器
  if (userAgent.includes('compatible') && userAgent.includes('MSIE') && !userAgent.includes('Opera')) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp.$1)

    if ([7, 8, 9, 10].includes(fIEVersion)) {
      return `IE${fIEVersion}`
    }
    return 'IE'
  }
  // 判断是否是IE11
  if (userAgent.includes('Trident') && userAgent.includes('rv:11.0')) {
    return 'IE11'
  }
  // 判断是否Opera浏览器
  if (userAgent.includes('Opera')) {
    return 'Opera'
  }
  // 判断是否IE的Edge浏览器
  if (userAgent.includes('Edge')) {
    return 'Edge'
  }
  // 判断是否Firefox浏览器
  if (userAgent.includes('Firefox')) {
    return 'FF'
  }
  // 判断是否Safari浏览器
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari'
  }
  // 判断Chrome浏览器
  if (userAgent.includes('Chrome') && !userAgent.includes('Safari')) {
    return 'Chrome'
  }
  return ''
}

/**
 * @description: 提取字符串中的数字
 * @param {String}
 * @return {Number}
 */
export const getNumberOfString = data => {
  if (!data) return false
  return data.replace(/[^0-9]/gi, '')
}
