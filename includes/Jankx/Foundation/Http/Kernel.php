<?php

namespace Jankx\Foundation\Http;

use Jankx\Foundation\Application;
use Jankx\Foundation\Bootstrap\LoadConfiguration;
use Jankx\Foundation\Bootstrap\RegisterLogger;
use Jankx\Foundation\Bootstrap\RegisterFacades;
use Jankx\Foundation\Bootstrap\RegisterProviders;
use Jankx\Foundation\Bootstrap\BootProviders;
use Jankx\Foundation\Bootstrap\ThemeDataLoader;
use Jankx\Foundation\Bootstrap\BootChildTheme;

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
        RegisterLogger::class,
        RegisterFacades::class,
        ThemeDataLoader::class,
        BootChildTheme::class,
        RegisterProviders::class,
        BootProviders::class,
    ];

    /**
     * Create a new HTTP kernel instance.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Bootstrap the application for HTTP requests.
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
     * Handle an incoming HTTP request.
     * This method should register WordPress hooks instead of returning a response.
     *
     * @param  \Jankx\Http\Request  $request
     * @return void
     */
    abstract public function handle($request);

    /**
     * Register WordPress hooks for this kernel.
     * This method should be called after bootstrap.
     *
     * @return void
     */
    abstract public function registerHooks();

    /**
     * Initialize the kernel with WordPress hooks.
     *
     * @param  \Jankx\Http\Request  $request
     * @return void
     */
    public function init($request)
    {
        $this->bootstrap();
        $this->handle($request);
        $this->registerHooks();
    }

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
