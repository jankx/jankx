<?php

namespace Jankx\Kernel;

use Illuminate\Container\Container;
use Jankx\Contracts\KernelInterface;

/**
 * Factory for creating kernel instances
 *
 * @package Jankx\Kernel
 */
class KernelFactory
{
    protected $container;
    protected $kernelMap = [];

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->registerDefaultKernels();
    }

    /**
     * Register default kernel mappings
     */
    protected function registerDefaultKernels()
    {
        $this->kernelMap = [
            'cli' => CLIKernel::class,
            'gutenberg-ajax' => GutenbergAjaxKernel::class,
            'cron' => CronKernel::class,
            'api' => APIKernel::class,
            'admin' => AdminKernel::class,
            'frontend' => FrontendKernel::class,
        ];
    }

    /**
     * Create a kernel instance for the given context
     *
     * @param string $context
     * @return KernelInterface|null
     */
    public function createKernel(string $context): ?KernelInterface
    {
        if (!isset($this->kernelMap[$context])) {
            return null;
        }

        $kernelClass = $this->kernelMap[$context];

        if (!class_exists($kernelClass)) {
            return null;
        }

        return $this->container->make($kernelClass);
    }

    /**
     * Register a custom kernel mapping
     *
     * @param string $context
     * @param string $kernelClass
     * @return void
     */
    public function registerKernel(string $context, string $kernelClass): void
    {
        if (!class_exists($kernelClass)) {
            throw new \InvalidArgumentException("Kernel class {$kernelClass} does not exist");
        }

        if (!is_subclass_of($kernelClass, KernelInterface::class)) {
            throw new \InvalidArgumentException("Kernel class {$kernelClass} must implement KernelInterface");
        }

        $this->kernelMap[$context] = $kernelClass;
    }

    /**
     * Get all registered kernel mappings
     *
     * @return array
     */
    public function getKernelMap(): array
    {
        return $this->kernelMap;
    }

    /**
     * Check if a kernel is registered for the given context
     *
     * @param string $context
     * @return bool
     */
    public function hasKernel(string $context): bool
    {
        return isset($this->kernelMap[$context]);
    }

    /**
     * Get kernel class for the given context
     *
     * @param string $context
     * @return string|null
     */
    public function getKernelClass(string $context): ?string
    {
        return $this->kernelMap[$context] ?? null;
    }
}