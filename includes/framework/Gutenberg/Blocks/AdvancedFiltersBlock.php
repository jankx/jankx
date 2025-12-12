<?php

/**
 * Advanced Filter Block
 *
 * A flexible filter block that can work with Post Layout blocks
 * to provide AJAX filtering capabilities.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Facades\Log;
use Jankx\Layouts\AdvancedFilters\AdvancedFiltersRenderer as FilterRenderer;
use Jankx\Query\AdvancedFiltersQueryBuilder;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\PostLayoutDecorator;
use Jankx\Rest\AdvancedFiltersRestApiHandler;
use Jankx\Rest\AdvancedFiltersAjaxHandler;
use WP_Query;

class AdvancedFiltersBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-filters';

    /**
     * REST API Handler instance
     *
     * @var AdvancedFiltersRestApiHandler|null
     */
    protected $restHandler = null;

    /**
     * AJAX Handler instance
     *
     * @var AdvancedFiltersAjaxHandler|null
     */
    protected $ajaxHandler = null;

    /**
     * Query Builder instance
     *
     * @var AdvancedFiltersQueryBuilder|null
     */
    protected $queryBuilder = null;

    /**
     * Filter Renderer instance
     *
     * @var FilterRenderer|null
     */
    protected $filterRenderer = null;

    /**
     * Dynamic Data Layout Manager instance
     *
     * @var DynamicDataLayoutManager|null
     */
    protected $layoutManager = null;

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        // Initialize handlers
        $this->restHandler = new AdvancedFiltersRestApiHandler();
        $this->ajaxHandler = new AdvancedFiltersAjaxHandler();
        $this->queryBuilder = new AdvancedFiltersQueryBuilder();
        $this->filterRenderer = new FilterRenderer();
        $this->layoutManager = DynamicDataLayoutManager::getInstance();

        // Register handlers
        add_action('rest_api_init', [$this->restHandler, 'registerEndpoints']);
        $this->ajaxHandler->registerHandlers();
        
        // Register filter hooks for handlers to use
        add_filter('jankx_advanced_filter_get_block_data', [$this, 'handleGetBlockDataFilter'], 10, 3);
        add_filter('jankx_advanced_filter_find_blocks', [$this, 'handleFindBlocksFilter'], 10, 2);

        // Localize data for block viewScript
        add_action('wp_footer', [$this, 'localizeFrontendData']);
    }

    /**
     * Filter callback to get block data
     *
     * @param array $results
     * @param array $target_blocks
     * @param array $filters
     * @return array
     */
    public function handleGetBlockDataFilter(array $results, array $target_blocks, array $filters): array
    {
        foreach ($target_blocks as $target) {
            if (!$target['enabled']) {
                continue;
            }

            $block_data = $this->getBlockData($target, $filters);
            if ($block_data) {
                $results[$target['blockId']] = $block_data;
            }
        }

        return $results;
        }

    /**
     * Filter callback to find blocks
     *
     * @param array $blocks
     * @param \WP_Post $post
     * @return array
     */
    public function handleFindBlocksFilter(array $blocks, $post): array
    {
        $parsed_blocks = parse_blocks($post->post_content);
        $this->findDynamicDataLayoutBlocks($parsed_blocks, $blocks, [
            'source' => 'current_page',
            'postId' => $post->ID,
            'postTitle' => $post->post_title,
            'postType' => $post->post_type,
        ]);

        return $blocks;
    }

    /**
     * Recursively find jankx/dynamic-data-layout blocks in parsed blocks
     *
     * @param array $blocks Parsed blocks array
     * @param array &$found_blocks Reference to array to collect found blocks
     * @param array $context Context information (source, postId, postTitle, postType)
     * @return void
     */
    private function findDynamicDataLayoutBlocks(array $blocks, array &$found_blocks, array $context): void
    {
        foreach ($blocks as $block) {
            // Check if this is a dynamic-data-layout block
            if (($block['blockName'] ?? '') === 'jankx/dynamic-data-layout') {
                $attributes = $block['attrs'] ?? [];
                $query_id = $attributes['queryId'] ?? null;
                
                // Use queryId if available, otherwise generate a hash
                $block_id = $query_id ? strval($query_id) : 'block_' . md5(serialize($block));
                
                // Check if block already exists (by queryId)
                $exists = false;
                foreach ($found_blocks as $existing_block) {
                    if ($existing_block['id'] === $block_id) {
                        $exists = true;
                        break;
                    }
                }
                
                if (!$exists) {
                    $found_blocks[] = [
                        'id' => $block_id,
                        'name' => ($attributes['postType'] ?? 'post') . ' Layout - ' . $context['postTitle'],
                        'postId' => $context['postId'],
                        'postTitle' => $context['postTitle'],
                        'postType' => $context['postType'],
                        'source' => $context['source'],
                        'blockType' => $attributes['postType'] ?? 'post',
                        'layout' => $attributes['layout'] ?? 'grid',
                    ];
                }
            }

            // Recursively search inner blocks
            if (!empty($block['innerBlocks'])) {
                $this->findDynamicDataLayoutBlocks($block['innerBlocks'], $found_blocks, $context);
            }
        }
    }

    /**
     * Get data for a specific block
     *
     * @param array $target
     * @param array $filters
     * @return array|null
     */
    private function getBlockData($target, $filters)
    {
        $block_id = $target['blockId'];
        $selector = $target['selector'];

        // Get block content
        $block_content = $this->getBlockContent($block_id);
        if (!$block_content) {
            return null;
        }

        // Parse block attributes
        $block_attributes = $this->parseBlockAttributes($block_content);
        if (!$block_attributes) {
            return null;
        }

        // Build query args from filters
        $query_args = $this->queryBuilder->buildFromFilters($block_attributes, $filters);

        // Execute query
        $query = new WP_Query($query_args);

        // Render using PostLayoutDecorator
        $layout_name = $block_attributes['layout'] ?? 'grid';
        $decorator = $this->layoutManager->createLayout(
            $layout_name,
            $block_attributes['postType'] ?? 'post',
            $block_attributes
        );
        $decorator->withQuery($query);
        $rendered_content = $decorator->render();

        return [
            'blockId' => $block_id,
            'selector' => $selector,
            'content' => $rendered_content,
            'query_info' => [
                'total_posts' => $query->found_posts ?? 0,
                'found_posts' => count($query->posts) ?? 0,
                'max_pages' => $query->max_num_pages ?? 0
            ]
        ];
    }

    /**
     * Get block content
     *
     * @param string $block_id
     * @return array|null
     */
    private function getBlockContent($block_id)
    {
        // First, try to find in current post/page context
        global $post;
        if ($post && !empty($post->post_content)) {
            $blocks = parse_blocks($post->post_content);
            $found_block = $this->findBlockInBlocks($blocks, $block_id);
            if ($found_block) {
                return $found_block;
            }
        }

        // If not found, search in limited posts to avoid memory issues
        // Only search in recent posts with dynamic-data-layout blocks
        $posts = get_posts([
            'post_type' => ['page', 'post'], // Limit to common post types
            'post_status' => 'publish',
            'posts_per_page' => 50, // Limit to 50 posts instead of -1
            'orderby' => 'modified',
            'order' => 'DESC',
            'suppress_filters' => true, // Disable filters for performance
            'no_found_rows' => true, // Skip pagination counting
            'update_post_term_cache' => false, // Skip term cache
            'update_post_meta_cache' => false, // Skip meta cache
        ]);

        foreach ($posts as $post_item) {
            if (empty($post_item->post_content)) {
                continue;
            }
            $blocks = parse_blocks($post_item->post_content);
            $found_block = $this->findBlockInBlocks($blocks, $block_id);
            if ($found_block) {
                return $found_block;
            }
        }

        return null;
    }

    /**
     * Find block in parsed blocks array
     *
     * @param array $blocks Parsed blocks array
     * @param string $block_id Target block ID
     * @return array|null Block array or null
     */
    private function findBlockInBlocks(array $blocks, string $block_id): ?array
    {
            foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === 'jankx/dynamic-data-layout') {
                $current_block_id = $block['attrs']['queryId'] ?? null;
                // Check both queryId and generated ID
                if ($current_block_id && strval($current_block_id) === strval($block_id)) {
                    return $block;
                }
                $generated_block_id = 'block_' . md5(serialize($block));
                if ($generated_block_id === $block_id) {
                        return $block;
                    }
            }

            // Recursively check inner blocks
            if (!empty($block['innerBlocks'])) {
                $found = $this->findBlockInBlocks($block['innerBlocks'], $block_id);
                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }

    /**
     * Parse block attributes
     *
     * @param array $block
     * @return array|null
     */
    private function parseBlockAttributes($block)
    {
        if (!$block || !isset($block['attrs'])) {
            return null;
        }

        $attrs = $block['attrs'];

        return [
            'postType' => $attrs['postType'] ?? 'post',
            'postsPerPage' => $attrs['postsPerPage'] ?? 6,
            'orderBy' => $attrs['orderBy'] ?? 'date',
            'order' => $attrs['order'] ?? 'DESC',
            'offset' => $attrs['offset'] ?? 0,
            'exclude' => $attrs['exclude'] ?? [],
            'include' => $attrs['include'] ?? [],
            'layout' => $attrs['layout'] ?? 'grid',
            'columns' => $attrs['columns'] ?? 3,
            'columnsTablet' => $attrs['columnsTablet'] ?? 2,
            'columnsMobile' => $attrs['columnsMobile'] ?? 1,
            'showFeaturedImage' => $attrs['showFeaturedImage'] ?? true,
            'showTitle' => $attrs['showTitle'] ?? true,
            'showExcerpt' => $attrs['showExcerpt'] ?? true,
            'showDate' => $attrs['showDate'] ?? true,
            'showAuthor' => $attrs['showAuthor'] ?? false,
            'excerptLength' => $attrs['excerptLength'] ?? 55,
        ];
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Use new attributes structure from block.json
        $target_block_ids = $attributes['targetBlockIds'] ?? [];
        $filter_type = $attributes['filterType'] ?? 'taxonomy';
        $layout = $attributes['layout'] ?? 'horizontal';
        $show_labels = $attributes['showLabels'] ?? true;
        $show_reset_button = $attributes['showResetButton'] ?? true;
        $reset_button_text = $attributes['resetButtonText'] ?? __('Reset Filters', 'jankx');
        $ajax_enabled = $attributes['ajaxEnabled'] ?? true;
        $update_url = $attributes['updateUrl'] ?? true;
        $scroll_to_results = $attributes['scrollToResults'] ?? false;
        $taxonomy_filters = $attributes['taxonomyFilters'] ?? [];
        $meta_filters = $attributes['metaFilters'] ?? [];
        $price_filters = $attributes['priceFilters'] ?? [];
        $date_filters = $attributes['dateFilters'] ?? [];
        $author_filters = $attributes['authorFilters'] ?? [];
        $keyword_filter = $attributes['keywordFilter'] ?? [];
        $display_style = $attributes['displayStyle'] ?? 'buttons';
        $show_count = $attributes['showCount'] ?? false;
        $show_empty_terms = $attributes['showEmptyTerms'] ?? true;
        $show_only_top_level = $attributes['showOnlyTopLevel'] ?? false;
        $show_hierarchy = $attributes['showHierarchy'] ?? false;
        $display_as_dropdown = $attributes['displayAsDropdown'] ?? false;
        $multiple_selection = $attributes['multipleSelection'] ?? true;
        $collapsible = $attributes['collapsible'] ?? false;
        $default_expanded = $attributes['defaultExpanded'] ?? true;

        // Generate unique filter ID
        $filter_id = 'filter_' . uniqid();

        // Try detect post type from target dynamic-data-layout blocks
        $detected_post_type = $this->detectPostTypeFromTargetIds($target_block_ids) ?: 'post';

        // Get block identifier for frontend JavaScript to find this block
        // Use blockId attribute (set to clientId in editor) if available
        $block_identifier_for_config = $attributes['blockId'] ?? '';
        
        if (empty($block_identifier_for_config)) {
            // Fallback: try to get from parsed block
            if ($block instanceof \WP_Block) {
                $block_identifier_for_config = $block->parsed_block['attrs']['blockId'] ?? 
                                              $block->parsed_block['attrs']['queryId'] ?? 
                                              ($block->parsed_block['attrs']['anchor'] ?? '');
            }
        }
        
        if (empty($block_identifier_for_config) && !empty($attributes['queryId'])) {
            $block_identifier_for_config = $attributes['queryId'];
        }
        
        // Generate a unique ID if still empty
        if (empty($block_identifier_for_config)) {
            $block_identifier_for_config = 'af-' . uniqid();
        }
        
        // Build filter configuration for frontend JavaScript
        $config = [
            'filterId' => $filter_id,
            'blockId' => $block_identifier_for_config, // Add block identifier to config
            'targetBlockIds' => $target_block_ids,
            'filterType' => $filter_type,
            'ajaxEnabled' => $ajax_enabled,
            'updateUrl' => $update_url,
            'scrollToResults' => $scroll_to_results,
            'taxonomyFilters' => array_filter($taxonomy_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'metaFilters' => array_filter($meta_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'priceFilters' => array_filter($price_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'dateFilters' => array_filter($date_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'authorFilters' => array_filter($author_filters, function($filter) {
                return $filter['enabled'] ?? false;
            }),
            'keywordFilter' => $keyword_filter,
            'postType' => $detected_post_type,
        ];

        // Apply filters to custom config
        $config = apply_filters('jankx_advanced_filters_config', $config, $attributes);

        // Generate unique ID for this filter instance
        $instance_id = 'jankx-advanced-filters-' . $filter_id;

        // Build CSS classes - add global layout class for consistent styling
        $wrapper_classes = ['wp-block-jankx-advanced-filters'];
        if ($layout) {
            $wrapper_classes[] = 'layout-' . esc_attr($layout);
        }
        
        // Add data attributes for frontend JavaScript to find this block
        // Use the same identifier from config
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $wrapper_classes),
            'id' => $instance_id,
            'data-filter-block-id' => $block_identifier_for_config,
        ]);

        // Create nonce for AJAX requests - use DynamicDataLayoutBlock's nonce
        $ajax_nonce = wp_create_nonce('jankx_load_more');
        $ajax_url = admin_url('admin-ajax.php');

        // Start output buffering
        ob_start();
        ?>
        <div <?php echo $wrapper_attributes; ?>>
            <div class="advanced-filters-config" 
                 data-config="<?php echo esc_attr(wp_json_encode($config)); ?>"
                 data-nonce="<?php echo esc_attr($ajax_nonce); ?>"
                 data-ajax-url="<?php echo esc_attr($ajax_url); ?>"
                 style="display: none;"></div>
            <div class="advanced-filters-container">
                <?php $this->filterRenderer->render($attributes, $config); ?>
            </div>
            <?php if ($show_reset_button) : ?>
                <button type="button" class="filter-reset-button">
                    <?php echo esc_html($reset_button_text); ?>
                </button>
            <?php endif; ?>
        </div>
        <?php

        $output = ob_get_clean();

        // Apply filters to custom output
        $output = apply_filters('jankx_advanced_filters_output', $output, $config, $attributes);

        return $output;
    }

    /**
     * Detect post type from target block IDs
     *
     * @param array $target_block_ids Array of block IDs
     * @return string|null Post type or null
     */
    private function detectPostTypeFromTargetIds(array $target_block_ids): ?string
    {
        if (empty($target_block_ids)) {
            return null;
        }

        // First, try to find blocks in current post/page context
        global $post;
        if ($post && !empty($post->post_content)) {
            $blocks = parse_blocks($post->post_content);
            foreach ($target_block_ids as $block_id) {
                $found_type = $this->findPostTypeInBlocks($blocks, $block_id);
                if ($found_type) {
                    return $found_type;
                }
            }
        }

        // If not found, try to find in template parts (limited query to avoid memory issues)
        // Only search in recent posts with dynamic-data-layout blocks to avoid memory exhaustion
        $posts = get_posts([
            'post_type' => ['page', 'post'], // Limit to common post types
            'post_status' => 'publish',
            'posts_per_page' => 50, // Limit to 50 posts instead of -1
            'orderby' => 'modified',
            'order' => 'DESC',
            'suppress_filters' => true, // Disable filters for performance
            'no_found_rows' => true, // Skip pagination counting
            'update_post_term_cache' => false, // Skip term cache
            'update_post_meta_cache' => false, // Skip meta cache
        ]);

        foreach ($target_block_ids as $block_id) {
            foreach ($posts as $post_item) {
                if (empty($post_item->post_content)) {
                        continue;
                    }
                $blocks = parse_blocks($post_item->post_content);
                $found_type = $this->findPostTypeInBlocks($blocks, $block_id);
                if ($found_type) {
                    return $found_type;
                }
            }
        }

        return null;
    }

    /**
     * Find post type in parsed blocks
     *
     * @param array $blocks Parsed blocks array
     * @param string $block_id Target block ID
     * @return string|null Post type or null
     */
    private function findPostTypeInBlocks(array $blocks, string $block_id): ?string
    {
        foreach ($blocks as $block) {
            // Check current block
            if (($block['blockName'] ?? '') === 'jankx/dynamic-data-layout') {
                    $current_block_id = $block['attrs']['queryId'] ?? null;
                    if ($current_block_id && strval($current_block_id) === strval($block_id)) {
                        return $block['attrs']['postType'] ?? null;
                    }
            }

            // Recursively check inner blocks
            if (!empty($block['innerBlocks'])) {
                $found = $this->findPostTypeInBlocks($block['innerBlocks'], $block_id);
                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }

    /**
     * Localize frontend data for block viewScript
     * 
     * block.json handles script loading, we just need to provide data
     *
     * @return void
     */
    public function localizeFrontendData(): void
    {
        // Always localize nonce for AJAX requests
        // This is needed for smart-tabs with advanced-filter triggers even when
        // advanced-filters block is not present (e.g., in templates, homepage)
        // has_block() may not detect blocks in template parts or homepage
        
        // Output inline script with localized data
        ?>
        <script type="text/javascript">
        if (typeof jankxAdvancedFilters !== 'undefined') {
            jankxAdvancedFilters = Object.assign(jankxAdvancedFilters || {}, {
                ajaxUrl: '<?php echo esc_url(admin_url('admin-ajax.php')); ?>',
                nonce: '<?php echo wp_create_nonce('jankx_load_more'); ?>'
            });
        } else {
            window.jankxAdvancedFilters = {
                ajaxUrl: '<?php echo esc_url(admin_url('admin-ajax.php')); ?>',
                nonce: '<?php echo wp_create_nonce('jankx_load_more'); ?>'
            };
        }
        </script>
        <?php
    }
}
