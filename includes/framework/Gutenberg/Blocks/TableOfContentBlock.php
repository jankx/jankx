<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Table of Content Block
 *
 * Automatically generates a table of content from heading blocks in the post.
 * Supports expand/collapse functionality and multiple display options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TableOfContentBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/table-of-content';

    /**
     * Headings data extracted from content
     *
     * @var array
     */
    protected $headings = [];

    /**
     * Track generated anchors for headings
     * Key: heading text hash (level:text), Value: generated anchor
     *
     * @var array
     */
    protected $headingAnchors = [];

    /**
     * Track anchor counts to handle duplicates
     *
     * @var array
     */
    protected $anchorCounts = [];

    /**
     * Initialize block filters and hooks
     * Called automatically by GutenbergService
     *
     * @return void
     */
    public function init()
    {
        // Add filter to core/heading blocks to ensure they have anchor IDs
        // Only add filter when post contains table-of-content block
        add_filter('render_block_core/heading', [$this, 'filterHeadingBlock'], 10, 2);
    }

    /**
     * Filter core/heading blocks to ensure they have anchor IDs
     *
     * @param string $block_content Block HTML content
     * @param array $block Block data
     * @return string Modified block content
     */
    public function filterHeadingBlock($block_content, $block)
    {
        if (empty($block_content)) {
            return $block_content;
        }

        // Check if anchor already exists in rendered content
        if (preg_match('/id=["\']([^"\']+)["\']/', $block_content)) {
            return $block_content;
        }

        // Extract heading text and level
        preg_match('/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/i', $block_content, $matches);
        if (empty($matches[2])) {
            return $block_content;
        }

        $level = (int) $matches[1];
        $heading_text = strip_tags($matches[2]);
        $heading_text = trim($heading_text);

        // Create unique key for this heading
        $heading_key = $level . ':' . $heading_text;

        // Check if we have pre-generated anchor for this heading
        $anchor = '';
        if (isset($this->headingAnchors[$heading_key])) {
            $anchor = $this->headingAnchors[$heading_key];
        }
        // Check if block has anchor attribute
        elseif (!empty($block['attrs']['anchor'])) {
            $anchor = $block['attrs']['anchor'];
        }
        // Generate new anchor
        else {
            $anchor = $this->generateAnchor($heading_text);
            $this->headingAnchors[$heading_key] = $anchor;
        }

        // Add anchor to heading
        $block_content = preg_replace(
            '/(<h[1-6])([^>]*)(>)/i',
            '$1$2 id="' . esc_attr($anchor) . '"$3',
            $block_content,
            1
        );

        return $block_content;
    }

    /**
     * Generate anchor from heading text
     *
     * @param string $text Heading text
     * @return string Anchor ID
     */
    protected function generateAnchor($text)
    {
        // Convert to lowercase
        $anchor = strtolower($text);

        // Remove Vietnamese diacritics
        $anchor = $this->removeVietnameseDiacritics($anchor);

        // Replace spaces and special chars with hyphens
        $anchor = preg_replace('/[^a-z0-9]+/', '-', $anchor);

        // Remove leading/trailing hyphens
        $anchor = trim($anchor, '-');

        // Handle duplicates
        if (isset($this->anchorCounts[$anchor])) {
            $this->anchorCounts[$anchor]++;
            $anchor = $anchor . '-' . $this->anchorCounts[$anchor];
        } else {
            $this->anchorCounts[$anchor] = 0;
        }

        return $anchor;
    }

    /**
     * Remove Vietnamese diacritics from string
     *
     * @param string $str Input string
     * @return string String without diacritics
     */
    protected function removeVietnameseDiacritics($str)
    {
        $diacritics = [
            'à' => 'a', 'á' => 'a', 'ả' => 'a', 'ã' => 'a', 'ạ' => 'a',
            'ă' => 'a', 'ằ' => 'a', 'ắ' => 'a', 'ẳ' => 'a', 'ẵ' => 'a', 'ặ' => 'a',
            'â' => 'a', 'ầ' => 'a', 'ấ' => 'a', 'ẩ' => 'a', 'ẫ' => 'a', 'ậ' => 'a',
            'đ' => 'd',
            'è' => 'e', 'é' => 'e', 'ẻ' => 'e', 'ẽ' => 'e', 'ẹ' => 'e',
            'ê' => 'e', 'ề' => 'e', 'ế' => 'e', 'ể' => 'e', 'ễ' => 'e', 'ệ' => 'e',
            'ì' => 'i', 'í' => 'i', 'ỉ' => 'i', 'ĩ' => 'i', 'ị' => 'i',
            'ò' => 'o', 'ó' => 'o', 'ỏ' => 'o', 'õ' => 'o', 'ọ' => 'o',
            'ô' => 'o', 'ồ' => 'o', 'ố' => 'o', 'ổ' => 'o', 'ỗ' => 'o', 'ộ' => 'o',
            'ơ' => 'o', 'ờ' => 'o', 'ớ' => 'o', 'ở' => 'o', 'ỡ' => 'o', 'ợ' => 'o',
            'ù' => 'u', 'ú' => 'u', 'ủ' => 'u', 'ũ' => 'u', 'ụ' => 'u',
            'ư' => 'u', 'ừ' => 'u', 'ứ' => 'u', 'ử' => 'u', 'ữ' => 'u', 'ự' => 'u',
            'ỳ' => 'y', 'ý' => 'y', 'ỷ' => 'y', 'ỹ' => 'y', 'ỵ' => 'y',
        ];

        return strtr($str, $diacritics);
    }

    /**
     * Parse blocks and pre-generate heading anchors
     * This ensures consistent IDs between TOC and actual headings
     *
     * @param array $blocks Parsed blocks
     * @param array &$headings Reference to headings array
     * @param int $min_level Minimum heading level
     * @param int $max_level Maximum heading level
     */
    protected function parseBlocksForHeadings($blocks, &$headings, $min_level = 2, $max_level = 6)
    {
        foreach ($blocks as $block) {
            // Skip table-of-content block
            if ($block['blockName'] === 'jankx/table-of-content') {
                continue;
            }

            // Check if this is a heading block
            if ($block['blockName'] === 'core/heading') {
                $level = $block['attrs']['level'] ?? 2;

                // Filter by min/max level
                if ($level < $min_level || $level > $max_level) {
                    continue;
                }

                // Extract heading text
                $text = wp_strip_all_tags($block['innerHTML']);
                $text = trim($text);

                if (!empty($text)) {
                    // Generate or get anchor
                    $anchor = '';
                    if (!empty($block['attrs']['anchor'])) {
                        $anchor = $block['attrs']['anchor'];
                    } else {
                        $anchor = $this->generateAnchor($text);
                    }

                    // Create unique key for this heading
                    $heading_key = $level . ':' . $text;

                    // Store anchor for later use by filterHeadingBlock
                    $this->headingAnchors[$heading_key] = $anchor;

                    // Add to headings list
                    $headings[] = [
                        'id' => $anchor,
                        'text' => $text,
                        'level' => $level,
                        'children' => [],
                        'isExpanded' => false,
                    ];
                }
            }

            // Recursively process inner blocks
            if (!empty($block['innerBlocks'])) {
                $this->parseBlocksForHeadings($block['innerBlocks'], $headings, $min_level, $max_level);
            }
        }
    }

    /**
     * Extract headings from post content
     * Parse blocks first to pre-generate anchors, then build hierarchy
     *
     * @param string $content Post content (raw block markup)
     * @param int $min_level Minimum heading level to include
     * @param int $max_level Maximum heading level to include
     * @return array Headings data
     */
    protected function extractHeadings($content, $min_level = 2, $max_level = 6)
    {
        if (empty($content)) {
            return [];
        }

        // Reset tracking arrays for fresh parse
        $this->headingAnchors = [];
        $this->anchorCounts = [];

        $headings = [];

        // Parse blocks from raw content
        $blocks = parse_blocks($content);

        // Parse blocks and pre-generate all heading anchors
        $this->parseBlocksForHeadings($blocks, $headings, $min_level, $max_level);

        // Build hierarchy from flat list
        return $this->buildHierarchy($headings);
    }


    /**
     * Build hierarchical structure from flat headings array
     *
     * @param array $headings Flat headings array
     * @return array Hierarchical headings array
     */
    protected function buildHierarchy($headings)
    {
        $hierarchy = [];
        $stack = []; // Stack to track parent elements at each level

        foreach ($headings as $heading) {
            $level = $heading['level'];

            // Pop stack until we find the correct parent level
            while (!empty($stack) && end($stack)['level'] >= $level) {
                array_pop($stack);
            }

            if (empty($stack)) {
                // Top level item
                $hierarchy[] = $heading;
                $stack[] = &$hierarchy[count($hierarchy) - 1];
            } else {
                // Child item
                $parent = &$stack[count($stack) - 1];
                $parent['children'][] = $heading;
                $stack[] = &$parent['children'][count($parent['children']) - 1];
            }
        }

        return $hierarchy;
    }

    /**
     * Render TOC list recursively
     *
     * @param array $items TOC items
     * @param string $listing_type 'ul' or 'ol'
     * @param string $expand_icon_type Icon type
     * @param bool $default_expanded Default expand state
     * @param bool $expand_first_item Expand first item
     * @param bool $show_numbers Show numbers
     * @param int $depth Current depth
     * @param bool $is_first_item Is this the first item
     * @return string HTML output
     */
    protected function renderTOCList($items, $listing_type, $expand_icon_type, $default_expanded, $expand_first_item, $show_numbers, $depth = 0, $is_first_item = false)
    {
        if (empty($items)) {
            return '';
        }

        $list_tag = $listing_type === 'ol' ? 'ol' : 'ul';
        $list_class = $depth === 0 ? 'toc-list toc-list--root' : 'toc-list toc-list--level-' . ($depth + 1);

        if ($show_numbers && $depth === 0) {
            $list_class .= ' toc-list--numbered';
        }

        $html = sprintf('<%s class="%s">', $list_tag, esc_attr($list_class));

        foreach ($items as $index => $item) {
            $has_children = !empty($item['children']);
            $is_expanded = $default_expanded || ($is_first_item && $index === 0 && $expand_first_item);

            $item_class = 'toc-item toc-item--level-' . $item['level'];
            $html .= sprintf('<li class="%s">', esc_attr($item_class));

            $html .= '<div class="toc-item__wrapper">';

            // Expand/collapse button
            if ($has_children) {
                $toggle_class = $is_expanded ? 'toc-item__toggle is-expanded' : 'toc-item__toggle is-collapsed';
                $icon = $this->getExpandIcon($expand_icon_type, $is_expanded);

                $html .= sprintf(
                    '<button class="%s" type="button" aria-expanded="%s"><span class="toc-item__icon">%s</span></button>',
                    esc_attr($toggle_class),
                    $is_expanded ? 'true' : 'false',
                    esc_html($icon)
                );
            }

            // Link
            $html .= sprintf(
                '<a href="#%s" class="toc-item__link">%s</a>',
                esc_attr($item['id']),
                esc_html($item['text'])
            );

            $html .= '</div>'; // End wrapper

            // Nested children
            if ($has_children) {
                $child_html = $this->renderTOCList(
                    $item['children'],
                    $listing_type,
                    $expand_icon_type,
                    $default_expanded,
                    $expand_first_item,
                    $show_numbers,
                    $depth + 1,
                    false
                );

                if (!$is_expanded) {
                    $child_html = str_replace('<' . $list_tag, '<' . $list_tag . ' style="display:none"', $child_html);
                }

                $html .= $child_html;
            }

            $html .= '</li>';
        }

        $html .= sprintf('</%s>', $list_tag);

        return $html;
    }

    /**
     * Get expand/collapse icon based on type
     *
     * @param string $type Icon type
     * @param bool $is_expanded Is expanded
     * @return string Icon character
     */
    protected function getExpandIcon($type, $is_expanded)
    {
        switch ($type) {
            case 'chevron':
                return $is_expanded ? '▼' : '▶';
            case 'arrow':
                return $is_expanded ? '↓' : '→';
            case 'caret':
                return $is_expanded ? '▾' : '▸';
            case 'plus-minus':
            default:
                return $is_expanded ? '−' : '+';
        }
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block inner content
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Get attributes
        $listing_type = $attributes['listingType'] ?? 'ul';
        $expand_icon_type = $attributes['expandIconType'] ?? 'plus-minus';
        $default_expanded = $attributes['defaultExpanded'] ?? false;
        $expand_first_item = $attributes['expandFirstItem'] ?? true;
        $show_numbers = $attributes['showNumbers'] ?? false;
        $show_heading = $attributes['showHeading'] ?? true;
        $custom_heading_text = $attributes['customHeadingText'] ?? '';
        $heading_style = $attributes['headingStyle'] ?? 'underline';
        $min_heading_level = $attributes['minHeadingLevel'] ?? 2;
        $max_heading_level = $attributes['maxHeadingLevel'] ?? 6;
        $class_name = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        // Get post content
        global $post;
        $post_content = '';

        if ($post && !empty($post->post_content)) {
            // Use raw content to avoid infinite loop with the_content filter
            // Parse blocks and extract heading blocks directly
            $post_content = $post->post_content;
        }

        // Extract headings from content with min/max level filtering
        $toc_items = $this->extractHeadings($post_content, $min_heading_level, $max_heading_level);

        // If no headings found, show placeholder
        if (empty($toc_items)) {
            return sprintf(
                '<div class="jankx-table-of-content %s"><div class="toc-placeholder"><p>%s</p></div></div>',
                esc_attr($class_name),
                esc_html__('No headings found in the post content.', 'jankx')
            );
        }

        // Build outer wrapper attributes (for data attributes only)
        $outer_attrs = [
            'class' => 'jankx-table-of-content heading-style-' . esc_attr($heading_style),
            'data-default-expanded' => $default_expanded ? 'true' : 'false',
            'data-expand-first-item' => $expand_first_item ? 'true' : 'false',
            'data-expand-icon-type' => $expand_icon_type,
        ];

        if (!empty($anchor)) {
            $outer_attrs['id'] = esc_attr($anchor);
        }

        // Build outer attributes string
        $outer_attrs_string = '';
        foreach ($outer_attrs as $key => $value) {
            $outer_attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        // Build inner wrapper attributes using WordPress block supports
        // This applies background, colors, spacing to .toc-wrapper
        $inner_attrs = [
            'class' => 'toc-wrapper',
        ];

        // Get block wrapper attributes for inner wrapper
        $inner_attrs_string = get_block_wrapper_attributes($inner_attrs);

        // Render TOC
        $toc_html = $this->renderTOCList(
            $toc_items,
            $listing_type,
            $expand_icon_type,
            $default_expanded,
            $expand_first_item,
            $show_numbers,
            0,
            true
        );

        // Determine heading text
        $heading_text = !empty($custom_heading_text) ? $custom_heading_text : __('Table of Contents', 'jankx');

        // Build heading HTML
        $heading_html = '';
        if ($show_heading) {
            $heading_html = sprintf(
                '<div class="toc-header"><h2 class="toc-title">%s</h2></div>',
                esc_html($heading_text)
            );
        }

        return sprintf(
            '<div%s><nav %s aria-label="%s">%s%s</nav></div>',
            $outer_attrs_string,
            $inner_attrs_string,
            esc_attr($heading_text),
            $heading_html,
            $toc_html
        );
    }
}

