const path = require("path")

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: path.resolve(__dirname, "dist"),
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = './public/index.html'
        return args
      })
  }
}
