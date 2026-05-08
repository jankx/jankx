const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

mix.setPublicPath('./');

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

// Development mode
if (mix.inProduction()) {
    // Production builds
    mix.sass('resources/scss/style.scss', 'style.min.css')
        .version()
        .sourceMaps();
} else {
    // Development builds with hot reload
    mix.sass('resources/scss/style.scss', 'style.css')
        .webpackConfig({
            plugins: [new LiveReloadPlugin({
                useSourceHash: true
            })],
        })
        .sourceMaps();
}

