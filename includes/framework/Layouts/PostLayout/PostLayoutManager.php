<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\PostLayout\PostLayoutFactory;
use Jankx\Layouts\PostLayout\PostLayoutDecorator;
use WP_Query;

/**
 * Post Layout Manager
 *
 * Quản lý việc đăng ký và tạo các post layouts
 * Được resolve qua Jankx Application container
 *
 * @package Jankx\Layouts\PostLayout
 */
class PostLayoutManager
{
    /**
     * Singleton instance
     *
     * @var PostLayoutManager|null
     */
    protected static $instance = null;

    /**
     * Factory initialized flag
     *
     * @var bool
     */
    protected static $factoryInitialized = false;

    /**
     * Constructor
     */
    protected function __construct()
    {
        // Initialize factory with default layouts (only once)
        if (!self::$factoryInitialized) {
            PostLayoutFactory::init();
            self::$factoryInitialized = true;
        }
    }

    /**
     * Get singleton instance
     *
     * @return PostLayoutManager
     */
    public static function getInstance(): PostLayoutManager
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Register a custom layout
     *
     * @param string $name Layout name
     * @param string $class Layout class name
     * @return void
     */
    public function registerLayout(string $name, string $class): void
    {
        PostLayoutFactory::register($name, $class);
    }

    /**
     * Get all registered layouts
     *
     * @param array $args Query args
     * @return array
     */
    public function getLayouts(array $args = []): array
    {
        $field = $args['field'] ?? 'all';
        $layouts = PostLayoutFactory::getRegisteredLayouts();

        if ($field === 'names') {
            return array_keys($layouts);
        }

        if ($field === 'classes') {
            return array_values($layouts);
        }

        // Return full array with name => class mapping
        if ($field === 'all') {
            $result = [];
            foreach ($layouts as $name => $class) {
                try {
                    $instance = new $class();

                    // Verify instance implements interface
                    if ($instance instanceof PostLayoutInterface) {
                        $result[] = [
                            'name' => $name,
                            'title' => $instance->getTitle(),
                            'class' => $class,
                            'supportedOptions' => $instance->getSupportedOptions(),
                            'readOnlyOptions' => $instance->getReadOnlyOptions(),
                        ];
                    }
                } catch (\Exception $e) {
                    // Skip layouts that can't be instantiated
                    continue;
                }
            }
            return $result;
        }

        return $layouts;
    }

    /**
     * Get layout instance by name
     *
     * @param string $layoutName
     * @return PostLayoutInterface|null
     */
    public function getLayout(string $layoutName): ?PostLayoutInterface
    {
        try {
            $layout = PostLayoutFactory::create($layoutName);
            return $layout instanceof PostLayoutInterface ? $layout : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Create layout instance
     *
     * @param string $layoutName
     * @param array $attributes Block attributes
     * @return PostLayoutDecorator
     */
    public function createLayout(string $layoutName, array $attributes = []): PostLayoutDecorator
    {
        // Create layout via factory
        $layout = PostLayoutFactory::create($layoutName);

        // Wrap in decorator
        $decorator = new PostLayoutDecorator($layout);

        // Set attributes if provided
        if (!empty($attributes)) {
            $decorator->withAttributes($attributes);
        }

        return $decorator;
    }

    /**
     * Render layout with query
     *
     * @param string $layoutName
     * @param array $attributes
     * @return string
     */
    public function render(string $layoutName, array $attributes): string
    {
        try {
            // Create layout
            $decorator = $this->createLayout($layoutName, $attributes);

            // Build and set query
            $query = $decorator->buildQuery($attributes);
            $decorator->withQuery($query);

            // Render
            return $decorator->render();
        } catch (\Exception $e) {
            return sprintf(
                '<div class="post-layout-error">%s</div>',
                esc_html($e->getMessage())
            );
        }
    }

    /**
     * Render preview data cho Gutenberg editor
     *
     * @param string $layoutName
     * @param array $attributes
     * @return array
     */
    public function renderPreview(string $layoutName, array $attributes = []): array
    {
        try {
            $decorator = $this->createLayout($layoutName, $attributes);
            return $decorator->renderPreview();
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get supported layouts as JSON for JavaScript
     *
     * @return string JSON string
     */
    public function getSupportedLayoutsJson(): string
    {
        $layouts = $this->getLayouts(['field' => 'all']);
        return wp_json_encode($layouts, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
    }

    /**
     * Check if layout exists
     *
     * @param string $layoutName
     * @return bool
     */
    public function hasLayout(string $layoutName): bool
    {
        return PostLayoutFactory::hasLayout($layoutName);
    }

    /**
     * Get layout options
     *
     * @param string $layoutName
     * @return array
     */
    public function getLayoutOptions(string $layoutName): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = PostLayoutFactory::create($layoutName);
        return $layout->getSupportedOptions();
    }
}