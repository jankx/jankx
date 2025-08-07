<?php

namespace Jankx\Services;

class ThemeService
{
    public function initFeatures()
    {
        add_theme_support('menus');

        // Add Gutenberg support
        add_theme_support('editor-styles');
        add_theme_support('wp-block-styles');
        add_theme_support('responsive-embeds');
        add_theme_support('align-wide');

        // Add support for navigation block
        add_theme_support('block-nav-menus');

        // Add support for custom logo
        add_theme_support('custom-logo');

        // Add support for post thumbnails
        add_theme_support('post-thumbnails');

        // Add support for HTML5 markup
        add_theme_support('html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
            'navigation-widgets',
        ));


         // Add support for editor styles
        add_theme_support('editor-styles');
        add_editor_style('style.css');
    }
}
