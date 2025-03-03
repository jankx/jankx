const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('assets/src/app.js', 'assets/js')
    .sass('style.scss', '.', [
        //
    ])
    .webpackConfig({
        plugins: [new LiveReloadPlugin({
            useSourceHash : true
        })],
    });
