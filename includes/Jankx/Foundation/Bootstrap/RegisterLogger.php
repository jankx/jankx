<?php

namespace Jankx\Foundation\Bootstrap;

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
            return new \Jankx\Foundation\Log\Logger();
        });
    }
}
