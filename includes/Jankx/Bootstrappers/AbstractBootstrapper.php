<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * Abstract Bootstrapper
 *
 * Base class for all bootstrappers in the Jankx framework.
 * Provides common functionality and enforces contract implementation.
 *
 * @package Jankx\Bootstrappers
 * @since 2.0.0
 */
abstract class AbstractBootstrapper implements BootstrapperInterface
{
    /**
     * @var int Bootstrapper priority (lower numbers run first)
     */
    protected $priority = 10;

    /**
     * @var array List of bootstrapper dependencies
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper priority
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Get bootstrapper dependencies
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * Get bootstrapper name (must be implemented by child)
     */
    abstract public function getName(): string;

    /**
     * Check if bootstrapper should run (must be implemented by child)
     */
    abstract public function shouldRun(): bool;

    /**
     * Bootstrap the application (must be implemented by child)
     */
    abstract public function bootstrap(Container $container): void;
}
