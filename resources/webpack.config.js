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

    'dist/blocks/icon-picker/index': './blocks/icon-picker/index.tsx',
    'dist/blocks/icon-picker/save': './blocks/icon-picker/save.js',
    'dist/blocks/icon-picker/style': './blocks/icon-picker/style.scss',
    'dist/blocks/icon-picker/editor': './blocks/icon-picker/editor.scss',

    'dist/blocks/offcanvas-sidebar/index': './blocks/offcanvas-sidebar/index.tsx',
    'dist/blocks/offcanvas-sidebar/frontend': './blocks/offcanvas-sidebar/frontend.ts',
    'dist/blocks/offcanvas-sidebar/style': './blocks/offcanvas-sidebar/style.scss',
    'dist/blocks/offcanvas-sidebar/editor': './blocks/offcanvas-sidebar/editor.scss',

    'dist/blocks/offcanvas-trigger/index': './blocks/offcanvas-trigger/index.tsx',
    'dist/blocks/offcanvas-trigger/style': './blocks/offcanvas-trigger/style.scss',
    'dist/blocks/offcanvas-trigger/editor': './blocks/offcanvas-trigger/editor.scss',

    'dist/blocks/svg-icon/index': './blocks/svg-icon/index.tsx',
    'dist/blocks/svg-icon/style': './blocks/svg-icon/style.scss',
    'dist/blocks/svg-icon/editor': './blocks/svg-icon/editor.scss',

    'dist/blocks/advanced-image-box/index': './blocks/advanced-image-box/index.tsx',
    'dist/blocks/advanced-image-box/style': './blocks/advanced-image-box/style.scss',
    'dist/blocks/advanced-image-box/editor': './blocks/advanced-image-box/editor.scss',

    'dist/blocks/table-of-content/index': './blocks/table-of-content/index.tsx',
    'dist/blocks/table-of-content/style': './blocks/table-of-content/style.scss',
    'dist/blocks/table-of-content/editor': './blocks/table-of-content/editor.scss',
    'dist/blocks/table-of-content/view': './blocks/table-of-content/view.ts',


    'dist/blocks/comment-count/index': './blocks/comment-count/index.tsx',
    'dist/blocks/comment-count/style': './blocks/comment-count/style.scss',
    'dist/blocks/comment-count/editor': './blocks/comment-count/editor.scss',

    'dist/blocks/search-results-count/index': './blocks/search-results-count/index.tsx',
    'dist/blocks/search-results-count/style': './blocks/search-results-count/style.scss',
    'dist/blocks/search-results-count/editor': './blocks/search-results-count/editor.scss',

    'dist/blocks/modal/index': './blocks/modal/index.js',
    'dist/blocks/modal/style': './blocks/modal/style.scss',
    'dist/blocks/modal/editor': './blocks/modal/editor.scss',
    'dist/blocks/modal/view': './blocks/modal/view.js',


    'dist/blocks/smart-tabs/index': './blocks/smart-tabs/index.tsx',
    'dist/blocks/smart-tabs/style': './blocks/smart-tabs/style.scss',
    'dist/blocks/smart-tabs/editor': './blocks/smart-tabs/editor.scss',
    'dist/blocks/smart-tabs/view': './blocks/smart-tabs/view.js',

    'dist/blocks/smart-tab/index': './blocks/smart-tab/index.tsx',
    'dist/blocks/smart-tab/view': './blocks/smart-tab/view.js',
    'dist/blocks/smart-tab/style': './blocks/smart-tab/style.scss',
    'dist/blocks/smart-tab/editor': './blocks/smart-tab/editor.scss',

    'dist/blocks/social-sharing/index': './blocks/social-sharing/index.tsx',
    'dist/blocks/social-sharing/frontend': './blocks/social-sharing/frontend.ts',
    'dist/blocks/social-sharing/style': './blocks/social-sharing/style.scss',
    'dist/blocks/social-sharing/editor': './blocks/social-sharing/editor.scss',

    'dist/blocks/social-sharing-icon/index': './blocks/social-sharing-icon/index.tsx',
    'dist/blocks/social-sharing-icon/frontend': './blocks/social-sharing-icon/frontend.ts',
    'dist/blocks/social-sharing-icon/style': './blocks/social-sharing-icon/style.scss',
    'dist/blocks/social-sharing-icon/editor': './blocks/social-sharing-icon/editor.scss',

    'dist/blocks/author-box/index': './blocks/author-box/src/index.tsx',
    'dist/blocks/author-box/style': './blocks/author-box/src/style.scss',
    'dist/blocks/author-box/editor': './blocks/author-box/src/editor.scss',

    'dist/blocks/carousel/index': './blocks/carousel/index.tsx',
    'dist/blocks/carousel/view': './blocks/carousel/view.js',
    'dist/blocks/carousel/style': './blocks/carousel/style.scss',
    'dist/blocks/carousel/editor': './blocks/carousel/editor.scss',

    'dist/blocks/carousel-slide/index': './blocks/carousel-slide/index.tsx',
    'dist/blocks/carousel-slide/style': './blocks/carousel-slide/style.scss',
    'dist/blocks/carousel-slide/editor': './blocks/carousel-slide/editor.scss',

    'dist/blocks/testimonial/index': './blocks/testimonial/index.tsx',
    'dist/blocks/testimonial/style': './blocks/testimonial/style.scss',

    'dist/blocks/testimonials/index': './blocks/testimonials/index.tsx',
    'dist/blocks/testimonials/style': './blocks/testimonials/style.scss',
    'dist/blocks/testimonials/editor': './blocks/testimonials/editor.scss',

    'dist/blocks/carousel-banner/index': './blocks/carousel-banner/index.tsx',
    'dist/blocks/carousel-banner/style': './blocks/carousel-banner/style.scss',
    'dist/blocks/carousel-banner/editor': './blocks/carousel-banner/editor.scss',

    'dist/blocks/carousel-inner-blocks-overlay/index': './blocks/carousel-inner-blocks-overlay/index.tsx',
    'dist/blocks/carousel-inner-blocks-overlay/style': './blocks/carousel-inner-blocks-overlay/style.scss',
    'dist/blocks/carousel-inner-blocks-overlay/editor': './blocks/carousel-inner-blocks-overlay/editor.scss',

    'dist/blocks/slideshow/index': './blocks/slideshow/index.tsx',
    'dist/blocks/slideshow/save': './blocks/slideshow/save.tsx',
    'dist/blocks/slideshow/style': './blocks/slideshow/style.scss',
    'dist/blocks/slideshow/editor': './blocks/slideshow/editor.scss',
    'dist/blocks/slideshow/view': './blocks/slideshow/view.js',

    'dist/blocks/slideshow-container/index': './blocks/slideshow-container/index.tsx',
    'dist/blocks/slideshow-container/save': './blocks/slideshow-container/save.tsx',
    'dist/blocks/slideshow-container/style': './blocks/slideshow-container/style.scss',
    'dist/blocks/slideshow-container/editor': './blocks/slideshow-container/editor.scss',

    'dist/blocks/slideshow-item/index': './blocks/slideshow-item/index.tsx',
    'dist/blocks/slideshow-item/save': './blocks/slideshow-item/save.tsx',
    'dist/blocks/slideshow-item/style': './blocks/slideshow-item/style.scss',
    'dist/blocks/slideshow-item/editor': './blocks/slideshow-item/editor.scss',

    'dist/blocks/smart-breadcrumb/index': './blocks/smart-breadcrumb/src/index.js',
    'dist/blocks/smart-breadcrumb/style': './blocks/smart-breadcrumb/src/style.scss',
    'dist/blocks/smart-breadcrumb/editor': './blocks/smart-breadcrumb/src/editor.scss',

    'dist/blocks/advanced-button/index': './blocks/advanced-button/index.tsx',
    'dist/blocks/advanced-button/frontend': './blocks/advanced-button/frontend.ts',
    'dist/blocks/advanced-button/style': './blocks/advanced-button/style.scss',
    'dist/blocks/advanced-button/editor': './blocks/advanced-button/editor.scss',

    'dist/blocks/advanced-filter/index': './blocks/advanced-filter/index.tsx',

    'dist/blocks/advanced-filters/index': './blocks/advanced-filters/index.tsx',
    'dist/blocks/advanced-filters/frontend': './blocks/advanced-filters/frontend.ts',
    'dist/blocks/advanced-filters/style': './blocks/advanced-filters/style.scss',
    'dist/blocks/advanced-filters/editor': './blocks/advanced-filters/editor.scss',

    'dist/blocks/smart-search/index': './blocks/smart-search/index.tsx',
    'dist/blocks/smart-search/frontend': './blocks/smart-search/frontend.ts',
    'dist/blocks/smart-search/style': './blocks/smart-search/style.scss',
    'dist/blocks/smart-search/editor': './blocks/smart-search/editor.scss',

    'dist/blocks/dynamic-data-layout/index': './blocks/dynamic-data-layout/index.tsx',
    'dist/blocks/dynamic-data-layout/view': './blocks/dynamic-data-layout/view.js',
    'dist/blocks/dynamic-data-layout/style': './blocks/dynamic-data-layout/style.scss',
    'dist/blocks/dynamic-data-layout/editor': './blocks/dynamic-data-layout/editor.scss',

    'dist/blocks/dynamic-data-template/index': './blocks/dynamic-data-template/index.tsx',
    'dist/blocks/dynamic-data-template/frontend': './blocks/dynamic-data-template/frontend.ts',
    'dist/blocks/dynamic-data-template/style': './blocks/dynamic-data-template/style.scss',
    'dist/blocks/dynamic-data-template/editor': './blocks/dynamic-data-template/editor.scss',

    'dist/blocks/dynamic-term-layout/index': './blocks/dynamic-term-layout/index.tsx',
    'dist/blocks/dynamic-term-layout/view': './blocks/dynamic-term-layout/view.js',
    'dist/blocks/dynamic-term-layout/style': './blocks/dynamic-term-layout/style.scss',
    'dist/blocks/dynamic-term-layout/editor': './blocks/dynamic-term-layout/editor.scss',

    'dist/blocks/dynamic-term-template/index': './blocks/dynamic-term-template/index.tsx',
    'dist/blocks/dynamic-term-template/frontend': './blocks/dynamic-term-template/frontend.ts',
    'dist/blocks/dynamic-term-template/style': './blocks/dynamic-term-template/style.scss',
    'dist/blocks/dynamic-term-template/editor': './blocks/dynamic-term-template/editor.scss',

    'dist/blocks/human-readable-post-date/index': './blocks/human-readable-post-date/index.tsx',
    'dist/blocks/human-readable-post-date/style': './blocks/human-readable-post-date/style.scss',

    'dist/blocks/sticky-box/index': './blocks/sticky-box/index.tsx',
    'dist/blocks/sticky-box/style': './blocks/sticky-box/style.scss',
    'dist/blocks/sticky-box/editor': './blocks/sticky-box/editor.scss',


    'dist/blocks/star-rating/index': './blocks/star-rating/index.tsx',
    'dist/blocks/star-rating/style': './blocks/star-rating/style.scss',
    'dist/blocks/star-rating/editor': './blocks/star-rating/editor.scss',

    'dist/blocks/post-type-badge/index': './blocks/post-type-badge/index.tsx',
    'dist/blocks/post-type-badge/style': './blocks/post-type-badge/style.scss',

    'dist/blocks/divider/index': './blocks/divider/index.tsx',
    'dist/blocks/divider/style': './blocks/divider/style.scss',
    'dist/blocks/divider/editor': './blocks/divider/editor.scss',

    'dist/blocks/text-input/index': './blocks/text-input/index.tsx',
    'dist/blocks/text-input/style': './blocks/text-input/style.scss',
    'dist/blocks/text-input/editor': './blocks/text-input/editor.scss',

    'dist/blocks/post-terms/index': './blocks/post-terms/index.ts',
    'dist/blocks/post-terms/style': './blocks/post-terms/style.scss',


    // Menu Builder block
    'dist/blocks/user-menu/index': './blocks/user-menu/src/index.tsx',
    'dist/blocks/user-menu/style': './blocks/user-menu/src/style.scss',
    'dist/blocks/user-menu/editor': './blocks/user-menu/src/editor.scss',

    'dist/blocks/wrapper/index': './blocks/wrapper/index.tsx',
    'dist/blocks/wrapper/style': './blocks/wrapper/index.css',
    'dist/blocks/overlap-group/index': './blocks/overlap-group/index.tsx',
    'dist/blocks/overlap-group/style': './blocks/overlap-group/style.scss',
    'dist/blocks/overlap-group/editor': './blocks/overlap-group/editor.scss',
    'assets/js/child-order': './js/filters/child-order.tsx',
    'assets/js/responsive-visibility': './js/filters/responsive-visibility.tsx',
    'dist/blocks/typography/index': './blocks/typography/index.tsx',
    'dist/blocks/integration/jankx-blocks-bridge': './blocks/integration/jankx-blocks-bridge.js',
    'assets/js/sticky-header': './js/sticky-header.ts',
    '../style': './scss/style.scss',
    '../style.min': './scss/style.scss',
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    clean: false,
    assetModuleFilename: 'dist/blocks/[name]/[name][ext]',
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
