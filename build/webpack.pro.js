const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const getPathByRoot = require('./utils').getPathByRoot

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new CompressionPlugin({
            test: [/\.js$/, /\.css$/],
            asset: '[path].gz',
            algorithm: 'gzip'
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/main.[hash].css'
        }),

        new WebpackCleanPlugin(getPathByRoot('./dist'), {
            allowExternal: true
        }),

        new BundleAnalyzerPlugin()
    ]
})