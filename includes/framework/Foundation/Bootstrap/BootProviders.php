<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;

class BootProviders
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        $app->bootProviders();
    }
}
