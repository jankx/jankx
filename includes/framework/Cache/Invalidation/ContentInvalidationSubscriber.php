<?php

namespace Jankx\Cache\Invalidation;

use Jankx\Cache\Contracts\CacheSubscriberInterface;
use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;

/**
 * Keeps every cache layer coherent with the content (Observer pattern).
 *
 * Every write WordPress makes has a matching observation here — post, term,
 * comment, menu, widget, option and user changes all end up clearing at least
 * one layer, because a stale page after an edit is the one bug that destroys
 * trust in a cache.
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
     * Options whose new value changes what the front end renders: writing one
     * of them bumps the query bucket and drops every cached page.
     *
     * @var string[]
     */
    const FRONT_OPTIONS = [
        'home',
        'siteurl',
        'blogname',
        'blogdescription',
        'show_on_front',
        'page_on_front',
        'page_for_posts',
        'posts_per_page',
        'sticky_posts',
        'permalink_structure',
        'category_base',
        'tag_base',
        'site_icon',
        'date_format',
        'time_format',
        'timezone_string',
        'default_comment_status',
        'thread_comments',
        'thread_comments_depth',
        'page_comments',
        'comments_per_page',
    ];

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

        // ── Posts: create, update, trash, untrash, delete ───────────────────
        add_action('save_post', [$this, 'onSavePost'], 20, 3);
        add_action('trashed_post', [$this, 'onPostTrashed'], 20, 2);
        add_action('untrashed_post', [$this, 'onPostTrashed'], 20, 2);
        add_action('deleted_post', [$this, 'onPostDeleted'], 20, 1);

        // ── Taxonomy: create, edit, delete, post ↔ term relationships ───────
        add_action('created_term', [$this, 'onTermChanged'], 20, 3);
        add_action('edited_term', [$this, 'onTermChanged'], 20, 3);
        add_action('delete_term', [$this, 'onTermDeleted'], 20, 4);
        add_action('set_object_terms', [$this, 'onObjectTermsChanged'], 20, 5);

        // ── Comments: `comment_count` lives inside the cached WP_Post ───────
        add_action('wp_insert_comment', [$this, 'onCommentInserted'], 20, 2);
        add_action('transition_comment_status', [$this, 'onCommentStatusChanged'], 20, 3);
        add_action('edit_comment', [$this, 'onCommentEdited'], 20, 2);
        add_action('deleted_comment', [$this, 'onCommentDeleted'], 20, 2);

        // ── Markup that wraps every page: menus, widgets, users ─────────────
        add_action('wp_update_nav_menu', [$this, 'onMarkupChanged'], 20, 3);
        add_action('wp_delete_nav_menu', [$this, 'onMarkupChanged'], 20, 1);
        add_action('user_register', [$this, 'onMarkupChanged'], 20, 2);
        add_action('profile_update', [$this, 'onMarkupChanged'], 20, 2);
        add_action('deleted_user', [$this, 'onMarkupChanged'], 20, 1);

        // ── Options: added, updated and deleted all decide what shows ───────
        add_action('add_option', [$this, 'onOptionChanged'], 20, 2);
        add_action('update_option', [$this, 'onOptionChanged'], 20, 3);
        add_action('delete_option', [$this, 'onOptionChanged'], 20, 1);

        // ── Everything stale: theme switch, upgrade, Customizer save ────────
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

        $this->postChanged($postId, $post);
    }

    /**
     * A post was moved to or restored from the trash (no `save_post` here).
     *
     * @param int    $postId         Post ID.
     * @param string $previousStatus Status the post had before.
     * @return void
     */
    public function onPostTrashed($postId, $previousStatus = ''): void
    {
        $postId = (int) $postId;
        if ($postId <= 0) {
            return;
        }

        $this->postChanged($postId, null);
    }

    /**
     * Terms were attached to (or detached from) an object — quick edit, bulk
     * edit and programmatic assignments never fire `save_post`.
     *
     * @param int    $objectId Object ID.
     * @param mixed  $terms    Terms (IDs or names).
     * @param mixed  $ttIds    Term taxonomy IDs.
     * @param string $taxonomy Taxonomy name.
     * @param bool   $append   Whether terms were appended.
     * @return void
     */
    public function onObjectTermsChanged($objectId, $terms = null, $ttIds = null, $taxonomy = '', $append = false): void
    {
        $objectId = (int) $objectId;
        if ($objectId <= 0) {
            return;
        }

        $postType = function_exists('get_post_type') ? get_post_type($objectId) : 'post';
        if (!$postType) {
            return;
        }

        $tags = $this->postTags($objectId, (string) $postType);
        if (is_string($taxonomy) && $taxonomy !== '') {
            $tags[] = 'taxonomy-' . $taxonomy;
        }

        $this->invalidate(array_values(array_unique($tags)), $this->urlsFor($objectId));
    }

    /**
     * A comment was created (programmatic inserts included).
     *
     * @param int     $commentId Comment ID.
     * @param mixed   $comment   Comment object.
     * @return void
     */
    public function onCommentInserted($commentId, $comment = null): void
    {
        $this->commentChanged($comment, (int) $commentId);
    }

    /**
     * A comment was approved, unapproved, spammed or trashed.
     *
     * @param string $newStatus New status.
     * @param string $oldStatus Previous status.
     * @param mixed  $comment   Comment object.
     * @return void
     */
    public function onCommentStatusChanged($newStatus, $oldStatus = '', $comment = null): void
    {
        $this->commentChanged($comment, 0);
    }

    /**
     * A comment was edited.
     *
     * @param int   $commentId Comment ID.
     * @param mixed $data      Comment data.
     * @return void
     */
    public function onCommentEdited($commentId, $data = null): void
    {
        $this->commentChanged(null, (int) $commentId);
    }

    /**
     * A comment was deleted.
     *
     * @param int   $commentId Comment ID.
     * @param mixed $comment   Comment object.
     * @return void
     */
    public function onCommentDeleted($commentId, $comment = null): void
    {
        $this->commentChanged($comment, (int) $commentId);
    }

    /**
     * Menus, widgets and user profiles are rendered around every page, but
     * they never change the queried posts: drop the pages, keep the queries.
     *
     * @param mixed ...$args Ignored hook arguments.
     * @return void
     */
    public function onMarkupChanged(...$args): void
    {
        $this->pageCache->purge(['all', 'home'], $this->homeUrls());
    }

    /**
     * An option was added, updated or deleted.
     *
     * @param string $option Option name.
     * @param mixed  ...$rest Hook arguments (vary per hook).
     * @return void
     */
    public function onOptionChanged($option, ...$rest): void
    {
        $option = (string) $option;
        if ($option === '') {
            return;
        }

        // Widget instances and theme mods paint the page around the content.
        if (strpos($option, 'widget_') === 0 || strpos($option, 'theme_mods_') === 0 || $option === 'sidebars_widgets') {
            $this->onMarkupChanged();

            return;
        }

        if (in_array($option, $this->frontOptions(), true)) {
            $this->invalidate(['all', 'home', 'front-page'], $this->homeUrls());
        }
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
        if ($postId <= 0) {
            return;
        }

        $this->postChanged($postId, null);
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
     * A post changed: bump the query bucket and drop its pages.
     *
     * @param int          $postId Post ID.
     * @param \WP_Post|null $post  Post object when still available.
     * @return void
     */
    private function postChanged($postId, $post): void
    {
        $postType = is_object($post) && !empty($post->post_type)
            ? (string) $post->post_type
            : (function_exists('get_post_type') ? (string) get_post_type($postId) : 'post');

        if ($postType === '' || $postType === 'false') {
            $postType = 'post';
        }

        $this->invalidate($this->postTags((int) $postId, $postType), $this->urlsFor($postId));
    }

    /**
     * A comment changed: the post that carries it (comment count, moderation
     * and the comment list itself) is now stale.
     *
     * @param mixed $comment   Comment object when still available.
     * @param int   $commentId Comment ID.
     * @return void
     */
    private function commentChanged($comment, int $commentId): void
    {
        $postId = 0;

        if (is_object($comment) && isset($comment->comment_post_ID)) {
            $postId = (int) $comment->comment_post_ID;
        }

        if ($postId <= 0 && $commentId > 0 && function_exists('get_comment_post_id')) {
            $postId = (int) get_comment_post_id($commentId);
        }

        if ($postId <= 0) {
            return;
        }

        $postType = function_exists('get_post_type') ? (string) get_post_type($postId) : 'post';

        $this->invalidate($this->postTags($postId, $postType ?: 'post'), $this->urlsFor($postId));
    }

    /**
     * Options that change what the front end renders, plus whatever the
     * `jankx/cache/front_options` filter adds to the list.
     *
     * @return string[]
     */
    private function frontOptions(): array
    {
        $options = self::FRONT_OPTIONS;

        if (function_exists('apply_filters')) {
            $extra = (array) apply_filters('jankx/cache/front_options', []);
            foreach ($extra as $name) {
                if (is_string($name) && $name !== '') {
                    $options[] = $name;
                }
            }
        }

        return $options;
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
