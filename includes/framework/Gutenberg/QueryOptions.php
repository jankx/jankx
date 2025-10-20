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
                'label' => __('Date (Ngày đăng)', 'jankx'),
            ],
            [
                'value' => 'modified',
                'label' => __('Modified (Ngày sửa)', 'jankx'),
            ],
            [
                'value' => 'title',
                'label' => __('Title (Tiêu đề)', 'jankx'),
            ],
            [
                'value' => 'name',
                'label' => __('Name (Slug)', 'jankx'),
            ],
            [
                'value' => 'author',
                'label' => __('Author (Tác giả)', 'jankx'),
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
                'label' => __('Random (Ngẫu nhiên)', 'jankx'),
            ],
            [
                'value' => 'comment_count',
                'label' => __('Comment Count (Số bình luận)', 'jankx'),
            ],
            [
                'value' => 'relevance',
                'label' => __('Relevance (Độ liên quan)', 'jankx'),
            ],
            [
                'value' => 'meta_value',
                'label' => __('Meta Value (Giá trị meta)', 'jankx'),
            ],
            [
                'value' => 'meta_value_num',
                'label' => __('Meta Value Num (Giá trị meta số)', 'jankx'),
            ],
            [
                'value' => 'post__in',
                'label' => __('Post__in (Thứ tự trong mảng)', 'jankx'),
            ],
            [
                'value' => 'post_name__in',
                'label' => __('Post Name__in (Thứ tự slug)', 'jankx'),
            ],
            [
                'value' => 'post_parent__in',
                'label' => __('Post Parent__in (Thứ tự parent)', 'jankx'),
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
                'label' => __('Descending (Giảm dần)', 'jankx'),
            ],
            [
                'value' => 'ASC',
                'label' => __('Ascending (Tăng dần)', 'jankx'),
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
     * Output all query options as JavaScript object
     *
     * @return void
     */
    public static function outputToJavaScript(): void
    {
        $options = [
            'orderBy' => self::getOrderByOptions(),
            'order' => self::getOrderOptions(),
            'metaCompare' => self::getMetaCompareOperators(),
            'metaTypes' => self::getMetaTypes(),
            'taxonomyOperators' => self::getTaxonomyOperators(),
        ];

        ?>
        <script>
            window.jankxQueryOptions = <?php echo wp_json_encode($options, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
        </script>
        <?php
    }
}

