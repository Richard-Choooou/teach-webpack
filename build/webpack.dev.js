const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /.(sc|c)ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        publicPath: '/',
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})