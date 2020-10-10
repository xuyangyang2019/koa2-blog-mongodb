/**
 * webpack client配置
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')()
const isProd = process.env.NODE_ENV === 'production'

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = merge(baseConfig, {
  entry: {
    app: path.join(process.cwd(), 'src/entry-client.js'),
  },
  mode: isProd ? 'production' : 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})

module.exports = config