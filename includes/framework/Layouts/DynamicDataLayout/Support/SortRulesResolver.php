<?php

namespace Jankx\Layouts\DynamicDataLayout\Support;

use Jankx\Gutenberg\QueryOptions;

/**
 * Sort Rules Resolver
 *
 * Turns the settings collected by the jankx/dynamic-data-sort-rules child block
 * into WP_Query arguments.
 *
 * Each rule mirrors the "Order By" / "Order" settings of the Query Settings
 * panel, so the editor and the query share a single option list:
 *
 *   ['orderBy' => 'date', 'order' => 'DESC']
 *   ['orderBy' => 'meta_value_num', 'order' => 'ASC', 'metaKey' => 'price']
 *   ['orderBy' => 'meta_value', 'order' => 'DESC', 'metaKey' => 'start_date', 'metaType' => 'DATE']
 *
 * Rules are applied in order, highest priority first, and WP_Query appends an
 * ID tiebreaker so pagination stays stable between requests.
 *
 * WP_Query can only order by a single meta key natively (meta_key/meta_type).
 * The first meta rule therefore goes through the native arguments, while every
 * following meta rule is resolved through a posts_clauses JOIN registered by
 * self::registerClauseFilter().
 *
 * @package Jankx\Layouts\DynamicDataLayout\Support
 * @since 2.0.0
 */
class SortRulesResolver
{
    /**
     * Guard so the clause filter is only attached once per query execution.
     *
     * @var bool
     */
    protected static $clauseFilterRegistered = false;

    /**
     * Secondary meta rules, kept between register and unregister.
     *
     * @var array[]
     */
    protected static $extraMetaRules = [];

    /**
     * orderby values that map to a real wp_posts column and are therefore safe
     * to combine into a multi-criteria ORDER BY array.
     *
     * Anything outside this list has to be applied as the only orderby value:
     *
     * - `post__in`, `post_name__in`, `post_parent__in` and `relevance` are only
     *   special-cased by WP_Query when they are the sole orderby (results are
     *   reordered in PHP, or a search fallback is added). Inside an array orderby
     *   WP_Query forwards them to MySQL, which fails on the unknown column.
     * - `rand` and `none` are not comparable columns.
     * - Values registered through the `jankx/gutenberg/query-options/order-by`
     *   filter (e.g. `post_views`) are translated by `pre_get_posts` handlers,
     *   which only run for a plain string orderby.
     *
     * @var string[]
     */
    protected const COMBINABLE_ORDERBY = [
        'date',
        'modified',
        'title',
        'name',
        'author',
        'type',
        'ID',
        'menu_order',
        'comment_count',
        'meta_value',
        'meta_value_num',
    ];

    /**
     * Whether an orderby value can be combined with other criteria.
     *
     * @param string $orderBy orderby value.
     * @return bool
     */
    protected static function isCombinable(string $orderBy): bool
    {
        return in_array($orderBy, self::COMBINABLE_ORDERBY, true);
    }

    /**
     * Sanitize the raw child-block attributes into a usable rule list.
     *
     * @param mixed $sortRules Raw "sortRules" attribute from the child block.
     * @return array{0: bool, 1: array[]} [enabled, rules]
     */
    public static function normalize($sortRules): array
    {
        if (!is_array($sortRules)) {
            return [false, []];
        }

        $enabled = !empty($sortRules['enabled']);

        if (!$enabled || empty($sortRules['rules']) || !is_array($sortRules['rules'])) {
            return [$enabled, []];
        }

        $allowedOrderBy = self::getAllowedOrderByValues();
        $rules = [];

        foreach ($sortRules['rules'] as $rule) {
            if (!is_array($rule)) {
                continue;
            }

            $orderBy = isset($rule['orderBy']) && is_string($rule['orderBy'])
                ? $rule['orderBy']
                : '';

            // Only accept values the editor can produce, so a hand-edited post
            // cannot inject an arbitrary column into the ORDER BY clause.
            if ($orderBy === '' || !in_array($orderBy, $allowedOrderBy, true)) {
                continue;
            }

            $normalizedRule = [
                'orderBy' => $orderBy,
                'order' => isset($rule['order']) && strtoupper((string) $rule['order']) === 'ASC'
                    ? 'ASC'
                    : 'DESC',
            ];

            if (in_array($orderBy, ['meta_value', 'meta_value_num'], true)) {
                $metaKey = isset($rule['metaKey']) && is_scalar($rule['metaKey'])
                    ? sanitize_key((string) $rule['metaKey'])
                    : '';

                // A meta rule without a meta key cannot be resolved.
                if ($metaKey === '') {
                    continue;
                }

                $normalizedRule['metaKey'] = $metaKey;

                if ($orderBy === 'meta_value') {
                    $metaType = isset($rule['metaType']) && is_string($rule['metaType'])
                        ? strtoupper($rule['metaType'])
                        : '';

                    if (in_array($metaType, self::getAllowedMetaTypes(), true)) {
                        $normalizedRule['metaType'] = $metaType;
                    }
                }
            }

            $rules[] = $normalizedRule;

            // A non-combinable criterion has to stay the only orderby value, so
            // any rule below it could never be applied anyway.
            if (!self::isCombinable($orderBy)) {
                break;
            }
        }

        return [$enabled, $rules];
    }

