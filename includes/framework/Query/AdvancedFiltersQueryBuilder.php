<?php

/**
 * Advanced Filters Query Builder
 *
 * Specialized query builder for Advanced Filters Block
 * Uses composition with PostTypeQueryBuilder
 * Follows Open/Closed Principle
 *
 * @package Jankx\Query
 * @since 1.0.0
 */

namespace Jankx\Query;

use Jankx\Contracts\Query\QueryBuilderInterface;
use WP_Query;

class AdvancedFiltersQueryBuilder implements QueryBuilderInterface
{
    /**
     * Base query builder
     *
     * @var PostTypeQueryBuilder
     */
    protected $baseBuilder;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->baseBuilder = new PostTypeQueryBuilder();
    }

    /**
     * Build query arguments from block attributes and filters
     *
     * @param array $block_attrs Block attributes
     * @param array $filters Filter values
     * @return array WP_Query arguments
     */
    public function buildFromFilters(array $block_attrs, array $filters): array
    {
        // Reset builder
        $this->baseBuilder->reset();

        // Set basic attributes
        $this->baseBuilder
            ->setPostType($block_attrs['postType'] ?? 'post')
            ->setPerPage($block_attrs['postsPerPage'] ?? 10)
            ->setOrderBy($block_attrs['orderBy'] ?? 'date')
            ->setOrder($block_attrs['order'] ?? 'DESC')
            ->setOffset($block_attrs['offset'] ?? 0);

        // Set post__in/post__not_in
        if (!empty($block_attrs['exclude'])) {
            $this->baseBuilder->setPostNotIn($block_attrs['exclude']);
        }
        if (!empty($block_attrs['include'])) {
            $this->baseBuilder->setPostIn($block_attrs['include']);
        }

        // Apply taxonomy filters
        if (!empty($filters['taxonomy'])) {
            foreach ($filters['taxonomy'] as $taxonomy => $terms) {
                if (!empty($terms)) {
                    $this->baseBuilder->addTaxonomy($taxonomy, 'term_id', $terms, 'IN');
                }
            }
        }

        // Apply meta filters
        if (!empty($filters['meta'])) {
            foreach ($filters['meta'] as $meta_filter) {
                if (!empty($meta_filter['metaKey']) && !empty($meta_filter['value'])) {
                    $compare = $this->getMetaCompareOperator($meta_filter['operator'] ?? 'equals');
                    $this->baseBuilder->addMeta(
                        $meta_filter['metaKey'],
                        $meta_filter['value'],
                        $compare
                    );
                }
            }
        }

        // Apply date filters
        if (!empty($filters['date'])) {
            foreach ($filters['date'] as $date_filter) {
                if (!empty($date_filter['field'])) {
                    $this->baseBuilder->addDate(
                        $date_filter['field'],
                        $date_filter['startDate'] ?? null,
                        $date_filter['endDate'] ?? null,
                        true
                    );
                }
            }
        }

        // Apply price filters
        if (!empty($filters['price'])) {
            foreach ($filters['price'] as $price_filter) {
                if (!empty($price_filter['field'])) {
                    if (!empty($price_filter['minPrice'])) {
                        $this->baseBuilder->addMeta(
                            $price_filter['field'],
                            $price_filter['minPrice'],
                            '>=',
                            'NUMERIC'
                        );
                    }
                    if (!empty($price_filter['maxPrice'])) {
                        $this->baseBuilder->addMeta(
                            $price_filter['field'],
                            $price_filter['maxPrice'],
                            '<=',
                            'NUMERIC'
                        );
                    }
                }
            }
        }

        // Build base args
        $args = $this->baseBuilder->build();
        
        // Add post_status
        $args['post_status'] = 'publish';

        // Apply hooks
        $args = apply_filters('jankx_advanced_filter_query_args', $args, $filters, $block_attrs);

        return $args;
    }

    /**
     * Get meta compare operator
     *
     * @param string $operator
     * @return string
     */
    protected function getMetaCompareOperator(string $operator): string
    {
        $operators = [
            'equals' => '=',
            'contains' => 'LIKE',
            'starts_with' => 'LIKE',
            'ends_with' => 'LIKE',
            'greater_than' => '>',
            'less_than' => '<',
            'exists' => 'EXISTS',
            'not_exists' => 'NOT EXISTS',
        ];

        return $operators[$operator] ?? '=';
    }

    /**
     * {@inheritDoc}
     */
    public function build(array $params = []): array
    {
        return $this->baseBuilder->build($params);
    }

    /**
     * {@inheritDoc}
     */
    public function query(array $params = []): WP_Query
    {
        return $this->baseBuilder->query($params);
    }

    /**
     * {@inheritDoc}
     */
    public function getQuery(): ?WP_Query
    {
        return $this->baseBuilder->getQuery();
    }

    /**
     * {@inheritDoc}
     */
    public function reset(): self
    {
        $this->baseBuilder->reset();
        return $this;
    }
}

