const RGB_MATCH = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/i
const HEX_MATCH = /^#[0-9a-f]{3,6}$/i

export const rgb2Rgba = (rgb, opacity) => {
  const res = rgb.match(RGB_MATCH)
  return `rgba(${res[1]},${res[2]},${res[3]},${opacity})`
}

export const isRgb = testStr => {
  return RGB_MATCH.test(testStr)
}

export const isHex = testStr => {
  return HEX_MATCH.test(testStr)
}

export const hex2Rgb = hex => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )})`
    : ''
}
