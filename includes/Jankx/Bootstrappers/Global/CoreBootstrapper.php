<?php

namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}



/**
 * Class CoreBootstrapper
 *
 * Khởi tạo các dịch vụ ban đầu và đăng ký chúng theo ngữ cảnh.
 *
 * @package Jankx\Bootstrap
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 2.0.0
 */
final class CoreBootstrapper extends AbstractBootstrapper
{
    /**
     * Method getName
     *
     * @since 2.0.0
     */
    public function getName(): string
    {
        return 'core';
    }

    /**
     * Method shouldRun
     *
     * @since 2.0.0
     */
    public function shouldRun(): bool
    {
        return true;
    }

    /**
     * Khởi tạo các dịch vụ và đăng ký chúng theo ngữ cảnh
     * @since 2.0.0
     */
    public function bootstrap(Container $container): void
    {
        // Initialize debug information if JANKX_DEBUG is enabled
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            \Jankx\Debug\DebugIntegration::init($container);
        }
    }
}
