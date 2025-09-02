const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');



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

    'blocks/svg-icon-button/build/index': './blocks/svg-icon-button/index.tsx',
    'blocks/svg-icon-button/build/style': './blocks/svg-icon-button/style.scss',
    'blocks/svg-icon-button/build/editor': './blocks/svg-icon-button/editor.scss',

    'blocks/image-button/build/index': './blocks/image-button/index.tsx',
    'blocks/image-button/build/style': './blocks/image-button/style.scss',
    'blocks/image-button/build/editor': './blocks/image-button/editor.scss',

    'blocks/query/build/index': './blocks/query/index.js',
    'blocks/query/build/save': './blocks/query/save.js',
    'blocks/query/build/view': './blocks/query/view.js',
    'blocks/query/build/init': './blocks/query/init.js',
    'blocks/query/build/editor': './blocks/query/editor.scss'
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
    alias: {
    },
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
    new DependencyExtractionWebpackPlugin({
      // Output to a .asset.php file for each entry point
      outputFormat: 'php',
      // Don't combine assets to create separate .asset.php files
      combineAssets: false,
      // Include WordPress core dependencies
      useDefaults: true,
      // Request external dependencies
      requestToExternal: (request) => {
        if (request === '@wordpress/blocks') {
          return ['wp', 'blocks'];
        }
        if (request === '@wordpress/i18n') {
          return ['wp', 'i18n'];
        }
        if (request === '@wordpress/block-editor') {
          return ['wp', 'blockEditor'];
        }
        if (request === '@wordpress/components') {
          return ['wp', 'components'];
        }
        if (request === '@wordpress/element') {
          return ['wp', 'element'];
        }
        if (request === '@wordpress/data') {
          return ['wp', 'data'];
        }
        if (request === '@wordpress/core-data') {
          return ['wp', 'coreData'];
        }
        if (request === 'react') {
          return 'React';
        }
        if (request === 'react-dom') {
          return 'ReactDOM';
        }
        if (request === 'swiper') {
          return 'Swiper';
        }
      },
    }),

  ],
  module: {
    rules: [
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
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'base-styles'),
                  path.resolve(__dirname, 'base-styles/woocommerce'),
                  path.resolve(__dirname, 'scss'),
                ],
                additionalData: `@import "woocommerce/patch"; @import "woocommerce/functions"; @import "woocommerce/variables"; @import "woocommerce/colors"; @import "woocommerce/mixins"; @import "woocommerce/breakpoints"; @import "woocommerce/overrides";`
              }
            }
          }
        ]
      }
    ],
  },
};
