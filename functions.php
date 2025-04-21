<?php
require_once __DIR__ . '/includes/framework.php';

function jankx_register_css_and_scripts()
{
    $jankxCssDeps = array('jankx-base');
    $stylesheetName = Jankx::theme()->get_stylesheet();
    $jankxTemplate = wp_get_theme(Jankx::templateStylesheet());

    if (is_child_theme() && apply_filters('jankx/styles/includes/main', true)) {
        $stylesheetUri = sprintf('%s/style.css', get_template_directory_uri());
        $jankxCssDeps[] = $jankxTemplate->get_stylesheet();

        css(
            $jankxTemplate->get_stylesheet(),
            $stylesheetUri,
            array(),
            $jankxTemplate->version
        );
    }

    css(
        $stylesheetName,
        get_stylesheet_uri(),
        apply_filters('jankx_asset_css_dependences', $jankxCssDeps, $stylesheetName),
        Jankx::theme()->version
    );

    $assetDirectory = sprintf('%s/assets', realpath(dirname(JANKX_FRAMEWORK_FILE_LOADER) . '/../../..'));
    $appJsVer = Jankx::theme()->version;
    $appJsName = '';

    $appjs = is_child_theme()
        ? sprintf('%s/assets/js/app.js', get_stylesheet_directory())
        : sprintf('%s/js/app.js', $assetDirectory);

    if (file_exists($appjs)) {
        $appJsName = 'app';
        $abspath = constant('ABSPATH');
        if (PHP_OS === 'WINNT') {
            $abspath = str_replace('\\', '/', $abspath);
            $appjs = str_replace('\\', '/', $appjs);
        }

        $jankxJsDeps = ['jankx-common', 'scroll-to-smooth'];
        if (apply_filters('jankx/tool/livereload/enabled', constant('JANKX_LIVERELOAD'))) {
            $bucket->js('livereload', 'http://localhost:35729/livereload.js', [], '3.0.2');
            $jankxJsDeps[] = 'livereload';
        }
        js(
            $appJsName,
            str_replace($abspath, site_url('/'), $appjs),
            apply_filters('jankx_asset_js_dependences', $jankxJsDeps),
            $appJsVer,
            true
        );
    }

    add_action('wp_enqueue_scripts', function () use ($stylesheetName, $jankxCssDeps, $appJsName) {
        $mainStylesheet = apply_filters('jankx_main_stylesheet', $stylesheetName, $jankxCssDeps);
        $mainJs         = apply_filters('jankx_main_js', $appJsName);

        css($mainStylesheet);

        if (!empty($mainJs)) {
            js($mainJs);
        }
    }, 50);
}

// Setup theme by yourself
add_action('init', function () {
    add_action('wp_enqueue_scripts', 'jankx_register_css_and_scripts', 5);
});

add_action('wp', function(){
    add_filter('jankx/gutenberg/enabled', function($enabled){
        if (is_single()) {
            return in_array(get_post_type(), ['product', 'page', 'post']);
        }
        return $enabled;
    });
});

/**
* Use this prefix for global
*/
function jankx_get_font_icon_prefix($groupName = null) {
    if (!empty($groupName)) {
        return apply_filters("jankx/font-icons/{$groupName}/prefix", $groupName);
    }
    return 'jkx-';
}
