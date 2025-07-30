<?php

namespace Jankx\Kernel;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Jankx;
use Jankx\Contracts\KernelInterface;
use Jankx\Contracts\BootstrapperInterface;
use Jankx\Facades\Config;
use Illuminate\Container\Container;
use Jankx\Facades\Logger;

/**
 * Abstract Kernel Class
 *
 * Base class for all kernel types in Jankx framework
 *
 * @package Jankx\Kernel
 * @since 2.0.0
 */
abstract class Kernel implements KernelInterface
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var array
     */
    protected $hooks = [];

    /**
     * @var array
     */
    protected $filters = [];

    /**
     * @var array
     */
    protected $bootstrappers = [];

    /**
     * @var bool
     */
    protected $booted = false;

    /**
     * @var string
     */
    protected $kernelType;

    /**
     * @var string
     */
    protected $context;

    protected $serviceProviders = [];

    /**
     * Constructor
     * @since 2.0.0
     */
    public function __construct(Container $container = null)
    {
        $this->container = $container ?: Jankx::getInstance();
        $this->kernelType = $this->getKernelType();

        // Configuration is loaded by Config facade

        $this->registerBootstrappers();
        $this->registerHooks();
        $this->registerFilters();
    }

    /**
     * Get kernel type
     *
     * @return string
     * @since 2.0.0
     */
    public function getKernelType(): string
    {
        return 'abstract';
    }

                /**
     * Get current context
     * @since 2.0.0
     */
    protected function getCurrentContext(): string
    {
        return $this->context ?? 'frontend';
    }

        /**
     * Set context for this kernel
     * @since 2.0.0
     */
    public function setContext(string $context): void
    {
        $this->context = $context;
    }

            /**
     * Register bootstrappers
     * @since 2.0.0
     */
    protected function registerBootstrappers(): void
    {
        // Add ConfigBootstrapper first (highest priority)
        $this->addBootstrapper(\Jankx\Bootstrappers\Global\ConfigBootstrapper::class);

        // Add CoreBootstrapper
        $this->addBootstrapper(\Jankx\Bootstrappers\Global\CoreBootstrapper::class);
    }

        /**
     * Register services from configuration
     * @since 2.0.0
     */
    protected function registerServices(): void
    {
        $this->serviceProviders = Config::get('app.providers.' . $this->getCurrentContext(), []);

        // Add global providers
        $globalProviders = Config::get('app.providers.global', []);
        $this->serviceProviders = array_merge($globalProviders, $this->serviceProviders);

        // Remove duplicates
        $this->serviceProviders = array_unique($this->serviceProviders);

        // Debug log providers
        Logger::debug('registerServices', [
            'context' => $this->getCurrentContext(),
            'global_providers' => $globalProviders,
            'context_providers' => Config::get('app.providers.' . $this->getCurrentContext(), []),
            'final_providers' => $this->serviceProviders
        ]);
    }



    /**
     * Register hooks
     * @since 2.0.0
     */
    abstract protected function registerHooks(): void;

    /**
     * Register filters
     * @since 2.0.0
     */
    abstract protected function registerFilters(): void;

    /**
     * Boot kernel
     * @since 2.0.0
     */
    public function boot(): void
    {
        if ($this->booted) {
            return;
        }

        // Run bootstrappers first
        $this->runBootstrappers();

        // Register services after bootstrappers have run
        $this->registerServices();

        // Load components
        $this->loadServices();
        $this->loadHooks();
        $this->loadFilters();

        $this->booted = true;

        do_action("jankx/kernel/{$this->kernelType}/booted", $this);
    }

    /**
     * Check if kernel is booted
     * @since 2.0.0
     */
    public function isBooted(): bool
    {
        return $this->booted;
    }

    /**
     * Get kernel type
     * @since 2.0.0
     */
    public function getType(): string
    {
        return $this->kernelType;
    }

    /**
     * Get container
     *
     * @return \Illuminate\Container\Container
     * @since 2.0.0
     */
    public function getContainer(): \Illuminate\Container\Container
    {
        return $this->container;
    }

    /**
     * Get hooks
     * @since 2.0.0
     */
    public function getHooks(): array
    {
        return $this->hooks;
    }

    /**
     * Get filters
     * @since 2.0.0
     */
    public function getFilters(): array
    {
        return $this->filters;
    }

    /**
     * Get bootstrappers
     * @since 2.0.0
     */
    public function getBootstrappers(): array
    {
        return $this->bootstrappers;
    }

    /**
     * Add bootstrapper
     * @since 2.0.0
     */
    public function addBootstrapper(string $bootstrapper): void
    {
        if (!in_array($bootstrapper, $this->bootstrappers)) {
            $this->bootstrappers[] = $bootstrapper;
        }
    }

    /**
     * Remove bootstrapper
     * @since 2.0.0
     */
    public function removeBootstrapper(string $bootstrapper): void
    {
        $key = array_search($bootstrapper, $this->bootstrappers);
        if ($key !== false) {
            unset($this->bootstrappers[$key]);
        }
    }

    /**
     * Check if bootstrapper exists
     * @since 2.0.0
     */
    public function hasBootstrapper(string $bootstrapper): bool
    {
        return in_array($bootstrapper, $this->bootstrappers);
    }

    /**
     * Run bootstrappers
     * @since 2.0.0
     */
    protected function runBootstrappers(): void
    {
        // Sort bootstrappers by priority
        $sortedBootstrappers = $this->sortBootstrappersByPriority();

        foreach ($sortedBootstrappers as $bootstrapperClass) {
            if (!class_exists($bootstrapperClass)) {
                continue;
            }

            $bootstrapper = $this->container->make($bootstrapperClass);

            if (!$bootstrapper instanceof BootstrapperInterface) {
                continue;
            }

            // Check dependencies
            if (!$this->checkBootstrapperDependencies($bootstrapper)) {
                continue;
            }

            // Check if should run
            if (!$bootstrapper->shouldRun()) {
                continue;
            }

            $bootstrapper->bootstrap($this->container);
        }
    }

    /**
     * Sort bootstrappers by priority
     * @since 2.0.0
     */
    protected function sortBootstrappersByPriority(): array
    {
        $bootstrappersWithPriority = [];

        foreach ($this->bootstrappers as $bootstrapperClass) {
            if (!class_exists($bootstrapperClass)) {
                continue;
            }

            $bootstrapper = $this->container->make($bootstrapperClass);

            if (!$bootstrapper instanceof BootstrapperInterface) {
                continue;
            }

            $bootstrappersWithPriority[] = [
                'class' => $bootstrapperClass,
                'priority' => $bootstrapper->getPriority()
            ];
        }

        // Sort by priority (lower number = higher priority)
        usort($bootstrappersWithPriority, function ($a, $b) {
            return $a['priority'] <=> $b['priority'];
        });

        return array_column($bootstrappersWithPriority, 'class');
    }

    /**
     * Check bootstrapper dependencies
     * @since 2.0.0
     */
    protected function checkBootstrapperDependencies(BootstrapperInterface $bootstrapper): bool
    {
        $dependencies = $bootstrapper->getDependencies();

        foreach ($dependencies as $dependency) {
            if (!class_exists($dependency) && !function_exists($dependency)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Load services
     * @since 2.0.0
     */
    protected function loadServices()
    {
        Logger::debug('loadServices', ['start' => true]);

        // Load services from Service Providers
        foreach ($this->getServiceProviders() as $providerClass) {
            Logger::debug('loadingProvider', ['provider' => $providerClass]);

            if (class_exists($providerClass)) {
                try {
                    // Check if class is abstract
                    $reflection = new \ReflectionClass($providerClass);
                    if ($reflection->isAbstract()) {
                        Logger::warning(sprintf("%s: Service Provider {$providerClass} is abstract and cannot be instantiated", get_class($this)));
                        continue;
                    }

                    $provider = new $providerClass($this->container);
                    $provider->register();
                    $provider->boot();

                    Logger::debug('providerLoaded', ['provider' => $providerClass, 'status' => 'success']);
                } catch (\Exception $e) {
                    Logger::error(sprintf("%s: Không thể khởi tạo Service Provider {$providerClass}: %s", get_class($this), $e->getMessage()));

                    Logger::debug('providerLoaded', ['provider' => $providerClass, 'status' => 'failed', 'error' => $e->getMessage()]);
                }
            } else {
                Logger::error(sprintf("%s: Service Provider {$providerClass} không tồn tại", get_class($this)));

                Logger::debug('providerLoaded', ['provider' => $providerClass, 'status' => 'not_found']);
            }
        }

        Logger::debug('loadServices', ['end' => true]);
    }

    /**
     * Load hooks
     * @since 2.0.0
     */
    protected function loadHooks(): void
    {
        foreach ($this->hooks as $hook) {
            if (isset($hook['hook'], $hook['callback'], $hook['priority'])) {
                add_action($hook['hook'], $hook['callback'], $hook['priority'], $hook['args'] ?? 1);
            }
        }
    }

    /**
     * Load filters
     * @since 2.0.0
     */
    protected function loadFilters(): void
    {
        foreach ($this->filters as $filter) {
            if (isset($filter['filter'], $filter['callback'], $filter['priority'])) {
                add_filter($filter['filter'], $filter['callback'], $filter['priority'], $filter['args'] ?? 1);
            }
        }
    }

    /**
     * Add hook
     * @since 2.0.0
     */
    protected function addHook(string $hook, $callback, int $priority = 10, int $args = 1): void
    {
        $this->hooks[] = [
            'hook' => $hook,
            'callback' => $callback,
            'priority' => $priority,
            'args' => $args
        ];
    }

    /**
     * Add filter
     * @since 2.0.0
     */
    protected function addFilter(string $filter, $callback, int $priority = 10, int $args = 1): void
    {
        $this->filters[] = [
            'filter' => $filter,
            'callback' => $callback,
            'priority' => $priority,
            'args' => $args
        ];
    }

    /**
     * Method getServiceProviders
     *
     * @since 2.0.0
     */
    protected function getServiceProviders(): array
    {
        return $this->serviceProviders;
    }

    /**
     * Add service provider
     * @since 2.0.0
     */
    public function addServiceProvider(string $providerClass): void
    {
        if (!in_array($providerClass, $this->serviceProviders)) {
            $this->serviceProviders[] = $providerClass;
        }
    }

    /**
     * Remove service provider
     * @since 2.0.0
     */
    public function removeServiceProvider(string $providerClass): void
    {
        $key = array_search($providerClass, $this->serviceProviders);
        if ($key !== false) {
            unset($this->serviceProviders[$key]);
        }
    }

    /**
     * Check if service provider exists
     * @since 2.0.0
     */
    public function hasServiceProvider(string $providerClass): bool
    {
        return in_array($providerClass, $this->serviceProviders);
    }
}
