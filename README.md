# LottiePalette

English | [中文](./README.CN.md)

[![npm](https://img.shields.io/npm/v/lottie-palette)](https://www.npmjs.com/package/lottie-palette)
![GitHub file size in bytes](https://img.shields.io/github/size/Gwokhov/lottie-palette/dist/lottie-palette.js)

## Intro

LottiePalette is a **runtime** util which can change the color of Lottie ani in single frame, for now it only support **SVG** renderer.

Demo：[LottiePaletteViewer](https://gwokhov.github.io/lottie-palette-viewer/dist/)

## Install

```shell
npm install lottie-palette
# or
yarn add lottie-palette
```

or just include the compiled file to your page:

```html
<script src="./lottie-palette.js"></script>
```

## Usage

> ⚠️ PS：LottiePalette is not include Lottie, please import Lottie additionally.

```js
import Lottie from 'lottie-web/build/player/lottie_svg'
import LottiePalette from 'lottie-palette'

let lp = null

const lottie = Lottie.loadAnimation({
  container: document.getElementById('#lottie-wrapper'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path,
  rendererSettings: {
    progressiveLoad: false // 2 make sure paths were loaded after DOMLoaded event
  }
})

lottie.addEventListener('DOMLoaded', () => {
  lp = new LottiePalette(document.getElementById('#lottie-wrapper'))
  // Instance will generate a color map
})

// You can change the black color paths 2 white via this：
lp.updateColor('rgb(0, 0, 0)', '#fff', true)
// or
lp.updateColor('#000', 'rgb(255, 255, 255)', true)
```

⚠️ PS：

1. If you want 2 update the color of the same elements (which have same color) multiple times, make sure that the first parameter of `updateColor()` is the inital color (when LottiePalette is instantiated or update map), if you want to refresh the color map, execute the `updateMaps()` function.
2. Instantiating LottiePalette in `DOMLoaded` event perform well at most cases. In case the color is missing, (for example, the color of the ani is dynamical), please manage the initialization of LottiePalette or just use `updateMaps()`.

## Methods

| Method                  | Description                                           | Arguments                                                                                                                          | Returns                     |
| ----------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `[[Constructor]]`       | the Constructor of LottiePalette                      | `$element:Element` SVG Element 2 init                                                                                              |                             |
| `updateColor`           | update single color                                   | `key:String` initial color（accept rgb, hex format)  `value:String` new color value `isUpdateGrad: Boolean` update gradient or not |                             |
| `updateLinearGrads`     | update linear gradient（recommand 2 use updateColor)  | `key:String` initial gradient lottie-palette-id `value:String` new gradient lottie-palette-id                                      |                             |
| `updateLinearGradColor` | update single color of linear gradient                | `key:String` initial color（accept rgb, hex format)  `value:String` new color value                                                |                             |
| `getInitialColors`      | get all initial colors                                |                                                                                                                                    | :Array, foramt: rgb |
| `getLinearGradients`    | get all initial linear gradient                       | `type:String` the format of array's item ('css'                                                                                          | 'id') , default: 'css'         | :Array |
| `updateMaps`            | update color map                                      |                                                                                                                                    |                             |
