<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutFactory;

class ViewLayoutManager
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

    private function __construct()
    {
        ViewLayoutFactory::init();
    }

    public function createLayout(string $layoutName): ViewLayoutInterface
    {
        return ViewLayoutFactory::create($layoutName);
    }

    public function getAvailableLayouts(): array
    {
        return $this->layouts = ViewLayoutFactory::getRegisteredLayouts();
    }

    public function getLayoutNames(): array
    {
        return ViewLayoutFactory::getLayoutNames();
    }

    public function hasLayout(string $layoutName): bool
    {
        return ViewLayoutFactory::hasLayout($layoutName);
    }

    public function registerLayout(string $name, string $class): void
    {
        ViewLayoutFactory::register($name, $class);
        $this->layouts = ViewLayoutFactory::getRegisteredLayouts();
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
        $layouts = [];
        foreach ($this->getLayoutNames() as $name) {
            try {
                $layout = $this->createLayout($name);
                $layouts[] = [
                    'name' => $layout->getName(),
                    'title' => $layout->getTitle(),
                    'postType' => $postType,
                    'supportedOptions' => $layout->getSupportedOptions(),
                    'readOnlyOptions' => $layout->getReadOnlyOptions(),
                    'settingsDefinition' => $layout->getSettingsDefinition(),
                ];
            } catch (\Throwable $e) {
                $layouts[] = [
                    'name' => $name,
                    'title' => ucfirst($name),
                    'postType' => $postType,
                    'supportedOptions' => [],
                    'readOnlyOptions' => [],
                    'settingsDefinition' => [],
                ];
            }
        }
        return $layouts;
    }

    public function getCommonLayouts(): array
    {
        $common = ['grid', 'list', 'card'];
        $layouts = [];
        foreach ($common as $name) {
            if (!ViewLayoutFactory::hasLayout($name)) {
                continue;
            }
            try {
                $layout = $this->createLayout($name);
                $layouts[] = [
                    'name' => $layout->getName(),
                    'title' => $layout->getTitle(),
                    'postType' => 'common',
                    'supportedOptions' => $layout->getSupportedOptions(),
                    'readOnlyOptions' => $layout->getReadOnlyOptions(),
                    'settingsDefinition' => $layout->getSettingsDefinition(),
                ];
            } catch (\Throwable $e) {
                $layouts[] = [
                    'name' => $name,
                    'title' => ucfirst($name),
                    'postType' => 'common',
                    'supportedOptions' => [],
                    'readOnlyOptions' => [],
                    'settingsDefinition' => [],
                ];
            }
        }
        return $layouts;
    }
}
