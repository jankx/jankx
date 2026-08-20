const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const blockEntry = (name) => ({
  [`blocks/${name}/build/index`]: `./blocks/${name}/index.tsx`,
  [`blocks/${name}/build/style`]: `./blocks/${name}/style.scss`,
  ...(name === 'embla-carousel'
    ? { [`blocks/${name}/build/editor`]: `./blocks/${name}/editor.scss` }
    : {}),
});

module.exports = [
  // Block entries (output to blocks/{name}/build/)
  ...['embla-carousel', 'embla-carousel-slide', 'embla-carousel-card', 'embla-carousel-presentation-slide'].map(
    (name) => ({
      mode: isProduction ? 'production' : 'development',
      devtool: isProduction ? false : 'source-map',
      entry: blockEntry(name),
      output: {
        path: path.resolve(__dirname),
        filename: '[name].js',
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/components': 'wp.components',
        '@wordpress/element': 'wp.element',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/data': 'wp.data',
        '@wordpress/icons': 'wp.icons',
        '@wordpress/primitives': 'wp.primitives',
        'lucide-react': ['wp', 'icons'],
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@wordpress/babel-preset-default',
                  '@babel/preset-typescript',
                ],
              },
            },
          },
          {
            test: /\.s?css$/,
            use: [
              MiniCssExtractPlugin.loader,
              { loader: 'css-loader', options: { importLoaders: 2 } },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: { plugins: ['autoprefixer'] },
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                  sassOptions: { silenceDeprecations: ['legacy-js-api'] },
                },
              },
            ],
          },
        ],
      },
      optimization: {
        splitChunks: false,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              output: { comments: false },
              compress: { drop_console: isProduction },
            },
            extractComments: false,
          }),
          new CssMinimizerPlugin(),
        ],
      },
      plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new DependencyExtractionWebpackPlugin(),
      ],
    })
  ),

  // Frontend view script (output to build/)
  {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    entry: { view: './blocks/view.ts' },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@wordpress/babel-preset-default',
                '@babel/preset-typescript',
              ],
            },
          },
        },
      ],
    },
    optimization: {
      splitChunks: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: { comments: false },
            compress: { drop_console: isProduction },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new DependencyExtractionWebpackPlugin(),
    ],
  },
];
