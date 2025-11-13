<?php

/**
 * Post Type Query Builder
 *
 * Implements Builder Pattern for WordPress post queries
 * Follows Single Responsibility Principle
 *
 * @package Jankx\Query
 * @since 1.0.0
 */

namespace Jankx\Query;

use Jankx\Contracts\Query\PostTypeQueryInterface;
use Jankx\Contracts\Query\TaxonomyQueryInterface;
use Jankx\Contracts\Query\MetaQueryInterface;
use Jankx\Contracts\Query\DateQueryInterface;
use WP_Query;

class PostTypeQueryBuilder implements PostTypeQueryInterface, TaxonomyQueryInterface, MetaQueryInterface, DateQueryInterface
{
    /**
     * Query arguments
     *
     * @var array
     */
    protected $args = [];

    /**
     * WP_Query instance
     *
     * @var WP_Query|null
     */
    protected $query = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->reset();
    }

    /**
     * {@inheritDoc}
     */
    public function setPostType($post_type): self
    {
        $this->args['post_type'] = $post_type;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setPerPage(int $per_page): self
    {
        $this->args['posts_per_page'] = $per_page;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setOrderBy(string $orderby): self
    {
        $this->args['orderby'] = $orderby;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setOrder(string $order): self
    {
        $this->args['order'] = strtoupper($order);
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setPaged(int $paged): self
    {
        $this->args['paged'] = $paged;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setOffset(int $offset): self
    {
        $this->args['offset'] = $offset;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setPostIn(array $post__in): self
    {
        $this->args['post__in'] = $post__in;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setPostNotIn(array $post__not_in): self
    {
        $this->args['post__not_in'] = $post__not_in;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setAuthor($author): self
    {
        $this->args['author'] = $author;
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function addTaxonomy(string $taxonomy, string $field, array $terms, string $operator = 'IN'): self
    {
        if (!isset($this->args['tax_query'])) {
            $this->args['tax_query'] = [];
        }

        $this->args['tax_query'][] = [
            'taxonomy' => $taxonomy,
            'field' => $field,
            'terms' => $terms,
            'operator' => $operator,
        ];

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getTaxQueries(): array
    {
        return $this->args['tax_query'] ?? [];
    }

    /**
     * {@inheritDoc}
     */
    public function resetTaxQueries(): self
    {
        unset($this->args['tax_query']);
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function addMeta(string $key, $value, string $compare = '=', string $type = ''): self
    {
        if (!isset($this->args['meta_query'])) {
            $this->args['meta_query'] = [];
        }

        $meta_query = [
            'key' => $key,
            'value' => $value,
            'compare' => $compare,
        ];

        if (!empty($type)) {
            $meta_query['type'] = $type;
        }

        $this->args['meta_query'][] = $meta_query;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function setMetaRelation(string $relation): self
    {
        if (!isset($this->args['meta_query'])) {
            $this->args['meta_query'] = [];
        }

        $this->args['meta_query']['relation'] = strtoupper($relation);
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getMetaQueries(): array
    {
        return $this->args['meta_query'] ?? [];
    }

    /**
     * {@inheritDoc}
     */
    public function resetMetaQueries(): self
    {
        unset($this->args['meta_query']);
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function addDate(string $column, ?string $after = null, ?string $before = null, bool $inclusive = true): self
    {
        if (!isset($this->args['date_query'])) {
            $this->args['date_query'] = [];
        }

        $date_query = [
            'column' => $column,
            'inclusive' => $inclusive,
        ];

        if ($after !== null) {
            $date_query['after'] = $after;
        }

        if ($before !== null) {
            $date_query['before'] = $before;
        }

        $this->args['date_query'][] = $date_query;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getDateQueries(): array
    {
        return $this->args['date_query'] ?? [];
    }

    /**
     * {@inheritDoc}
     */
    public function resetDateQueries(): self
    {
        unset($this->args['date_query']);
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function build(array $params = []): array
    {
        // Merge provided params with current args
        if (!empty($params)) {
            $this->args = array_merge($this->args, $params);
        }

        // Apply filters
        $args = apply_filters('jankx/query/post-type/before_build', $this->args);

        return $args;
    }

    /**
     * {@inheritDoc}
     */
    public function query(array $params = []): WP_Query
    {
        $args = $this->build($params);

        // Execute query
        $this->query = new WP_Query($args);

        // Apply filters after query
        do_action('jankx/query/post-type/after_query', $this->query, $args);

        return $this->query;
    }

    /**
     * {@inheritDoc}
     */
    public function getQuery(): ?WP_Query
    {
        return $this->query;
    }

    /**
     * {@inheritDoc}
     */
    public function reset(): self
    {
        $this->args = [];
        $this->query = null;
        return $this;
    }
}

