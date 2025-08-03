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

// Development mode
if (mix.inProduction()) {
    // Production builds
    mix.js('resources/src/app.js', 'resources/js/app.js')
        .sass('resources/scss/style.scss', 'style.min.css')
        .sass('resources/scss/admin.scss', 'resources/assets/css/admin.min.css')
        .version()
        .sourceMaps();
} else {
    // Development builds with hot reload
    mix.js('resources/src/app.js', 'resources/assets/js/app.js')
        .sass('resources/scss/style.scss', 'resources/assets/css/style.css')
        .sass('resources/scss/admin.scss', 'resources/assets/css/admin.css')
        .webpackConfig({
            plugins: [new LiveReloadPlugin({
                useSourceHash: true
            })],
        })
        .sourceMaps();
}

// Copy assets
mix.copy('resources/assets/fonts', 'resources/assets/fonts')
    .copy('resources/assets/images', 'resources/assets/images');
