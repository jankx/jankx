<?php

namespace Jankx\Gutenberg;

/**
 * Query Options Manager
 *
 * Quản lý các options cho query parameters trong Gutenberg blocks
 *
 * @package Jankx\Gutenberg
 * @since 1.0.0
 */
class QueryOptions
{
    /**
     * Get order by options
     *
     * @return array Array of order by options with value and label
     */
    public static function getOrderByOptions(): array
    {
        $options = [
            [
                'value' => 'date',
                'label' => __('Date', 'jankx'),
            ],
            [
                'value' => 'modified',
                'label' => __('Modified Date', 'jankx'),
            ],
            [
                'value' => 'title',
                'label' => __('Title', 'jankx'),
            ],
            [
                'value' => 'name',
                'label' => __('Slug', 'jankx'),
            ],
            [
                'value' => 'author',
                'label' => __('Author', 'jankx'),
            ],
            [
                'value' => 'type',
                'label' => __('Type (Post Type)', 'jankx'),
            ],
            [
                'value' => 'ID',
                'label' => __('ID', 'jankx'),
            ],
            [
                'value' => 'menu_order',
                'label' => __('Menu Order', 'jankx'),
            ],
            [
                'value' => 'rand',
                'label' => __('Random', 'jankx'),
            ],
            [
                'value' => 'comment_count',
                'label' => __('Comment Count', 'jankx'),
            ],
            [
                'value' => 'relevance',
                'label' => __('Relevance', 'jankx'),
            ],
            [
                'value' => 'meta_value',
                'label' => __('Meta Value', 'jankx'),
            ],
            [
                'value' => 'meta_value_num',
                'label' => __('Meta Value Numeric', 'jankx'),
            ],
            [
                'value' => 'post__in',
                'label' => __('Post__in (Array Order)', 'jankx'),
            ],
            [
                'value' => 'post_name__in',
                'label' => __('Post Name__in (Slug Order)', 'jankx'),
            ],
            [
                'value' => 'post_parent__in',
                'label' => __('Post Parent__in (Parent Order)', 'jankx'),
            ],
        ];

        /**
         * Filter order by options
         *
         * Cho phép thêm/xóa/sửa các options cho order by parameter
         *
         * @param array $options Array of order by options
         *
         * @since 1.0.0
         *
         * @example
         * add_filter('jankx/gutenberg/query-options/order-by', function($options) {
         *     $options[] = [
         *         'value' => 'custom_field',
         *         'label' => __('Custom Field', 'my-plugin'),
         *     ];
         *     return $options;
         * });
         */
        return apply_filters('jankx/gutenberg/query-options/order-by', $options);
    }

    /**
     * Get order options
     *
     * @return array Array of order options with value and label
     */
    public static function getOrderOptions(): array
    {
        $options = [
            [
                'value' => 'DESC',
                'label' => __('Descending', 'jankx'),
            ],
            [
                'value' => 'ASC',
                'label' => __('Ascending', 'jankx'),
            ],
        ];

        /**
         * Filter order options
         *
         * Cho phép thêm/xóa/sửa các options cho order parameter
         *
         * @param array $options Array of order options
         *
         * @since 1.0.0
         */
        return apply_filters('jankx/gutenberg/query-options/order', $options);
    }

    /**
     * Get meta query compare operators
     *
     * @return array Array of compare operators
     */
    public static function getMetaCompareOperators(): array
    {
        $operators = [
            [
                'value' => '=',
                'label' => __('Equal (=)', 'jankx'),
            ],
            [
                'value' => '!=',
                'label' => __('Not Equal (!=)', 'jankx'),
            ],
            [
                'value' => '>',
                'label' => __('Greater Than (>)', 'jankx'),
            ],
            [
                'value' => '>=',
                'label' => __('Greater Than or Equal (>=)', 'jankx'),
            ],
            [
                'value' => '<',
                'label' => __('Less Than (<)', 'jankx'),
            ],
            [
                'value' => '<=',
                'label' => __('Less Than or Equal (<=)', 'jankx'),
            ],
            [
                'value' => 'LIKE',
                'label' => __('Like (LIKE)', 'jankx'),
            ],
            [
                'value' => 'NOT LIKE',
                'label' => __('Not Like (NOT LIKE)', 'jankx'),
            ],
            [
                'value' => 'IN',
                'label' => __('In (IN)', 'jankx'),
            ],
            [
                'value' => 'NOT IN',
                'label' => __('Not In (NOT IN)', 'jankx'),
            ],
            [
                'value' => 'EXISTS',
                'label' => __('Exists (EXISTS)', 'jankx'),
            ],
            [
                'value' => 'NOT EXISTS',
                'label' => __('Not Exists (NOT EXISTS)', 'jankx'),
            ],
        ];

        /**
         * Filter meta query compare operators
         *
         * @param array $operators Array of compare operators
         *
         * @since 1.0.0
         */
        return apply_filters('jankx/gutenberg/query-options/meta-compare', $operators);
    }

