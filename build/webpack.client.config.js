/**
 * webpack client配置
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// const base = require('./webpack.base.config')()
const base = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

// const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
    entry: {
        app: './src/client-entry.js',
        // app: path.join(process.cwd(), 'client/entry-client.js'),
    },
    mode: process.env.NODE_ENV || 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
            'process.env.DEBUG_API': true
        }),
        new VueSSRClientPlugin()
    ]
})

module.exports = config