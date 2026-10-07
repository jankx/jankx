<?php

namespace Jankx\Cache\Invalidation;

use Jankx\Cache\Contracts\CacheSubscriberInterface;
use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;

/**
 * Keeps every cache layer coherent with the content (Observer pattern).
 *
 * Two invalidations, deliberately different in granularity:
 *
 * - query cache → one bucket bump per change (cheap, and a post save really
 *   does invalidate every post listing);
 * - page cache  → tag + URL purge, so an edge cache only drops the pages that
 *   actually changed (LiteSpeed tags / HTTP PURGE / storage flush).
 *
 * @package Jankx\Cache\Invalidation
 * @since 2.0.0
 */
class ContentInvalidationSubscriber implements CacheSubscriberInterface
{
    /**
     * @var PageCacheInterface
     */
    private $pageCache;

    /**
     * @var QueryCacheInterface
     */
    private $queryCache;

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @param PageCacheInterface  $pageCache Page cache.
     * @param QueryCacheInterface $queryCache Query cache.
     * @param array<string,mixed> $options   cache.query configuration.
     */
    public function __construct(PageCacheInterface $pageCache, QueryCacheInterface $queryCache, array $options = [])
    {
        $this->pageCache = $pageCache;
        $this->queryCache = $queryCache;
        $this->options = $options;
    }

    /**
     * @inheritdoc
     */
    public function subscribe(): void
    {
        if (!function_exists('add_action')) {
            return;
        }

        add_action('save_post', [$this, 'onSavePost'], 20, 3);
        add_action('deleted_post', [$this, 'onPostDeleted'], 20, 1);
        add_action('edited_term', [$this, 'onTermChanged'], 20, 3);
        add_action('delete_term', [$this, 'onTermDeleted'], 20, 4);
        add_action('switch_theme', [$this, 'onEverythingChanged']);
        add_action('upgrader_process_complete', [$this, 'onEverythingChanged'], 20, 2);
        add_action('customize_save_after', [$this, 'onEverythingChanged']);
    }

    /**
     * A post was created/updated (revisions and autosaves are ignored).
     *
     * @param int          $postId Post ID.
     * @param \WP_Post|null $post  Post object.
     * @param bool         $update Whether this is an existing post being updated.
     * @return void
     */
    public function onSavePost($postId, $post = null, $update = null): void
    {
        $postId = (int) $postId;
        if ($postId <= 0) {
            return;
        }

        if (function_exists('wp_is_post_revision') && wp_is_post_revision($postId)) {
            return;
        }

        if (function_exists('wp_is_post_autosave') && wp_is_post_autosave($postId)) {
            return;
        }

        $postType = is_object($post) && !empty($post->post_type)
            ? (string) $post->post_type
            : (function_exists('get_post_type') ? (string) get_post_type($postId) : 'post');

        if ($postType === '' || $postType === 'false') {
            $postType = 'post';
        }

        $this->invalidate($this->postTags($postId, $postType), $this->urlsFor($postId));
    }

    /**
     * A post was deleted.
     *
     * @param int $postId Post ID.
     * @return void
     */
    public function onPostDeleted($postId): void
    {
        $postId = (int) $postId;
        $postType = function_exists('get_post_type') ? (string) get_post_type($postId) : 'post';

        $this->invalidate($this->postTags($postId, $postType ?: 'post'), $this->urlsFor($postId));
    }

    /**
     * A term was edited.
     *
     * @param int    $termId  Term ID.
     * @param int    $ttId    Term taxonomy ID.
     * @param string $taxonomy Taxonomy name.
     * @return void
     */
    public function onTermChanged($termId, $ttId = 0, $taxonomy = ''): void
    {
        $this->invalidate($this->termTags($termId, $taxonomy), $this->homeUrls());
    }

    /**
     * A term was deleted.
     *
     * @param object|int $term     Term object or ID.
     * @param int        $ttId     Term taxonomy ID.
     * @param string     $taxonomy Taxonomy name.
     * @return void
     */
    public function onTermDeleted($term, $ttId = 0, $taxonomy = ''): void
    {
        if (is_object($term) && !empty($taxonomy)) {
            $termId = isset($term->term_id) ? (int) $term->term_id : 0;
        } else {
            $termId = (int) $term;
        }

        $this->invalidate($this->termTags($termId, (string) $taxonomy), $this->homeUrls());
    }

    /**
     * Everything is stale: theme switched, plugin/theme upgraded, Customizer
     * saved.
     *
     * @return void
     */
    public function onEverythingChanged(): void
    {
        if (!empty($this->options['enabled'])) {
            $this->queryCache->flush();
        }

        $this->pageCache->purge(['all'], []);
    }

    /**
     * @param string[] $tags Cache tags.
     * @param string[] $urls Absolute URLs.
     * @return void
     */
    private function invalidate(array $tags, array $urls): void
    {
        if (!empty($this->options['enabled'])) {
            $this->queryCache->flushBucket($this->bucket());
        }

        $this->pageCache->purge($tags, $urls);
    }

    /**
     * @param int    $postId   Post ID.
     * @param string $postType Post type.
     * @return string[]
     */
    private function postTags($postId, string $postType): array
    {
        return array_values(array_unique([
            'all',
            'home',
            'front-page',
            'post-' . (int) $postId,
            'type-' . $postType,
        ]));
    }

    /**
     * @param int    $termId   Term ID.
     * @param string $taxonomy Taxonomy name.
     * @return string[]
     */
    private function termTags($termId, string $taxonomy): array
    {
        $tags = ['all', 'home', 'front-page'];

        if ((int) $termId > 0) {
            $tags[] = 'term-' . (int) $termId;
        }
        if ($taxonomy !== '') {
            $tags[] = 'taxonomy-' . $taxonomy;
        }

        return $tags;
    }

    /**
     * @param int $postId Post ID.
     * @return string[]
     */
    private function urlsFor($postId): array
    {
        $urls = $this->homeUrls();

        if ($postId && function_exists('get_permalink')) {
            $permalink = get_permalink($postId);
            if (is_string($permalink) && $permalink !== '') {
                $urls[] = $permalink;
            }
        }

        return $urls;
    }

    /**
     * @return string[]
     */
    private function homeUrls(): array
    {
        return function_exists('home_url') ? [home_url('/')] : [];
    }

    /**
     * @return string
     */
    private function bucket(): string
    {
        return !empty($this->options['bucket']) ? (string) $this->options['bucket'] : 'posts';
    }
}
