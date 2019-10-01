const RGB_MATCH = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/i
const HEX_MATCH = /^#[0-9a-f]{3,6}$/i

export function rgb2Rgba(rgb, opacity) {
  const num = rgb.substring(4, rgb.length - 1)
  return `rgba(${num},${opacity})`
}

export function isRgb(testStr) {
  return RGB_MATCH.test(testStr)
}

export function isHex(testStr) {
  return HEX_MATCH.test(testStr)
}

export function hex2Rgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )})`
    : ''
}