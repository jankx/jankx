<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * Theme Bootstrapper
 *
 * Bootstrap theme-specific features
 *
 * @package Jankx\Bootstrappers
 */
class ThemeBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 10;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper name
     */
    public function getName(): string
    {
        return 'theme';
    }

    /**
     * Get bootstrapper priority
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Check if bootstrapper should run
     */
    public function shouldRun(): bool
    {
        return true; // Theme bootstrapper always runs
    }

    /**
     * Get bootstrapper dependencies
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * Bootstrap the application
     */
    public function bootstrap(Container $container): void
    {
        // Register theme-specific services or hooks here
        add_action('after_setup_theme', [$this, 'setupTheme']);
        add_action('init', [$this, 'initializeThemeFeatures']);

        do_action('jankx/bootstrapper/theme/loaded', $container);
    }

    /**
     * Setup theme
     */
    public function setupTheme(): void
    {
        // Add theme support for various features
        add_theme_support('automatic-feed-links');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
        add_theme_support('customize-selective-refresh-widgets');

        // Register navigation menus
        register_nav_menus([
            'primary' => __('Primary Menu', 'jankx'),
            'footer' => __('Footer Menu', 'jankx'),
        ]);

        // Load theme text domain
        load_theme_textdomain('jankx', get_template_directory() . '/languages');
    }

    /**
     * Initialize theme features
     */
    public function initializeThemeFeatures(): void
    {
        // Add theme-specific initialization logic here
    }
}
