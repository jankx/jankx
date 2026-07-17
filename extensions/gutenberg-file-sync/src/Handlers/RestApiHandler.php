<?php
namespace Jankx\Extensions\GutenbergFileSync\Handlers;

class RestApiHandler
{
    public function register()
    {
        // Register template sync hooks via rest_api_init so they fire
        // at the correct point in the WordPress boot order.
        // REST_REQUEST is NOT defined yet when register_hooks() runs at
        // after_setup_theme, so we cannot rely on that constant here.
        add_action('rest_api_init', [$this, 'register_rest_hooks']);
    }

    /**
     * Register REST hooks — called by rest_api_init so REST_REQUEST is already true.
     */
    public function register_rest_hooks()
    {
        // Handle Templates
        add_action('rest_after_insert_wp_template', [$this, 'sync_template_to_file'], 10, 3);

        // Handle Template Parts
        add_action('rest_after_insert_wp_template_part', [$this, 'sync_template_to_file'], 10, 3);
    }

    /**
     * Sync template content to file and delete the database record.
     *
     * @param \WP_Post         $post     Inserted post object.
     * @param \WP_REST_Request $request  Request object.
     * @param bool             $creating True when creating a post, false when updating.
     */
    public function sync_template_to_file($post, $request, $creating)
    {
        $post_type = $post->post_type;
        $slug      = $post->post_name;
        $content   = $post->post_content;

        // Determine directory based on post type
        $dir = ($post_type === 'wp_template') ? 'templates' : 'parts';

        // Get active theme directory
        $theme_dir = get_stylesheet_directory();
        $file_path = sprintf('%s/%s/%s.html', $theme_dir, $dir, $slug);

        // Ensure directory exists
        if (!is_dir(dirname($file_path))) {
            wp_mkdir_p(dirname($file_path));
        }

        // Write content to file
        $result = file_put_contents($file_path, $content);

        if ($result !== false) {
            // After successful file write, remove the DB record so WordPress
            // keeps reading the canonical version from the theme file.
            wp_delete_post($post->ID, true);

            error_log(sprintf('[GutenbergFileSync] Synced "%s" (%s) to %s', $slug, $post_type, $file_path));
        } else {
            error_log(sprintf('[GutenbergFileSync] Failed to write file: %s', $file_path));
        }
    }
}
