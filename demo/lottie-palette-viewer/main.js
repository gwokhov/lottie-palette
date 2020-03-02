import {
  html,
  render
} from 'https://cdn.jsdelivr.net/npm/lit-html@1.1.2/lit-html.min.js'

let lp = null
const data = {
  url: '',
  isLoaded: false,
  isUpdateGrad: true,
  colorMap: null,
  linearGradMap: null
}

const initLottieFile = (path, onDOMLoaded) => {
  const $preview = document.getElementById('preview')
  if ($preview.firstChild) {
    $preview.removeChild($preview.firstChild)
    data.colorMap = null
    data.linearGradMap = null
  }
  const l = lottie.loadAnimation({
    container: $preview,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path,
    rendererSettings: {
      progressiveLoad: false
    }
  })

  l.addEventListener('DOMLoaded', () => {
    onDOMLoaded({ el: $preview })
    data.isLoaded = true
    execRender()
  })
}

const loadFile = path => {
  initLottieFile(path, ({ el }) => {
    lp = new LottiePalette(el)
    const colors = lp.getInitColors()
    const lineGrads = lp.getInitLinearGrads()

    if (colors.length > 0) {
      data.colorMap = Object.create(null)
      colors.forEach(color => {
        data.colorMap[color] = color
      })
    }
    if (lineGrads.length > 0) {
      data.linearGradMap = Object.create(null)
      lp.getInitLinearGrads().forEach(lineGrad => {
        data.linearGradMap[lineGrad] = lineGrad
      })
    }

    execRender()
  })
}

const onFilePut = e => {
  e.preventDefault()
  loadFile(URL.createObjectURL(e.dataTransfer.files[0]))
}

const onUrlEnter = () => {
  if (data.url) {
    loadFile(data.url)
  }
}

const onToggleSyncGrad = () => {
  data.isUpdateGrad = !data.isUpdateGrad
  execRender()
}

const onColorChange = (originColor, newColor) => {
  lp.updateColor(originColor, newColor, data.isUpdateGrad)
  data.colorMap[originColor] = newColor
  execRender()
}

const onTextClick = text => {
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

const player = () => {
  return html`
    <div class="content-wrapper">
      <h1 class="title">🎨 Lottie Palette Viewer</h1>
      <div
        @drop=${onFilePut}
        @dragenter=${e => e.preventDefault()}
        @dragover=${e => e.preventDefault()}
        class="drag-area"
      >
        <div
          id="preview"
          style="display: ${data.isLoaded ? 'block' : 'none'}"
        ></div>
        <div
          class="empty-view"
          style="display: ${!data.isLoaded ? 'block' : 'none'}"
        >
          <img class="empty-view-img" src="./assets/empty.png" />
          <div class="empty-view-desc">Drop and drop a JSON file 2 me!</div>
          <div class="empty-view-or">OR</div>
          <a class="empty-view-file" href="javascript:;">
            SELECT FILE
            <input @change=${onFilePut} accept=".json" type="file" />
          </a>
          <div class="empty-view-or">OR</div>
          <div class="empty-view-url">
            <input
              placeholder="File URL"
              type="text"
              @input=${e => (data.url = e.target.value)}
            />
            <button @click=${onUrlEnter}>FIRA!</button>
          </div>
        </div>
      </div>
    </div>
  `
}

const brick = ({ key, color, isGrad = false }) => html`
  <li class="brick-item">
    <div style="background: ${color}" class="brick-item-color">
      ${!isGrad
        ? html`
            <input
              @change=${e => onColorChange(key, e.srcElement.value)}
              type="color"
            />
          `
        : ''}
    </div>
    <div @click=${() => onTextClick(color)} class="brick-item-text">
      ${color}
    </div>
  </li>
`

const palette = () => {
  const { colorMap, linearGradMap, isUpdateGrad } = data
  const colorBrick = []
  const gradBrick = []
  if (colorMap && Object.keys(colorMap).length > 0) {
    Object.keys(colorMap).forEach(key =>
      colorBrick.push(brick({ key, color: colorMap[key] }))
    )
  }
  if (linearGradMap && Object.keys(linearGradMap).length > 0) {
    Object.keys(linearGradMap).forEach(key =>
      gradBrick.push(brick({ key, color: linearGradMap[key], isGrad: true }))
    )
  }

  return html`
    <div class="data-wrapper">
      ${colorMap &&
        html`
          <div>
            <h4 class="data-tag">
              Colors
              <div
                class="${isUpdateGrad ? 'checked update-grad' : 'update-grad'}"
              >
                <input
                  id="update-grad"
                  type="checkbox"
                  @change=${onToggleSyncGrad}
                />
                <label for="update-grad">Sync Gradient</label>
              </div>
            </h4>
            <div class="tips">💡 Tips: click the text to copy</div>
            <ul class="brick-list">
              ${colorBrick}
            </ul>
          </div>
        `}
      ${linearGradMap &&
        html`
          <div>
            <h4 class="data-tag">LinearGradients</h4>
            <div class="tips"></div>
            <ul class="brick-list">
              ${gradBrick}
            </ul>
          </div>
        `}
    </div>
  `
}

const app = () => {
  return html`
    ${player()} ${(data.colorMap || data.linearGradMap) && palette()}
  `
}

const execRender = () => {
  render(app(), document.getElementById('app'))
}

execRender()
