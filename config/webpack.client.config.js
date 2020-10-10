const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    entry: {
        client: path.resolve(__dirname, '../src/entry-client.js')
    },

    plugins: [
        // 此插件在输出目录中,生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin(),
        // 此插件在输出目录中,生成 index.html,用来演示spa
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            filename: 'index.html'
        })
    ]
})