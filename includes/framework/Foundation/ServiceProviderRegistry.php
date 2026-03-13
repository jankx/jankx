<?php

namespace Jankx\Foundation;

use Jankx\Contracts\ServiceProvider as ServiceProviderContract;
use Jankx\Foundation\Application;

class ServiceProviderRegistry
{
    /**
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $providers = [];

    /**
     * @var array
     */
    protected $loadedProviders = [];

    /**
     * @var array
     */
    protected $bootedProviders = [];

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Register a provider
     *
     * @param string|ServiceProviderContract $provider
     * @param bool $force
     * @return ServiceProviderContract|null
     */
    public function register($provider, $force = false)
    {
        if ($registered = $this->getProvider($provider)) {
            return $registered;
        }

        if (is_string($provider)) {
            $provider = $this->resolveProvider($provider);
        }

        // Check if provider should be loaded
        if (!$force && method_exists($provider, 'shouldLoad') && !$provider->shouldLoad()) {
            return null;
        }

        $provider->register($this->app);

        $this->markAsLoaded($provider);

        return $provider;
    }

    /**
     * Mark provider as loaded
     *
     * @param ServiceProviderContract $provider
     * @return void
     */
    protected function markAsLoaded($provider)
    {
        $name = get_class($provider);
        $this->providers[$name] = $provider;
        $this->loadedProviders[$name] = true;
    }

    /**
     * Resolve provider instance
     *
     * @param string $provider
     * @return ServiceProviderContract
     */
    protected function resolveProvider($provider)
    {
        return new $provider($this->app);
    }

    /**
     * Get registered provider
     *
     * @param string|ServiceProviderContract $provider
     * @return ServiceProviderContract|null
     */
    public function getProvider($provider)
    {
        $name = is_string($provider) ? $provider : get_class($provider);
        return $this->providers[$name] ?? null;
    }

    /**
     * Boot all registered providers
     *
     * @return void
     */
    public function bootAll()
    {
        foreach ($this->providers as $name => $provider) {
            $this->bootProvider($provider);
        }
    }

    /**
     * Boot a specific provider
     *
     * @param ServiceProviderContract $provider
     * @return void
     */
    public function bootProvider(ServiceProviderContract $provider)
    {
        $name = get_class($provider);

        if (isset($this->bootedProviders[$name])) {
            return;
        }

        // Double check shouldLoad before booting just in case context changed
        if (method_exists($provider, 'shouldLoad') && !$provider->shouldLoad()) {
            $this->forgetProvider($name);
            return;
        }

        if (method_exists($provider, 'boot')) {
            $provider->boot($this->app);
        }

        if (method_exists($provider, 'markAsBooted')) {
            $provider->markAsBooted();
        }

        $this->bootedProviders[$name] = true;
    }

    /**
     * Check if a provider is booted
     *
     * @param string|ServiceProviderContract $provider
     * @return bool
     */
    public function isBooted($provider)
    {
        $name = is_string($provider) ? $provider : get_class($provider);
        return isset($this->bootedProviders[$name]);
    }

    /**
     * Forget a provider and its registered services if possible
     *
     * @param string $name
     * @return void
     */
    public function forgetProvider($name)
    {
        if (isset($this->providers[$name])) {
            unset($this->providers[$name]);
        }
        if (isset($this->loadedProviders[$name])) {
            unset($this->loadedProviders[$name]);
        }
        if (isset($this->bootedProviders[$name])) {
            unset($this->bootedProviders[$name]);
        }
    }

    /**
     * Get all registered providers
     *
     * @return array
     */
    public function getProviders()
    {
        return array_values($this->providers);
    }
}
