import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    name: 'LottiePalette',
    format: 'umd',
    file: 'dist/lottie-palette.js'
  },
  plugins: [
    commonjs(),
    babel({
      exclude: ['node_modules/**'],
      presets: ['@babel/preset-env']
    }),
    terser()
  ]
}
