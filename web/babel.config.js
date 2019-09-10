module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [ 'component', {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk'
    }],
    [ 'component', {
      libraryName: 'mint-ui',
      style: true
    }, 'mint-ui']
  ]
}
