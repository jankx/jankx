const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'blocks/language-switcher/build/index': './blocks/language-switcher/index.tsx',
    'blocks/language-switcher/build/style': './blocks/language-switcher/style.scss',
    'blocks/language-switcher/build/editor': './blocks/language-switcher/editor.scss',

    'blocks/calendar/build/index': './blocks/calendar/index.tsx',
    'blocks/calendar/build/style': './blocks/calendar/style.scss',
    'blocks/calendar/build/editor': './blocks/calendar/editor.scss',

    'blocks/dynamic-collection/build/index': './blocks/dynamic-collection/index.tsx',
    'blocks/dynamic-collection/build/save': './blocks/dynamic-collection/save.js',
    'blocks/dynamic-collection/build/style': './blocks/dynamic-collection/style.scss',
    'blocks/dynamic-collection/build/editor': './blocks/dynamic-collection/editor.scss',

    'blocks/icon-picker/build/index': './blocks/icon-picker/index.tsx',
    'blocks/icon-picker/build/save': './blocks/icon-picker/save.js',
    'blocks/icon-picker/build/style': './blocks/icon-picker/style.scss',
    'blocks/icon-picker/build/editor': './blocks/icon-picker/editor.scss',

    'blocks/product-carousel/build/index': './blocks/product-carousel/index.tsx',
    'blocks/product-carousel/build/save': './blocks/product-carousel/save.js',
    'blocks/product-carousel/build/style': './blocks/product-carousel/style.scss',
    'blocks/product-carousel/build/editor': './blocks/product-carousel/editor.scss',
    // thêm các entry block khác ở đây...
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    clean: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@wordpress/blocks': ['wp', 'blocks'],
    '@wordpress/i18n': ['wp', 'i18n'],
    '@wordpress/block-editor': ['wp', 'blockEditor'],
    '@wordpress/components': ['wp', 'components'],
    '@wordpress/element': ['wp', 'element'],
    '@wordpress/data': ['wp', 'data'],
    '@wordpress/core-data': ['wp', 'coreData'],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [require.resolve('@wordpress/babel-preset-default')],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
};
