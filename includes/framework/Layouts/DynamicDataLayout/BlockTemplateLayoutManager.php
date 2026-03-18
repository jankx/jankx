<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutFactory;

class BlockTemplateLayoutManager
{
    protected static $instance = null;
    protected $layouts = [];

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Set the layout manager instance (useful for testing)
     *
     * @param BlockTemplateLayoutManager|null $instance
     * @return void
     */
    public static function setInstance(?self $instance): void
    {
        self::$instance = $instance;
    }

    private function __construct()
    {
        BlockTemplateLayoutFactory::init();
        $this->layouts = BlockTemplateLayoutFactory::getRegisteredLayouts();
    }

    public function createLayout(string $layoutName): BlockTemplateLayoutInterface
    {
        return BlockTemplateLayoutFactory::create($layoutName);
    }

    public function getAvailableLayouts(): array
    {
        return $this->layouts;
    }

    public function getLayoutNames(): array
    {
        return BlockTemplateLayoutFactory::getLayoutNames();
    }

    public function hasLayout(string $layoutName): bool
    {
        return BlockTemplateLayoutFactory::hasLayout($layoutName);
    }

    public function registerLayout(string $name, string $class): void
    {
        BlockTemplateLayoutFactory::register($name, $class);
        $this->layouts = BlockTemplateLayoutFactory::getRegisteredLayouts();
    }

    public function getLayoutOptions(string $layoutName): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = $this->createLayout($layoutName);
        return $layout->getSupportedOptions();
    }

    public function getLayoutSettingsDefinition(string $layoutName): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = $this->createLayout($layoutName);
        return $layout->getSettingsDefinition();
    }

    public function renderLayout(string $layoutName, array $options = [], $query = null): string
    {
        if (!$this->hasLayout($layoutName)) {
            return '';
        }

        $layout = $this->createLayout($layoutName);
        $layout->setOptions($options);

        if ($query) {
            $layout->setQuery($query);
        }

        return $layout->render();
    }

    public function renderLayoutPreview(string $layoutName, array $options = []): array
    {
        if (!$this->hasLayout($layoutName)) {
            return [];
        }

        $layout = $this->createLayout($layoutName);
        $layout->setOptions($options);

        return $layout->renderPreview();
    }

    public function getLayoutsForPostType(string $postType): array
    {
        // Return all available layouts for BlockTemplate (they work with any post type)
        return $this->getAvailableLayouts();
    }

    public function getCommonLayouts(): array
    {
        // Return common layouts that work well with most content
        $commonLayouts = ['grid', 'list', 'card', 'carousel', 'masonry'];
        $availableLayouts = $this->getAvailableLayouts();
        
        return array_intersect_key($availableLayouts, array_flip($commonLayouts));
    }
}
