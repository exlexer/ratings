const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './client/app.jsx'],
    plugins: [
        new HtmlWebpackPlugin({
            template: 'client/index.html',
        }),
    ],
    output: {
        path: path.resolve(__dirname, './client/dist'),
        filename: 'build.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'client')],
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', '@babel/react'],
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(png|ttf|jpg|gif|svg|woff)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'client'),
        },
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
};
