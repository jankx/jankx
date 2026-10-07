<?php

namespace Jankx\Cache\Query;

use Jankx\Cache\Contracts\QueryCacheInterface;
use Jankx\Cache\Contracts\QueryKeyGeneratorInterface;

/**
 * Transparent WP_Query layer (Observer + Decorator).
 *
 * - `posts_pre_query` serves a cached result and short-circuits the database.
 * - `the_posts` persists what the database (or another short-circuiting
 *   plugin) produced, after sticky posts and `found_posts` are final.
 *
 * Both hooks receive the WP_Query by reference, and `the_posts` fires on the
 * cache-hit path too — hence the per-request "served" set, which prevents
 * writing back what was just read.
 *
 * Only public, filter-enabled, front-end queries are cached; a query is keyed
 * by its final SQL, so every clause filter (ordering, meta, search) is part of
 * the identity of the entry.
 *
 * @package Jankx\Cache\Query
 * @since 2.0.0
 */
class QueryCacheInterceptor
{
    /**
     * @var QueryCacheInterface
     */
    private $cache;

    /**
     * @var QueryKeyGeneratorInterface
     */
    private $keys;

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @var \SplObjectStorage
     */
    private $served;

    /**
     * @param QueryCacheInterface       $cache   Query cache.
     * @param QueryKeyGeneratorInterface $keys   Query key generator.
     * @param array<string,mixed>       $options cache.query configuration.
     */
    public function __construct(QueryCacheInterface $cache, QueryKeyGeneratorInterface $keys, array $options = [])
    {
        $this->cache = $cache;
        $this->keys = $keys;
        $this->options = $options;
        $this->served = new \SplObjectStorage();
    }

    /**
     * Register both hooks.
     *
     * @return void
     */
    public function register(): void
    {
        if (!function_exists('add_filter') || !$this->cache->isEnabled()) {
            return;
        }

        add_filter('posts_pre_query', [$this, 'serve'], 10, 2);
        add_filter('the_posts', [$this, 'store'], 10, 2);
    }

    /**
     * Serve a cached result (returns null to let WordPress query the database).
     *
     * @param mixed $posts Current value passed by WP_Query.
     * @param mixed $query WP_Query instance (by reference).
     * @return mixed
     */
    public function serve($posts, $query)
    {
        // Another callback already short-circuited: never override it.
        if ($posts !== null) {
            return $posts;
        }

        if (!$this->isCacheable($query)) {
            return null;
        }

        $key = $this->keyFor($query);
        if ($key === null) {
            return null;
        }

        $payload = $this->cache->get($key, $this->bucket());
        if (!is_array($payload) || !isset($payload['posts']) || !is_array($payload['posts'])) {
            return null;
        }

        if (($payload['fields'] ?? null) !== $this->fieldsOf($query)) {
            return null;
        }

        $query->found_posts = isset($payload['found_posts']) ? (int) $payload['found_posts'] : count($payload['posts']);
        $query->max_num_pages = isset($payload['max_num_pages']) ? (int) $payload['max_num_pages'] : 0;

        $this->served->attach($query);

        return $payload['posts'];
    }

    /**
     * Persist the result produced by the database (or another plugin).
     *
     * @param mixed $posts Posts being filtered.
     * @param mixed $query WP_Query instance (by reference).
     * @return mixed
     */
    public function store($posts, $query)
    {
        if ($this->served->contains($query)) {
            // Just served from cache: writing it back would be a no-op that
            // also hides a `the_posts` plugin filter applied to the hit.
            $this->served->detach($query);

            return $posts;
        }

        if (!$this->isCacheable($query) || !is_array($posts)) {
            return $posts;
        }

        $key = $this->keyFor($query);
        if ($key === null) {
            return $posts;
        }

        $foundPosts = isset($query->found_posts) && is_numeric($query->found_posts)
            ? (int) $query->found_posts
            : count($posts);
        $maxPages = isset($query->max_num_pages) && is_numeric($query->max_num_pages)
            ? (int) $query->max_num_pages
            : 0;

        $this->cache->put($key, [
            'fields' => $this->fieldsOf($query),
            'posts' => $posts,
            'found_posts' => $foundPosts,
            'max_num_pages' => $maxPages,
        ], $this->ttl(), $this->bucket());

        return $posts;
    }

    /**
     * Whether this query may enter the cache.
     *
     * @param mixed $query WP_Query instance.
     * @return bool
     */
    public function isCacheable($query): bool
    {
        if (!$this->cache->isEnabled() || !is_object($query)) {
            return false;
        }

        if (empty($query->request) || !is_string($query->request)) {
            return false;
        }

        $queryVars = isset($query->query_vars) && is_array($query->query_vars) ? $query->query_vars : [];

        if (!empty($queryVars['suppress_filters'])) {
            return false;
        }

        if (array_key_exists('cache_results', $queryVars) && !$queryVars['cache_results']) {
            return false;
        }

        if (!empty($queryVars['perm'])) {
            return false;
        }

        // Only publishable content: a status such as `any` or `private` would
        // let one visitor read another visitor's posts.
        $status = $queryVars['post_status'] ?? '';
        if ($status !== '' && $status !== 'publish') {
            if (!is_array($status) || $status !== ['publish']) {
                return false;
            }
        }

        foreach ((array) ($this->options['exclude_patterns'] ?? []) as $pattern) {
            if ($pattern !== '' && stripos($query->request, $pattern) !== false) {
                return false;
            }
        }

        if (!empty($this->options['public_only']) && function_exists('is_user_logged_in') && is_user_logged_in()) {
            return false;
        }

        if (!empty($this->options['frontend_only'])) {
            if (function_exists('is_admin') && is_admin()) {
                return false;
            }
            if (function_exists('wp_doing_ajax') && wp_doing_ajax()) {
                return false;
            }
            if (defined('REST_REQUEST') && REST_REQUEST) {
                return false;
            }
            if (defined('DOING_CRON') && DOING_CRON) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param mixed $query WP_Query instance.
     * @return string|null
     */
    private function keyFor($query): ?string
    {
        if (!is_object($query) || empty($query->request)) {
            return null;
        }

        return $this->keys->generate((string) $query->request, [
            'fields' => $this->fieldsOf($query),
        ])->value();
    }

    /**
     * @param mixed $query WP_Query instance.
     * @return string
     */
    private function fieldsOf($query): string
    {
        if (isset($query->query_vars['fields'])) {
            return (string) $query->query_vars['fields'];
        }

        return '';
    }

    /**
     * @return string
     */
    private function bucket(): string
    {
        return !empty($this->options['bucket']) ? (string) $this->options['bucket'] : 'posts';
    }

    /**
     * @return int
     */
    private function ttl(): int
    {
        return !empty($this->options['ttl']) ? (int) $this->options['ttl'] : 3600;
    }
}