    /**
     * Get meta query types
     *
     * @return array Array of meta types
     */
    public static function getMetaTypes(): array
    {
        $types = [
            [
                'value' => '',
                'label' => __('-- Auto --', 'jankx'),
            ],
            [
                'value' => 'NUMERIC',
                'label' => 'NUMERIC',
            ],
            [
                'value' => 'CHAR',
                'label' => 'CHAR',
            ],
            [
                'value' => 'DATE',
                'label' => 'DATE',
            ],
            [
                'value' => 'DATETIME',
                'label' => 'DATETIME',
            ],
            [
                'value' => 'DECIMAL',
                'label' => 'DECIMAL',
            ],
        ];

        /**
         * Filter meta query types
         *
         * @param array $types Array of meta types
         *
         * @since 1.0.0
         */
        return apply_filters('jankx/gutenberg/query-options/meta-types', $types);
    }

    /**
     * Get taxonomy query operators
     *
     * @return array Array of taxonomy operators
     */
    public static function getTaxonomyOperators(): array
    {
        $operators = [
            [
                'value' => 'IN',
                'label' => __('In (IN)', 'jankx'),
            ],
            [
                'value' => 'NOT IN',
                'label' => __('Not In (NOT IN)', 'jankx'),
            ],
            [
                'value' => 'AND',
                'label' => __('And (AND)', 'jankx'),
            ],
            [
                'value' => 'EXISTS',
                'label' => __('Exists (EXISTS)', 'jankx'),
            ],
            [
                'value' => 'NOT EXISTS',
                'label' => __('Not Exists (NOT EXISTS)', 'jankx'),
            ],
        ];

        /**
         * Filter taxonomy query operators
         *
         * @param array $operators Array of taxonomy operators
         *
         * @since 1.0.0
         */
        return apply_filters('jankx/gutenberg/query-options/taxonomy-operators', $operators);
    }

    /**
     * Get query preset options
     *
     * @return array Array of query preset options with value, label, and postType
     */
    public static function getQueryPresets(): array
    {
        $presets = [
            [
                'value' => 'default',
                'label' => __('Default (Main Query)', 'jankx'),
                'postType' => null, // Available for all post types
                'help' => __('Use WordPress main query. Query parameters will be hidden.', 'jankx'),
            ],
            [
                'value' => 'related',
                'label' => __('Related Posts (Same Taxonomy)', 'jankx'),
                'postType' => null, // Available for all post types
                'help' => __('Display related posts (same taxonomy as current post).', 'jankx'),
            ],
            [
                'value' => 'custom',
                'label' => __('Custom Query', 'jankx'),
                'postType' => null, // Available for all post types
                'help' => __('Customize query parameters as you wish.', 'jankx'),
            ],
        ];

        /**
         * Filter query preset options
         *
         * Allows packages (like WooCommerce) to add custom presets
         *
         * @param array $presets Array of query preset options
         *
         * @since 1.0.0
         *
         * @example
         * add_filter('jankx/gutenberg/query-options/query-presets', function($presets) {
         *     $presets[] = [
         *         'value' => 'on-sale',
         *         'label' => __('On Sale Products', 'jankx'),
         *         'postType' => 'product',
         *         'help' => __('Display products that are currently on sale.', 'jankx'),
         *     ];
         *     return $presets;
         * });
         */
        return apply_filters('jankx/gutenberg/query-options/query-presets', $presets);
    }

    /**
     * Get all query options as array
     *
     * @return array Array of all query options
     */
    public static function getOptions(): array
    {
        return [
            'orderBy' => self::getOrderByOptions(),
            'order' => self::getOrderOptions(),
            'metaCompare' => self::getMetaCompareOperators(),
            'metaTypes' => self::getMetaTypes(),
            'taxonomyOperators' => self::getTaxonomyOperators(),
            'queryPresets' => self::getQueryPresets(),
        ];
    }

    /**
     * Output all query options as JavaScript object
     *
     * @return void
     * @deprecated Use wp_localize_script() with getOptions() instead
     */
    public static function outputToJavaScript(): void
    {
        $options = self::getOptions();

        ?>
        <script>
            window.jankxQueryOptions = <?php echo wp_json_encode($options, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
        </script>
        <?php
    }
}

