const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const getPathByRoot = require('./utils').getPathByRoot

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /\/node_modules/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash].[ext]',
                        outputPath: 'static/images',
                        fallback: 'file-loader',
                    }
                }
            ]
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'commons',
            filename: 'static/js/[name].[hash].js'
        }
    },
    plugins: [
        new ProgressBarPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}