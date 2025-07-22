<?php

namespace Jankx\Gutenberg;

use Illuminate\Container\Container;

/**
 * Jankx Gutenberg Layout Registry
 *
 * Manages layouts and their associated blocks for the Jankx Gutenberg system.
 * Provides a centralized way to register and retrieve layout configurations.
 */
class LayoutRegistry
{
    /**
     * @var array Registered layouts
     */
    protected static $layouts = [];

    /**
     * @var array Registered blocks within layouts
     */
    protected static $blocks = [];

    /**
     * @var array Layout categories
     */
    protected static $categories = [];

    /**
     * @var Container
     */
    protected static $container;

    /**
     * Initialize the registry with container
     */
    public static function init(Container $container)
    {
        self::$container = $container;
        self::registerDefaultCategories();
    }

    /**
     * Register a new layout
     *
     * @param string $name Layout name
     * @param array $config Layout configuration
     * @return void
     */
    public static function registerLayout($name, array $config)
    {
        $defaultConfig = [
            'name' => '',
            'category' => 'jankx-layouts',
            'description' => '',
            'icon' => 'layout',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'blocks' => [],
            'attributes' => [
                'spacing' => [
                    'type' => 'string',
                    'default' => 'default'
                ],
                'background' => [
                    'type' => 'string',
                    'default' => 'none'
                ],
                'alignment' => [
                    'type' => 'string',
                    'default' => 'left'
                ],
                'partialHydration' => [
                    'type' => 'boolean',
                    'default' => false
                ]
            ],
            'render_callback' => null,
            'editor_script' => null,
            'editor_style' => null,
            'style' => null
        ];

        self::$layouts[$name] = array_merge($defaultConfig, $config);
    }

    /**
     * Register a block within a specific layout
     *
     * @param string $layoutName Layout name
     * @param string $blockName Block name
     * @param array $config Block configuration
     * @return void
     */
    public static function registerBlockInLayout($layoutName, $blockName, array $config = [])
    {
        if (!isset(self::$blocks[$layoutName])) {
            self::$blocks[$layoutName] = [];
        }

        $defaultBlockConfig = [
            'name' => $blockName,
            'required' => false,
            'order' => 0,
            'supports' => [],
            'attributes' => []
        ];

        self::$blocks[$layoutName][$blockName] = array_merge($defaultBlockConfig, $config);
    }

    /**
     * Get a registered layout
     *
     * @param string $name Layout name
     * @return array|null Layout configuration
     */
    public static function getLayout($name)
    {
        return self::$layouts[$name] ?? null;
    }

    /**
     * Get all registered layouts
     *
     * @return array All layouts
     */
    public static function getLayouts()
    {
        return self::$layouts;
    }

    /**
     * Get blocks for a specific layout
     *
     * @param string $layoutName Layout name
     * @return array Blocks in layout
     */
    public static function getLayoutBlocks($layoutName)
    {
        return self::$blocks[$layoutName] ?? [];
    }

    /**
     * Get all layouts by category
     *
     * @param string $category Category name
     * @return array Layouts in category
     */
    public static function getLayoutsByCategory($category)
    {
        $layouts = [];
        foreach (self::$layouts as $name => $config) {
            if ($config['category'] === $category) {
                $layouts[$name] = $config;
            }
        }
        return $layouts;
    }

    /**
     * Check if layout exists
     *
     * @param string $name Layout name
     * @return bool
     */
    public static function hasLayout($name)
    {
        return isset(self::$layouts[$name]);
    }

    /**
     * Register a layout category
     *
     * @param string $name Category name
     * @param array $config Category configuration
     * @return void
     */
    public static function registerCategory($name, array $config = [])
    {
        $defaultConfig = [
            'name' => $name,
            'icon' => 'category',
            'description' => ''
        ];

        self::$categories[$name] = array_merge($defaultConfig, $config);
    }

    /**
     * Get all categories
     *
     * @return array All categories
     */
    public static function getCategories()
    {
        return self::$categories;
    }

    /**
     * Register default categories
     */
    protected static function registerDefaultCategories()
    {
        self::registerCategory('jankx-layouts', [
            'name' => 'Jankx Layouts',
            'icon' => 'layout',
            'description' => 'Pre-built layouts for Jankx theme'
        ]);

        self::registerCategory('jankx-sections', [
            'name' => 'Jankx Sections',
            'icon' => 'section',
            'description' => 'Section layouts for Jankx theme'
        ]);

        self::registerCategory('jankx-components', [
            'name' => 'Jankx Components',
            'icon' => 'component',
            'description' => 'Component layouts for Jankx theme'
        ]);
    }

    /**
     * Get layouts used in current post
     *
     * @param int $postId Post ID
     * @return array Used layouts
     */
    public static function getUsedLayouts($postId)
    {
        $post = get_post($postId);
        if (!$post) {
            return [];
        }

        $usedLayouts = [];
        $content = $post->post_content;

        // Parse content for Jankx layout blocks
        preg_match_all('/<!-- wp:jankx\/layout-([^ ]+) /', $content, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $layoutName) {
                if (self::hasLayout($layoutName)) {
                    $usedLayouts[] = $layoutName;
                }
            }
        }

        return array_unique($usedLayouts);
    }

    /**
     * Get layout settings from block attributes
     *
     * @param array $attributes Block attributes
     * @return array Layout settings
     */
    public static function getLayoutSettings($attributes)
    {
        return [
            'spacing' => $attributes['spacing'] ?? 'default',
            'background' => $attributes['background'] ?? 'none',
            'alignment' => $attributes['alignment'] ?? 'left',
            'partial_hydration' => $attributes['partialHydration'] ?? false
        ];
    }

    /**
     * Check if layout supports partial hydration
     *
     * @param string $layoutName Layout name
     * @return bool
     */
    public static function supportsPartialHydration($layoutName)
    {
        $layout = self::getLayout($layoutName);
        return $layout && isset($layout['supports']['partial_hydration']) && $layout['supports']['partial_hydration'];
    }

    /**
     * Get container instance
     *
     * @return Container
     */
    public static function getContainer()
    {
        return self::$container;
    }
}