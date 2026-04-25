<?php
namespace Jankx\Extensions\GutenbergFileSync\Handlers;

class RestApiHandler
{
    public function register()
    {
        // Handle Templates
        add_action('rest_after_insert_wp_template', [$this, 'sync_template_to_file'], 10, 3);
        
        // Handle Template Parts
        add_action('rest_after_insert_wp_template_part', [$this, 'sync_template_to_file'], 10, 3);
    }

    /**
     * Sync template content to file and delete the database record
     * 
     * @param \WP_Post         $post     Inserted post object.
     * @param \WP_REST_Request $request  Request object.
     * @param bool            $creating True when creating a post, false when updating.
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

        // Ensure directory exists (though it should in Jankx)
        if (!is_dir(dirname($file_path))) {
            wp_mkdir_p(dirname($file_path));
        }

        // Write content to file
        $result = file_put_contents($file_path, $content);

        if ($result !== false) {
            // After successful file write, delete the post from database
            // We use a slight delay or a hook that runs after the REST response if possible,
            // but wp_delete_post right here is the most direct way.
            wp_delete_post($post->ID, true);
            
            // Log it for debugging if needed (optional)
            // error_log(sprintf('GutenbergFileSync: Synced %s to file and removed from DB.', $slug));
        }
    }
}
