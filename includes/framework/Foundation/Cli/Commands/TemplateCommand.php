<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Template Management Commands
 *
 * Manage Gutenberg templates and parts (export to flat HTML, sync from files, or cleanup database).
 *
 * ## EXAMPLES
 *
 *     wp jankx template export
 *     wp jankx template sync
 *     wp jankx template clean
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class TemplateCommand extends WP_CLI_Command
{
    /**
     * Export all templates and parts to flat HTML files.
     *
     * ## EXAMPLES
     *
     *     wp jankx template export
     *
     * @when after_wp_load
     */
    public function export($args, $assoc_args)
    {
        $theme = wp_get_theme();
        $stylesheet_dir = get_stylesheet_directory();
        $template_dir = get_template_directory();

        $export_dir = $stylesheet_dir;
        WP_CLI::log(sprintf('Exporting templates for theme: %s', $theme->get('Name')));
        WP_CLI::log(sprintf('Destination: %s', $export_dir));

        $types = [
            'templates' => 'wp_template',
            'parts'     => 'wp_template_part'
        ];

        foreach ($types as $type => $post_type) {
            $type_export_dir = $export_dir . '/' . $type;
            if (!file_exists($type_export_dir)) {
                mkdir($type_export_dir, 0755, true);
            }

            // 1. Get from disk (parent & child)
            $dirs = array_unique([$template_dir . '/' . $type, $stylesheet_dir . '/' . $type]);
            $template_data = [];

            foreach ($dirs as $dir) {
                if (is_dir($dir)) {
                    $found_files = glob($dir . '/*.html');
                    foreach ($found_files as $file) {
                        $name = basename($file);
                        $template_data[$name] = [
                            'source'  => 'disk',
                            'content' => file_get_contents($file)
                        ];
                    }
                }
            }

            // 2. Get from database (overrides disk)
            $db_templates = get_posts([
                'post_type'      => $post_type,
                'post_status'    => 'publish',
                'posts_per_page' => -1,
            ]);

            foreach ($db_templates as $post) {
                $name = $post->post_name . '.html';
                $template_data[$name] = [
                    'source'  => 'database',
                    'content' => $post->post_content
                ];
            }

            foreach ($template_data as $name => $data) {
                WP_CLI::log(sprintf('  - Processing %s (%s): %s', $type, $data['source'], $name));
                
                // Export raw Gutenberg content instead of rendered HTML
                file_put_contents($type_export_dir . '/' . $name, $data['content']);
            }
        }

        WP_CLI::success('Export completed!');
    }

    /**
     * Sync flat HTML files back to database templates and parts.
     *
     * ## EXAMPLES
     *
     *     wp jankx template sync
     *
     * @when after_wp_load
     */
    public function sync($args, $assoc_args)
    {
        $stylesheet_dir = get_stylesheet_directory();
        $source_dir = $stylesheet_dir;

        $types = [
            'templates' => 'wp_template',
            'parts'     => 'wp_template_part'
        ];

        foreach ($types as $type => $post_type) {
            $type_dir = $source_dir . '/' . $type;
            if (!is_dir($type_dir)) continue;

            $files = glob($type_dir . '/*.html');
            if (empty($files)) continue;

            WP_CLI::log(sprintf('Syncing %s to database...', $type));

            foreach ($files as $file_path) {
                $name = basename($file_path, '.html');
                $content = file_get_contents($file_path);

                $existing = get_posts([
                    'post_type'      => $post_type,
                    'name'           => $name,
                    'post_status'    => 'any',
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
                    wp_update_post($post_data);
                    WP_CLI::log(sprintf('  - Updated %s: %s', $post_type, $name));
                } else {
                    wp_insert_post($post_data);
                    WP_CLI::log(sprintf('  - Created %s: %s', $post_type, $name));
                }
            }
        }
        WP_CLI::success('Sync completed!');
    }

    /**
     * Remove all customized templates and parts from the database.
     *
     * ## EXAMPLES
     *
     *     wp jankx template clean
     *
     * @when after_wp_load
     */
    public function clean($args, $assoc_args)
    {
        if (!isset($assoc_args['yes'])) {
            WP_CLI::confirm('Are you sure you want to delete all customized templates and parts from the database? This cannot be undone.');
        }

        $post_types = ['wp_template', 'wp_template_part'];
        $count = 0;

        foreach ($post_types as $post_type) {
            $posts = get_posts([
                'post_type'      => $post_type,
                'post_status'    => 'any',
                'posts_per_page' => -1,
            ]);

            foreach ($posts as $post) {
                if (wp_delete_post($post->ID, true)) {
                    WP_CLI::log(sprintf('  - Deleted %s: %s', $post_type, $post->post_name));
                    $count++;
                }
            }
        }

        WP_CLI::success(sprintf('Deleted %d items from database.', $count));
    }
}
