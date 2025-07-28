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
 */
class NotFoundKernel extends Kernel
{
    /**
     * Constructor
     *
     * @param Container $container Container để resolve các dịch vụ
     */
    public function __construct(Container $container = null)
    {
        parent::__construct($container);
    }

    /**
     * Get kernel type
     *
     * @return string
     */
    public function getKernelType(): string
    {
        return 'not_found';
    }

    /**
     * Register bootstrappers
     */
    protected function registerBootstrappers(): void
    {
        $this->bootstrappers = [
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
            'Jankx\Bootstrappers\Global\DebugBootstrapper',
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
        ];
    }

    /**
     * Register services
     */
    protected function registerServices(): void
    {
        $this->services = [
            'Jankx\Providers\ContextualServiceProvider',
        ];
    }

    /**
     * Register hooks
     */
    protected function registerHooks(): void
    {
        $this->hooks = [
            'template_redirect' => ['Jankx\Kernel\NotFoundKernel', 'handleNotFound'],
        ];
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        $this->filters = [];
    }

    /**
     * Handle 404 requests
     */
    public static function handleNotFound()
    {
        if (is_404()) {
            // Handle 404 logic here
        }
    }
}
