<?php

namespace Jankx\Layouts\DynamicDataLayout\Support;

use Jankx\Facades\Log;
use Jankx\Layouts\DynamicDataLayout\Contracts\PostLayoutInterface;
use Jankx\Multilingual\MultilingualFactory;
use WP_Query;

class LayoutQueryBuilder
{
    protected array $attributes;
    protected PostLayoutInterface $layout;

    public function __construct(array $attributes, PostLayoutInterface $layout)
    {
        $this->attributes = $attributes;
        $this->layout = $layout;
    }

    public function build(): WP_Query
    {
        $args = $this->buildBaseArgs();
        $args = $this->applyPaginationArgs($args);
        $args = $this->applyFilterArgs($args);
        $args = $this->applyLanguageArgs($args);
        $args = $this->applyFilters($args);

        return new WP_Query($args);
    }

    protected function buildBaseArgs(): array
    {
        [$orderby, $order] = $this->resolveOrdering();

        $args = [
            'post_type' => !empty($this->attributes['postTypes']) && is_array($this->attributes['postTypes'])
                ? array_values(array_filter(array_map('sanitize_key', (array) $this->attributes['postTypes'])))
                : ($this->attributes['postType'] ?? 'post'),
            'posts_per_page' => $this->attributes['postsPerPage'] ?? 10,
            'orderby' => $orderby,
            'post_status' => 'publish',
        ];

        if ($order !== null) {
            $args['order'] = $order;
        }

        if ($this->isPostType('post')) {
            $includeSticky = !empty($this->attributes['includeStickyPosts']);
            $args['ignore_sticky_posts'] = $includeSticky ? 0 : 1;
        }

        return $args;
    }

    protected function resolveOrdering(): array
    {
        $orderby = $this->attributes['orderBy'] ?? 'date';
        $order = $this->attributes['order'] ?? 'DESC';

        if ($orderby === 'rand' || $orderby === 'none') {
            return [$orderby, $order];
        }

        $orderbyArray = [$orderby => $order, 'ID' => 'DESC'];
        return [$orderbyArray, null];
    }

    protected function applyPaginationArgs(array $args): array
    {
        if (isset($this->attributes['_internal_paged']) && $this->attributes['_internal_paged'] > 0) {
            $args['paged'] = (int) $this->attributes['_internal_paged'];
        }

        if (!empty($this->attributes['enablePagination'])) {
            $paged = get_query_var('paged') ?: 1;
            $args['paged'] = $paged;

            if (isset($args['offset']) && $paged > 1) {
                $args['offset'] = $args['offset'] + ($args['posts_per_page'] * ($paged - 1));
            }
        }

        if (isset($this->attributes['offset']) && $this->attributes['offset'] > 0) {
            $args['offset'] = (int) $this->attributes['offset'];
        }

        return $args;
    }

    protected function applyFilterArgs(array $args): array
    {
        $args = $this->applyStatusArgs($args);
        $args = $this->applyMetaOrderingArgs($args);
        $args = $this->applyParentArgs($args);
        $args = $this->applyKeywordArgs($args);
        $args = $this->applyAuthorArgs($args);
        $args = $this->applyPostIdArgs($args);
        $args = $this->applyTaxQueryArgs($args);
        $args = $this->applyMetaQueryArgs($args);
        return $args;
    }

    protected function applyStatusArgs(array $args): array
    {
        if (!empty($this->attributes['postStatus']) && is_array($this->attributes['postStatus'])) {
            $args['post_status'] = $this->attributes['postStatus'];
        }
        return $args;
    }

    protected function applyMetaOrderingArgs(array $args): array
    {
        if (empty($this->attributes['metaKey'])) {
            return $args;
        }
        if (!in_array($this->attributes['orderBy'], ['meta_value', 'meta_value_num'], true)) {
            return $args;
        }
        $args['meta_key'] = sanitize_key($this->attributes['metaKey']);
        if (!empty($this->attributes['metaType'])) {
            $args['meta_type'] = $this->attributes['metaType'];
        }
        $metaOrder = $this->attributes['order'] ?? 'DESC';
        $args['orderby'] = [$this->attributes['orderBy'] => $metaOrder, 'ID' => 'DESC'];
        unset($args['order']);
        return $args;
    }

    protected function applyParentArgs(array $args): array
    {
        if (!empty($this->attributes['postParent'])) {
            $args['post_parent'] = (int) $this->attributes['postParent'];
        }
        if (!empty($this->attributes['postParentIn'])) {
            $args['post_parent__in'] = array_map('intval', (array) $this->attributes['postParentIn']);
        }
        if (!empty($this->attributes['postParentNotIn'])) {
            $args['post_parent__not_in'] = array_map('intval', (array) $this->attributes['postParentNotIn']);
        }
        return $args;
    }

    protected function applyKeywordArgs(array $args): array
    {
        if (empty($this->attributes['keyword'])) {
            return $args;
        }
        $args['s'] = sanitize_text_field($this->attributes['keyword']);
        return $args;
    }

