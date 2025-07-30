<?php

namespace Jankx\Kernel;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;

/**
 * Class AjaxKernel
 *
 * Khởi tạo các dịch vụ dành riêng cho AJAX requests và các dịch vụ dùng chung.
 *
 * @package Jankx\Kernel
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 2.0.0
 */
class AjaxKernel extends Kernel
{
    /**
     * Constructor
     *
     * @param Container $container Container để resolve các dịch vụ
     * @since 2.0.0
     */
    public function __construct(Container $container = null)
    {
        parent::__construct($container);
    }

    /**
     * Get kernel type
     *
     * @return string
     * @since 2.0.0
     */
    public function getKernelType(): string
    {
        return 'ajax';
    }

    /**
     * Register bootstrappers
     * @since 2.0.0
     */
    protected function registerBootstrappers(): void
    {
        parent::registerBootstrappers();

        $this->bootstrappers = [
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
            'Jankx\Bootstrappers\Global\DebugBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper',
        ];
    }

    /**
     * Register services
     * @since 2.0.0
     */
    protected function registerServices(): void
    {
        parent::registerServices();

        $this->services = [
            'Jankx\Providers\AdminServiceProvider',
        ];
    }

    /**
     * Register hooks
     * @since 2.0.0
     */
    protected function registerHooks(): void
    {
        $this->hooks = [
            'wp_ajax_nopriv_jankx_ajax' => ['Jankx\Kernel\AjaxKernel', 'handleAjaxRequest'],
            'wp_ajax_jankx_ajax' => ['Jankx\Kernel\AjaxKernel', 'handleAjaxRequest'],
        ];
    }

    /**
     * Register filters
     * @since 2.0.0
     */
    protected function registerFilters(): void
    {
        $this->filters = [
            'jankx_ajax_response' => ['Jankx\Kernel\AjaxKernel', 'filterAjaxResponse'],
        ];
    }

    /**
     * Handle AJAX requests
     * @since 2.0.0
     */
    public static function handleAjaxRequest()
    {
        // Handle AJAX request logic here
        wp_die();
    }
}
