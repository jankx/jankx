<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Foundation\Application;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutFactory;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\LayoutRegistry;

/**
 * Block Template Layout Manager
 *
 * High-level service that manages dynamic data layouts via the LayoutRegistry.
 * Replaces static instance access with dependency injection.
 */
class BlockTemplateLayoutManager
{
    /**
     * Singleton instance for test compatibility
     * @var static
     * @deprecated Use dependency injection instead
     */
    protected static $instance;

    /**
     * Get singleton instance
     *
     * @deprecated Use dependency injection
     * @return static
     */
    public static function getInstance()
    {
        if (!static::$instance) {
            $app = Application::getInstance();
            $registry = $app ? $app->make(LayoutRegistry::class) : new LayoutRegistry($app ?? new Application());
            static::$instance = new static($registry);

            // Register layouts from factory if registry is empty
            if (empty($registry->all())) {
                BlockTemplateLayoutFactory::init();
                $layouts = BlockTemplateLayoutFactory::getRegisteredLayouts();
                foreach ($layouts as $name => $class) {
                    try {
                        $registry->register($name, $class);
                    } catch (\Exception $e) {
                        // Skip if already registered or invalid
                    }
                }
            }
        }
        return static::$instance;
    }

    /**
     * Set singleton instance (for testing)
     * 
     * @param static|null $instance
     * @return void
     */
    public static function setInstance($instance)
    {
        static::$instance = $instance;
    }

    /**
     * @var LayoutRegistry
     */
    protected $registry;

    /**
     * Constructor using Dependency Injection
     * 
     * @param LayoutRegistry $registry
     */
    public function __construct(LayoutRegistry $registry)
    {
        $this->registry = $registry;
    }

    /**
     * Create a specific layout instance
     * 
     * @param string $layoutName
     * @param array $options Optional initial options
     * @return BlockTemplateLayoutInterface
     */
    public function createLayout(string $layoutName, array $options = []): BlockTemplateLayoutInterface
    {
        return $this->registry->resolve($layoutName, $options);
    }

    /**
     * Get all registered layouts from the registry
     * 
     * @return array [name => class]
     */
    public function getAvailableLayouts(): array
    {
        return $this->registry->all();
    }

    /**
     * Get names of all registered layouts
     * 
     * @return array
     */
    public function getLayoutNames(): array
    {
        return $this->registry->getNames();
    }

    /**
     * Check if a specific layout name is registered
     * 
     * @param string $layoutName
     * @return bool
     */
    public function hasLayout(string $layoutName): bool
    {
        return $this->registry->has($layoutName);
    }

    /**
     * Dynamically register a new layout
     * 
     * @param string $name
     * @param string $class
     * @return void
     */
    public function registerLayout(string $name, string $class): void
    {
        $this->registry->register($name, $class);
    }

    /**
     * Get supported options for a layout
     * 
     * @param string $layoutName
     * @return array
     */
    public function getLayoutOptions(string $layoutName): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = $this->createLayout($layoutName);
        return $layout->getSupportedOptions();
    }

    /**
     * Get full settings definition for a layout
     * 
     * @param string $layoutName
     * @return array
     */
    public function getLayoutSettingsDefinition(string $layoutName): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = $this->createLayout($layoutName);
        return $layout->getSettingsDefinition();
    }

    /**
     * Render a layout by name
     * 
     * @param string $layoutName
     * @param array $options
     * @param mixed $query Optional WP_Query
     * @return string
     */
    public function renderLayout(string $layoutName, array $options = [], $query = null): string
    {
        if (!$this->hasLayout($layoutName)) {
            return '';
        }

        $layout = $this->createLayout($layoutName, $options);
        if ($query) {
            $layout->setQuery($query);
        }

        return $layout->render();
    }

    /**
     * Get preview structure for a layout
     * 
     * @param string $layoutName
     * @param array $options
     * @return array
     */
    public function renderLayoutPreview(string $layoutName, array $options = []): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = $this->createLayout($layoutName, $options);
        return $layout->renderPreview();
    }

    /**
     * Get layouts available for post types (currently all)
     * 
     * @param string $postType
     * @return array
     */
    public function getLayoutsForPostType(string $postType): array
    {
        return $this->getAvailableLayouts();
    }

    /**
     * Get the most commonly used layouts
     * 
     * @return array
     */
    public function getCommonLayouts(): array
    {
        $commonLayouts = ['grid', 'list', 'card', 'carousel', 'masonry'];
        $availableLayouts = $this->getAvailableLayouts();
        
        return array_intersect_key($availableLayouts, array_flip($commonLayouts));
    }
}

