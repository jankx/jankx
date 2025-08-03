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

mix.js('resources/src/app.js', 'resources/assets/js')
    .sass('resources/scss/style.scss', 'style.css')
    .sass('resources/scss/admin.scss', 'resources/assets/css/admin.css')
    .webpackConfig({
        plugins: [new LiveReloadPlugin({
            useSourceHash : true
        })],
    });
