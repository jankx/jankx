<?php

namespace Jankx\Providers;

use Jankx\Services\UserService;

class AdminServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Đăng ký các dịch vụ cho admin
        // Register User Service for admin context
        $this->singleton('user.service', UserService::class);

        // Register BlockParserService
        $this->singleton(\Jankx\Services\BlockParserService::class, \Jankx\Services\BlockParserService::class);

        // Đăng ký helper provider cho admin
        $helperProvider = new AdminHelperProvider($this->container);
        $helperProvider->register();
    }

    public function boot()
    {
        // Khởi động các dịch vụ nếu cần
    }
}
