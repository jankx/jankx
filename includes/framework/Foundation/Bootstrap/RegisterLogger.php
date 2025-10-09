<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Contracts\LoggerInterface;
use Jankx\Foundation\Application;

class RegisterLogger
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        $app->singleton('log', function ($app) {
            // 1. Nếu JANKX_DEBUG_LOG được bật → dùng DebugLogger (log tất cả)
            if (defined('JANKX_DEBUG_LOG') && JANKX_DEBUG_LOG === true) {
                return new \Jankx\Foundation\Log\Logger();
            }

            // 2. Nếu WP_DEBUG và WP_DEBUG_LOG được bật → dùng IntegrationLogger (chỉ log warning và error)
            if (defined('WP_DEBUG') && WP_DEBUG === true &&
                defined('WP_DEBUG_LOG') && WP_DEBUG_LOG === true) {
                return new \Jankx\Foundation\Log\IntegrationLogger();
            }

            // 3. Ngược lại → dùng NullLogger (không log gì cả)
            return new \Jankx\Foundation\Log\NullLogger();
        });
        $app->alias(LoggerInterface::class, 'log');
    }
}
