const path = require('path');

module.exports = {
    entry: {
        'index': './index.js',
        'style-index': './style-index.css'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    externals: {
        '@wordpress/element': 'wp.element',
        '@wordpress/components': 'wp.components',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/icons': 'wp.icons',
        '@wordpress/data': 'wp.data',
        '@wordpress/compose': 'wp.compose',
        '@wordpress/hooks': 'wp.hooks'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    }
};
