<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutFactory;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;

/**
 * Dynamic Data Layout Manager
 *
 * Quản lý việc đăng ký và tạo các layouts cho dynamic-data-layout block.
 * Hỗ trợ đăng ký layouts theo post type context (common vs post type specific).
 *
 * @package Jankx\Layouts\DynamicDataLayout
 * @since 2.0.0
 */
class DynamicDataLayoutManager
{
    /**
     * Singleton instance
     *
     * @var DynamicDataLayoutManager|null
     */
    protected static $instance = null;

    /**
     * Registered layouts by post type
     * Structure: ['post_type' => ['layout_name' => LayoutClass], 'common' => [...]]
     *
     * @var array
     */
    protected $registeredLayouts = [];

    /**
     * Built-in layouts
     *
     * @var array
     */
    protected $builtInLayouts = ['card', 'carousel', 'grid', 'list'];

    /**
     * Constructor
     */
    protected function __construct()
    {
        BlockTemplateLayoutFactory::init();
        $this->registerBuiltInLayouts();
        
        // Allow developers to register custom layouts
        do_action('jankx/dynamic-data-layout/register-layouts', $this);
    }

    /**
     * Get singleton instance
     *
     * @return DynamicDataLayoutManager
     */
    public static function getInstance(): DynamicDataLayoutManager
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Register built-in layouts
     *
     * @return void
     */
    protected function registerBuiltInLayouts(): void
    {
        // Register built-in layouts as common (available for all post types)
        foreach ($this->builtInLayouts as $layoutName) {
            $this->registerLayout($layoutName, null, 'common');
        }
    }

    /**
     * Register a layout
     *
     * @param string $layoutName Layout name (e.g., 'grid', 'list', 'card', 'carousel')
     * @param string|null $layoutClass Layout class name (null for built-in layouts)
     * @param string|array $postTypes Post type(s) or 'common' for all post types
     * @return void
     */
    public function registerLayout(string $layoutName, ?string $layoutClass = null, $postTypes = 'common'): void
    {
        // Normalize post types to array
        if ($postTypes === 'common') {
            $postTypes = ['common'];
        } elseif (!is_array($postTypes)) {
            $postTypes = [$postTypes];
        }

        foreach ($postTypes as $postType) {
            if (!isset($this->registeredLayouts[$postType])) {
                $this->registeredLayouts[$postType] = [];
            }

            $this->registeredLayouts[$postType][$layoutName] = [
                'name' => $layoutName,
                'class' => $layoutClass,
                'postType' => $postType,
            ];
        }
    }

    /**
     * Get layouts for a specific post type
     *
     * @param string $postType Post type
     * @return array Array of layout information
     */
    public function getLayoutsForPostType(string $postType): array
    {
        $layouts = [];

        // Get common layouts (available for all post types)
        if (isset($this->registeredLayouts['common'])) {
            foreach ($this->registeredLayouts['common'] as $layoutName => $layoutInfo) {
                $layouts[] = $this->getLayoutInfo($layoutName, 'common');
            }
        }

        // Get post type specific layouts
        if (isset($this->registeredLayouts[$postType])) {
            foreach ($this->registeredLayouts[$postType] as $layoutName => $layoutInfo) {
                $layouts[] = $this->getLayoutInfo($layoutName, $postType);
            }
        }

        // Apply filter to allow modification
        return apply_filters('jankx/dynamic-data-layout/layouts-for-post-type', $layouts, $postType);
    }

    /**
     * Get common layouts (available for all post types)
     *
     * @return array
     */
    public function getCommonLayouts(): array
    {
        $layouts = [];
        
        if (isset($this->registeredLayouts['common'])) {
            foreach ($this->registeredLayouts['common'] as $layoutName => $layoutInfo) {
                $layouts[] = $this->getLayoutInfo($layoutName, 'common');
            }
        }

        return $layouts;
    }

