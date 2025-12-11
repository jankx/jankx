<?php

namespace Jankx\Gutenberg\Blocks\AdvancedImageBox;

/**
 * Interface for Advanced Image Box Presets
 *
 * All presets must implement this interface to be registered
 */
interface PresetInterface
{
    /**
     * Get preset ID (unique identifier)
     *
     * @return string
     */
    public function getId(): string;

    /**
     * Get preset name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Get preset label (display name)
     *
     * @return string
     */
    public function getLabel(): string;

    /**
     * Get preset description
     *
     * @return string
     */
    public function getDescription(): string;

    /**
     * Get mask type: 'css' or 'svg'
     *
     * @return string
     */
    public function getMaskType(): string;

    /**
     * Get preset options definition
     *
     * @return array Array of option definitions
     */
    public function getOptions(): array;

    /**
     * Check if preset requires inner blocks
     *
     * @return bool
     */
    public function requiresInnerBlocks(): bool;

    /**
     * Get inner blocks template (if required)
     *
     * @return array|null
     */
    public function getInnerBlocksTemplate(): ?array;

    /**
     * Get CSS classes to apply to the block
     *
     * @return array
     */
    public function getClasses(): array;

    /**
     * Render CSS for the preset
     *
     * @param array $attributes Block attributes
     * @param array $options Preset options values
     * @return string CSS code
     */
    public function renderCSS(array $attributes, array $options = []): string;

    /**
     * Render SVG mask (if maskType is 'svg')
     *
     * @param array $attributes Block attributes
     * @param array $options Preset options values
     * @return string SVG code or empty string
     */
    public function renderSVGMask(array $attributes, array $options = []): string;

    /**
     * Render additional HTML markup
     *
     * @param array $attributes Block attributes
     * @param array $options Preset options values
     * @param string $content Inner blocks content
     * @return string HTML markup
     */
    public function renderMarkup(array $attributes, array $options = [], string $content = ''): string;

    /**
     * Get JavaScript code (if needed)
     *
     * @return string JavaScript code or empty string
     */
    public function getJavaScript(): string;
}

