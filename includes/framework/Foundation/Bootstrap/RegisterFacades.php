<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Facades\Config as ConfigFacade;
use Jankx\Facades\App as AppFacade;
use Jankx\Facades\Log as LogFacade;
use Jankx\Foundation\Log\IntegrationLogger;
use Jankx\Foundation\Log\Logger;
use Jankx\Foundation\Log\NullLogger;
use Jankx\Foundation\Log\TelegramLogger;
use Jankx\Helper\Environment;

class RegisterFacades
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {


        // Set the application instance for the facades
        AppFacade::setFacadeApplication($app);
        ConfigFacade::setFacadeApplication($app);
        LogFacade::setFacadeApplication($app);

        // Bind the logger instance as a singleton
        $app->singleton('log', function ($app) {
            // 1. Nếu JANKX_DEBUG_ALL_LOG được bật → dùng Logger (log tất cả)
            //    Logger tự động tích hợp TelegramLogger nếu JANKX_USE_TELEGRAM_LOGGER = true
            if (defined('JANKX_DEBUG_ALL_LOG') && constant('JANKX_DEBUG_ALL_LOG') === true) {
                if (defined('JANKX_USE_TELEGRAM_LOGGER') && constant('JANKX_USE_TELEGRAM_LOGGER') === true) {
                    return new TelegramLogger();
                }
                return new Logger();
            }

            // 2. Nếu WP_DEBUG và WP_DEBUG_LOG được bật → dùng IntegrationLogger (chỉ log warning và error)
            if (defined('WP_DEBUG') && WP_DEBUG === true ||
                defined('WP_DEBUG_LOG') && WP_DEBUG_LOG === true) {
                return new IntegrationLogger();
            }

            // 3. Ngược lại → dùng NullLogger (không log gì cả)
            return new NullLogger();
        });
    }
}
