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
 * @since 2.0.0
 */
class GutenbergBlocksService
{
    /**
     * @var array
     * @since 2.0.0
     */
    private $blocksInfo = [];

    /**
     * Capture Gutenberg blocks information
     *
     * @since 2.0.0
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

        // Parse blocks directly instead of using hooks
        $this->parseBlocksDirectly();
    }

    /**
     * Parse blocks directly
     *
     * @since 2.0.0
     */
    private function parseBlocksDirectly(): void
    {
        // Check frontend content
        if ($this->hasGutenbergContent()) {
            $this->blocksInfo['is_gutenberg_frontend'] = true;
            $parsedBlocks = $this->parseBlocks();
            $this->blocksInfo = array_merge($this->blocksInfo, $parsedBlocks);

            Logger::debug('GutenbergBlocksService: Parsed blocks from content', $parsedBlocks);
        } else {
            Logger::debug('GutenbergBlocksService: No Gutenberg content found');
        }

        // Check template parts
        $templateParts = $this->getTemplateParts();
        if ($templateParts > 0) {
            $this->blocksInfo['template_parts'] = $templateParts;
            Logger::debug('GutenbergBlocksService: Found template parts', ['count' => $templateParts]);
        }

        // Parse all content blocks from database
        $this->parseAllContentBlocks();

        // Check if this is a block theme (only as fallback if no real blocks found)
        if (function_exists('wp_is_block_theme') && wp_is_block_theme() && $this->blocksInfo['total_blocks'] === 0) {
            $this->blocksInfo['is_block_theme'] = true;
            $this->blocksInfo['total_blocks'] = 1;
            $this->blocksInfo['block_types']['core/theme'] = 1;
            Logger::debug('GutenbergBlocksService: Block theme detected (fallback)');
        }

        // If still no blocks found, check for any content
        if ($this->blocksInfo['total_blocks'] === 0) {
            $content = $this->getCurrentContent();
            if (!empty($content)) {
                Logger::debug('GutenbergBlocksService: Found content but no blocks', [
                    'content_length' => strlen($content),
                    'content_preview' => substr($content, 0, 100)
                ]);
            } else {
                Logger::debug('GutenbergBlocksService: No content found');
            }
        }
    }

    /**
     * Parse blocks at admin_enqueue_scripts hook (for admin/backend)
     *
     * @since 2.0.0
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
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public function getBlocksInfo(): array
    {
        // Auto-capture info if not already captured
        if (empty($this->blocksInfo) || $this->blocksInfo['total_blocks'] === 0) {
            $this->captureInfo();
        }

        return $this->blocksInfo;
    }

    /**
     * Force refresh blocks info
     *
     * @return array
     * @since 2.0.0
     */
    public function forceRefreshBlocksInfo(): array
    {
        // Clear existing info
        $this->blocksInfo = [];

        // Re-capture info
        $this->captureInfo();

        return $this->blocksInfo;
    }

    /**
     * Check if currently in Gutenberg editor
     *
     * @return bool
     * @since 2.0.0
     */
    private function isGutenbergEditor(): bool
    {
        return is_admin() && $this->isBlockEditor();
    }

