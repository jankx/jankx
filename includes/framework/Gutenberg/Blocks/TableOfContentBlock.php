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
     * Track if headings are extracted from HTML (classic editor) or blocks
     *
     * @var bool
     */
    protected $usesHTMLHeadings = false;

    /**
     * Track if the_content filter is already added
     *
     * @var bool
     */
    protected static $contentFilterAdded = false;

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
     * Filter classic editor content to ensure HTML headings have anchor IDs
     * Only processes when headings were extracted from HTML (classic editor)
     *
     * @param string $content Post content HTML
     * @return string Modified content
     */
    public function filterContentHeadings($content)
    {
        if (empty($content)) {
            return $content;
        }

        // Only process if this is classic editor content (has <h tags but no <!-- wp: blocks)
        // and we have generated anchors for HTML headings
        if (!preg_match('/<h[1-6]/i', $content) || preg_match('/<!--\s*wp:/', $content)) {
            return $content;
        }

        // Check if we have anchors generated (from parseHTMLForHeadings)
        // If no anchors, skip processing (headings might come from blocks)
        if (empty($this->headingAnchors)) {
            return $content;
        }

        // Extract all headings from HTML
        preg_match_all('/<h([1-6])([^>]*?)>(.*?)<\/h[1-6]>/is', $content, $matches, PREG_SET_ORDER);
        
        if (!empty($matches)) {
            foreach ($matches as $match) {
                $level = (int) $match[1];
                $attrs = $match[2];
                $heading_text = strip_tags($match[3]);
                $heading_text = trim($heading_text);
                
                if (empty($heading_text)) {
                    continue;
                }

                // Check if already has ID
                if (preg_match('/id=["\']([^"\']+)["\']/', $attrs)) {
                    continue;
                }

                // Generate anchor - use existing if available, otherwise generate new
                $heading_key = $level . ':' . $heading_text;
                $anchor = '';
                
                if (isset($this->headingAnchors[$heading_key])) {
                    $anchor = $this->headingAnchors[$heading_key];
                } else {
                    // Generate new anchor if not found (should not happen if parseHTMLForHeadings ran)
                    $anchor = $this->generateAnchor($heading_text);
                    $this->headingAnchors[$heading_key] = $anchor;
                }

                // Add ID to heading tag
                $new_heading = '<h' . $level . $attrs . ' id="' . esc_attr($anchor) . '">' . $match[3] . '</h' . $level . '>';
                $content = str_replace($match[0], $new_heading, $content);
            }
        }

        return $content;
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
    protected function parseBlocksForHeadings($blocks, &$headings, $min_level = 1, $max_level = 6)
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
     * Parse HTML content for headings (classic editor)
     *
     * @param string $content HTML content
     * @param array &$headings Reference to headings array
     * @param int $min_level Minimum heading level
     * @param int $max_level Maximum heading level
     * @return void
     */
    protected function parseHTMLForHeadings($content, &$headings, $min_level = 1, $max_level = 6)
    {
        // Extract headings from HTML using regex
        preg_match_all('/<h([1-6])([^>]*?)>(.*?)<\/h[1-6]>/is', $content, $matches, PREG_SET_ORDER);
        
        if (empty($matches)) {
            return;
        }

        foreach ($matches as $match) {
            $level = (int) $match[1];
            $attrs = $match[2];
            $heading_html = $match[3];
            
            // Filter by min/max level
            if ($level < $min_level || $level > $max_level) {
                continue;
            }

            // Extract text
            $text = wp_strip_all_tags($heading_html);
            $text = trim($text);
            
            if (empty($text)) {
                continue;
            }

            // Get or generate anchor
            $anchor = '';
            
            // Check if heading already has ID attribute
            if (preg_match('/id=["\']([^"\']+)["\']/', $attrs, $id_match)) {
                $anchor = $id_match[1];
            } else {
                // Generate anchor
                $heading_key = $level . ':' . $text;
                if (isset($this->headingAnchors[$heading_key])) {
                    $anchor = $this->headingAnchors[$heading_key];
                } else {
                    $anchor = $this->generateAnchor($text);
                    $this->headingAnchors[$heading_key] = $anchor;
                }
            }

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

    /**
     * Extract headings from post content
     * Parse blocks first, fallback to HTML parsing for classic editor
     *
     * @param string $content Post content (raw block markup or HTML)
     * @param int $min_level Minimum heading level to include
     * @param int $max_level Maximum heading level to include
     * @return array Headings data
     */
    protected function extractHeadings($content, $min_level = 1, $max_level = 6)
    {
        if (empty($content)) {
            return [];
        }

        // Reset tracking arrays for fresh parse
        $this->headingAnchors = [];
        $this->anchorCounts = [];
        $this->usesHTMLHeadings = false;

        $headings = [];

        // Try parsing as Gutenberg blocks first
        $blocks = parse_blocks($content);
        
        // Check if we have actual blocks (not just empty block)
        $has_blocks = false;
        foreach ($blocks as $block) {
            if (!empty($block['blockName'])) {
                $has_blocks = true;
                break;
            }
        }

        if ($has_blocks) {
            // Parse blocks and pre-generate all heading anchors
            // Headings come from Gutenberg blocks, no need to filter the_content
            $this->usesHTMLHeadings = false;
            $this->parseBlocksForHeadings($blocks, $headings, $min_level, $max_level);
        } else {
            // Fallback to HTML parsing for classic editor
            // Headings come from HTML, need to filter the_content to add anchors
            $this->usesHTMLHeadings = true;
            
            // Convert block content to HTML if needed
            $html_content = '';
            if (function_exists('do_blocks')) {
                $html_content = do_blocks($content);
            } else {
                $html_content = $content;
            }
            
            // Parse HTML for headings
            $this->parseHTMLForHeadings($html_content, $headings, $min_level, $max_level);
        }

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
     * Check if we're in template editor (site editor)
     *
     * @return bool
     */
    protected function isTemplateEditor()
    {
        // Check if we're in REST API context (editor preview)
        if (defined('REST_REQUEST') && REST_REQUEST) {
            // Check if this is a template request
            $request_uri = $_SERVER['REQUEST_URI'] ?? '';
            if (strpos($request_uri, '/wp-json/wp/v2/template') !== false ||
                strpos($request_uri, '/wp-json/wp/v2/template-part') !== false) {
                return true;
            }
        }

        // Check current screen
        if (function_exists('get_current_screen')) {
            $screen = get_current_screen();
            if ($screen && ($screen->id === 'site-editor' || $screen->id === 'appearance_page_gutenberg-edit-site')) {
                return true;
            }
        }

        // Check if we're in editor iframe
        if (isset($_GET['_wp-find-template']) || isset($_GET['postType']) && $_GET['postType'] === 'wp_template') {
            return true;
        }

        // Check global post context - if no post but we have block, likely template editor
        global $post;
        if (empty($post) || empty($post->post_content)) {
            // In template editor, there's no post object
            if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generate mock headings for template editor preview
     *
     * @param int $min_level Minimum heading level
     * @param int $max_level Maximum heading level
     * @return array Mock headings with hierarchy
     */
    protected function getMockHeadings($min_level = 1, $max_level = 6)
    {
        // Vietnamese mock headings based on user's example
        $mock_data = [
            [
                'id' => 'ban-can-biet',
                'text' => 'Bạn cần biết!',
                'level' => max(1, min(2, $min_level)),
                'children' => [],
                'isExpanded' => false,
            ],
            [
                'id' => 'mo-hinh-van-hanh',
                'text' => 'Mô hình vận hành',
                'level' => max(1, min(2, $min_level)),
                'children' => [
                    [
                        'id' => 'hoat-dong-sach-cu-gia-re',
                        'text' => 'HOẠT ĐỘNG SÁCH CŨ GIÁ RẺ',
                        'level' => max(1, min(3, $max_level)),
                        'children' => [
                            [
                                'id' => 'vai-tro-nhiem-vu',
                                'text' => 'Vai trò & nhiệm vụ',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'he-thong-tich-diem',
                                'text' => 'Hệ thống tích điểm hội viên',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'hop-tac-nha-ban',
                                'text' => 'Hợp tác NHÀ BÁN (DTNB)',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'hop-tac-shop-tich-diem',
                                'text' => 'Hợp tác SHOP TÍCH ĐIỂM',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'phat-trien-dich-vu',
                                'text' => 'Phát triển dịch vụ về sách',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'dich-vu-cho-thue-sach',
                                'text' => 'Dịch vụ cho thuê sách online',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'ky-gui-sach-online',
                                'text' => 'Ký gửi sách online',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                        ],
                        'isExpanded' => true,
                    ],
                    [
                        'id' => 'hoat-dong-cheephub',
                        'text' => 'HOẠT ĐỘNG CHEEPHUB',
                        'level' => max(1, min(3, $max_level)),
                        'children' => [
                            [
                                'id' => 'training-ctv',
                                'text' => 'Training CTV với hệ thống n',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'blog-chia-se',
                                'text' => 'Blog chia sẻ kiến thức tài liệu',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                            [
                                'id' => 'hop-tac-dong-gia',
                                'text' => 'Hợp tác đồng giá vận chuyển',
                                'level' => max(1, min(4, $max_level)),
                                'children' => [],
                                'isExpanded' => false,
                            ],
                        ],
                        'isExpanded' => false,
                    ],
                ],
                'isExpanded' => true,
            ],
        ];

        // Filter mock data by min/max level
        $filtered_data = $this->filterHeadingsByLevel($mock_data, $min_level, $max_level);

        // Build hierarchy from filtered data
        return $this->buildHierarchyFromMock($filtered_data);
    }

    /**
     * Filter headings by level recursively
     *
     * @param array $headings Headings array
     * @param int $min_level Minimum level
     * @param int $max_level Maximum level
     * @return array Filtered headings
     */
    protected function filterHeadingsByLevel($headings, $min_level, $max_level)
    {
        $filtered = [];

        foreach ($headings as $heading) {
            // Skip if level is out of range
            if ($heading['level'] < $min_level || $heading['level'] > $max_level) {
                continue;
            }

            // Recursively filter children
            if (!empty($heading['children'])) {
                $heading['children'] = $this->filterHeadingsByLevel($heading['children'], $min_level, $max_level);
            }

            $filtered[] = $heading;
        }

        return $filtered;
    }

    /**
     * Build hierarchy from mock data (flatten first, then rebuild)
     *
     * @param array $mock_data Mock headings data
     * @return array Hierarchical headings
     */
    protected function buildHierarchyFromMock($mock_data)
    {
        // Flatten mock data with children
        $flat_headings = [];
        $this->flattenMockHeadings($mock_data, $flat_headings);

        // Build hierarchy using existing method
        return $this->buildHierarchy($flat_headings);
    }

    /**
     * Flatten mock headings recursively
     *
     * @param array $headings Headings with nested children
     * @param array &$flat Reference to flat array
     * @return void
     */
    protected function flattenMockHeadings($headings, &$flat)
    {
        foreach ($headings as $heading) {
            $flat_item = [
                'id' => $heading['id'],
                'text' => $heading['text'],
                'level' => $heading['level'],
                'children' => [],
                'isExpanded' => $heading['isExpanded'] ?? false,
            ];
            $flat[] = $flat_item;

            if (!empty($heading['children'])) {
                $this->flattenMockHeadings($heading['children'], $flat);
            }
        }
    }

    /**
     * Render TOC list recursively
     *
     * @param array $items TOC items
     * @param string $listing_type 'ul', 'ol', or 'none'
     * @param string $expand_icon_type Icon type
     * @param bool $default_expanded Default expand state
     * @param bool $expand_first_item Expand first item
     * @param int $depth Current depth
     * @param bool $is_first_item Is this the first item
     * @return string HTML output
     */
    protected function renderTOCList($items, $listing_type, $expand_icon_type, $default_expanded, $expand_first_item, $depth = 0, $is_first_item = false, $is_hidden = false)
    {
        if (empty($items)) {
            return '';
        }

        // For 'none' type, use div instead of list tags
        if ($listing_type === 'none') {
            $list_tag = 'div';
        } else {
            $list_tag = $listing_type === 'ol' ? 'ol' : 'ul';
        }
        
        $list_class = $depth === 0 ? 'toc-list toc-list--root' : 'toc-list toc-list--level-' . ($depth + 1);
        
        if ($listing_type === 'none') {
            $list_class .= ' toc-list--none';
        }

        if ($is_hidden) {
            $html = sprintf('<%s class="%s" style="display:none">', $list_tag, esc_attr($list_class));
        } else {
            $html = sprintf('<%s class="%s">', $list_tag, esc_attr($list_class));
        }

        foreach ($items as $index => $item) {
            $has_children = !empty($item['children']);
            // When expand icon type is 'none', always show all items expanded
            if ($expand_icon_type === 'none') {
                $is_expanded = true;
            } else {
                $is_expanded = $default_expanded || ($is_first_item && $index === 0 && $expand_first_item);
            }

            $item_class = 'toc-item toc-item--level-' . $item['level'];
            
            // For 'none' type, use div instead of li
            if ($listing_type === 'none') {
                $html .= sprintf('<div class="%s">', esc_attr($item_class));
            } else {
                $html .= sprintf('<li class="%s">', esc_attr($item_class));
            }

            $html .= '<div class="toc-item__wrapper">';

            // Expand/collapse button (only if icon type is not 'none')
            if ($has_children && $expand_icon_type !== 'none') {
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
                $is_child_hidden = ($expand_icon_type !== 'none' && !$is_expanded);

                $child_html = $this->renderTOCList(
                    $item['children'],
                    $listing_type,
                    $expand_icon_type,
                    $default_expanded,
                    $expand_first_item,
                    $depth + 1,
                    false,
                    $is_child_hidden
                );

                $html .= $child_html;
            }

            // For 'none' type, use div closing tag instead of li
            if ($listing_type === 'none') {
                $html .= '</div>';
            } else {
                $html .= '</li>';
            }
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
        $show_heading = $attributes['showHeading'] ?? true;
        $hide_empty_message = $attributes['hideEmptyMessage'] ?? true;
        $custom_heading_text = $attributes['customHeadingText'] ?? '';
        $heading_style = $attributes['headingStyle'] ?? 'underline';
        $min_heading_level = $attributes['minHeadingLevel'] ?? 1;
        $max_heading_level = $attributes['maxHeadingLevel'] ?? 6;
        $bullet_type = $attributes['bulletType'] ?? 'disc';
        $hierarchical_indent = $attributes['hierarchicalIndent'] ?? true;
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
        
        // If headings come from HTML (classic editor), add filter to apply anchors to content
        // If headings come from blocks, filterHeadingBlock() already handles it
        if ($this->usesHTMLHeadings && !self::$contentFilterAdded) {
            add_filter('the_content', [$this, 'filterContentHeadings'], 10, 1);
            self::$contentFilterAdded = true;
        }

        // If no headings found, check if we're in template editor and show mock data
        if (empty($toc_items)) {
            // Check if we're in template editor (site editor)
            $is_template_editor = $this->isTemplateEditor();
            
            if ($is_template_editor) {
                // Use mock headings for template editor preview
                $toc_items = $this->getMockHeadings($min_heading_level, $max_heading_level);
            } else {
                // Show placeholder for normal posts without headings
                if ($hide_empty_message) {
                    return '';
                }

                return sprintf(
                    '<div class="jankx-table-of-content %s"><div class="toc-placeholder"><p>%s</p></div></div>',
                    esc_attr($class_name),
                    esc_html__('No headings found in the post content.', 'jankx')
                );
            }
        }

        // Build outer wrapper attributes (for data attributes only)
        $wrapper_class = 'jankx-table-of-content heading-style-' . esc_attr($heading_style) . ' has-bullet-' . esc_attr($bullet_type);
        if (!$hierarchical_indent) {
            $wrapper_class .= ' is-flat-hierarchy';
        }
        if (!empty($class_name)) {
            $wrapper_class .= ' ' . esc_attr($class_name);
        }

        // Build wrapper attributes using WordPress block supports
        // This applies background, colors, spacing, borders, etc. to the block root
        $wrapper_attrs = get_block_wrapper_attributes([
            'class' => $wrapper_class,
            'data-default-expanded' => $default_expanded ? 'true' : 'false',
            'data-expand-first-item' => $expand_first_item ? 'true' : 'false',
            'data-expand-icon-type' => $expand_icon_type,
            'id' => !empty($anchor) ? $anchor : null,
        ]);

        // Render TOC
        $toc_html = $this->renderTOCList(
            $toc_items,
            $listing_type,
            $expand_icon_type,
            $default_expanded,
            $expand_first_item,
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
            '<div %s><nav class="toc-wrapper" aria-label="%s">%s%s</nav></div>',
            $wrapper_attrs,
            esc_attr($heading_text),
            $heading_html,
            $toc_html
        );
    }
}

