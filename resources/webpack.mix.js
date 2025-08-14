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

if (mix.inProduction()) {
    mix.sass('resources/scss/style.scss', 'style.min.css')
        .css('resources/assets/css/admin-pages.css', 'admin-pages.min.css');
} else {
    mix.sass('resources/scss/style.scss', 'style.css')
        .css('resources/assets/css/admin-pages.css', 'admin-pages.css')
        .webpackConfig({
            plugins: [new LiveReloadPlugin({
                useSourceHash: true
            })],
        });
}

