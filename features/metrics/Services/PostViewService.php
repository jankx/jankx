<?php

namespace Jankx\Features\Metrics\Services;

use Jankx\Features\Metrics\ViewsBlock;
use Jankx\Gutenberg\GutenbergRepository;

class PostViewService
{
    /**
     * Get post view count
     *
     * @param int $post_id
     * @return int
     */
    public function getPostViews($post_id = null)
    {
        if (!$post_id) {
            $post_id = get_the_ID();
        }

        if (!$post_id) {
            return 0;
        }

        $views = get_post_meta($post_id, 'post_views_count', true);
        return intval($views);
    }

    /**
     * Increment post view count
     *
     * @param int $post_id
     * @return int
     */
    public function incrementPostViews($post_id = null)
    {
        if (!$post_id) {
            $post_id = get_the_ID();
        }

        if (!$post_id) {
            return 0;
        }

        $current_views = $this->getPostViews($post_id);
        $new_views = $current_views + 1;

        $result = update_post_meta($post_id, 'post_views_count', $new_views);

        // Debug logging
        error_log("Jankx Post Views: incrementPostViews - Post: $post_id, Current: $current_views, New: $new_views, Update result: " . ($result ? 'success' : 'failed'));

        return $new_views;
    }

    /**
     * Track post view (increment if not admin and not logged in as author)
     *
     * @param int $post_id
     * @return void
     */
    public function trackPostView($post_id = null)
    {
        if (!$post_id) {
            $post_id = get_the_ID();
        }

        if (!$post_id) {
            return;
        }

        // Get the post author ID for the specific post
        $post_author_id = get_post_field('post_author', $post_id);
        $current_user_id = get_current_user_id();

        // Don't track views for admins or post authors
        if (apply_filters('jankx_post_view_service_should_track_view', false) && (current_user_can('manage_options') || $post_author_id == $current_user_id)) {
            return;
        }

        $this->incrementPostViews($post_id);
    }

    /**
     * Format view count for display
     *
     * @param int $views
     * @return string
     */
    public function formatViews($views)
    {
        if ($views >= 1000000) {
            return round($views / 1000000, 1) . 'M';
        } elseif ($views >= 1000) {
            return round($views / 1000, 1) . 'K';
        }

        return number_format($views);
    }

    /**
     * Initialize AJAX handlers
     */
    public function initAjax()
    {
        // AJAX handler for logged-in users
        add_action('wp_ajax_track_post_view', array($this, 'ajaxTrackPostView'));

        // AJAX handler for non-logged-in users
        add_action('wp_ajax_nopriv_track_post_view', array($this, 'ajaxTrackPostView'));

        // AJAX handler to get post views
        add_action('wp_ajax_get_post_views', array($this, 'ajaxGetPostViews'));
        add_action('wp_ajax_nopriv_get_post_views', array($this, 'ajaxGetPostViews'));
    }

