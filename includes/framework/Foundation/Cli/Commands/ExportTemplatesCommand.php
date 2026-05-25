<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Template Export Commands
 *
 * Exports all template parts and page templates of the active theme
 * into flat HTML files.
 *
 * ## EXAMPLES
 *
 *     wp jankx export-templates
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class ExportTemplatesCommand extends WP_CLI_Command
{
    /**
     * Export all templates and parts to flat HTML files.
     *
     * ## EXAMPLES
     *
     *     wp jankx export-templates
     *
     * @when after_wp_load
     */
    public function __invoke($args, $assoc_args)
    {
        $theme = wp_get_theme();
        $stylesheet_dir = get_stylesheet_directory();
        $template_dir = get_template_directory();

        $export_dir = $stylesheet_dir . '/html';
        if (!file_exists($export_dir)) {
            mkdir($export_dir, 0755, true);
        }

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

            // 1. Get templates from disk (parent & child theme)
            $dirs = array_unique([$template_dir . '/' . $type, $stylesheet_dir . '/' . $type]);
            $template_data = [];

            foreach ($dirs as $dir) {
                if (is_dir($dir)) {
                    $found_files = glob($dir . '/*.html');
                    foreach ($found_files as $file) {
                        $name = basename($file);
                        $template_data[$name] = [
                            'source'  => 'disk',
                            'path'    => $file,
                            'content' => file_get_contents($file)
                        ];
                    }
                }
            }

            // 2. Get templates from database (overrides disk templates)
            $db_templates = get_posts([
                'post_type'      => $post_type,
                'post_status'    => 'publish',
                'posts_per_page' => -1,
            ]);

            foreach ($db_templates as $post) {
                $name = $post->post_name . '.html';
                $template_data[$name] = [
                    'source'  => 'database',
                    'id'      => $post->ID,
                    'content' => $post->post_content
                ];
            }

            if (empty($template_data)) {
                WP_CLI::log(sprintf('No %s found.', $type));
                continue;
            }

            foreach ($template_data as $name => $data) {
                WP_CLI::log(sprintf('  - Processing %s (%s): %s', $type, $data['source'], $name));
                
                $content = $data['content'];
                
                // Render blocks
                ob_start();
                $rendered_content = do_blocks($content);
                $extra_output = ob_get_clean();
                $rendered_content = $extra_output . $rendered_content;

                // Basic HTML wrapper if it's a template (not a part)
                if ($type === 'templates' && stripos($rendered_content, '<html') === false) {
                    $rendered_content = $this->wrap_in_html($rendered_content, $name);
                }

                $output_file = $type_export_dir . '/' . $name;
                file_put_contents($output_file, $rendered_content);
            }
        }

        WP_CLI::success(sprintf('Export completed! Files are in %s', $export_dir));
    }

    /**
     * Wrap the rendered content in a basic HTML structure.
     *
     * @param string $content
     * @param string $title
     * @return string
     */
    protected function wrap_in_html($content, $title)
    {
        $title = ucwords(str_replace(['-', '.html'], [' ', ''], $title));
        return sprintf(
            '<!DOCTYPE html>
<html lang="%s">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    <style>
        body { margin: 0; padding: 0; }
        /* Add some basic styles to make it look decent if needed */
    </style>
    %s
</head>
<body>
    %s
</body>
</html>',
            get_bloginfo('language'),
            $title,
            $this->get_theme_styles(),
            $content
        );
    }

    /**
     * Get theme styles (from theme.json or enqueued styles).
     *
     * @return string
     */
    protected function get_theme_styles()
    {
        ob_start();
        
        // Ensure styles are enqueued
        wp_enqueue_scripts();
        
        // Print styles and head scripts
        wp_print_styles();
        wp_print_head_scripts();
        
        $head_output = ob_get_clean();

        // Also get global styles from block theme
        if (function_exists('wp_get_global_stylesheet')) {
            $global_styles = wp_get_global_stylesheet();
            $head_output .= "\n<style id='wp-global-styles-inline-css'>\n" . $global_styles . "\n</style>";
        }

        return $head_output;
    }
}