    /**
     * Whether the given attributes carry sort rules that should win over the
     * single "orderBy"/"order" pair of the Query Settings panel.
     *
     * @param array $attributes Block attributes.
     * @return bool
     */
    public static function hasRules(array $attributes): bool
    {
        [$enabled, $rules] = self::normalize($attributes['sortRules'] ?? null);

        return $enabled && !empty($rules);
    }

    /**
     * Apply the sort rules to a set of query arguments.
     *
     * Returns the arguments unchanged when there are no usable rules, so the
     * caller keeps whatever ordering it resolved from the Query Settings panel.
     *
     * @param array $args WP_Query arguments.
     * @param mixed $sortRules Raw "sortRules" attribute from the child block.
     * @return array
     */
    public static function applyToArgs(array $args, $sortRules): array
    {
        [$enabled, $rules] = self::normalize($sortRules);

        if (!$enabled || empty($rules)) {
            return $args;
        }

        // A rule that WP_Query can only honour on its own cancels the others.
        $standalone = null;
        foreach ($rules as $rule) {
            if (!self::isCombinable($rule['orderBy'])) {
                $standalone = $rule;
                break;
            }
        }

        if ($standalone !== null) {
            $args['orderby'] = $standalone['orderBy'];
            $args['order'] = $standalone['orderBy'] === 'post__in' ? 'ASC' : $standalone['order'];
            unset($args['meta_key'], $args['meta_type']);

            return $args;
        }

        $orderby = [];
        $nativeMetaRule = null;
        $extraMetaRules = [];

        foreach ($rules as $rule) {
            $order = $rule['order'];

            if (in_array($rule['orderBy'], ['meta_value', 'meta_value_num'], true)) {
                if ($nativeMetaRule === null) {
                    $nativeMetaRule = $rule;
                    $orderby[$rule['orderBy']] = $order;
                    continue;
                }

                // WP_Query supports a single meta_key, so the rest need a JOIN.
                $extraMetaRules[] = $rule;
                continue;
            }

            $orderby[$rule['orderBy']] = $order;
        }

        // Stable pagination requires a deterministic tiebreaker.
        $orderby['ID'] = 'DESC';

        $args['orderby'] = $orderby;
        unset($args['order']);

        if ($nativeMetaRule !== null) {
            $args['meta_key'] = $nativeMetaRule['metaKey'];

            if (!empty($nativeMetaRule['metaType'])) {
                $args['meta_type'] = $nativeMetaRule['metaType'];
            }
        }

        if (!empty($extraMetaRules)) {
            self::registerClauseFilter($extraMetaRules);
        }

        return $args;
    }

    /**
     * Remove the posts_clauses filter after the query has been executed.
     *
     * WP_Query runs its SQL inside the constructor, so the filter only has to
     * live for the duration of the query and must not leak into other queries
     * (which could be the main query).
     *
     * @return void
     */
    public static function unregisterClauseFilter(): void
    {
        if (!self::$clauseFilterRegistered) {
            return;
        }

        remove_filter('posts_clauses', [self::class, 'filterPostsClauses']);

        self::$clauseFilterRegistered = false;
    }

