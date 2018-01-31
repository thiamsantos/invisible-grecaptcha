import babel from 'rollup-plugin-babel'

export default [
  {
    input: 'src/index.js',
    plugins: [
      babel({
        babelrc: false,
        plugins: ['external-helpers'],
        presets: [['env', {modules: false}], 'stage-0']
      })
    ],
    output: [
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'invisibleGrecaptcha'
      },
      {
        file: 'dist/index.esm.js',
        format: 'es'
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs'
      }
    ]
  }
]
