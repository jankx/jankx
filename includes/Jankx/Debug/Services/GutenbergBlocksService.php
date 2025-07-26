<?php

namespace Jankx\Debug\Services;

use Jankx\Services\BlockParserService;
use Jankx\Facades\Logger;

/**
 * Gutenberg Blocks Service
 *
 * Service for handling Gutenberg blocks debug information
 *
 * @package Jankx\Debug\Services
 * @since 2.0.1
 */
class GutenbergBlocksService
{
    /**
     * @var array
     * @since 2.0.1
     */
    private $blocksInfo = [];

    /**
     * Capture Gutenberg blocks information
     *
     * @since 2.0.1
     */
    public function captureInfo(): void
    {
        $this->blocksInfo = [
            'total_blocks' => 0,
            'block_types' => [],
            'is_gutenberg_editor' => false,
            'is_gutenberg_frontend' => false
        ];

        // Check editor mode
        if ($this->isGutenbergEditor()) {
            $this->blocksInfo['is_gutenberg_editor'] = true;
        }

        // Parse blocks based on context
        if (is_admin()) {
            // For admin/backend, parse at admin_enqueue_scripts hook
            add_action('admin_enqueue_scripts', [$this, 'parseBlocksAtAdminEnqueue'], 999);
        } else {
            // For frontend, parse at wp_footer hook
            add_action('wp_footer', [$this, 'parseBlocksAtWpFooter'], 999);
        }
    }

    /**
     * Parse blocks at admin_enqueue_scripts hook (for admin/backend)
     *
     * @since 2.0.1
     */
    public function parseBlocksAtAdminEnqueue(): void
    {
        // Check frontend content
        if ($this->hasGutenbergContent()) {
            $this->blocksInfo['is_gutenberg_frontend'] = true;
            $this->blocksInfo = array_merge($this->blocksInfo, $this->parseBlocks());
        }

        // Check template parts
        $templateParts = $this->getTemplateParts();
        if ($templateParts > 0) {
            $this->blocksInfo['template_parts'] = $templateParts;
        }
    }

    /**
     * Parse blocks at wp_footer hook
     *
     * @since 2.0.1
     */
    public function parseBlocksAtWpFooter(): void
    {
        // Check frontend content
        if ($this->hasGutenbergContent()) {
            $this->blocksInfo['is_gutenberg_frontend'] = true;
            $this->blocksInfo = array_merge($this->blocksInfo, $this->parseBlocks());
        }

        // Check template parts
        $templateParts = $this->getTemplateParts();
        if ($templateParts > 0) {
            $this->blocksInfo['template_parts'] = $templateParts;
        }
    }



    /**
     * Get Gutenberg blocks information
     *
     * @return array
     * @since 2.0.1
     */
    public function getBlocksInfo(): array
    {
        return $this->blocksInfo;
    }

    /**
     * Check if currently in Gutenberg editor
     *
     * @return bool
     * @since 2.0.1
     */
    private function isGutenbergEditor(): bool
    {
        return is_admin() && $this->isBlockEditor();
    }

    /**
     * Check if currently in block editor
     *
     * @return bool
     * @since 2.0.1
     */
    private function isBlockEditor(): bool
    {
        if (!function_exists('get_current_screen')) {
            return false;
        }

        $screen = get_current_screen();
        return $screen && method_exists($screen, 'is_block_editor') && $screen->is_block_editor();
    }

    /**
     * Check if current content has Gutenberg blocks
     *
     * @return bool
     * @since 2.0.1
     */
    private function hasGutenbergContent(): bool
    {
        // Always try to parse blocks and check the result
        $stats = is_admin()
            ? BlockParserService::getBlockStatsAtAdminEnqueue()
            : BlockParserService::getBlockStatsAtWpFooter();

        // If we found any blocks, return true
        if ($stats['total_blocks'] > 0) {
            return true;
        }

        // Additional checks for block theme
        if (function_exists('wp_is_block_theme') && wp_is_block_theme()) {
            return true;
        }

        // Check for template parts
        if ($this->getTemplateParts() > 0) {
            return true;
        }

        // Check widgets
        if ($this->hasWidgetBlocks()) {
            return true;
        }

        return false;
    }

    /**
     * Check if theme templates have blocks
     *
     * @return bool
     * @since 2.0.1
     */
    private function hasThemeTemplateBlocks(): bool
    {
        // Check if we're using block theme
        if (function_exists('wp_is_block_theme') && wp_is_block_theme()) {
            return true;
        }

        // Check for template files with blocks
        $templateFiles = [
            'header.php',
            'footer.php',
            'sidebar.php',
            'index.php',
            'single.php',
            'page.php'
        ];

        foreach ($templateFiles as $template) {
            $templatePath = get_template_directory() . '/' . $template;
            if (file_exists($templatePath)) {
                $templateContent = file_get_contents($templatePath);
                if (has_blocks($templateContent)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if widgets have blocks
     *
     * @return bool
     * @since 2.0.1
     */
    private function hasWidgetBlocks(): bool
    {
        if (!function_exists('is_active_sidebar')) {
            return false;
        }

        $widgetAreas = ['sidebar-1', 'footer-1', 'footer-2', 'footer-3'];
        foreach ($widgetAreas as $area) {
            if (is_active_sidebar($area)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Parse blocks from content using BlockParserService
     *
     * @return array
     * @since 2.0.1
     */
    private function parseBlocks(): array
    {
        // Use BlockParserService for comprehensive block parsing
        $stats = is_admin()
            ? BlockParserService::getBlockStatsAtAdminEnqueue()
            : BlockParserService::getBlockStatsAtWpFooter();

        // Debug logging
        Logger::debug('GutenbergBlocksService Debug', [
            'context' => is_admin() ? 'Admin' : 'Frontend',
            'total_blocks' => $stats['total_blocks'],
            'block_types' => $stats['block_types'],
            'block_names' => $stats['block_names'] ?? []
        ]);

        return [
            'total_blocks' => $stats['total_blocks'],
            'block_types' => $stats['block_types']
        ];
    }

    /**
     * Get template parts count
     *
     * @return int
     * @since 2.0.1
     */
    private function getTemplateParts(): int
    {
        if (!function_exists('get_block_template_parts')) {
            return 0;
        }

        $templateParts = get_block_template_parts();
        return is_array($templateParts) ? count($templateParts) : 0;
    }
}