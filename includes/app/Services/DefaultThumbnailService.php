<?php

namespace App\Services;

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
     * Default placeholder image path
     *
     * @var string
     */
    protected $placeholderImagePath = 'resources/assets/images/placeholder-image.png';

    /**
     * Cached default thumbnail ID for current request
     *
     * @var int|false|null
     */
    protected $cachedDefaultThumbnailId = null;

    /**
     * Check if post has thumbnail (including default)
     *
     * @param bool $has_thumbnail
     * @param int $post_id
     * @param int $thumbnail_id
     * @return bool
     */
    public function hasPostThumbnail($has_thumbnail, $post_id, $thumbnail_id)
    {
        // If already has thumbnail, return true
        if ($has_thumbnail) {
            return true;
        }

        // Check if post type is supported
        $post_type = get_post_type($post_id);
        if (!in_array($post_type, $this->supportedPostTypes)) {
            return $has_thumbnail;
        }

        // For supported post types, always return true if we have default thumbnail
        return $this->getDefaultThumbnailId() !== false;
    }

    /**
     * Get post thumbnail ID (including default)
     *
     * @param int $thumbnail_id
     * @param int $post_id
     * @return int|false
     */
    public function getPostThumbnailId($thumbnail_id, $post_id)
    {
        // If already has thumbnail, return it
        if ($thumbnail_id) {
            return $thumbnail_id;
        }

        // Check if post type is supported
        $post_type = get_post_type($post_id);
        $supported_types = $this->getSupportedPostTypes();

        if (!in_array($post_type, $supported_types)) {
            return $thumbnail_id;
        }

        // Return default thumbnail ID
        return $this->getDefaultThumbnailId();
    }

    /**
     * Get attachment image source (including default)
     *
     * @param array|false $image
     * @param int $attachment_id
     * @param string|array $size
     * @param bool $icon
     * @return array|false
     */
    public function getAttachmentImageSrc($image, $attachment_id, $size, $icon)
    {
        // If image exists, return it
        if ($image) {
            return $image;
        }

        // Check if this is a default thumbnail request
        $default_thumbnail_id = $this->getDefaultThumbnailId();
        if ($default_thumbnail_id && $attachment_id == $default_thumbnail_id) {
            return wp_get_attachment_image_src($default_thumbnail_id, $size, $icon);
        }

        return $image;
    }

    /**
     * Get post thumbnail HTML (including default)
     *
     * @param string $html
     * @param int $post_id
     * @param int $post_thumbnail_id
     * @param string|array $size
     * @param string $attr
     * @return string
     */
    public function getPostThumbnailHtml($html, $post_id, $post_thumbnail_id, $size, $attr)
    {
        // If already has thumbnail HTML, return it
        if (!empty($html)) {
            return $html;
        }

        // Check if post type is supported
        $post_type = get_post_type($post_id);
        if (!in_array($post_type, $this->supportedPostTypes)) {
            return $html;
        }

        // Get default thumbnail ID
        $default_thumbnail_id = $this->getDefaultThumbnailId();
        if (!$default_thumbnail_id) {
            return $html;
        }

        // Generate HTML for default thumbnail
        return wp_get_attachment_image($default_thumbnail_id, $size, false, $attr);
    }

    /**
     * Get default thumbnail ID
     *
     * @return int|false
     */
    protected function getDefaultThumbnailId()
    {
        // Return cached value if available (performance optimization)
        if ($this->cachedDefaultThumbnailId !== null) {
            return $this->cachedDefaultThumbnailId;
        }

        // Get stored default thumbnail ID
        $thumbnail_id = get_option($this->optionName, false);

        // If we have a stored ID, check if the post still exists
        if ($thumbnail_id) {
            $post = get_post($thumbnail_id);
            if ($post && $post->post_type === 'attachment') {
                $this->cachedDefaultThumbnailId = $thumbnail_id;
                return $thumbnail_id;
            }
        }

        // If no valid stored ID, try to upload default image
        $uploaded_id = $this->uploadDefaultThumbnail();

        // Cache the result
        $this->cachedDefaultThumbnailId = $uploaded_id;

        return $uploaded_id;
    }

    /**
     * Upload default thumbnail to media library
     *
     * @return int|false
     */
    protected function uploadDefaultThumbnail()
    {
        // Get theme directory
        $theme_dir = get_template_directory();
        $image_path = $theme_dir . '/' . $this->placeholderImagePath;

        // Check if placeholder image exists
        if (!file_exists($image_path)) {
            return false;
        }

        // Prepare file data
        $filename = basename($image_path);
        $upload_file = wp_upload_bits($filename, null, file_get_contents($image_path));

        // Check if upload was successful
        if ($upload_file['error']) {
            return false;
        }

        $wp_filetype = wp_check_filetype($filename, null);

        $attachment = [
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => 'Default Thumbnail',
            'post_content' => '',
            'post_status' => 'inherit'
        ];

        $attachment_id = wp_insert_attachment($attachment, $upload_file['file']);

        if (is_wp_error($attachment_id)) {
            return false;
        }

        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attachment_data = wp_generate_attachment_metadata($attachment_id, $upload_file['file']);
        wp_update_attachment_metadata($attachment_id, $attachment_data);

        // Store the attachment ID in options
        update_option($this->optionName, $attachment_id);

        return $attachment_id;
    }

    /**
     * Get default thumbnail URL
     *
     * @param string|array $size
     * @return string|false
     */
    public function getDefaultThumbnailUrl($size = 'thumbnail')
    {
        $thumbnail_id = $this->getDefaultThumbnailId();
        if (!$thumbnail_id) {
            return false;
        }

        $image = wp_get_attachment_image_src($thumbnail_id, $size);
        return $image ? $image[0] : false;
    }

    /**
     * Add supported post type
     *
     * @param string $post_type
     * @return void
     */
    public function addSupportedPostType($post_type)
    {
        if (!in_array($post_type, $this->supportedPostTypes)) {
            $this->supportedPostTypes[] = $post_type;
        }
    }

    /**
     * Remove supported post type
     *
     * @param string $post_type
     * @return void
     */
    public function removeSupportedPostType($post_type)
    {
        $key = array_search($post_type, $this->supportedPostTypes);
        if ($key !== false) {
            unset($this->supportedPostTypes[$key]);
        }
    }

    /**
     * Get supported post types
     *
     * @return array
     */
    public function getSupportedPostTypes()
    {
        return apply_filters(
            'jankx/default/thumbnails/post-types',
            $this->supportedPostTypes
        );
    }

    /**
     * Render default thumbnail for Gutenberg Post Featured Image block
     *
     * @param string $block_content The block content
     * @param array $block The block array
     * @return string Modified block content
     */
    public function renderBlockFeaturedImage($block_content, $block)
    {
        // Quick return for non-featured-image blocks (99% of blocks)
        if ($block['blockName'] !== 'core/post-featured-image') {
            return $block_content;
        }

        // If block already has content (post has thumbnail), return immediately
        if (!empty(trim($block_content))) {
            return $block_content;
        }

        // Get current post ID
        $post_id = get_the_ID();
        if (!$post_id) {
            return $block_content;
        }

        // Check if post already has thumbnail
        if (has_post_thumbnail($post_id)) {
            return $block_content;
        }

        // Check if post type is supported
        $post_type = get_post_type($post_id);
        $supported_types = $this->getSupportedPostTypes();

        if (!in_array($post_type, $supported_types)) {
            return $block_content;
        }

        // Get default thumbnail ID
        $default_thumbnail_id = $this->getDefaultThumbnailId();
        if (!$default_thumbnail_id) {
            return $block_content;
        }

        // Get block attributes
        $attrs = $block['attrs'] ?? [];
        $size_slug = $attrs['sizeSlug'] ?? 'post-thumbnail';
        $is_link = $attrs['isLink'] ?? false;
        $link_target = $attrs['linkTarget'] ?? '_self';

        // Generate thumbnail HTML
        $thumbnail_html = wp_get_attachment_image($default_thumbnail_id, $size_slug, false, [
            'class' => 'wp-post-image',
            'style' => $attrs['style']['css'] ?? '',
        ]);

        if (!$thumbnail_html) {
            return $block_content;
        }

        // Wrap in link if needed
        if ($is_link) {
            $permalink = get_permalink($post_id);
            $thumbnail_html = sprintf(
                '<a href="%s" target="%s">%s</a>',
                esc_url($permalink),
                esc_attr($link_target),
                $thumbnail_html
            );
        }

        // Wrap in figure with block classes
        $block_content = sprintf(
            '<figure class="wp-block-post-featured-image">%s</figure>',
            $thumbnail_html
        );

        return $block_content;
    }

    /**
     * Reset default thumbnail (delete from media and clear option)
     *
     * @return bool
     */
    public function resetDefaultThumbnail()
    {
        $thumbnail_id = get_option($this->optionName, false);

        if ($thumbnail_id) {
            wp_delete_attachment($thumbnail_id, true);
        }

        delete_option($this->optionName);

        return true;
    }
}
