<?php

namespace Jankx\Foundation;

use Exception;
use Illuminate\Container\Container;
use Jankx\Config\Repository;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

class Application extends Container
{
    /**
     * The Jankx framework version.
     *
     * @var string
     */
    const VERSION = '2.0.0';

    /**
     * The base path for the Jankx installation.
     *
     * @var string
     */
    protected $basePath;

    /**
     * Indicates if the application has been bootstrapped.
     *
     * @var bool
     */
    protected $hasBeenBootstrapped = false;

    /**
     * The array of booted callbacks.
     *
     * @var callable[]
     */
    protected $bootedCallbacks = [];

    /**
     * The array of booting callbacks.
     *
     * @var callable[]
     */
    protected $bootingCallbacks = [];

    /**
     * The service providers that should be registered.
     *
     * @var array
     */
    protected $serviceProviders = [];

    /**
     * The loaded service providers.
     *
     * @var array
     */
    protected $loadedProviders = [];

    /**
     * The deferred services and their providers.
     *
     * @var array
     */
    protected $deferredServices = [];

    /**
     * Create a new Jankx application instance.
     *
     * @param  string|null  $basePath
     * @return void
     */
    public function __construct($basePath = null)
    {
        $this->basePath = $basePath ?: dirname(__DIR__, 3);

        $this->registerBaseBindings();
        $this->registerCoreContainerAliases();
    }

    /**
     * Get the version number of the application.
     *
     * @return string
     */
    public function version()
    {
        return static::VERSION;
    }

    /**
     * Get the base path of the Jankx installation.
     *
     * @param  string  $path
     * @return string
     */
    public function basePath($path = '')
    {
        return $this->basePath . ($path ? DIRECTORY_SEPARATOR . $path : $path);
    }

    /**
     * Get the path to the application configuration files.
     *
     * @param  string  $path
     * @return string
     */
    public function configPath($path = '')
    {
        return $this->basePath('config' . ($path ? DIRECTORY_SEPARATOR . $path : $path));
    }

    /**
     * Get the path to the bootstrap directory.
     *
     * @param  string  $path
     * @return string
     */
    public function bootstrapPath($path = '')
    {
        return $this->basePath('bootstrap' . ($path ? DIRECTORY_SEPARATOR . $path : $path));
    }

    /**
     * Register the basic bindings into the container.
     *
     * @return void
     */
    protected function registerBaseBindings()
    {
        static::setInstance($this);

        $this->instance('app', $this);
        $this->instance(Container::class, $this);
        $this->instance(Application::class, $this);

        $this->singleton('config', function () {
            return new Repository();
        });

        $this->singleton('log', function () {
            return new \Jankx\Foundation\Log\Logger();
        });
    }



    /**
     * Register the core class aliases in the container.
     *
     * @return void
     */
    protected function registerCoreContainerAliases()
    {
        // Default aliases
        $defaultAliases = [
            'app'      => [\Jankx\Foundation\Application::class],
            'config'   => [\Jankx\Config\Repository::class],
        ];

        // Load aliases from config if available
        try {
            $config = $this->make('config');
            $configAliases = $config->get('app.aliases', []);

            // Merge default aliases with config aliases
            $aliases = array_merge($defaultAliases, $configAliases);
        } catch (Exception $e) {
            // Fallback to default aliases if config is not available
            $aliases = $defaultAliases;
        }

        foreach ($aliases as $key => $aliasClasses) {
            if (is_array($aliasClasses)) {
                foreach ($aliasClasses as $alias) {
                    $this->alias($key, $alias);
                }
            } else {
                $this->alias($key, $aliasClasses);
            }
        }
    }

    /**
     * Determine if the application has been bootstrapped.
     *
     * @return bool
     */
    public function hasBeenBootstrapped()
    {
        return $this->hasBeenBootstrapped;
    }

    /**
     * Set the booted flag.
     *
     * @return void
     */
    public function setBooted()
    {
        $this->hasBeenBootstrapped = true;
    }

    /**
     * Register a booted callback.
     *
     * @param  callable  $callback
     * @return void
     */
    public function booted($callback)
    {
        $this->bootedCallbacks[] = $callback;

        if ($this->hasBeenBootstrapped()) {
            $callback($this);
        }
    }

    /**
     * Call the booted callbacks for the application.
     *
     * @return void
     */
    public function callBootedCallbacks()
    {
        foreach ($this->bootedCallbacks as $callback) {
            $callback($this);
        }
    }

    /**
     * Register a booting callback.
     *
     * @param  callable  $callback
     * @return void
     */
    public function booting($callback)
    {
        $this->bootingCallbacks[] = $callback;
    }

    /**
     * Call the booting callbacks for the application.
     *
     * @return void
     */
    public function callBootingCallbacks()
    {
        foreach ($this->bootingCallbacks as $callback) {
            $callback($this);
        }
    }

    /**
     * Bootstrap the application with the given bootstrappers.
     *
     * @param  array  $bootstrappers
     * @return void
     */
    public function bootstrapWith(array $bootstrappers)
    {
        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Starting bootstrap with %d bootstrappers', count($bootstrappers)));
        }

        $this->callBootingCallbacks();

        foreach ($bootstrappers as $bootstrapper) {
            if (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] Running bootstrapper: %s', $bootstrapper));
            }

            $this->make($bootstrapper)->bootstrap($this);
        }

        $this->setBooted();
        $this->callBootedCallbacks();

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Bootstrap completed');
        }
    }

    /**
     * Boot the application's service providers.
     *
     * @return void
     */
    public function boot()
    {
        // Boot service providers here if needed
    }

    /**
     * Register a service provider with the application.
     *
     * @param  string  $provider
     * @return void
     */
    public function register($provider)
    {
        if (is_string($provider)) {
            $provider = new $provider($this);
        }

        $provider->register($this);

        $this->serviceProviders[] = $provider;
    }

    /**
     * Boot the application's service providers.
     *
     * @return void
     */
    public function bootProviders()
    {
        foreach ($this->serviceProviders as $provider) {
            if (method_exists($provider, 'boot')) {
                $provider->boot($this);
            }
        }
    }

    /**
     * Get the service providers that have been registered.
     *
     * @return array
     */
    public function getServiceProviders()
    {
        return $this->serviceProviders;
    }

    /**
     * Determine if the given service provider is registered.
     *
     * @param  string  $provider
     * @return bool
     */
    public function isRegistered($provider)
    {
        return in_array($provider, array_map(function ($p) {
            return get_class($p);
        }, $this->serviceProviders));
    }
}
