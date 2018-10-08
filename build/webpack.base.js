const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getPathByRoot = function (targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /.js$/,
            use: ['babel-loader']
        }, {
            test: /.html$/,
            use: ['html-loader']
        }, {
            test: /.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        new MiniCssExtractPlugin({
            filename: 'static/index.[hash].css'
        })
    ]
}