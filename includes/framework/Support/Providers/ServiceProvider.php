<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Contracts\ServiceProvider as ServiceProviderContract;

abstract class ServiceProvider implements ServiceProviderContract
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * @var string
     */
    protected static $cachedContext;

    /**
     * @var bool
     */
    protected $booted = false;

    /**
     * Create a new service provider instance.
     *
     * @param  \Jankx\Foundation\Application|null  $app
     * @return void
     */
    public function __construct(?Application $app = null)
    {
        $this->app = $app;
    }

    /**
     * Check if provider is booted
     *
     * @return bool
     */
    public function isBooted(): bool
    {
        return $this->booted;
    }

    /**
     * Mark provider as booted
     *
     * @return void
     */
    public function markAsBooted(): void
    {
        $this->booted = true;
    }

    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register services here
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Bootstrap services here
    }

    /**
     * Get the application instance.
     *
     * @return \Jankx\Foundation\Application
     */
    public function getApplication()
    {
        return $this->app;
    }

    /**
     * Check if provider should be loaded
     *
     * @return bool
     */
    public function shouldLoad(): bool
    {
        $context = $this->getLoadingContext();

        switch ($context) {
            case 'cli':
                return $this->shouldLoadCli();
            case 'cron':
                return $this->shouldLoadCron();
            case 'ajax':
                return $this->shouldLoadAjax();
            case 'rest':
                return $this->shouldLoadRest();
            case 'admin':
                return $this->shouldLoadAdmin();
            case 'frontend':
                return $this->shouldLoadFrontend();
            default:
                return true;
        }
    }

    /**
     * Get the current loading context
     *
     * @return string
     */
    protected function getLoadingContext(): string
    {
        if (static::$cachedContext !== null) {
            return static::$cachedContext;
        }

        if ($this->app->has('kernel')) {
            $kernel = $this->app->make('kernel');
            $context = $kernel->getContext();

            if (in_array($context, ['wp-cli', 'cli'])) {
                return static::$cachedContext = 'cli';
            }
            if (in_array($context, ['wp-cron', 'cron'])) {
                return static::$cachedContext = 'cron';
            }
            if (in_array($context, ['admin-ajax', 'ajax'])) {
                return static::$cachedContext = 'ajax';
            }
            if (in_array($context, ['rest-api', 'rest'])) {
                return static::$cachedContext = 'rest';
            }
            if (in_array($context, ['dashboard', 'admin'])) {
                return static::$cachedContext = 'admin';
            }
            if ($context === 'frontend') {
                return static::$cachedContext = 'frontend';
            }
        }

        if (defined('WP_CLI') && WP_CLI) {
            return static::$cachedContext = 'cli';
        }

        if (wp_doing_ajax()) {
            return static::$cachedContext = 'ajax';
        }

        if (wp_doing_cron()) {
            return static::$cachedContext = 'cron';
        }

        if (defined('REST_REQUEST') && REST_REQUEST) {
            return static::$cachedContext = 'rest';
        }

        if (is_admin()) {
            return static::$cachedContext = 'admin';
        }

        return static::$cachedContext = 'frontend';
    }

    /**
     * Check if provider should be loaded in frontend
     *
     * @return bool
     */
    public function shouldLoadFrontend(): bool
    {
        return true;
    }

    /**
     * Check if provider should be loaded in admin
     *
     * @return bool
     */
    public function shouldLoadAdmin(): bool
    {
        return true;
    }

    /**
     * Check if provider should be loaded in CLI
     *
     * @return bool
     */
    public function shouldLoadCli(): bool
    {
        return true;
    }

    /**
     * Check if provider should be loaded in Cron
     *
     * @return bool
     */
    public function shouldLoadCron(): bool
    {
        return true;
    }

    /**
     * Check if provider should be loaded in REST API
     *
     * @return bool
     */
    public function shouldLoadRest(): bool
    {
        return true;
    }

    /**
     * Check if provider should be loaded in AJAX
     *
     * @return bool
     */
    public function shouldLoadAjax(): bool
    {
        return true;
    }

    /**
     * Check if child theme is active
     *
     * @return bool
     */
    protected function isChildThemeActive(): bool
    {
        if (function_exists('get_template_directory') && function_exists('get_stylesheet_directory')) {
            return get_template_directory() !== get_stylesheet_directory();
        }
        return false;
    }
}
