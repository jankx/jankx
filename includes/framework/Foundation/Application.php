<?php

namespace Jankx\Foundation;

use Exception;
use Illuminate\Container\Container;
use Jankx\Config\Repository;
use Jankx\Contracts\LoggerInterface;
use Jankx\Support\Providers\Admin\JankxAdminPagesServiceProvider;
use Jankx\Support\Providers\ContentLayoutServiceProvider;
use Jankx\Support\Providers\ExtensionServiceProvider;
use Jankx\Support\Providers\FontIconsServiceProvider;
use Jankx\Support\Providers\FontsServiceProvider;
use Jankx\Support\Providers\JankxFrameworkServiceProvider;
use Jankx\Support\Providers\SystemServiceProvider;
use Jankx\Support\Providers\TemplateEngineServiceProvider;
use Jankx\Support\Providers\ThemeOptionsServiceProvider;
use Jankx\Support\Providers\TranslationServiceProvider;

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
     * The built-in service providers that should always be registered.
     *
     * @var array
     */
    protected $builtInProviders = [
        SystemServiceProvider::class,
        TranslationServiceProvider::class,
        JankxFrameworkServiceProvider::class,
        ThemeOptionsServiceProvider::class,
        JankxAdminPagesServiceProvider::class,
        ExtensionServiceProvider::class,
        ContentLayoutServiceProvider::class,
        TemplateEngineServiceProvider::class,
    ];

    /**
     * The service providers that should be lazy loaded.
     * 
     * @var array
     */
    protected $lazyProviders = [
        FontsServiceProvider::class,
        FontIconsServiceProvider::class,
    ];


    /**
     * The deferred services and their providers.
     *
     * @var array
     */
    protected $deferredServices = [];

    /**
     * Lazy loaded services cache
     *
     * @var array
     */
    protected $lazyServices = [];

    /**
     * Services that should be lazy loaded
     *
     * @var array
     */
    protected $lazyServiceProviders = [];

    /**
     * The Service Provider Registry instance.
     *
     * @var \Jankx\Foundation\ServiceProviderRegistry
     */
    protected $providerRegistry;

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
        $this->providerRegistry = new ServiceProviderRegistry($this);

        // Register lazy providers
        $this->registerLazyProviders();
    }

    /**
     * Register lazy service providers
     * 
     * @return void
     */
    protected function registerLazyProviders(): void
    {
        if (isset($this->lazyProviders)) {
            foreach ($this->lazyProviders as $provider) {
                $this->registerLazy($provider);
            }
        }
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

        $this->singleton('cache', function () {
            return new class {
                public function get($key) { return null; }
                public function set($key, $value) { return true; }
                public function isEnabled() { return false; }
            };
        });

        // Add repository and other common mocks for testing
        $this->singleton('gutenberg.repository', function () {
            return new class {
                public function getBlocks() { return []; }
                public function getInstances() { return []; }
                public function registerBlock($block) {}
                public function getBlock($name) { return null; }
                public function getBlockPath($name) { return null; }
            };
        });

        $this->singleton('jankx.option', function () {
            return new class {
                public function get($name, $default = null) { return $default; }
                public function set($name, $value) {}
            };
        });

        $this->alias('log', LoggerInterface::class);
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
            'app'      => [Application::class],
            'config'   => [Repository::class],
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


        $this->callBootingCallbacks();

        foreach ($bootstrappers as $bootstrapper) {
            $this->make($bootstrapper)->bootstrap($this);
        }

        $this->setBooted();
        $this->callBootedCallbacks();
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
        $this->providerRegistry->register($provider);
    }

    /**
     * Get all built-in service providers.
     *
     * @return array
     */
    public function getBuiltInProviders()
    {
        return $this->builtInProviders;
    }

    /**
     * Get all service providers including built-in ones.
     *
     * @return array
     */
    public function getAllServiceProviders()
    {
        return $this->providerRegistry->getProviders();
    }

    /**
     * Boot all service providers including built-in ones.
     *
     * @return void
     */
    public function bootAllProviders()
    {
        $this->providerRegistry->bootAll();
    }

    /**
     * Boot the application's service providers.
     *
     * @return void
     */
    public function bootProviders()
    {
        $this->bootAllProviders();
        $this->bootServices();
    }

    /**
     * Boot all initialized services and destroy unused ones
     *
     * @return void
     */
    public function bootServices()
    {
        // Copy instances to avoid modification during iteration issues
        $instances = $this->instances;
        foreach ($instances as $abstract => $instance) {
            if ($instance instanceof \Jankx\Contracts\ServiceInterface) {
                $instance->initialize();

                // If service not initialized and not scheduled, destroy it
                if (!$instance->isInitialized() && !$instance->isBootScheduled()) {
                    $this->forgetInstance($abstract);
                }
            }
        }

        // Also check lazy services that might have been resolved but not fully booted
        foreach ($this->lazyServices as $abstract => $instance) {
            if ($instance instanceof \Jankx\Contracts\ServiceInterface) {
                $instance->initialize();

                if (!$instance->isInitialized() && !$instance->isBootScheduled()) {
                    $this->forgetInstance($abstract);
                    unset($this->lazyServices[$abstract]);
                }
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
        return $this->providerRegistry->getProviders();
    }

    /**
     * Determine if the given service provider is registered.
     *
     * @param  string  $provider
     * @return bool
     */
    public function isRegistered($provider)
    {
        return $this->providerRegistry->getProvider($provider) !== null;
    }

    /**
     * Register a lazy service provider
     *
     * @param string $provider
     * @return void
     */
    public function registerLazy($provider)
    {
        $this->lazyServiceProviders[] = $provider;

        // Register the provider so that its services are bound
        // This is needed for bound() to return true in tests
        $this->register($provider);
    }

    /**
     * Load a lazy service when needed
     *
     * @param string $service
     * @return mixed
     */
    public function loadLazyService($service)
    {
        // Check if service is already loaded
        if (isset($this->lazyServices[$service])) {
            return $this->lazyServices[$service];
        }

        // Find and load the provider
        foreach ($this->lazyServiceProviders as $provider) {
            if (method_exists($provider, 'provides') && $provider::provides($service)) {
                $this->register($provider);
                $instance = $this->make($service);

                if ($instance instanceof \Jankx\Contracts\ServiceInterface) {
                    $instance->initialize();

                    if (!$instance->isInitialized() && !$instance->isBootScheduled()) {
                        // Service should not load in this context, destroy it
                        $this->forgetInstance($service);
                        return null;
                    }
                }

                $this->lazyServices[$service] = $instance;
                return $this->lazyServices[$service];
            }
        }

        throw new \Exception("Service '{$service}' not registered");
    }

    /**
     * Check if a service is lazy loaded
     *
     * @param string $service
     * @return bool
     */
    public function isLazyService($service)
    {
        foreach ($this->lazyServiceProviders as $provider) {
            if (method_exists($provider, 'provides') && $provider::provides($service)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get all lazy service providers
     *
     * @return array
     */
    public function getLazyServiceProviders()
    {
        return $this->lazyServiceProviders;
    }

    /**
     * Clear lazy services cache
     *
     * @return void
     */
    public function clearLazyServices()
    {
        $this->lazyServices = [];
    }

    /**
     * Get lazy service with fallback
     *
     * @param string $service
     * @param mixed $default
     * @return mixed
     */
    public function lazy($service, $default = null)
    {
        try {
            return $this->loadLazyService($service);
        } catch (Exception $e) {
            return $default;
        }
    }

    /**
     * Check if lazy service exists and can be loaded
     *
     * @param string $service
     * @return bool
     */
    public function hasLazy($service)
    {
        return $this->isLazyService($service);
    }

    /**
     * Get lazy service statistics
     *
     * @return array
     */
    public function getLazyStats()
    {
        return [
            'providers' => count($this->lazyServiceProviders),
            'loaded' => count($this->lazyServices),
            'total' => count($this->lazyServiceProviders)
        ];
    }
}
