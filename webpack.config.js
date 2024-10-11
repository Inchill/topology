const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // 项目入口
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development', // 可切换为 'production' 用于生产环境
    devServer: {
        // contentBase: path.join(__dirname, 'dist'),
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    resolve: {
        alias: {
            pages: path.resolve(__dirname, 'src/pages'), // 为 pages 目录配置别名
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    module: {
        rules: [{
            test: /\.js$/, // 编译 ES6+
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            },
        }, ],
    },
};