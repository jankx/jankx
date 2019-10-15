const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    devtool: 'source-map', // any "source-map"-like devtool is possible
    entry: {
        '../style': './src/sass/style.scss',
        'js/jankx': './src/js/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // falback to style-loader in development
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                          implementation: require('sass'),
                          sassOptions: {
                            indentWidth: 4,
                            sourceMap: true,
                            fiber: false,
                          },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            fileName: '[name].css',
            chunkFileName: '[id].css',
        }),
    ],
};
