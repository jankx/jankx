<?php

namespace Jankx\Adapters;

/**
 * WordPress Adapter for Jankx Framework
 *
 * Provides WordPress-specific functionality and adaptations.
 *
 * @package Jankx\Adapters
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 */
class WordPressAdapter
{
    /**
     * Check if currently in admin area
     *
     * @return bool
     * @since 2.0.0
     */
    public function isAdmin(): bool
    {
        return \is_admin();
    }

    /**
     * Check if currently in block editor
     *
     * @return bool
     * @since 2.0.0
     */
    public function isBlockEditor(): bool
    {
        if (!function_exists('get_current_screen')) {
            return false;
        }

        $screen = get_current_screen();
        return $screen && method_exists($screen, 'is_block_editor') && $screen->is_block_editor();
    }

    /**
     * Check if content has blocks
     *
     * @param string $content
     * @return bool
     * @since 2.0.0
     */
    public function hasBlocks(string $content): bool
    {
        return \has_blocks($content);
    }

    /**
     * Get current post content
     *
     * @return string
     * @since 2.0.0
     */
    public function getCurrentContent(): string
    {
        return \get_the_content() ?: '';
    }

    /**
     * Get current post excerpt
     *
     * @return string
     * @since 2.0.0
     */
    public function getCurrentExcerpt(): string
    {
        return \get_the_excerpt() ?: '';
    }

    /**
     * Get template parts count
     *
     * @return int
     * @since 2.0.0
     */
    public function getTemplatePartsCount(): int
    {
        if (!function_exists('get_block_template_parts')) {
            return 0;
        }

        $templateParts = get_block_template_parts();
        return is_array($templateParts) ? count($templateParts) : 0;
    }
}