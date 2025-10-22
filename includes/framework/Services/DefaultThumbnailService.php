<?php

namespace Jankx\Services;

use WP_Error;

/**
 * Default Thumbnail Service
 *
 * Handles default thumbnail functionality for posts without featured images.
 * Provides fallback thumbnails for supported post types.
 *
 * @package App\Services
 * @since 1.0.0
 */
class DefaultThumbnailService
{
    /**
     * Supported post types that will always have thumbnails
     *
     * @var array
     */
    protected $supportedPostTypes = [
        'post',
        'product', // WooCommerce product
    ];

    /**
     * Option name for storing default thumbnail ID
     *
     * @var string
     */
    protected $optionName = 'jankx_default_thumbnail_id';

    /**
     * Default placeholder image path (relative to theme)
     *
     * @var string
     */
    protected $placeholderImagePath = 'resources/assets/images/placeholder-image.png';

    /**
     * Check if the service is enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return (bool) apply_filters('jankx/ux/thumbnail/default', true);
    }

    /**
     * Boot the service
     *
     * Register WordPress filters to apply default thumbnails
     *
     * @return void
     */
    public function boot(): void
    {
        add_filter('has_post_thumbnail', '__return_true', 999);
        add_filter('post_thumbnail_id', [$this, 'applyDefaultThumbnailId']);
    }

    /**
     * Unload the service
     *
     * Remove WordPress filters
     *
     * @return void
     */
    public function unload(): void
    {
        remove_filter('has_post_thumbnail', '__return_true', 999);
        remove_filter('post_thumbnail_id', [$this, 'applyDefaultThumbnailId']);
    }

    /**
     * Allow SVG uploads
     *
     * @param array $mimes Allowed mime types
     * @return array
     */
    public function allowSvg(array $mimes): array
    {
        if (!in_array('image/svg+xml', array_values($mimes))) {
            $mimes['svg'] = 'image/svg+xml';
        }
        return $mimes;
    }

    /**
     * Get default thumbnail ID
     *
     * Creates and uploads the default thumbnail if it doesn't exist
     *
     * @return int Attachment ID or 0 on failure
     */
    public function getDefaultThumbnailId(): int
    {
        $defaultThumbnailId = get_option($this->optionName, null);

        // Return cached value if exists and valid
        if ($defaultThumbnailId !== null) {
            if ($defaultThumbnailId instanceof WP_Error) {
                return 0;
            }
            return (int) $defaultThumbnailId;
        }

        // Determine file path
        $filePath = $this->getPlaceholderFilePath();

        $defaultThumbnailId = 0;

        if (file_exists($filePath)) {
            $defaultThumbnailId = $this->uploadPlaceholderImage($filePath);
        }

        // Cache the result
        update_option($this->optionName, $defaultThumbnailId, true);

        return (int) $defaultThumbnailId;
    }

    /**
     * Get placeholder file path
     *
     * @return string
     */
    protected function getPlaceholderFilePath(): string
    {
        // Check child theme first, then parent theme
        if (is_child_theme()) {
            $childPath = get_stylesheet_directory() . DIRECTORY_SEPARATOR . $this->placeholderImagePath;
            if (file_exists($childPath)) {
                return $childPath;
            }
        }

        return get_template_directory() . DIRECTORY_SEPARATOR . $this->placeholderImagePath;
    }

    /**
     * Upload placeholder image to media library
     *
     * @param string $filePath Path to the placeholder image file
     * @return int Attachment ID or 0 on failure
     */
    protected function uploadPlaceholderImage(string $filePath): int
    {
        // Create temporary file
        $tempFile = tmpfile();
        $fileMetadata = stream_get_meta_data($tempFile);
        copy($filePath, $fileMetadata['uri']);

        // Load required WordPress functions
        $this->loadMediaFunctions();

        // Allow SVG upload temporarily
        add_filter('upload_mimes', [$this, 'allowSvg']);

        // Prepare file array for sideload
        $file = [
            'name' => basename($filePath),
            'tmp_name' => $fileMetadata['uri'],
            'size' => filesize($filePath),
            'type' => mime_content_type($filePath),
            'error' => 0
        ];

        // Upload the file
        $attachmentId = media_handle_sideload($file);

        // Remove SVG upload filter
        remove_filter('upload_mimes', [$this, 'allowSvg']);

        // Clean up
        fclose($tempFile);

        // Return 0 on error, otherwise return attachment ID
        if ($attachmentId instanceof WP_Error) {
            return 0;
        }

        return (int) $attachmentId;
    }

    /**
     * Load WordPress media functions if not already loaded
     *
     * @return void
     */
    protected function loadMediaFunctions(): void
    {
        if (!function_exists('wp_handle_sideload')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        if (!function_exists('media_handle_sideload')) {
            require_once ABSPATH . 'wp-admin/includes/media.php';
        }

        if (!function_exists('wp_read_image_metadata')) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }
    }

    /**
     * Apply default thumbnail ID if post doesn't have one
     *
     * @param int $thumbnailId Current thumbnail ID
     * @return int Modified thumbnail ID
     */
    public function applyDefaultThumbnailId($thumbnailId): int
    {
        if ($thumbnailId > 0) {
            return (int) $thumbnailId;
        }

        return $this->getDefaultThumbnailId();
    }
}