    /**
     * Attach the posts_clauses filter that resolves secondary meta rules.
     *
     * @param array[] $extraMetaRules Meta rules beyond the first one.
     * @return void
     */
    protected static function registerClauseFilter(array $extraMetaRules): void
    {
        if (self::$clauseFilterRegistered) {
            return;
        }

        add_filter('posts_clauses', [self::class, 'filterPostsClauses']);

        self::$clauseFilterRegistered = true;
        self::$extraMetaRules = $extraMetaRules;
    }

    /**
     * Add one LEFT JOIN per secondary meta rule and extend the ORDER BY.
     *
     * @param array $clauses SQL clauses.
     * @return array
     */
    public static function filterPostsClauses($clauses)
    {
        if (empty(self::$extraMetaRules) || !is_array($clauses)) {
            return $clauses;
        }

        global $wpdb;

        if (!($wpdb instanceof \wpdb)) {
            return $clauses;
        }

        $orderParts = [];
        $joins = [];
        $index = 0;

        foreach (self::$extraMetaRules as $rule) {
            $alias = 'jankx_sr_' . $index++;

            $joins[] = $wpdb->prepare(
                "LEFT JOIN {$wpdb->postmeta} AS {$alias} ON ({$alias}.post_id = {$wpdb->posts}.ID AND {$alias}.meta_key = %s)",
                $rule['metaKey']
            );

            $orderParts[] = sprintf(
                '%s %s',
                self::buildOrderExpression($alias, $rule),
                self::sanitizeDirection($rule['order'])
            );
        }

        if (empty($orderParts)) {
            return $clauses;
        }

        if (!empty($clauses['join'])) {
            $clauses['join'] .= ' ' . implode(' ', $joins);
        } else {
            $clauses['join'] = implode(' ', $joins);
        }

        $orderParts[] = $wpdb->posts . '.ID DESC';

        if (!empty($clauses['orderby'])) {
            $clauses['orderby'] .= ' ' . implode(', ', $orderParts);
        } else {
            $clauses['orderby'] = implode(', ', $orderParts);
        }

        return $clauses;
    }

    /**
     * Build the SQL expression that orders a joined meta alias.
     *
     * Numeric and date meta values are stored as strings, so they are cast the
     * same way WooCommerce does before sorting.
     *
     * @param string $alias Joined meta table alias.
     * @param array $rule Normalized rule.
     * @return string
     */
    protected static function buildOrderExpression(string $alias, array $rule): string
    {
        if ($rule['orderBy'] === 'meta_value_num') {
            return "CAST({$alias}.meta_value AS DECIMAL(30,10))";
        }

        if (isset($rule['metaType']) && in_array($rule['metaType'], ['DATE', 'DATETIME'], true)) {
            $format = $rule['metaType'] === 'DATE' ? '%Y-%m-%d' : '%Y-%m-%d %H:%i:%s';

            return "STR_TO_DATE({$alias}.meta_value, '{$format}')";
        }

        return "{$alias}.meta_value";
    }

    /**
     * Clamp a direction to ASC/DESC.
     *
     * @param mixed $order Direction.
     * @return string
     */
    protected static function sanitizeDirection($order): string
    {
        return strtoupper((string) $order) === 'ASC' ? 'ASC' : 'DESC';
    }

    /**
     * Allowed orderby values, taken from the same source as the editor select.
     *
     * @return string[]
     */
    public static function getAllowedOrderByValues(): array
    {
        $values = [];

        foreach (QueryOptions::getOrderByOptions() as $option) {
            if (!empty($option['value']) && is_string($option['value'])) {
                $values[] = $option['value'];
            }
        }

        if (empty($values)) {
            $values = ['date', 'modified', 'title', 'name', 'author', 'type', 'ID', 'menu_order', 'rand', 'comment_count', 'meta_value', 'meta_value_num'];
        }

        return array_values(array_unique($values));
    }

    /**
     * Allowed meta_type values for meta_value rules.
     *
     * @return string[]
     */
    public static function getAllowedMetaTypes(): array
    {
        return ['NUMERIC', 'BINARY', 'CHAR', 'DATE', 'DATETIME', 'DECIMAL', 'SIGNED', 'TIME', 'UNSIGNED'];
    }
}