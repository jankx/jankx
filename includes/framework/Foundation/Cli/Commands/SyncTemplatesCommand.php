<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Template Sync Commands
 *
 * Syncs flat HTML files from theme's 'html' directory back to the database
 * as Gutenberg templates and parts.
 *
 * ## EXAMPLES
 *
 *     wp jankx sync-templates
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class SyncTemplatesCommand extends WP_CLI_Command
{
    /**
     * Sync flat HTML files back to database templates and parts.
     *
     * ## EXAMPLES
     *
     *     wp jankx sync-templates
     *
     * @when after_wp_load
     */
    public function __invoke($args, $assoc_args)
    {
        $stylesheet_dir = get_stylesheet_directory();
        $source_dir = $stylesheet_dir . '/html';

        if (!is_dir($source_dir)) {
            WP_CLI::error(sprintf('Source directory not found: %s', $source_dir));
        }

        $types = [
            'templates' => 'wp_template',
            'parts'     => 'wp_template_part'
        ];

        foreach ($types as $type => $post_type) {
            $type_dir = $source_dir . '/' . $type;
            if (!is_dir($type_dir)) {
                WP_CLI::log(sprintf('Skipping %s: directory not found.', $type));
                continue;
            }

            $files = glob($type_dir . '/*.html');
            if (empty($files)) {
                WP_CLI::log(sprintf('No HTML files found in %s.', $type_dir));
                continue;
            }

            WP_CLI::log(sprintf('Syncing %s to database...', $type));

            foreach ($files as $file_path) {
                $file_name = basename($file_path, '.html');
                $content = file_get_contents($file_path);
                
                // Clean up content: if it's wrapped in our HTML shell, extract body content
                $content = $this->extract_gutenberg_content($content);

                $this->sync_to_db($file_name, $content, $post_type);
            }
        }

        WP_CLI::success('Sync completed!');
    }

    /**
     * Extract Gutenberg block content from a full HTML document if needed.
     * 
     * @param string $content
     * @return string
     */
    protected function extract_gutenberg_content($content)
    {
        // Check if it's a full HTML document by looking for <body>
        if (stripos($content, '<body') !== false) {
            preg_match('/<body.*?>([\s\S]*?)<\/body>/i', $content, $matches);
            if (isset($matches[1])) {
                $content = trim($matches[1]);
            }
        }
        
        // Remove our injected styles if they exist (wp-global-styles-inline-css, etc)
        $content = preg_replace('/<style id=\'wp-global-styles-inline-css\'>[\s\S]*?<\/style>/i', '', $content);
        $content = preg_replace('/<style.*?>[\s\S]*?<\/style>/i', '', $content);
        
        return trim($content);
    }

    /**
     * Update or create a template/part in the database.
     * 
     * @param string $name
     * @param string $content
     * @param string $post_type
     */
    protected function sync_to_db($name, $content, $post_type)
    {
        $existing = get_posts([
            'post_type'      => $post_type,
            'name'           => $name,
            'post_status'    => ['publish', 'draft', 'pending', 'private', 'future'],
            'posts_per_page' => 1,
        ]);

        $post_data = [
            'post_title'   => ucwords(str_replace('-', ' ', $name)),
            'post_name'    => $name,
            'post_content' => $content,
            'post_status'  => 'publish',
            'post_type'    => $post_type,
        ];

        if (!empty($existing)) {
            $post_data['ID'] = $existing[0]->ID;
            $result = wp_update_post($post_data, true);
            $action = 'Updated';
        } else {
            $result = wp_insert_post($post_data, true);
            $action = 'Created';
        }

        if (is_wp_error($result)) {
            WP_CLI::warning(sprintf('  - Failed to sync %s: %s', $name, $result->get_error_message()));
        } else {
            WP_CLI::log(sprintf('  - %s %s: %s', $action, $post_type, $name));
        }
    }
}
