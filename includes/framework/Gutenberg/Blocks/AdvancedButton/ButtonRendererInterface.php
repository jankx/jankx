<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Button Renderer Interface
 *
 * Defines the contract for button renderers based on trigger type
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
interface ButtonRendererInterface
{
    /**
     * Render the button element
     *
     * @param array $attributes Block attributes
     * @param string $content Button content (text and inner blocks markup)
     * @param string $classes Button CSS classes
     * @param array $styles Button inline styles
     * @return string Rendered button HTML
     */
    public function render(array $attributes, string $content, string $classes, array $styles): string;
}