    /**
     * Get layout information
     *
     * @param string $layoutName Layout name
     * @param string $postType Post type context
     * @return array
     */
    protected function getLayoutInfo(string $layoutName, string $postType): array
    {
        // For built-in layouts, use BlockTemplateLayoutFactory
        if (in_array($layoutName, $this->builtInLayouts)) {
            try {
                $layout = BlockTemplateLayoutFactory::create($layoutName);
                if ($layout instanceof BlockTemplateLayoutInterface) {
                    return [
                        'name' => $layoutName,
                        'title' => $layout->getTitle(),
                        'class' => get_class($layout),
                        'postType' => $postType,
                        'supportedOptions' => $layout->getSupportedOptions(),
                        'readOnlyOptions' => $layout->getReadOnlyOptions(),
                        'settingsDefinition' => $layout->getSettingsDefinition(),
                    ];
                }
            } catch (\Exception $e) {
                // Layout not found in BlockTemplateLayoutFactory, continue
            }
        }

        // For custom layouts
        $layoutInfo = $this->registeredLayouts[$postType][$layoutName] ?? null;
        if ($layoutInfo && $layoutInfo['class']) {
            try {
                $layout = new $layoutInfo['class']();
                if ($layout instanceof BlockTemplateLayoutInterface) {
                    return [
                        'name' => $layoutName,
                        'title' => $layout->getTitle(),
                        'class' => $layoutInfo['class'],
                        'postType' => $postType,
                        'supportedOptions' => $layout->getSupportedOptions(),
                        'readOnlyOptions' => $layout->getReadOnlyOptions(),
                        'settingsDefinition' => $layout->getSettingsDefinition(),
                    ];
                }
            } catch (\Exception $e) {
                // Layout class not found or invalid
            }
        }

        // Fallback
        return [
            'name' => $layoutName,
            'title' => ucfirst($layoutName),
            'class' => null,
            'postType' => $postType,
            'supportedOptions' => [],
            'readOnlyOptions' => [],
            'settingsDefinition' => [],
        ];
    }

    /**
     * Create layout instance
     *
     * @param string $layoutName Layout name
     * @param string $postType Post type
     * @param array $attributes Block attributes
     * @return BlockTemplateLayoutDecorator|null
     */
    public function createLayout(string $layoutName, string $postType, array $attributes = []): ?BlockTemplateLayoutDecorator
    {
        try {
            // Try to create from BlockTemplateLayoutFactory first (for built-in layouts)
            $layout = BlockTemplateLayoutFactory::create($layoutName);
            
            // Wrap in decorator
            $decorator = new BlockTemplateLayoutDecorator($layout);
            
            // Set attributes if provided
            if (!empty($attributes)) {
                $decorator->withAttributes($attributes);
            }

            return $decorator;
        } catch (\Exception $e) {
            // Try custom layout class
            $layoutInfo = null;
            
            // Check post type specific first
            if (isset($this->registeredLayouts[$postType][$layoutName])) {
                $layoutInfo = $this->registeredLayouts[$postType][$layoutName];
            } elseif (isset($this->registeredLayouts['common'][$layoutName])) {
                $layoutInfo = $this->registeredLayouts['common'][$layoutName];
            }

            if ($layoutInfo && $layoutInfo['class']) {
                try {
                    $layout = new $layoutInfo['class']();
                    if ($layout instanceof BlockTemplateLayoutInterface) {
                        $decorator = new BlockTemplateLayoutDecorator($layout);
                        if (!empty($attributes)) {
                            $decorator->withAttributes($attributes);
                        }
                        return $decorator;
                    }
                } catch (\Exception $e) {
                    // Custom layout class failed
                }
            }
        }

        return null;
    }

    /**
     * Check if layout exists for post type
     *
     * @param string $layoutName Layout name
     * @param string $postType Post type
     * @return bool
     */
    public function hasLayout(string $layoutName, string $postType): bool
    {
        // Check built-in layouts
        if (in_array($layoutName, $this->builtInLayouts)) {
            return BlockTemplateLayoutFactory::hasLayout($layoutName);
        }

        // Check registered layouts
        return isset($this->registeredLayouts[$postType][$layoutName]) ||
               isset($this->registeredLayouts['common'][$layoutName]);
    }
}