    /**
     * Check if currently in block editor
     *
     * @return bool
     * @since 2.0.0
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
     * @since 2.0.0
     */
    private function hasGutenbergContent(): bool
    {
        // Check current post content
        if (is_singular()) {
            global $post;
            if ($post && !empty($post->post_content) && has_blocks($post->post_content)) {
                return true;
            }
        }

        // Check content from the loop
        if (have_posts()) {
            while (have_posts()) {
                the_post();
                $content = get_the_content();
                rewind_posts();
                if (!empty($content) && has_blocks($content)) {
                    return true;
                }
            }
        }

        // Check global $wp_query
        global $wp_query;
        if ($wp_query && $wp_query->have_posts()) {
            $wp_query->the_post();
            $content = get_the_content();
            $wp_query->rewind_posts();
            if (!empty($content) && has_blocks($content)) {
                return true;
            }
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
     * @since 2.0.0
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
     * @since 2.0.0
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
     * Parse blocks from content
     *
     * @return array
     * @since 2.0.0
     */
    private function parseBlocks(): array
    {
        $content = $this->getCurrentContent();

        if (empty($content) || !has_blocks($content)) {
            return [
                'total_blocks' => 0,
                'block_types' => []
            ];
        }

        $blocks = parse_blocks($content);
        $blockTypes = [];
        $totalBlocks = 0;

        foreach ($blocks as $block) {
            if (!empty($block['blockName'])) {
                $blockName = $block['blockName'];
                if (!isset($blockTypes[$blockName])) {
                    $blockTypes[$blockName] = 0;
                }
                $blockTypes[$blockName]++;
                $totalBlocks++;
            }

            // Count nested blocks
            if (!empty($block['innerBlocks'])) {
                $totalBlocks += $this->countNestedBlocks($block['innerBlocks']);
            }
        }

        return [
            'total_blocks' => $totalBlocks,
            'block_types' => $blockTypes
        ];
    }

    /**
     * Count nested blocks recursively
     *
     * @param array $blocks
     * @return int
     * @since 2.0.0
     */
    private function countNestedBlocks(array $blocks): int
    {
        $count = 0;

        foreach ($blocks as $block) {
            if (!empty($block['blockName'])) {
                $count++;
            }

            if (!empty($block['innerBlocks'])) {
                $count += $this->countNestedBlocks($block['innerBlocks']);
            }
        }

        return $count;
    }

    /**
     * Get current content
     *
     * @return string
     * @since 2.0.0
     */
    private function getCurrentContent(): string
    {
        // Try to get current post content
        if (is_singular()) {
            global $post;
            if ($post && !empty($post->post_content)) {
                return $post->post_content;
            }
        }

        // Try to get content from the loop
        if (have_posts()) {
            while (have_posts()) {
                the_post();
                $content = get_the_content();
                rewind_posts();
                return $content;
            }
        }

        // Try to get content from global $wp_query
        global $wp_query;
        if ($wp_query && $wp_query->have_posts()) {
            $wp_query->the_post();
            $content = get_the_content();
            $wp_query->rewind_posts();
            return $content;
        }

        return '';
    }

    /**
     * Get template parts count
     *
     * @return int
     * @since 2.0.0
     */
    private function getTemplateParts(): int
    {
        if (!function_exists('get_block_template_parts')) {
            return 0;
        }

        $templateParts = get_block_template_parts();
        return is_array($templateParts) ? count($templateParts) : 0;
    }

    /**
     * Parse current page/post blocks
     *
     * @since 2.0.0
     */
    private function parseAllContentBlocks(): void
    {
        // Get current queried object
        $queriedObject = get_queried_object();

        if (!$queriedObject) {
            Logger::debug('GutenbergBlocksService: No queried object found');
            return;
        }

        $content = '';
        $postType = '';

        // Get content based on queried object type
        if ($queriedObject instanceof WP_Post) {
            $content = $queriedObject->post_content;
            $postType = $queriedObject->post_type;
        } elseif ($queriedObject instanceof WP_Term) {
            // For taxonomy pages, get description
            $content = $queriedObject->description;
            $postType = 'taxonomy';
        } elseif ($queriedObject instanceof WP_User) {
            // For author pages, get bio
            $content = $queriedObject->description;
            $postType = 'author';
        }

        if (empty($content)) {
            Logger::debug('GutenbergBlocksService: No content found in queried object', [
                'object_type' => get_class($queriedObject),
                'post_type' => $postType
            ]);
            return;
        }

        // Use GutenbergBlockExtractor for high performance
        $extractor = new \Jankx\Parsers\GutenbergBlockExtractor($content);
        $blockStats = $extractor->getBlockStats();

        if (!empty($blockStats['block_types'])) {
            $this->blocksInfo['total_blocks'] = $blockStats['total_blocks'];
            $this->blocksInfo['block_types'] = $blockStats['block_types'];
            $this->blocksInfo['unique_block_types'] = $blockStats['unique_block_types'];

            Logger::debug('GutenbergBlocksService: Parsed current page blocks', [
                'total_blocks' => $blockStats['total_blocks'],
                'unique_block_types' => $blockStats['unique_block_types'],
                'block_types' => $blockStats['block_types'],
                'post_type' => $postType,
                'object_type' => get_class($queriedObject)
            ]);
        } else {
            Logger::debug('GutenbergBlocksService: No blocks found in current page content');
        }
    }
}