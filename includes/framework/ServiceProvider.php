<?php

namespace Jankx\Framework;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

abstract class ServiceProvider
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Create a new service provider instance.
     *
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct($app)
    {
        $this->app = $app;
    }

    /**
     * Register services into the container.
     *
     * @return void
     */
    abstract public function register();

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
