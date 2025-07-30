<?php

namespace Jankx\Kernel;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\Global\CoreBootstrapper;
use Jankx\Kernel\Strategies\CLIKernelStrategy;
use Jankx\Kernel\Strategies\AjaxKernelStrategy;
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
    protected $contextStrategies = [];
    protected $kernelFactory;

    protected $currentContext = null;


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
            new AjaxKernelStrategy(),
            new GutenbergAjaxKernelStrategy(),
            new CronKernelStrategy(),
            new APIKernelStrategy(),
            new AdminKernelStrategy(),
            new FrontendKernelStrategy(), // Default fallback
        ];

        // Sort strategies by priority (lower number = higher priority)
        usort($strategies, function ($a, $b) {
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
            // Set context for the kernel
            $this->currentKernel->setContext($context);
            $this->currentKernel->boot();
        }
    }

    /**
     * Get current context using Strategy Pattern
     */
    public function getCurrentContext(): string
    {
        if (is_null($this->currentContext)) {
            foreach ($this->contextStrategies as $strategy) {
                if ($strategy->canHandle()) {
                    $context = $strategy->getContext();
                    // Debug logging
                    if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
                        \Jankx\Facades\Logger::debug("KernelManager: Detected context: {$context} using strategy: " . get_class($strategy));
                    }
                    return $context;
                }
            }

            $context = 'frontend'; // Default fallback
            // Debug logging
            if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
                \Jankx\Facades\Logger::debug("KernelManager: Using default context: {$context}");
            }
            $this->currentContext = $context;
        } else {
            $context = $this->currentContext;
        }
        return $context;
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
    }
}
