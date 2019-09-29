# LottiePalette

[English](./README.md) | 中文

[![npm](https://img.shields.io/npm/v/lottie-palette)](https://www.npmjs.com/package/lottie-palette)
![GitHub file size in bytes](https://img.shields.io/github/size/Gwokhov/lottie-palette/dist/lottie-palette.js)

## 介绍

LottiePalette 是一个「**运行时**」捕获单帧修改 Lottie 动画颜色的工具，目前仅支持 **SVG** 的渲染方式。

Demo：[LottiePaletteViewer](https://gwokhov.github.io/lottie-palette-viewer/dist/)

## 安装

```shell
npm install lottie-palette
# or
yarn add lottie-palette
```

或者直接引用到你的页面上：

```html
<script src="./lottie-palette.js"></script>
```

## 使用

> ⚠️ 注：LottiePalette 不包含 Lottie，请单独引入

```js
import Lottie from 'lottie-web/build/player/lottie_svg'
import LottiePalette from './lottie-palette'

let lp = null

const lottie = Lottie.loadAnimation({
  container: document.getElementById('#lottie-wrapper'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path,
  rendererSettings: {
    progressiveLoad: false // 关闭按需加载以确保路径在DOMLoaded时全部加载
  }
})

lottie.addEventListener('DOMLoaded', () => {
  lp = new LottiePalette(document.getElementById('#lottie-wrapper'))
  // 初始化实例后，LottiePalette会自动生成当前svg的颜色映射表
})

// 假如你想改变动画中色值为的黑色元素改为白色，你可以：
lp.updateColor('rgb(0, 0, 0)', '#fff', true) // 第三个参数为是否更新渐变色
// or
lp.updateColor('#000', 'rgb(255, 255, 255)', true)
```

⚠️ 注：

1. 假如你想多次更新同一个元素（同一系列）的颜色，请确保 `updateColor()` 的第一个参数为最开始的颜色（LottiePalette 实例化时的状态），若你想刷新 LottiePalette 内颜色映射表的状态，可以调用 `updateMaps()`。
2. 在 `DOMLoaded` 时实例化 LottiePalette 能满足大部分场景，若出现颜色缺少的情况（例如动画的颜色是动态变化的）请自己控制 LottiePalette 的初始化时机或使用 `updateMaps()`。

## 方法

| 方法                    | 说明                                | 参数                                                                                                   | 返回                      |
|-------------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------|---------------------------|
| `[[Constructor]]`       | LottiePalette构造函数               | `$element:Element` 初始化的SVG动画元素                                                                 |                           |
| `updateColor`           | 更新单个颜色                        | `key:String` 初始颜色（接受rgb，hex格式） `value:String` 替换颜色 `isUpdateGrad: Boolean` 是否更新渐变 |                           |
| `updateLinearGrads`      | 更新线性渐变（建议使用updateColor） | `key:String` 初始渐变的lottie-palette-id `value:String` 替换渐变的lottie-palette-id                    |                           |
| `updateLinearGradColor` | 更新渐变中的单个颜色                | `key:String` 初始颜色（接受rgb，hex格式） `value:String` 替换颜色                                      |                           |
| `getInitialColors`       | 获取映射表中全部颜色                |                                                                                                        | :Array，元素以rgb形式展示 |
| `getLinearGradients`    | 获取映射表中全部线性渐变            | `type:String` 返回数组中元素的类型（'css'|'id'），默认为'css'                                          | :Array                    |
| `updateMaps`            | 更新颜色映射表                      |                                                                                                        |                           |