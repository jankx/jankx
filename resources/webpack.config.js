const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'blocks/language-switcher/index': './blocks/language-switcher/index.tsx',
    'blocks/calendar/index': './blocks/calendar/index.tsx',
    'blocks/dynamic-collection/index': './blocks/dynamic-collection/index.tsx',
    'blocks/icon-picker/index': './blocks/icon-picker/index.tsx',
    'blocks/product-carousel/index': './blocks/product-carousel/index.tsx',
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
      { test: /\.css$/i, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
};
