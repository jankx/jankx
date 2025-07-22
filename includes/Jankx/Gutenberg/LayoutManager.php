<?php

namespace Jankx\Gutenberg;

use Illuminate\Container\Container;
use Jankx\Gutenberg\LayoutOptions;
use Jankx\Gutenberg\LayoutTemplate;
use Jankx\Facades\Logger;

/**
 * Jankx Gutenberg Layout Manager
 *
 * Manages the registration and initialization of layouts in the Gutenberg editor.
 * Handles both dashboard and frontend context loading.
 */
class LayoutManager
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var array Registered layouts
     */
    protected $registeredLayouts = [];

    /**
     * @var bool Whether layouts are initialized
     */
    protected $initialized = false;

    /**
     * Constructor
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
        LayoutRegistry::init($container);

        // Initialize Layout Template
        LayoutTemplate::init($container);
    }

    /**
     * Initialize the layout manager
     */
    public function init()
    {
        if ($this->initialized) {
            return;
        }

        // Register default layouts
        $this->registerDefaultLayouts();

        // Register layouts based on context
        $this->registerContextualLayouts();

        $this->initialized = true;

        Logger::debug('Jankx Layout Manager initialized', [
            'total_layouts' => count($this->registeredLayouts),
            'context' => $this->getCurrentContext()
        ]);
    }

    /**
     * Register default layouts
     */
    protected function registerDefaultLayouts()
    {
        // Hero Section Layout
        LayoutRegistry::registerLayout('hero-section', [
            'name' => 'Hero Section',
            'category' => 'jankx-sections',
            'description' => 'A prominent hero section with title, description, and call-to-action',
            'icon' => 'hero',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'title' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'description' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'buttonText' => [
                    'type' => 'string',
                    'default' => 'Learn More'
                ],
                'buttonUrl' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'backgroundImage' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);

        // Testimonial Layout
        LayoutRegistry::registerLayout('testimonial', [
            'name' => 'Testimonial',
            'category' => 'jankx-components',
            'description' => 'A testimonial section with quote, author, and image',
            'icon' => 'testimonial',
            'supports' => [
                'align' => ['wide'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'quote' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'author' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'position' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'avatar' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);

        // Feature Grid Layout
        LayoutRegistry::registerLayout('feature-grid', [
            'name' => 'Feature Grid',
            'category' => 'jankx-sections',
            'description' => 'A grid of feature items with icons and descriptions',
            'icon' => 'grid',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'columns' => [
                    'type' => 'number',
                    'default' => 3
                ],
                'features' => [
                    'type' => 'array',
                    'default' => []
                ]
            ]
        ]);

        // Register blocks within layouts
        $this->registerLayoutBlocks();
    }

    /**
     * Register blocks within layouts
     */
    protected function registerLayoutBlocks()
    {
        // Hero Section blocks
        LayoutRegistry::registerBlockInLayout('hero-section', 'jankx/hero-title', [
            'required' => true,
            'order' => 1
        ]);

        LayoutRegistry::registerBlockInLayout('hero-section', 'jankx/hero-description', [
            'required' => false,
            'order' => 2
        ]);

        LayoutRegistry::registerBlockInLayout('hero-section', 'jankx/hero-button', [
            'required' => false,
            'order' => 3
        ]);

        // Testimonial blocks
        LayoutRegistry::registerBlockInLayout('testimonial', 'jankx/testimonial-quote', [
            'required' => true,
            'order' => 1
        ]);

        LayoutRegistry::registerBlockInLayout('testimonial', 'jankx/testimonial-author', [
            'required' => true,
            'order' => 2
        ]);

        // Feature Grid blocks
        LayoutRegistry::registerBlockInLayout('feature-grid', 'jankx/feature-item', [
            'required' => false,
            'order' => 1
        ]);
    }

    /**
     * Register layouts based on current context
     */
    protected function registerContextualLayouts()
    {
        $context = $this->getCurrentContext();

        if ($context === 'dashboard') {
            // Load all layouts in dashboard
            $this->registerAllLayouts();
        } else {
            // Load only used layouts in frontend
            $this->registerUsedLayouts();
        }
    }

    /**
     * Register all layouts (for dashboard)
     */
    protected function registerAllLayouts()
    {
        $layouts = LayoutRegistry::getLayouts();

        foreach ($layouts as $name => $config) {
            $this->registerLayoutBlock($name, $config);
        }

        Logger::debug('All layouts registered for dashboard', [
            'total_layouts' => count($layouts)
        ]);
    }

    /**
     * Register only used layouts (for frontend)
     */
    protected function registerUsedLayouts()
    {
        global $post;

        if (!$post) {
            return;
        }

        $usedLayouts = LayoutRegistry::getUsedLayouts($post->ID);

        foreach ($usedLayouts as $layoutName) {
            $config = LayoutRegistry::getLayout($layoutName);
            if ($config) {
                $this->registerLayoutBlock($layoutName, $config);
            }
        }

        Logger::debug('Used layouts registered for frontend', [
            'used_layouts' => $usedLayouts,
            'post_id' => $post->ID
        ]);
    }

    /**
     * Register a layout as a Gutenberg block
     *
     * @param string $name Layout name
     * @param array $config Layout configuration
     */
    protected function registerLayoutBlock($name, $config)
    {
        $blockName = "jankx/layout-{$name}";

        $blockConfig = [
            'editor_script' => $config['editor_script'] ?? "jankx-layout-{$name}-editor",
            'editor_style' => $config['editor_style'] ?? "jankx-layout-{$name}-editor",
            'style' => $config['style'] ?? "jankx-layout-{$name}",
            'render_callback' => $config['render_callback'] ?? [$this, "renderLayout_{$name}"],
            'attributes' => $config['attributes'] ?? []
        ];

        if (function_exists('register_block_type')) {
            register_block_type($blockName, $blockConfig);
        }

        $this->registeredLayouts[$name] = $config;
    }

    /**
     * Get current context
     *
     * @return string Context name
     */
    protected function getCurrentContext()
    {
        if (is_admin()) {
            return 'dashboard';
        }

        if (wp_doing_ajax()) {
            return 'ajax';
        }

        if (wp_doing_cron()) {
            return 'cron';
        }

        return 'frontend';
    }

    /**
     * Render layout template
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function renderLayout($layoutName, $attributes, $content)
    {
        $layout = LayoutRegistry::getLayout($layoutName);
        if (!$layout) {
            return $content;
        }

        $settings = LayoutRegistry::getLayoutSettings($attributes);
        $partialHydration = $settings['partial_hydration'];

        // Check if this is the first layout (always server render)
        if ($this->isFirstLayout($layoutName)) {
            $partialHydration = false;
        }

        if ($partialHydration) {
            return $this->renderPartialHydrationLayout($layoutName, $settings, $content);
        }

        return $this->renderServerLayout($layoutName, $settings, $content);
    }

    /**
     * Check if this is the first layout in the post
     *
     * @param string $layoutName Layout name
     * @return bool
     */
    protected function isFirstLayout($layoutName)
    {
        global $post;

        if (!$post) {
            return false;
        }

        $content = $post->post_content;
        $firstLayoutMatch = preg_match('/<!-- wp:jankx\/layout-([^ ]+) /', $content, $matches);

        if ($firstLayoutMatch) {
            return $matches[1] === $layoutName;
        }

        return false;
    }

    /**
     * Render layout with server-side rendering
     *
     * @param string $layoutName Layout name
     * @param array $settings Layout settings
     * @param string $content Block content
     * @return string Rendered HTML
     */
    protected function renderServerLayout($layoutName, $settings, $content)
    {
        // Use Layout Template for rendering
        return LayoutTemplate::render($layoutName, $settings, $content);
    }

    /**
     * Render layout with partial hydration (lazy load)
     *
     * @param string $layoutName Layout name
     * @param array $settings Layout settings
     * @param string $content Block content
     * @return string Rendered HTML
     */
    protected function renderPartialHydrationLayout($layoutName, $settings, $content)
    {
        $classes = $this->getLayoutClasses($layoutName, $settings);
        $styles = $this->getLayoutStyles($settings);

        // Create placeholder for lazy loading
        $placeholder = sprintf(
            '<div class="jankx-layout jankx-layout-%s jankx-layout-lazy %s" style="%s" data-layout="%s" data-settings="%s">%s</div>',
            esc_attr($layoutName),
            esc_attr($classes),
            esc_attr($styles),
            esc_attr($layoutName),
            esc_attr(json_encode($settings)),
            '<div class="jankx-layout-placeholder">Loading...</div>'
        );

        return $placeholder;
    }

    /**
     * Get layout CSS classes
     *
     * @param string $layoutName Layout name
     * @param array $settings Layout settings
     * @return string CSS classes
     */
    protected function getLayoutClasses($layoutName, $settings)
    {
        return LayoutOptions::generateClasses($settings);
    }

    /**
     * Get layout CSS styles
     *
     * @param array $settings Layout settings
     * @return string CSS styles
     */
    protected function getLayoutStyles($settings)
    {
        return LayoutOptions::generateStyles($settings);
    }

    /**
     * Get registered layouts
     *
     * @return array Registered layouts
     */
    public function getRegisteredLayouts()
    {
        return $this->registeredLayouts;
    }

    /**
     * Check if layout is registered
     *
     * @param string $name Layout name
     * @return bool
     */
    public function isLayoutRegistered($name)
    {
        return isset($this->registeredLayouts[$name]);
    }
}