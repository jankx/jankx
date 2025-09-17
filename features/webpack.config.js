const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'index': './metrics/blocks/views/index.tsx',
        'style': './metrics/blocks/views/style.css'
    },
    output: {
        path: path.resolve(__dirname, 'metrics/blocks/views/build'),
        filename: '[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@wordpress/babel-preset-default',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new RemoveEmptyScriptsPlugin(),
        new DependencyExtractionWebpackPlugin({
            injectPolyfill: true,
            combineAssets: false
        })
    ],
    externals: {
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/components': 'wp.components',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/element': 'wp.element',
        '@wordpress/i18n': 'wp.i18n'
    }
};
