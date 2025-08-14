<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Facades\Config as ConfigFacade;
use Jankx\Facades\App as AppFacade;
use Jankx\Facades\Log as LogFacade;
use Jankx\Foundation\Log\Logger;
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
            return new Logger();
        });


    }
}