    protected function applyAuthorArgs(array $args): array
    {
        if (!empty($this->attributes['authorIn'])) {
            $args['author__in'] = array_map('intval', (array) $this->attributes['authorIn']);
        }
        if (!empty($this->attributes['authorNotIn'])) {
            $args['author__not_in'] = array_map('intval', (array) $this->attributes['authorNotIn']);
        }
        return $args;
    }

    protected function applyPostIdArgs(array $args): array
    {
        if (!empty($this->attributes['postIn'])) {
            $args['post__in'] = array_map('intval', (array) $this->attributes['postIn']);
        }
        if (!empty($this->attributes['postNotIn'])) {
            $args['post__not_in'] = array_map('intval', (array) $this->attributes['postNotIn']);
        }
        return $args;
    }

    protected function applyTaxQueryArgs(array $args): array
    {
        if (empty($this->attributes['taxQuery']) || !is_array($this->attributes['taxQuery'])) {
            return $args;
        }
        $taxQuery = [];
        foreach ($this->attributes['taxQuery'] as $taxItem) {
            $taxonomy = $taxItem['taxonomy'] ?? '';
            if ($taxonomy === '') {
                continue;
            }
            $operator = $this->sanitizeOperator($taxItem['operator'] ?? 'IN');
            $taxQueryItem = [
                'taxonomy' => sanitize_key($taxonomy),
                'operator' => $operator,
            ];
            if (!in_array($operator, ['EXISTS', 'NOT EXISTS'], true)) {
                if (empty($taxItem['terms'])) {
                    continue;
                }
                $taxQueryItem['field'] = 'term_id';
                $taxQueryItem['terms'] = array_map('intval', (array) $taxItem['terms']);
            }
            $taxQuery[] = $taxQueryItem;
        }
        if (!empty($taxQuery)) {
            $args['tax_query'] = $taxQuery;
        }
        return $args;
    }

    protected function applyMetaQueryArgs(array $args): array
    {
        if (empty($this->attributes['metaQuery']) || !is_array($this->attributes['metaQuery'])) {
            return $args;
        }
        $metaQuery = [];
        foreach ($this->attributes['metaQuery'] as $metaItem) {
            if (empty($metaItem['key'])) {
                continue;
            }
            $metaQueryItem = [
                'key' => sanitize_key($metaItem['key']),
            ];
            $compare = $this->sanitizeCompareOperator($metaItem['compare'] ?? '=');
            $metaQueryItem['compare'] = $compare;
            if (!in_array($compare, ['EXISTS', 'NOT EXISTS'], true) && isset($metaItem['value'])) {
                $metaQueryItem['value'] = sanitize_text_field($metaItem['value']);
            }
            if (!empty($metaItem['type'])) {
                $type = $this->sanitizeMetaType($metaItem['type']);
                if ($type !== '') {
                    $metaQueryItem['type'] = $type;
                }
            }
            $metaQuery[] = $metaQueryItem;
        }
        if (!empty($metaQuery)) {
            $args['meta_query'] = $metaQuery;
        }
        return $args;
    }

    protected function sanitizeOperator(string $operator): string
    {
        $allowed = ['IN', 'NOT IN', 'AND', 'EXISTS', 'NOT EXISTS'];
        return in_array($operator, $allowed, true) ? $operator : 'IN';
    }

    protected function sanitizeCompareOperator(string $compare): string
    {
        $allowed = ['=', '!=', '>', '>=', '<', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'EXISTS', 'NOT EXISTS'];
        return in_array($compare, $allowed, true) ? $compare : '=';
    }

    protected function sanitizeMetaType(string $type): string
    {
        $allowed = ['NUMERIC', 'BINARY', 'CHAR', 'DATE', 'DATETIME', 'DECIMAL', 'SIGNED', 'TIME', 'UNSIGNED'];
        return in_array($type, $allowed, true) ? $type : '';
    }

    protected function applyLanguageArgs(array $args): array
    {
        if (empty($this->attributes['_current_language'])) {
            return $args;
        }
        $language = $this->attributes['_current_language'];
        $args = MultilingualFactory::addLanguageToQueryArgs($args, $language);
        return $args;
    }

    protected function applyFilters(array $args): array
    {
        $args = apply_filters('jankx/post-layout/query-args', $args, $this->attributes);
        $args = apply_filters('jankx/post-layout/query-args/' . $this->layout->getName(), $args, $this->attributes);
        if (!empty($this->attributes['customQueryId'])) {
            $customQueryId = sanitize_key($this->attributes['customQueryId']);
            $args = apply_filters('jankx/post-layout/query-args/' . $customQueryId, $args, $this->attributes);
        }
        return $args;
    }

    // removed unused debug methods

    protected function isPostType(string $type): bool
    {
        return ($this->attributes['postType'] ?? 'post') === $type;
    }
}
