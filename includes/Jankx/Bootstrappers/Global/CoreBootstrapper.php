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
 */
final class CoreBootstrapper extends AbstractBootstrapper
{
    public function getName(): string
    {
        return 'core';
    }

    public function shouldRun(): bool
    {
        return true;
    }

    /**
     * Khởi tạo các dịch vụ và đăng ký chúng theo ngữ cảnh
     */
    public function bootstrap(Container $container): void
    {
        // Initialize debug information if JANKX_DEBUG is enabled
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            \Jankx\Debug\DebugIntegration::init($container);
        }
    }
}
