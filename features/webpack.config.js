const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'views/index': './metrics/blocks/views/index.tsx',
        'views/style': './metrics/blocks/views/style.css',
        'trend-posts/index': './metrics/blocks/trend-posts/index.tsx',
        'trend-posts/style': './metrics/blocks/trend-posts/style.css'
    },
    output: {
        path: path.resolve(__dirname, 'metrics/blocks'),
        filename: (pathData) => {
            const chunkName = pathData.chunk.name;
            const parts = chunkName.split('/');
            const blockName = parts[0];
            const fileName = parts[1] || 'index';
            return `${blockName}/build/${fileName}.js`;
        },
        clean: false
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
            filename: (pathData) => {
                const chunkName = pathData.chunk.name;
                const parts = chunkName.split('/');
                const blockName = parts[0];
                const fileName = parts[1] || 'index';
                return `${blockName}/build/${fileName}.css`;
            },
            chunkFilename: '[id].css'
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
