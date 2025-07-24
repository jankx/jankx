<?php

namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Context\ContextualServiceRegistry;

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

        // Đăng ký dịch vụ dùng chung (shared)
        // ContextualServiceRegistry::register(ContextualServiceRegistry::SHARED, GoogleFontsServiceProvider::class);
        // ContextualServiceRegistry::register(ContextualServiceRegistry::SHARED, ThemeOptionsServiceProvider::class);

        // // Đăng ký dịch vụ frontend
        // ContextualServiceRegistry::register(ContextualServiceRegistry::FRONTEND, SocialSharingServiceProvider::class);
        // ContextualServiceRegistry::register(ContextualServiceRegistry::FRONTEND, PostLayoutServiceProvider::class);

        // // Đăng ký dịch vụ dashboard
        // ContextualServiceRegistry::register(ContextualServiceRegistry::DASHBOARD, AdminMenuServiceProvider::class);
    }
}
