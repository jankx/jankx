<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Foundation\Application;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use InvalidArgumentException;

/**
 * Layout Registry
 * 
 * Manages dynamically registered layouts for Dynamic Data blocks.
 * Uses the Application container to resolve instances with full DI support.
 */
class LayoutRegistry
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $layouts = [];

    /**
     * Constructor
     * 
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Register a new layout
     * 
     * @param string $name Unique layout identifier
     * @param string $class Fully qualified class name
     * @return void
     */
    public function register(string $name, string $class): void
    {
        if (!class_exists($class)) {
            throw new InvalidArgumentException(sprintf('Layout class "%s" does not exist.', $class));
        }

        if (!is_subclass_of($class, BlockTemplateLayoutInterface::class)) {
            throw new InvalidArgumentException(sprintf(
                'Layout class "%s" must implement %s',
                $class,
                BlockTemplateLayoutInterface::class
            ));
        }

        $this->layouts[$name] = $class;
    }

    /**
     * Unregister a layout
     * 
     * @param string $name
     * @return void
     */
    public function unregister(string $name): void
    {
        unset($this->layouts[$name]);
    }

    /**
     * Check if a layout exists
     * 
     * @param string $name
     * @return bool
     */
    public function has(string $name): bool
    {
        return isset($this->layouts[$name]);
    }

    /**
     * Get a layout class by name
     * 
     * @param string $name
     * @return string|null
     */
    public function get(string $name): ?string
    {
        return $this->layouts[$name] ?? null;
    }

    /**
     * Resolve a layout instance via Container
     * 
     * @param string $name
     * @param array $options
     * @return BlockTemplateLayoutInterface
     */
    public function resolve(string $name, array $options = []): BlockTemplateLayoutInterface
    {
        $class = $this->get($name);

        if (!$class) {
            throw new InvalidArgumentException(sprintf('Layout "%s" is not registered.', $name));
        }

        // Use Application::make to enable Constructor Injection for Layout classes
        $instance = $this->app->make($class);
        
        if (!empty($options)) {
            $instance->setOptions($options);
        }

        return $instance;
    }

    /**
     * Get all registered layouts
     * 
     * @return array [name => className]
     */
    public function all(): array
    {
        return apply_filters('jankx/layouts/registry/all', $this->layouts);
    }

    /**
     * Get all registered layout names
     * 
     * @return array
     */
    public function getNames(): array
    {
        return array_keys($this->all());
    }
}

