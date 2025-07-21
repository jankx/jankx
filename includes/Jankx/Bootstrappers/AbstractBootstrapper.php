<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

abstract class AbstractBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 10;

    /**
     * @var array
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
