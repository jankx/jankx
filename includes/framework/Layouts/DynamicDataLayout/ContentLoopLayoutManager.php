<?php

namespace Jankx\Layouts\DynamicDataLayout;

/**
 * Content Loop Layout Manager
 *
 * Quản lý việc đăng ký và tạo các content loop layouts cho dynamic-data-template block.
 * Content loop layouts là layouts cho từng item trong loop (khác với wrapper layouts).
 *
 * @package Jankx\Layouts\DynamicDataLayout
 * @since 2.0.0
 */
class ContentLoopLayoutManager
{
    /**
     * Singleton instance
     *
     * @var ContentLoopLayoutManager|null
     */
    protected static $instance = null;

    /**
     * Registered layouts by post type
     * Structure: ['post_type' => ['layout_name' => LayoutInfo], 'common' => [...]]
     *
     * @var array
     */
    protected $registeredLayouts = [];

    /**
     * Built-in layouts
     *
     * @var array
     */
    protected $builtInLayouts = ['default'];

    /**
     * Constructor
     */
    protected function __construct()
    {
        $this->registerBuiltInLayouts();
        
        // Allow developers to register custom layouts
        do_action('jankx/dynamic-data-template/register-content-loop-layouts', $this);
    }

    /**
     * Get singleton instance
     *
     * @return ContentLoopLayoutManager
     */
    public static function getInstance(): ContentLoopLayoutManager
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
        // Register default layout as common
        $this->registerLayout('default', null, 'common');

        // Register product-specific layout
        if (post_type_exists('product')) {
            $this->registerLayout('button-in-featured-image-wrap', null, 'product');
        }
    }

    /**
     * Register a content loop layout
     *
     * @param string $layoutName Layout name (e.g., 'default', 'button-in-featured-image-wrap')
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
        return apply_filters('jankx/dynamic-data-template/content-loop-layouts-for-post-type', $layouts, $postType);
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
        $layoutInfo = $this->registeredLayouts[$postType][$layoutName] ?? null;
        
        if ($layoutInfo && $layoutInfo['class']) {
            try {
                $layout = new $layoutInfo['class']();
                return [
                    'name' => $layoutName,
                    'title' => method_exists($layout, 'getTitle') ? $layout->getTitle() : ucfirst($layoutName),
                    'class' => $layoutInfo['class'],
                    'postType' => $postType,
                    'supportedOptions' => method_exists($layout, 'getSupportedOptions') ? $layout->getSupportedOptions() : [],
                ];
            } catch (\Exception $e) {
                // Layout class not found or invalid
            }
        }

        // For built-in layouts, return default info
        return [
            'name' => $layoutName,
            'title' => ucfirst(str_replace('-', ' ', $layoutName)),
            'class' => null,
            'postType' => $postType,
            'supportedOptions' => [],
        ];
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
        return isset($this->registeredLayouts[$postType][$layoutName]) ||
               isset($this->registeredLayouts['common'][$layoutName]);
    }
}

