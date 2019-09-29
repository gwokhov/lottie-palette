export default class LottiePalette {
  constructor($element) {
    if (!$element) {
      throw '[lottie-palette] No element found.'
    }
    this.$element = $element
    this.colorMap = {}
    this.linearGradMap = {}
    this.updateMaps()
  }

  /**
   * 更新映射键值表（色值序列 -> 元素）
   */
  updateMaps() {
    this._generateColorMap()
    this._generateLineGradMap()
  }

  /**
   * 生成一个单色值的键值表（色值 -> 对应元素）
   */
  _generateColorMap() {
    const pathList = this.$element.querySelectorAll('path[fill^="rgb"]')

    for (let i = 0, len = pathList.length; i < len; i++) {
      const $path = pathList[i]
      const rgbColor = window.encodeURIComponent(
        window.getComputedStyle($path).fill.replace(/\s+/g, '')
      )

      if (!(rgbColor in this.colorMap)) {
        this.colorMap[rgbColor] = [$path]
      } else {
        this.colorMap[rgbColor].push($path)
      }
    }
  }

  /**
   * 生成一个径向渐变的键值表（渐变值序列 -> 对应元素）
   */
  _generateLineGradMap() {
    const lineGradList = this.$element.querySelectorAll('defs > linearGradient')

    // 遍历所有<linearGradient>元素
    for (let i = 0, len = lineGradList.length; i < len; i++) {
      const $lineGrad = lineGradList[i]
      const stopList = $lineGrad.children
      const stopData = []
      // 遍历所有<stop>元素
      for (let i = 0, len = stopList.length; i < len; i++) {
        const $stop = stopList[i]

        const offset = $stop.getAttribute('offset')
        const color = $stop.getAttribute('stop-color')
        const opacity = $stop.getAttribute('stop-opacity')
        stopData.push([offset, color, opacity].join('|'))
      }
      const stopDataStr = stopData.join('-')

      // 将序列化后的渐变数据及对应节点存储
      if (!(stopDataStr in this.linearGradMap)) {
        this.linearGradMap[stopDataStr] = [$lineGrad]
      } else {
        this.linearGradMap[stopDataStr].push($lineGrad)
      }
    }
  }

  /**
   * 将序列化后的渐变数据转为数组对象
   * @param {*} str 序列化数据
   */
  static _lineGradString2Data(str) {
    const stopData = str.split('-')
    return stopData.map(stop => {
      return stop.split('|')
    })
  }

  /**
   * 将序列化的渐变数据转化为CSS渐变字符串
   * @param {*} str 序列化数据
   */
  static _lineGradString2CSS(str) {
    const stopArray = LottiePalette._lineGradString2Data(str)
    const pre = 'linear-gradient('
    const suf = ')'
    const stops = []

    stopArray.forEach(stop => {
      let color = ''
      if (stop[2]) {
        color = LottiePalette._rgb2Rgba(stop[1], stop[2])
      } else {
        color = stop[1]
      }
      color += ` ${stop[0]}`
      stops.push(color)
    })
    return `${pre}${stops.join(',')}${suf}`
  }

  static _rgb2Rgba(rgb, opacity) {
    const num = rgb.substring(4, rgb.length - 1)
    return `rgba(${num},${opacity})`
  }

  static _hex2Rgb(hex) {
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

  getInitialColors() {
    const colors = []
    for (let color in this.colorMap) {
      if (this.colorMap.hasOwnProperty(color)) {
        colors.push(window.decodeURIComponent(color))
      }
    }
    return colors
  }

  getLinearGradients(type = 'css') {
    const lineGrads = []
    for (let lineGrad in this.linearGradMap) {
      if (!this.linearGradMap.hasOwnProperty(lineGrad)) {
        return
      }

      let lineGradStr
      if (type === 'css') {
        lineGradStr = LottiePalette._lineGradString2CSS(lineGrad)
      } else {
        lineGradStr = lineGrad
      }

      lineGrads.push(lineGradStr)
    }
    return lineGrads
  }

  /**
   * 更新颜色值
   * @param {String} key 颜色原始值（只接受rgb, hex格式）
   * @param {String} value 更新后的颜色
   * @param {Boolean} isUpdateGrad 是否更新渐变
   */
  updateColor(key, value, isUpdateGrad) {
    let fKey = key.replace(/\s+/g, '')
    if (fKey.indexOf('#') === 0 && (fKey.length === 4 || fKey.length === 7)) {
      fKey = LottiePalette._hex2Rgb(fKey)
    } else if (fKey.indexOf('rgb(') === 0) {
    } else {
      throw `[lottie-palette] Color key ${key} is invalid`
    }

    const encodeKey = window.encodeURIComponent(key.replace(/\s+/g, ''))
    if (!(encodeKey in this.colorMap)) {
      throw `No such color key "${key}" in the origin svg file!`
    }

    this.colorMap[encodeKey].forEach($path => {
      $path.style.fill = value.replace(/\s+/g, '')
    })

    if (isUpdateGrad) {
      this.updateLinearGradColor(key, value)
    }
  }

  /**
   * 更新渐变的单个颜色值
   * @param {String} key 颜色原始值（只接受rgb, hex格式）
   * @param {String} value 更新后的颜色
   */
  updateLinearGradColor(key, value) {
    for (let lineGrad in this.linearGradMap) {
      if (!this.linearGradMap.hasOwnProperty(lineGrad)) {
        return
      }
      const stopData = LottiePalette._lineGradString2Data(lineGrad)

      // 获取key颜色相同的<stop>元素的索引
      let stopIndexes = []
      stopData.forEach((stop, index) => {
        if (stop[1] === key) {
          stopIndexes.push(index)
        }
      })

      if (stopIndexes.length > 0) {
        this.linearGradMap[lineGrad].forEach($lineGrad => {
          stopIndexes.forEach(index => {
            $lineGrad.children[index].setAttribute('stop-color', value)
          })
        })
      }
    }
  }

  updateLinearGrad(key, value) {
    if (!(key in this.linearGradMap)) {
      throw `No such linear gradient key "${key}" in the origin svg file!`
    }

    const stopData = LottiePalette._lineGradString2Data(
      value.replace(/\s+/g, '')
    )

    this.linearGradMap[key].forEach($lineGrad => {
      // 删除<linearGradient>元素所有子节点
      while ($lineGrad.hasChildNodes()) {
        $lineGrad.removeChild($lineGrad.firstChild)
      }
      // 将生成新的<stop>元素添加到<linearGradient中
      stopData.forEach(stop => {
        const $stop = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'stop'
        )
        $stop.setAttribute('offset', stop[0])
        $stop.setAttribute('stop-color', stop[1])
        $stop.setAttribute('stop-opacity', stop[2])
        $lineGrad.appendChild($stop)
      })
    })
  }
}
