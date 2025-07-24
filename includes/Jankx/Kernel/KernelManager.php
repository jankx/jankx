<?php

namespace Jankx\Kernel;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\Global\CoreBootstrapper;
use Jankx\Contracts\KernelInterface;
use Jankx\Kernel\Strategies\KernelContextStrategy;
use Jankx\Kernel\Strategies\CLIKernelStrategy;
use Jankx\Kernel\Strategies\GutenbergAjaxKernelStrategy;
use Jankx\Kernel\Strategies\CronKernelStrategy;
use Jankx\Kernel\Strategies\APIKernelStrategy;
use Jankx\Kernel\Strategies\AdminKernelStrategy;
use Jankx\Kernel\Strategies\FrontendKernelStrategy;
use Jankx\Kernel\KernelFactory;

/**
 * Kernel Manager
 *
 * Manages the registration, initialization, and booting of kernels based on context.
 * Uses Strategy Pattern to determine which kernel to boot based on context.
 *
 * @package Jankx\Kernel
 */
class KernelManager
{
    protected $container;
    protected $booted = false;
    protected $currentKernel;
    protected $kernels = [];
    protected $bootedKernels = [];
    protected $contextStrategies = [];
    protected $kernelFactory;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->kernelFactory = new KernelFactory($container);
        $this->bootstrapSystem();
        $this->registerContextStrategies();
    }

    protected function bootstrapSystem()
    {
        // Initialize the system with CoreBootstrapper before doing anything else
        $bootstrapper = new CoreBootstrapper();
        $bootstrapper->bootstrap($this->container);
    }

    /**
     * Register context strategies for determining which kernel to use
     */
    protected function registerContextStrategies()
    {
        $strategies = [
            new CLIKernelStrategy(),
            new GutenbergAjaxKernelStrategy(),
            new CronKernelStrategy(),
            new APIKernelStrategy(),
            new AdminKernelStrategy(),
            new FrontendKernelStrategy(), // Default fallback
        ];

        // Sort strategies by priority (lower number = higher priority)
        usort($strategies, function($a, $b) {
            return $a->getPriority() <=> $b->getPriority();
        });

        $this->contextStrategies = $strategies;
    }

    public function boot()
    {
        if ($this->booted) {
            return;
        }

        $this->booted = true;
        $this->determineContextAndBootKernel();
    }

        /**
     * Use Strategy Pattern to determine context and boot appropriate kernel
     */
    protected function determineContextAndBootKernel()
    {
        $context = $this->getCurrentContext();
        $this->currentKernel = $this->kernelFactory->createKernel($context);

        if ($this->currentKernel) {
            $this->currentKernel->boot();
        }
    }

    /**
     * Get current context using Strategy Pattern
     */
    protected function getCurrentContext(): string
    {
        foreach ($this->contextStrategies as $strategy) {
            if ($strategy->canHandle()) {
                return $strategy->getContext();
            }
        }

        return 'frontend'; // Default fallback
    }

    /**
     * Get kernel class for given context using factory
     */
    protected function getKernelClassForContext(string $context): ?string
    {
        return $this->kernelFactory->getKernelClass($context);
    }

    public function getCurrentKernel()
    {
        return $this->currentKernel;
    }

    /**
     * Register a kernel using factory
     */
    public function registerKernel(string $type, string $kernelClass): void
    {
        $this->kernelFactory->registerKernel($type, $kernelClass);
        $this->kernels[$type] = $kernelClass;
    }

    public function getKernel(string $type)
    {
        if (!isset($this->kernels[$type])) {
            return null;
        }

        $kernelClass = $this->kernels[$type];

        if (!isset($this->bootedKernels[$type])) {
            $this->bootedKernels[$type] = new $kernelClass($this->container);
        }

        return $this->bootedKernels[$type];
    }

    public function bootKernel(string $type): void
    {
        $kernel = $this->getKernel($type);

        if ($kernel && !$kernel->isBooted()) {
            $kernel->boot();
        }
    }

    public function bootAllKernels(): void
    {
        foreach (array_keys($this->kernels) as $type) {
            $this->bootKernel($type);
        }
    }

    /**
     * Boot kernels by context using Strategy Pattern
     */
    public function bootKernelsByContext(): void
    {
        $context = $this->getCurrentContext();
        $this->bootKernel($context);
    }

    public function getAllKernels(): array
    {
        return $this->kernels;
    }

    public function getBootedKernels(): array
    {
        return $this->bootedKernels;
    }

    public function hasKernel(string $type): bool
    {
        return isset($this->kernels[$type]);
    }

    public function isKernelBooted(string $type): bool
    {
        $kernel = $this->getKernel($type);
        return $kernel ? $kernel->isBooted() : false;
    }

    public function removeKernel(string $type): void
    {
        unset($this->kernels[$type]);
        unset($this->bootedKernels[$type]);
    }

    public function getKernelInfo(string $type): array
    {
        $kernel = $this->getKernel($type);

        if (!$kernel) {
            return [];
        }

        return [
            'type' => $type,
            'booted' => $kernel->isBooted(),
            'context' => $this->getCurrentContext(),
        ];
    }

    public function getAllKernelInfo(): array
    {
        $info = [];

        foreach (array_keys($this->kernels) as $type) {
            $info[$type] = $this->getKernelInfo($type);
        }

        return $info;
    }

    /**
     * Get current context strategies for debugging
     */
    public function getContextStrategies(): array
    {
        return array_map(function($strategy) {
            return [
                'class' => get_class($strategy),
                'canHandle' => $strategy->canHandle(),
                'context' => $strategy->getContext(),
            ];
        }, $this->contextStrategies);
    }
}