    /**
     * AJAX handler to track post view
     */
    public function ajaxTrackPostView()
    {
        // Debug logging
        error_log("Jankx Post Views: AJAX request received - " . print_r($_POST, true));

        // Verify nonce for security
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'track_post_view_nonce')) {
            error_log("Jankx Post Views: Nonce verification failed");
            wp_die('Security check failed');
        }

        $post_id = intval($_POST['post_id'] ?? 0);

        if (!$post_id) {
            error_log("Jankx Post Views: Invalid post ID: $post_id");
            wp_send_json_error('Invalid post ID');
        }

        // Check if post exists
        if (!get_post($post_id)) {
            error_log("Jankx Post Views: Post not found: $post_id");
            wp_send_json_error('Post not found');
        }

        // Get the post author ID for the specific post
        $post_author_id = get_post_field('post_author', $post_id);
        $current_user_id = get_current_user_id();

        // Don't track views for admins or post authors
        if (current_user_can('manage_options') || $post_author_id == $current_user_id) {
            error_log("Jankx Post Views: View not tracked (admin/author) - Post: $post_id, Author: $post_author_id, User: $current_user_id");
            wp_send_json_success(array(
                'message' => 'View not tracked (admin/author)',
                'views' => $this->getPostViews($post_id)
            ));
        }

        // Increment view count
        $new_views = $this->incrementPostViews($post_id);
        error_log("Jankx Post Views: View tracked successfully - Post: $post_id, New views: $new_views");

        wp_send_json_success(array(
            'message' => 'View tracked successfully',
            'views' => $new_views,
            'formatted_views' => $this->formatViews($new_views)
        ));
    }

    /**
     * AJAX handler to get post views
     */
    public function ajaxGetPostViews()
    {
        $post_id = intval($_POST['post_id'] ?? 0);

        if (!$post_id) {
            wp_send_json_error('Invalid post ID');
        }

        // Check if post exists
        if (!get_post($post_id)) {
            wp_send_json_error('Post not found');
        }

        $views = $this->getPostViews($post_id);

        wp_send_json_success(array(
            'views' => $views,
            'formatted_views' => $this->formatViews($views)
        ));
    }

    /**
     * Check if view should be tracked (avoid duplicate tracking)
     *
     * @param int $post_id
     * @return bool
     */
    public function shouldTrackView($post_id)
    {
        // Check if already tracked in this session
        if (isset($_SESSION['tracked_posts'][$post_id])) {
            return false;
        }

        // Check if tracked via cookie (24 hours)
        $cookie_name = 'jankx_viewed_' . $post_id;
        if (isset($_COOKIE[$cookie_name])) {
            return false;
        }

        return true;
    }

    /**
     * Mark post as tracked in session and cookie
     *
     * @param int $post_id
     */
    public function markAsTracked($post_id)
    {
        // Mark in session
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['tracked_posts'][$post_id] = true;

        // Mark in cookie (24 hours)
        $cookie_name = 'jankx_viewed_' . $post_id;
        setcookie($cookie_name, '1', time() + (24 * 60 * 60), '/');
    }

    /**
     * Get AJAX URL for tracking views
     *
     * @return string
     */
    public function getAjaxUrl()
    {
        return admin_url('admin-ajax.php');
    }

    /**
     * Get nonce for AJAX security
     *
     * @return string
     */
    public function getNonce()
    {
        return wp_create_nonce('track_post_view_nonce');
    }

    /**
     * Enqueue frontend scripts for singular pages
     */
    public function enqueueFrontendScripts()
    {
        // Only load on singular pages (posts, pages, custom post types)
        if (!is_singular() || is_admin()) {
            return;
        }

        // Check if script is already enqueued to prevent duplicates
        if (wp_script_is('jankx-views-frontend', 'enqueued') || wp_script_is('jankx-views-frontend', 'done')) {
            return;
        }

        // Enqueue the frontend script
        wp_enqueue_script(
            'jankx-views-frontend',
            get_template_directory_uri() . '/features/metrics/blocks/views/frontend.js',
            array(), // No dependencies - vanilla JS
            '1.0.0',
            true
        );

        // Pass data to JavaScript
        wp_localize_script('jankx-views-frontend', 'jankxViewsData', array(
            'ajaxUrl' => $this->getAjaxUrl(),
            'nonce' => $this->getNonce(),
            'postId' => get_the_ID()
        ));
    }

    /**
     * Initialize frontend functionality
     */
    public function initFrontend()
    {
        // Enqueue scripts on singular pages
        add_action('wp_enqueue_scripts', array($this, 'enqueueFrontendScripts'));
        add_action('jankx/gutenberg/register-blocks', function(GutenbergRepository $repository){
            $repository->registerBlock(ViewsBlock::class, implode(DIRECTORY_SEPARATOR, [dirname(__DIR__), 'blocks', 'views']));
        });
    }

    /**
     * Test method to manually set view count (for debugging)
     *
     * @param int $post_id
     * @param int $count
     * @return bool
     */
    public function setTestViewCount($post_id, $count = 1)
    {
        if (!$post_id) {
            return false;
        }

        $result = update_post_meta($post_id, 'post_views_count', $count);
        error_log("Jankx Post Views: setTestViewCount - Post: $post_id, Count: $count, Result: " . ($result ? 'success' : 'failed'));

        return $result;
    }
}
