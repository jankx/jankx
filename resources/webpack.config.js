const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');



module.exports = {
  mode: 'development',
  devtool: 'source-map',
  context: path.resolve(__dirname),
  entry: {

    'blocks/icon-picker/build/index': './blocks/icon-picker/index.tsx',
    'blocks/icon-picker/build/save': './blocks/icon-picker/save.js',
    'blocks/icon-picker/build/style': './blocks/icon-picker/style.scss',
    'blocks/icon-picker/build/editor': './blocks/icon-picker/editor.scss',

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

    'blocks/advanced-image-box/build/index': './blocks/advanced-image-box/index.tsx',
    'blocks/advanced-image-box/build/style': './blocks/advanced-image-box/style.scss',
    'blocks/advanced-image-box/build/editor': './blocks/advanced-image-box/editor.scss',

    'blocks/table-of-content/build/index': './blocks/table-of-content/index.tsx',
    'blocks/table-of-content/build/style': './blocks/table-of-content/style.scss',
    'blocks/table-of-content/build/editor': './blocks/table-of-content/editor.scss',
    'blocks/table-of-content/build/view': './blocks/table-of-content/view.ts',


    'blocks/comment-count/build/index': './blocks/comment-count/index.tsx',
    'blocks/comment-count/build/style': './blocks/comment-count/style.scss',
    'blocks/comment-count/build/editor': './blocks/comment-count/editor.scss',
    'blocks/search-results-count/build/index': './blocks/search-results-count/index.tsx',
    'blocks/search-results-count/build/style': './blocks/search-results-count/style.scss',
    'blocks/search-results-count/build/editor': './blocks/search-results-count/editor.scss',

    'blocks/modal/build/index': './blocks/modal/index.js',
    'blocks/modal/build/style': './blocks/modal/style.scss',
    'blocks/modal/build/editor': './blocks/modal/editor.scss',
    'blocks/modal/build/view': './blocks/modal/view.js',


    'blocks/smart-tabs/build/index': './blocks/smart-tabs/index.tsx',
    'blocks/smart-tabs/build/style': './blocks/smart-tabs/style.scss',
    'blocks/smart-tabs/build/editor': './blocks/smart-tabs/editor.scss',
    'blocks/smart-tabs/build/view': './blocks/smart-tabs/view.js',

    'blocks/smart-tab/build/index': './blocks/smart-tab/index.tsx',
    'blocks/smart-tab/build/view': './blocks/smart-tab/view.js',
    'blocks/smart-tab/build/style': './blocks/smart-tab/style.scss',
    'blocks/smart-tab/build/editor': './blocks/smart-tab/editor.scss',

    'blocks/social-sharing/build/index': './blocks/social-sharing/index.tsx',
    'blocks/social-sharing/build/frontend': './blocks/social-sharing/frontend.ts',
    'blocks/social-sharing/build/style': './blocks/social-sharing/style.scss',
    'blocks/social-sharing/build/editor': './blocks/social-sharing/editor.scss',

    'blocks/social-sharing-icon/build/index': './blocks/social-sharing-icon/index.tsx',
    'blocks/social-sharing-icon/build/frontend': './blocks/social-sharing-icon/frontend.ts',
    'blocks/social-sharing-icon/build/style': './blocks/social-sharing-icon/style.scss',
    'blocks/social-sharing-icon/build/editor': './blocks/social-sharing-icon/editor.scss',

    'blocks/author-box/build/index': './blocks/author-box/src/index.tsx',
    'blocks/author-box/build/style': './blocks/author-box/src/style.scss',
    'blocks/author-box/build/editor': './blocks/author-box/src/editor.scss',

    'blocks/carousel/build/index': './blocks/carousel/index.tsx',
    'blocks/carousel/build/view': './blocks/carousel/view.js',
    'blocks/carousel/build/style': './blocks/carousel/style.scss',
    'blocks/carousel/build/editor': './blocks/carousel/editor.scss',

    'blocks/carousel-slide/build/index': './blocks/carousel-slide/index.tsx',
    'blocks/carousel-slide/build/style': './blocks/carousel-slide/style.scss',
    'blocks/carousel-slide/build/editor': './blocks/carousel-slide/editor.scss',

    'blocks/testimonial/build/index': './blocks/testimonial/index.tsx',
    'blocks/testimonial/build/style': './blocks/testimonial/style.scss',

    'blocks/testimonials/build/index': './blocks/testimonials/index.tsx',
    'blocks/testimonials/build/style': './blocks/testimonials/style.scss',
    'blocks/testimonials/build/editor': './blocks/testimonials/editor.scss',

    'blocks/carousel-banner/build/index': './blocks/carousel-banner/index.tsx',
    'blocks/carousel-banner/build/style': './blocks/carousel-banner/style.scss',
    'blocks/carousel-banner/build/editor': './blocks/carousel-banner/editor.scss',

    'blocks/carousel-inner-blocks-overlay/build/index': './blocks/carousel-inner-blocks-overlay/index.tsx',
    'blocks/carousel-inner-blocks-overlay/build/style': './blocks/carousel-inner-blocks-overlay/style.scss',
    'blocks/carousel-inner-blocks-overlay/build/editor': './blocks/carousel-inner-blocks-overlay/editor.scss',

    'blocks/slideshow/build/index': './blocks/slideshow/index.tsx',
    'blocks/slideshow/build/save': './blocks/slideshow/save.tsx',
    'blocks/slideshow/build/style': './blocks/slideshow/style.scss',
    'blocks/slideshow/build/editor': './blocks/slideshow/editor.scss',
    'blocks/slideshow/build/view': './blocks/slideshow/view.js',

    'blocks/slideshow-container/build/index': './blocks/slideshow-container/index.tsx',
    'blocks/slideshow-container/build/save': './blocks/slideshow-container/save.tsx',
    'blocks/slideshow-container/build/style': './blocks/slideshow-container/style.scss',
    'blocks/slideshow-container/build/editor': './blocks/slideshow-container/editor.scss',

    'blocks/slideshow-item/build/index': './blocks/slideshow-item/index.tsx',
    'blocks/slideshow-item/build/save': './blocks/slideshow-item/save.tsx',
    'blocks/slideshow-item/build/style': './blocks/slideshow-item/style.scss',
    'blocks/slideshow-item/build/editor': './blocks/slideshow-item/editor.scss',

    'blocks/smart-breadcrumb/build/index': './blocks/smart-breadcrumb/src/index.js',
    'blocks/smart-breadcrumb/build/style': './blocks/smart-breadcrumb/src/style.scss',
    'blocks/smart-breadcrumb/build/editor': './blocks/smart-breadcrumb/src/editor.scss',

    'blocks/advanced-button/build/index': './blocks/advanced-button/index.tsx',
    'blocks/advanced-button/build/frontend': './blocks/advanced-button/frontend.ts',
    'blocks/advanced-button/build/style': './blocks/advanced-button/style.scss',
    'blocks/advanced-button/build/editor': './blocks/advanced-button/editor.scss',

    'blocks/advanced-filter/build/index': './blocks/advanced-filter/index.tsx',

    'blocks/advanced-filters/build/index': './blocks/advanced-filters/index.tsx',
    'blocks/advanced-filters/build/frontend': './blocks/advanced-filters/frontend.ts',
    'blocks/advanced-filters/build/style': './blocks/advanced-filters/style.scss',
    'blocks/advanced-filters/build/editor': './blocks/advanced-filters/editor.scss',

    'blocks/smart-search/build/index': './blocks/smart-search/index.tsx',
    'blocks/smart-search/build/frontend': './blocks/smart-search/frontend.ts',
    'blocks/smart-search/build/style': './blocks/smart-search/style.scss',
    'blocks/smart-search/build/editor': './blocks/smart-search/editor.scss',

    'blocks/dynamic-data-layout/build/index': './blocks/dynamic-data-layout/index.tsx',
    'blocks/dynamic-data-layout/build/view': './blocks/dynamic-data-layout/view.js',
    'blocks/dynamic-data-layout/build/style': './blocks/dynamic-data-layout/style.scss',
    'blocks/dynamic-data-layout/build/editor': './blocks/dynamic-data-layout/editor.scss',

    'blocks/dynamic-data-template/build/index': './blocks/dynamic-data-template/index.tsx',
    'blocks/dynamic-data-template/build/frontend': './blocks/dynamic-data-template/frontend.ts',
    'blocks/dynamic-data-template/build/style': './blocks/dynamic-data-template/style.scss',
    'blocks/dynamic-data-template/build/editor': './blocks/dynamic-data-template/editor.scss',

    'blocks/human-readable-post-date/build/index': './blocks/human-readable-post-date/index.tsx',
    'blocks/human-readable-post-date/build/style': './blocks/human-readable-post-date/style.scss',

    'blocks/sticky-box/build/index': './blocks/sticky-box/index.tsx',
    'blocks/sticky-box/build/style': './blocks/sticky-box/style.scss',
    'blocks/sticky-box/build/editor': './blocks/sticky-box/editor.scss',


    'blocks/star-rating/build/index': './blocks/star-rating/index.tsx',
    'blocks/star-rating/build/style': './blocks/star-rating/style.scss',
    'blocks/star-rating/build/editor': './blocks/star-rating/editor.scss',

    'blocks/post-type-badge/build/index': './blocks/post-type-badge/index.tsx',
    'blocks/post-type-badge/build/style': './blocks/post-type-badge/style.scss',

    'blocks/divider/build/index': './blocks/divider/index.tsx',
    'blocks/divider/build/style': './blocks/divider/style.scss',
    'blocks/divider/build/editor': './blocks/divider/editor.scss',

    'blocks/text-input/build/index': './blocks/text-input/index.tsx',
    'blocks/text-input/build/style': './blocks/text-input/style.scss',
    'blocks/text-input/build/editor': './blocks/text-input/editor.scss',

    'blocks/post-terms/build/index': './blocks/post-terms/index.ts',
    'blocks/post-terms/build/style': './blocks/post-terms/style.scss',


    // Menu Builder block
    'blocks/user-menu/build/index': './blocks/user-menu/src/index.tsx',
    'blocks/user-menu/build/style': './blocks/user-menu/src/style.scss',
    'blocks/user-menu/build/editor': './blocks/user-menu/src/editor.scss',

    'blocks/wrapper/build/index': './blocks/wrapper/index.tsx',
    'blocks/wrapper/build/style': './blocks/wrapper/index.css',
    'blocks/overlap-group/build/index': './blocks/overlap-group/index.tsx',
    'blocks/overlap-group/build/style': './blocks/overlap-group/style.scss',
    'blocks/overlap-group/build/editor': './blocks/overlap-group/editor.scss',
    'assets/js/child-order': './js/filters/child-order.tsx',
    'assets/js/responsive-visibility': './js/filters/responsive-visibility.tsx',
    'blocks/typography/build/index': './blocks/typography/index.tsx',
    'blocks/integration/build/jankx-blocks-bridge': './blocks/integration/jankx-blocks-bridge.js',
    'assets/js/sticky-header': './js/sticky-header.ts',
    '../style': './scss/style.scss',
    '../style.min': './scss/style.scss',
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    clean: false,
    assetModuleFilename: 'blocks/[name]/build/[name][ext]',
  },
  optimization: {
    splitChunks: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
    alias: {
      // Force all plyr imports (including plyr-react's internal `import PlyrJS from "plyr"`)
      // to use the compiled dist build. This avoids webpack 5 strict ESM "fully specified"
      // issues when bundling plyr/src/js/plyr.js.
      plyr$: path.resolve(__dirname, '../node_modules/plyr/dist/plyr.js'),
      'plyr/src/js/plyr.js': path.resolve(__dirname, '../node_modules/plyr/dist/plyr.js'),
      plyr: path.resolve(__dirname, '../node_modules/plyr/dist/plyr.js'),

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
    '@wordpress/server-side-render': ['wp', 'serverSideRender'],
    // Swiper will be bundled, not external
    // embla-carousel-react will be bundled into editor script
    // embla-carousel will be bundled into frontend carousel script
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
        if (request === '@wordpress/server-side-render') {
          return ['wp', 'serverSideRender'];
        }
        if (request === 'react') {
          return 'React';
        }
        if (request === 'react-dom') {
          return 'ReactDOM';
        }
        if (request === 'jquery') {
          return 'jQuery';
        }
        // Swiper will be bundled, not external
      },
    }),

  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
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
                  path.resolve(__dirname, './node_modules/@wordpress/base-styles'),
                  path.resolve(__dirname, 'base-styles'),
                  path.resolve(__dirname, 'scss'),
                ],

              }
            }
          }
        ]
      }
    ],
  },
};
