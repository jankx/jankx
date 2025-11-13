<?php

namespace Jankx\Foundation\Cli;

use Jankx\Foundation\Application;
use Jankx\Foundation\Bootstrap\LoadConfiguration;
use Jankx\Foundation\Bootstrap\RegisterFacades;
use Jankx\Foundation\Bootstrap\RegisterProviders;
use Jankx\Foundation\Bootstrap\BootProviders;
use Jankx\Foundation\Bootstrap\ThemeDataLoader;
use Jankx\Foundation\Bootstrap\BootChildTheme;
use Jankx\Contracts\KernelInterface;

abstract class Kernel implements KernelInterface
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
        RegisterFacades::class,
        ThemeDataLoader::class,
        BootChildTheme::class,
        RegisterProviders::class,
        BootProviders::class,
    ];

    /**
     * The kernel context.
     *
     * @var string
     */
    protected $context;

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

    /**
     * Register WordPress hooks for this kernel.
     * Console kernels typically don't need WordPress hooks.
     *
     * @return void
     */
    public function registerHooks()
    {
        // Console kernels don't need WordPress hooks
    }

    /**
     * Initialize the kernel with WordPress hooks.
     * Console kernels typically don't need WordPress hooks.
     *
     * @param \Jankx\Http\Request $request
     * @return void
     */
    public function init($request)
    {
        $this->bootstrap();
        $this->handle($request);
        // Console kernels don't need registerHooks()
    }

    /**
     * Get the kernel context.
     *
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }
}
