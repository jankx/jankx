<?php

namespace Jankx\Layouts\AdvancedImageBox;

class PresetRegistry
{
    protected static $presets = [];
    protected static $initialized = false;

    public static function register($preset): void
    {
        if (is_string($preset)) {
            if (!class_exists($preset)) {
                return;
            }
            $preset = new $preset();
        }
        if (!$preset instanceof PresetInterface) {
            return;
        }
        $id = $preset->getId();
        if (empty($id)) {
            return;
        }
        self::$presets[$id] = $preset;
    }

    public static function getAll(): array
    {
        self::initialize();
        return self::$presets;
    }

    public static function get(string $id): ?PresetInterface
    {
        self::initialize();
        return self::$presets[$id] ?? null;
    }

    public static function getPresetsData(): array
    {
        self::initialize();
        $data = [];
        foreach (self::$presets as $id => $preset) {
            $data[$id] = [
                'id' => $preset->getId(),
                'name' => $preset->getName(),
                'label' => $preset->getLabel(),
                'description' => $preset->getDescription(),
                'maskType' => $preset->getMaskType(),
                'options' => $preset->getOptions(),
                'requiresInnerBlocks' => $preset->requiresInnerBlocks(),
                'innerBlocksTemplate' => $preset->getInnerBlocksTemplate(),
                'className' => implode(' ', $preset->getClasses()),
            ];
        }
        return $data;
    }

    protected static function initialize(): void
    {
        if (self::$initialized) {
            return;
        }
        do_action('jankx/advanced-image-box/register-presets', self::class);
        self::$initialized = true;
    }

    public static function renderPresetCSS(string $presetId, array $attributes, array $options = []): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return '';
        }
        return $preset->renderCSS($attributes, $options);
    }

    public static function renderPresetSVGMask(string $presetId, array $attributes, array $options = []): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return '';
        }
        return $preset->renderSVGMask($attributes, $options);
    }

    public static function renderPresetMarkup(string $presetId, array $attributes, array $options = [], string $content = ''): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return $content;
        }
        return $preset->renderMarkup($attributes, $options, $content);
    }

    public static function getEditorCSS(string $presetId, array $attributes, array $options = []): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return '';
        }
        return $preset->renderCSS($attributes, $options);
    }
}

