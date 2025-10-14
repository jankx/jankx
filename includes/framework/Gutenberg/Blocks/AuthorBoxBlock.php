<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Template\Template;

/**
 * Author Box Block
 *
 * A block for displaying author information with avatar, name, and bio
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class AuthorBoxBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/author-box';

    /**
     * Initialize the block
     *
     * @return void
     */
    public function init()
    {
        // Register AJAX handlers
        add_action('wp_ajax_jankx-author-box-fetch-data', [$this, 'handleFetchData']);
        add_action('wp_ajax_nopriv_jankx-author-box-fetch-data', [$this, 'handleFetchData']);
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        // Parse block attributes
        $authorId = isset($attributes['authorId']) ? intval($attributes['authorId']) : get_the_author_meta('ID');
        $showAvatar = isset($attributes['showAvatar']) ? $attributes['showAvatar'] : true;
        $showBio = isset($attributes['showBio']) ? $attributes['showBio'] : true;
        $showSocial = isset($attributes['showSocial']) ? $attributes['showSocial'] : false;
        $layout = isset($attributes['layout']) ? $attributes['layout'] : 'horizontal';
        $avatarSize = isset($attributes['avatarSize']) ? $attributes['avatarSize'] : 'medium';
        $textAlign = isset($attributes['textAlign']) ? $attributes['textAlign'] : 'left';
        $authorTitle = isset($attributes['authorTitle']) ? $attributes['authorTitle'] : 'Tác giả';

        // Get author data
        $author = get_userdata($authorId);
        if (!$author) {
            return '<div class="jankx-author-box-error">' . __('Author not found', 'jankx') . '</div>';
        }

        $authorName = $author->display_name;
        $authorBio = get_user_meta($authorId, 'description', true);
        $authorUrl = get_author_posts_url($authorId);
        $authorAvatar = get_avatar_url($authorId, ['size' => $this->getAvatarSize($avatarSize)]);

        // Get social links
        $socialLinks = [];
        if ($showSocial) {
            $socialLinks = $this->getAuthorSocialLinks($authorId);
        }

        // Build CSS classes
        $cssClasses = [
            'jankx-author-box',
            'jankx-author-box--' . $layout,
            'jankx-author-box--align-' . $textAlign
        ];

        // Start building HTML
        $html = '<div class="' . esc_attr(implode(' ', $cssClasses)) . '">';

        $html .= '<div class="jankx-author-box__content">';

        // Avatar
        if ($showAvatar && $authorAvatar) {
            $html .= '<div class="jankx-author-box__avatar">';
            $html .= '<img src="' . esc_url($authorAvatar) . '" alt="' . esc_attr($authorName) . '" class="jankx-author-box__avatar-img">';
            $html .= '</div>';
        }

        // Author info
        $html .= '<div class="jankx-author-box__info">';

        // Author name
        $html .= '<h3 class="jankx-author-box__name">';
        $html .= '<a href="' . esc_url($authorUrl) . '" class="jankx-author-box__name-link">';
        // Add author title/prefix if provided
        if (!empty($authorTitle)) {
            $html .= esc_html($authorTitle . ': ');
        }
        $html .= esc_html($authorName);
        $html .= '</a>';
        $html .= '</h3>';

        // Author bio
        if ($showBio && !empty($authorBio)) {
            $html .= '<div class="jankx-author-box__bio">';
            $html .= wp_kses_post($authorBio);
            $html .= '</div>';
        }

        // Social links
        if ($showSocial && !empty($socialLinks)) {
            $html .= '<div class="jankx-author-box__social">';
            foreach ($socialLinks as $platform => $url) {
                if (!empty($url)) {
                    $html .= '<a href="' . esc_url($url) . '" class="jankx-author-box__social-link jankx-author-box__social-link--' . esc_attr($platform) . '" target="_blank" rel="noopener">';
                    $html .= '<span class="jankx-author-box__social-icon">' . $this->getSocialIcon($platform) . '</span>';
                    $html .= '</a>';
                }
            }
            $html .= '</div>';
        }

        $html .= '</div>'; // .jankx-author-box__info
        $html .= '</div>'; // .jankx-author-box__content
        $html .= '</div>'; // .jankx-author-box

        return $html;
    }

    /**
     * Get avatar size in pixels
     *
     * @param string $size Size name
     * @return int Size in pixels
     */
    protected function getAvatarSize($size)
    {
        $sizes = [
            'small' => 48,
            'medium' => 96,
            'large' => 150,
            'xlarge' => 200
        ];

        return $sizes[$size] ?? 96;
    }

    /**
     * Get author social links
     *
     * @param int $authorId Author ID
     * @return array Social links
     */
    protected function getAuthorSocialLinks($authorId)
    {
        $socialLinks = [];

        // Common social media fields
        $socialFields = [
            'facebook' => 'facebook',
            'twitter' => 'twitter',
            'instagram' => 'instagram',
            'linkedin' => 'linkedin',
            'youtube' => 'youtube',
            'website' => 'user_url'
        ];

        foreach ($socialFields as $platform => $metaKey) {
            $url = get_user_meta($authorId, $metaKey, true);
            if (!empty($url)) {
                $socialLinks[$platform] = $url;
            }
        }

        return $socialLinks;
    }

    /**
     * Get social media icon SVG
     *
     * @param string $platform Platform name
     * @return string SVG icon
     */
    protected function getSocialIcon($platform)
    {
        $icons = [
            'facebook' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            'twitter' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
            'instagram' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
            'linkedin' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
            'youtube' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
            'website' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
        ];

        return $icons[$platform] ?? '';
    }

    /**
     * AJAX handler for fetching author data
     *
     * @return void
     */
    public function handleFetchData()
    {
        try {
            // Validate nonce for security (skip for admin users in site editor)
            if (!is_admin() && !wp_verify_nonce($_REQUEST['_wpnonce'] ?? '', 'jankx_author_box_nonce')) {
                throw new Exception('Invalid nonce');
            }

            // Get and validate parameters
            $authorId = intval($_REQUEST['author_id'] ?? 0);

            if (!$authorId) {
                throw new Exception('Author ID is required');
            }

            // Get author data
            $author = get_userdata($authorId);
            if (!$author) {
                throw new Exception('Author not found');
            }

            // Format author data
            $authorData = $this->formatAuthorData($author);

            wp_send_json_success([
                'author' => $authorData
            ]);

        } catch (Exception $e) {
            wp_send_json_error([
                'message' => $e->getMessage(),
                'code' => $e->getCode() ?: 'UNKNOWN_ERROR'
            ]);
        }
    }

    /**
     * Format author data for AJAX response
     *
     * @param \WP_User $author Author user object
     * @return array Formatted author data
     */
    protected function formatAuthorData($author)
    {
        $authorId = $author->ID;

        // Get avatar URL
        $avatarSize = 96; // Default medium size
        $avatarUrl = get_avatar_url($authorId, ['size' => $avatarSize]);

        // Get bio
        $bio = get_user_meta($authorId, 'description', true);

        // Get author URL
        $authorUrl = get_author_posts_url($authorId);

        // Get social links
        $socialLinks = $this->getAuthorSocialLinks($authorId);

        return [
            'ID' => $authorId,
            'name' => $author->display_name,
            'avatar' => $avatarUrl,
            'bio' => $bio,
            'url' => $authorUrl,
            'socialLinks' => $socialLinks
        ];
    }
}
