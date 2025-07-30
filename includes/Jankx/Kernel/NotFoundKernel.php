<?php

namespace Jankx\Kernel;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Illuminate\Container\Container;

/**
 * Class NotFoundKernel
 *
 * Khởi tạo các dịch vụ dành riêng cho trang 404 và các dịch vụ dùng chung.
 *
 * @package Jankx\Kernel
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 2.0.0
 */
class NotFoundKernel extends Kernel
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
        return 'not_found';
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
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
        ];
    }

    /**
     * Register services
     * @since 2.0.0
     */
    protected function registerServices(): void
    {
        parent::registerServices();

        $this->services = [];
    }

    /**
     * Register hooks
     * @since 2.0.0
     */
    protected function registerHooks(): void
    {
        $this->hooks = [
            'template_redirect' => ['Jankx\Kernel\NotFoundKernel', 'handleNotFound'],
        ];
    }

    /**
     * Register filters
     * @since 2.0.0
     */
    protected function registerFilters(): void
    {
        $this->filters = [
            'jankx_404_title' => ['Jankx\Kernel\NotFoundKernel', 'filter404Title'],
        ];
    }

    /**
     * Handle 404 requests
     * @since 2.0.0
     */
    public static function handleNotFound()
    {
        if (is_404()) {
            // Handle 404 logic here
        }
    }
}
