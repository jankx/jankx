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

    'blocks/dynamic-collection/build/index': './blocks/dynamic-collection/index.tsx',
    'blocks/dynamic-collection/build/save': './blocks/dynamic-collection/save.js',
    'blocks/dynamic-collection/build/style': './blocks/dynamic-collection/style.scss',
    'blocks/dynamic-collection/build/editor': './blocks/dynamic-collection/editor.scss',

    'blocks/icon-picker/build/index': './blocks/icon-picker/index.tsx',
    'blocks/icon-picker/build/save': './blocks/icon-picker/save.js',
    'blocks/icon-picker/build/style': './blocks/icon-picker/style.scss',
    'blocks/icon-picker/build/editor': './blocks/icon-picker/editor.scss',

    'blocks/mega-menu/build/index': './blocks/mega-menu/index.tsx',
    'blocks/mega-menu/build/view': './blocks/mega-menu/view.js',
    'blocks/mega-menu/build/style': './blocks/mega-menu/style.scss',
    'blocks/mega-menu/build/editor': './blocks/mega-menu/editor.scss',

    'blocks/products-carousel/build/index': './blocks/products-carousel/index.tsx',
    'blocks/products-carousel/build/view': './blocks/products-carousel/view.js',
    'blocks/products-carousel/build/style': './blocks/products-carousel/style.scss',
    'blocks/products-carousel/build/editor': './blocks/products-carousel/editor.scss',

    'blocks/carousel/build/index': './blocks/carousel/index.tsx',
    'blocks/carousel/build/view': './blocks/carousel/view.ts',
    'blocks/carousel/build/style': './blocks/carousel/style.scss',
    'blocks/carousel/build/editor': './blocks/carousel/editor.scss',

    'blocks/slide/build/index': './blocks/slide/index.tsx',
    'blocks/slide/build/editor': './blocks/slide/editor.scss',

    'blocks/lookbook-reveal/build/index': './blocks/lookbook-reveal/index.tsx',
    'blocks/lookbook-reveal/build/style': './blocks/lookbook-reveal/style.scss',
    'blocks/lookbook-reveal/build/editor': './blocks/lookbook-reveal/editor.scss',

    'blocks/scattered-product-list/build/index': './blocks/scattered-product-list/index.tsx',
    'blocks/scattered-product-list/build/view': './blocks/scattered-product-list/view.js',
    'blocks/scattered-product-list/build/style': './blocks/scattered-product-list/style.scss',
    'blocks/scattered-product-list/build/editor': './blocks/scattered-product-list/editor.scss',

    'blocks/advanced-posts/build/index': './blocks/advanced-posts/index.tsx',
    'blocks/advanced-posts/build/style': './blocks/advanced-posts/style.scss',
    'blocks/advanced-posts/build/editor': './blocks/advanced-posts/editor.scss',

    'blocks/categories-grid/build/index': './blocks/categories-grid/index.tsx',
    'blocks/categories-grid/build/style': './blocks/categories-grid/style.scss',
    'blocks/categories-grid/build/editor': './blocks/categories-grid/editor.scss',
    'blocks/categories-grid/build/view': './blocks/categories-grid/view.js',

    'blocks/wplyr-media/build/index': './blocks/wplyr-media/index.tsx',
    'blocks/wplyr-media/build/style': './blocks/wplyr-media/style.scss',
    'blocks/wplyr-media/build/editor': './blocks/wplyr-media/editor.scss',
    'blocks/wplyr-media/build/view': './blocks/wplyr-media/view.js',

    'blocks/icon-button/build/index': './blocks/icon-button/index.tsx',
    'blocks/icon-button/build/style': './blocks/icon-button/style.scss',
    'blocks/icon-button/build/editor': './blocks/icon-button/editor.scss',

    'blocks/offcanvas-sidebar/build/index': './blocks/offcanvas-sidebar/index.tsx',
    'blocks/offcanvas-sidebar/build/frontend': './blocks/offcanvas-sidebar/frontend.ts',
    'blocks/offcanvas-sidebar/build/style': './blocks/offcanvas-sidebar/style.scss',
    'blocks/offcanvas-sidebar/build/editor': './blocks/offcanvas-sidebar/editor.scss',

    'blocks/offcanvas-trigger/build/index': './blocks/offcanvas-trigger/index.tsx',
    'blocks/offcanvas-trigger/build/style': './blocks/offcanvas-trigger/style.scss',
    'blocks/offcanvas-trigger/build/editor': './blocks/offcanvas-trigger/editor.scss',

    'blocks/svg-icon/build/index': './blocks/svg-icon/index.tsx',
    'blocks/svg-icon/build/style': './blocks/svg-icon/style.scss',
    'blocks/svg-icon/build/editor': './blocks/svg-icon/editor.scss',
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    clean: false,
    assetModuleFilename: 'blocks/[name]/build/[name][ext]',
  },
  optimization: {
    splitChunks: false
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
    swiper: 'Swiper',
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
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'blocks/carousel/build/[name][ext]'
        }
      },
    ],
  },
};
