<?php

namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;

class ThemeBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    public function getName(): string
    {
        return 'theme';
    }

    public function shouldRun(): bool
    {
        return true; // Theme bootstrapper always runs
    }

    public function bootstrap(Container $container): void
    {
        add_action('after_setup_theme', [$this, 'setupTheme']);
        add_action('init', [$this, 'initializeThemeFeatures']);
        do_action('jankx/bootstrapper/theme/loaded', $container);
    }

    public function setupTheme(): void
    {
        add_theme_support('automatic-feed-links');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
        add_theme_support('customize-selective-refresh-widgets');
        register_nav_menus([
            'primary' => __('Primary Menu', 'jankx'),
            'footer' => __('Footer Menu', 'jankx'),
        ]);
        load_theme_textdomain('jankx', get_template_directory() . '/languages');
    }

    public function initializeThemeFeatures(): void
    {
        // Add theme-specific initialization logic here
    }
}
