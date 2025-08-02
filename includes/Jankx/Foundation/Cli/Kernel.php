<?php

namespace Jankx\Foundation\Cli;

use Jankx\Foundation\Application;
use Jankx\Foundation\Bootstrap\LoadConfiguration;
use Jankx\Foundation\Bootstrap\HandleExceptions;
use Jankx\Foundation\Bootstrap\RegisterLogger;
use Jankx\Foundation\Bootstrap\RegisterFacades;
use Jankx\Foundation\Bootstrap\RegisterProviders;
use Jankx\Foundation\Bootstrap\BootProviders;
use Jankx\Foundation\Bootstrap\ThemeDataLoader;

abstract class Kernel
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * The bootstrap classes for the application.
     *
     * @var array
     */
    protected $bootstrappers = [
        LoadConfiguration::class,
        HandleExceptions::class,
        RegisterLogger::class,
        RegisterFacades::class,
        ThemeDataLoader::class,
        RegisterProviders::class,
        BootProviders::class,
    ];

    /**
     * Create a new console kernel instance.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Bootstrap the application for console commands.
     *
     * @return void
     */
    public function bootstrap()
    {
        if (!$this->app->hasBeenBootstrapped()) {
            $this->app->bootstrapWith($this->bootstrappers);
        }
    }

    /**
     * Handle an incoming console command.
     *
     * @param  array  $args
     * @return int
     */
    abstract public function handle($args);

    /**
     * Get the application instance.
     *
     * @return \Jankx\Foundation\Application
     */
    public function getApplication()
    {
        return $this->app;
    }
}
