<?php

namespace Jankx\Services;

use Jankx\Contracts\ServiceInterface;
use Jankx\Foundation\Application;

abstract class AbstractService implements ServiceInterface
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var bool
     */
    protected $initialized = false;

    /**
     * @var string
     */
    protected $name;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->name = static::class;
    }

    /**
     * Khởi tạo service
     *
     * @return void
     */
    public function initialize(): void
    {
        if ($this->initialized) {
            return;
        }

        // 1. shouldLoad global: Check data flat file or database (options)
        if (!$this->shouldLoad()) {
            return;
        }

        // 2. shouldLoad context: Check if the service should be loaded in the current environment
        if (!$this->shouldLoadInContext()) {
            return;
        }

        $this->boot();
        $this->initialized = true;
    }

    /**
     * Kiểm tra service đã được khởi tạo chưa
     *
     * @return bool
     */
    public function isInitialized(): bool
    {
        return $this->initialized;
    }

    /**
     * Lấy tên service
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Phương thức boot để override trong các service con
     *
     * @return void
     */
    abstract protected function boot(): void;

    /**
     * Lấy application instance
     *
     * @return Application
     */
    protected function getApp(): Application
    {
        return $this->app;
    }

    /**
     * shouldLoad global: Check data flat file or database (options)
     *
     * @return bool
     */
    public function shouldLoad(): bool
    {
        return true;
    }

    /**
     * Dispatch to context specific shouldLoad methods
     *
     * @return bool
     */
    protected function shouldLoadInContext(): bool
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
        // Highest priority: Jankx Kernel context
        if ($this->app->has('kernel')) {
            $kernel = $this->app->make('kernel');
            $context = $kernel->getContext();

            if (in_array($context, ['wp-cli', 'cli'])) {
                return 'cli';
            }
            if (in_array($context, ['wp-cron', 'cron'])) {
                return 'cron';
            }
            if (in_array($context, ['admin-ajax', 'ajax'])) {
                return 'ajax';
            }
            if (in_array($context, ['rest-api', 'rest'])) {
                return 'rest';
            }
            if (in_array($context, ['dashboard', 'admin'])) {
                return 'admin';
            }
            if ($context === 'frontend') {
                return 'frontend';
            }
        }

        // Fallback to WordPress standard checks
        // Order matters here because some contexts overlap (e.g. AJAX is also technically ADMIN in WP)
        if (defined('WP_CLI') && WP_CLI) {
            return 'cli';
        }

        if (wp_doing_ajax()) {
            return 'ajax';
        }

        if (wp_doing_cron()) {
            return 'cron';
        }

        if (defined('REST_REQUEST') && REST_REQUEST) {
            return 'rest';
        }

        // is_admin() is true for AJAX and some other cases, so we check it after AJAX/REST/CLI
        if (is_admin()) {
            return 'admin';
        }

        return 'frontend';
    }

    /**
     * Check if service should be loaded in frontend
     *
     * @return bool
     */
    public function shouldLoadFrontend(): bool
    {
        // By default, load in all frontend requests.
        // If you only want to load after WordPress has parsed the main query,
        // you can use: return $this->isWpParsed();
        return true;
    }

    /**
     * Check if WordPress has parsed the main query
     *
     * @return bool
     */
    protected function isWpParsed(): bool
    {
        return did_action('wp') > 0;
    }

    /**
     * Check if service should be loaded in admin
     *
     * @return bool
     */
    public function shouldLoadAdmin(): bool
    {
        return true;
    }

    /**
     * Check if service should be loaded in CLI
     *
     * @return bool
     */
    public function shouldLoadCli(): bool
    {
        return true;
    }

    /**
     * Check if service should be loaded in Cron
     *
     * @return bool
     */
    public function shouldLoadCron(): bool
    {
        return true;
    }

    /**
     * Check if service should be loaded in REST API
     *
     * @return bool
     */
    public function shouldLoadRest(): bool
    {
        return true;
    }

    /**
     * Check if service should be loaded in AJAX
     *
     * @return bool
     */
    public function shouldLoadAjax(): bool
    {
        return true;
    }
}
