<?php

namespace Jankx\Gutenberg\Blocks\AdvancedImageBox;

use Jankx\Foundation\Application;

/**
 * Registry for Advanced Image Box Presets
 */
class PresetRegistry
{
    protected static $presets = [];
    protected static $initialized = false;

    /**
     * Register a preset
     *
     * @param PresetInterface|string $preset Preset instance or class name
     * @return void
     */
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

    /**
     * Get all registered presets
     *
     * @return PresetInterface[]
     */
    public static function getAll(): array
    {
        self::initialize();
        return self::$presets;
    }

    /**
     * Get preset by ID
     *
     * @param string $id Preset ID
     * @return PresetInterface|null
     */
    public static function get(string $id): ?PresetInterface
    {
        self::initialize();
        return self::$presets[$id] ?? null;
    }

    /**
     * Get presets data for JavaScript
     *
     * @return array
     */
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

    /**
     * Initialize presets (load default presets)
     *
     * @return void
     */
    protected static function initialize(): void
    {
        if (self::$initialized) {
            return;
        }

        // Allow themes/plugins to register presets
        do_action('jankx/advanced-image-box/register-presets', self::class);

        self::$initialized = true;
    }

    /**
     * Render preset CSS
     *
     * @param string $presetId Preset ID
     * @param array $attributes Block attributes
     * @param array $options Preset options
     * @return string
     */
    public static function renderPresetCSS(string $presetId, array $attributes, array $options = []): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return '';
        }

        return $preset->renderCSS($attributes, $options);
    }

    /**
     * Render preset SVG mask
     *
     * @param string $presetId Preset ID
     * @param array $attributes Block attributes
     * @param array $options Preset options
     * @return string
     */
    public static function renderPresetSVGMask(string $presetId, array $attributes, array $options = []): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return '';
        }

        return $preset->renderSVGMask($attributes, $options);
    }

    /**
     * Render preset markup
     *
     * @param string $presetId Preset ID
     * @param array $attributes Block attributes
     * @param array $options Preset options
     * @param string $content Inner blocks content
     * @return string
     */
    public static function renderPresetMarkup(string $presetId, array $attributes, array $options = [], string $content = ''): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return $content;
        }

        return $preset->renderMarkup($attributes, $options, $content);
    }

    /**
     * Get editor CSS for all presets (for inline styles in editor)
     *
     * @param string $presetId Preset ID
     * @param array $attributes Block attributes
     * @param array $options Preset options
     * @return string CSS code for editor
     */
    public static function getEditorCSS(string $presetId, array $attributes, array $options = []): string
    {
        $preset = self::get($presetId);
        if (!$preset) {
            return '';
        }

        return $preset->renderCSS($attributes, $options);
    }
}

