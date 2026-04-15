<?php

namespace Jankx\Foundation\Cli\Seeders;

use WP_CLI;

/**
 * Abstract base class for Jankx data seeders.
 *
 * Provides convenient helper methods for inserting posts, terms,
 * options, and other WordPress data. Subclasses only need to implement
 * getName(), getDescription(), getGroup(), run(), rollback(), and count().
 *
 * @package Jankx\Foundation\Cli\Seeders
 * @since 2.1.0
 */
abstract class AbstractSeeder implements SeederInterface
{
    /**
     * Whether to output verbose progress messages.
     *
     * @var bool
     */
    protected bool $verbose = false;

    /**
     * IDs of posts created by this seeder (used in rollback).
     *
     * @var int[]
     */
    protected array $createdPostIds = [];

    /**
     * IDs of terms created by this seeder (used in rollback).
     *
     * @var array  [['id' => int, 'taxonomy' => string], ...]
     */
    protected array $createdTerms = [];

    // ─── SeederInterface ─────────────────────────────────────────────────────

    /**
     * {@inheritdoc}
     */
    public static function getGroup(): string
    {
        return 'general';
    }

    /**
     * {@inheritdoc}
     */
    public function count(): int
    {
        return 0;
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * Enable/disable verbose output.
     *
     * @param bool $verbose
     * @return void
     */
    public function setVerbose(bool $verbose): void
    {
        $this->verbose = $verbose;
    }

    /**
     * Insert or retrieve a term, returning its ID.
     *
     * @param string $name
     * @param string $taxonomy
     * @param array  $args  Extra args passed to wp_insert_term()
     * @return int|null Term ID or null on failure.
     */
    protected function ensureTerm(string $name, string $taxonomy, array $args = []): ?int
    {
        $slug = $args['slug'] ?? sanitize_title($name);
        $existing = get_term_by('slug', $slug, $taxonomy);

        if ($existing) {
            $this->log(sprintf('  Term exists  : [%s] %s', $taxonomy, $name));
            return (int) $existing->term_id;
        }

        $args = array_merge(['slug' => $slug], $args);
        $result = wp_insert_term($name, $taxonomy, $args);

        if (is_wp_error($result)) {
            $this->warn(sprintf('  Failed term  : [%s] %s — %s', $taxonomy, $name, $result->get_error_message()));
            return null;
        }

        $termId = (int) $result['term_id'];
        $this->createdTerms[] = ['id' => $termId, 'taxonomy' => $taxonomy];
        $this->log(sprintf('  Created term : [%s] %s (ID: %d)', $taxonomy, $name, $termId));

        return $termId;
    }

    /**
     * Insert or retrieve a post, returning its ID.
     *
     * If a post with the same title and post_type already exists,
     * the existing post's ID is returned (idempotent).
     *
     * @param array $postData  Arguments for wp_insert_post()
     * @return int|null Post ID or null on failure.
     */
    protected function ensurePost(array $postData): ?int
    {
        $title    = $postData['post_title'] ?? '';
        $postType = $postData['post_type'] ?? 'post';

        // Check existence
        $existing = get_page_by_title($title, OBJECT, $postType);
        if ($existing) {
            $this->log(sprintf('  Post exists  : [%s] %s', $postType, $title));
            return (int) $existing->ID;
        }

        $postId = wp_insert_post($postData, true);

        if (is_wp_error($postId)) {
            $this->warn(sprintf('  Failed post  : [%s] %s — %s', $postType, $title, $postId->get_error_message()));
            return null;
        }

        $this->createdPostIds[] = (int) $postId;
        $this->log(sprintf('  Created post : [%s] %s (ID: %d)', $postType, $title, $postId));

        return (int) $postId;
    }

    /**
     * Attach an image to a post by URL.
     *
     * Downloads the image and sets it as the post thumbnail.
     *
     * @param int    $postId
     * @param string $imageUrl
     * @param string $title    Optional attachment title.
     * @return int|null Attachment ID or null on failure.
     */
    protected function attachImageFromUrl(int $postId, string $imageUrl, string $title = ''): ?int
    {
        if (!function_exists('media_sideload_image')) {
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        $attachmentId = media_sideload_image($imageUrl, $postId, $title ?: basename($imageUrl), 'id');

        if (is_wp_error($attachmentId)) {
            $this->warn(sprintf('  Failed image : %s — %s', $imageUrl, $attachmentId->get_error_message()));
            return null;
        }

        set_post_thumbnail($postId, $attachmentId);
        $this->log(sprintf('  Attached img : %s (attachment: %d)', basename($imageUrl), $attachmentId));

        return (int) $attachmentId;
    }

    /**
     * Generate a placeholder Lorem Ipsum paragraph.
     *
     * @param int $paragraphs
     * @return string
     */
    protected function loremIpsum(int $paragraphs = 3): string
    {
        $base = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
        return implode("\n\n", array_fill(0, $paragraphs, $base));
    }

    /**
     * Default rollback: delete all posts and terms created by this seeder.
     *
     * Subclasses may override for more granular control.
     *
     * @return void
     */
    public function rollback(): void
    {
        foreach ($this->createdPostIds as $postId) {
            wp_delete_post($postId, true);
            $this->log(sprintf('  Deleted post : ID %d', $postId));
        }

        foreach ($this->createdTerms as $termData) {
            wp_delete_term($termData['id'], $termData['taxonomy']);
            $this->log(sprintf('  Deleted term : [%s] ID %d', $termData['taxonomy'], $termData['id']));
        }
    }

    /**
     * Log an informational message (only in verbose mode or via WP_CLI::log).
     *
     * @param string $message
     * @return void
     */
    protected function log(string $message): void
    {
        if ($this->verbose) {
            WP_CLI::log($message);
        }
    }

    /**
     * Output a warning message.
     *
     * @param string $message
     * @return void
     */
    protected function warn(string $message): void
    {
        WP_CLI::warning($message);
    }
}
