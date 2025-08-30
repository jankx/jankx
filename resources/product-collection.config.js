const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
     // Product Collection Block
     'blocks/product-collection/build/index': './blocks/product-collection/index.tsx',
     'blocks/product-collection/build/style': './blocks/product-collection/style.scss',
     'blocks/product-collection/build/editor': './blocks/product-collection/editor.scss',
     'blocks/product-collection/build/frontend': './blocks/product-collection/frontend.ts',
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
      '@woocommerce/settings': path.resolve(__dirname, './mock/woocommerce-settings.js'),
      '@woocommerce/utils': path.resolve(__dirname, './mock/woocommerce-utils.js'),
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
    '@wordpress/compose': ['wp', 'compose'],
    '@wordpress/hooks': ['wp', 'hooks'],
    '@wordpress/html-entities': ['wp', 'htmlEntities'],
    '@wordpress/primitives': ['wp', 'primitives'],
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
        if (request === '@wordpress/compose') {
          return ['wp', 'compose'];
        }
        if (request === '@wordpress/hooks') {
          return ['wp', 'hooks'];
        }
        if (request === '@wordpress/html-entities') {
          return ['wp', 'htmlEntities'];
        }
        if (request === '@wordpress/primitives') {
          return ['wp', 'primitives'];
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
        // Handle WooCommerce packages
        if (request === '@woocommerce/components') {
          return 'wc.components';
        }
        if (request === '@woocommerce/currency') {
          return 'wc.currency';
        }
        if (request === '@woocommerce/navigation') {
          return 'wc.navigation';
        }
        if (request === '@woocommerce/date') {
          return 'wc.date';
        }
        if (request === '@woocommerce/experimental') {
          return 'wc.experimental';
        }
        if (request === '@woocommerce/number') {
          return 'wc.number';
        }
        if (request === '@woocommerce/data') {
          return 'wc.data';
        }
        if (request === '@woocommerce/tracks') {
          return 'wc.tracks';
        }
        if (request === '@woocommerce/customer-effort-score') {
          return 'wc.customerEffortScore';
        }
        // Handle other WooCommerce modules
        if (request.startsWith('@woocommerce/')) {
          return `wc.${request.replace('@woocommerce/', '').replace(/\//g, '.')}`;
        }
        if (request.startsWith('../../atomic/')) {
          return `wc.atomic.${request.replace('../../atomic/', '').replace(/\//g, '.')}`;
        }
        if (request.startsWith('../product-template/')) {
          return `wc.productTemplate.${request.replace('../product-template/', '').replace(/\//g, '.')}`;
        }
      },
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
