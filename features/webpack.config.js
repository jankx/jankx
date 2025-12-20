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
        'trend-posts/style': './metrics/blocks/trend-posts/style.scss',
        'gallery-detail/index': './gallery/blocks/gallery-detail/index.js',
        'gallery-detail/view': './gallery/blocks/gallery-detail/view.js',
        'gallery-detail/style': './gallery/blocks/gallery-detail/style.css',
        'custom-price/index': './custom-blocks/blocks/custom-price/index.tsx',
        'custom-price/style': './custom-blocks/blocks/custom-price/style.scss',
        'custom-price/editor': './custom-blocks/blocks/custom-price/editor.scss',
        'metabox-timeline/style': './custom-blocks/blocks/metabox-timeline/style.css',
        'per-unit/index': './custom-blocks/blocks/per-unit/index.tsx',
        'per-unit/style': './custom-blocks/blocks/per-unit/style.css'
    },
    output: {
        path: path.resolve(__dirname, '.'),
        filename: (pathData) => {
            const chunkName = pathData.chunk.name;
            const parts = chunkName.split('/');
            const blockName = parts[0];
            const fileName = parts[1] || 'index';
            
            if (
                chunkName.startsWith('custom-price') ||
                chunkName.startsWith('per-unit') ||
                chunkName.startsWith('metabox-timeline')
            ) {
                return `custom-blocks/blocks/${blockName}/build/${fileName}.js`;
            }
            if (chunkName.startsWith('gallery-detail')) {
                return `gallery/blocks/${blockName}/build/${fileName}.js`;
            }
            
            return `metrics/blocks/${blockName}/build/${fileName}.js`;
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
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
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
                
                if (
                    chunkName.startsWith('custom-price') ||
                    chunkName.startsWith('per-unit') ||
                    chunkName.startsWith('metabox-timeline')
                ) {
                    return `custom-blocks/blocks/${blockName}/build/${fileName}.css`;
                }
                if (chunkName.startsWith('gallery-detail')) {
                    return `gallery/blocks/${blockName}/build/${fileName}.css`;
                }
                
                return `metrics/blocks/${blockName}/build/${fileName}.css`;
            },
            chunkFilename: '[id].css'
        }),
        new RemoveEmptyScriptsPlugin(),
        new DependencyExtractionWebpackPlugin({
            injectPolyfill: true,
            combineAssets: false
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    externals: {
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/components': 'wp.components',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/element': 'wp.element',
        '@wordpress/i18n': 'wp.i18n'
    }
};
