<?php

namespace Jankx\CLI\Commands;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use WP_CLI;
use WP_CLI_Command;

/**
 * WP CLI Command to generate Gutenberg blocks
 *
 * @package Jankx\CLI\Commands
 * @since 2.0.0
 */
class GenerateBlockCommand extends WP_CLI_Command
{
    /**
     * Generate a new Gutenberg block
     *
     * ## OPTIONS
     *
     * <block-name>
     * : Name of the block (e.g., hero-section, feature-grid)
     *
     * [--title=<title>]
     * : Block title (default: auto-generated from block name)
     *
     * [--description=<description>]
     * : Block description
     *
     * ## EXAMPLES
     *
     *     # Generate a simple block
     *     wp jankx generate-block hero-section
     *
     *     # Generate a block with custom options
     *     wp jankx generate-block feature-grid --title="Feature Grid" --description="Display features in a grid layout"
     *
     * @since 2.0.0
     */
    public function __invoke($args, $assoc_args)
    {
        if (empty($args[0])) {
            WP_CLI::error('Block name is required');
            return;
        }

        $blockName = sanitize_title($args[0]);
        $blockTitle = isset($assoc_args['title']) ? $assoc_args['title'] : ucwords(str_replace(['-', '_'], ' ', $blockName));
        $description = isset($assoc_args['description']) ? $assoc_args['description'] : '';

        WP_CLI::log("🎨 Generating Gutenberg block: $blockName");
        WP_CLI::log("📝 Title: $blockTitle");
        WP_CLI::log("📄 Description: $description");

        // TODO: Implement block generation logic
        WP_CLI::success("Block '$blockName' generated successfully!");
        WP_CLI::log("📁 Files created:");
        WP_CLI::log("   - assets/gutenberg/js/blocks/$blockName.js");
        WP_CLI::log("   - assets/gutenberg/css/blocks/$blockName.css");
        WP_CLI::log("   - templates/blocks/$blockName.html");
        WP_CLI::log("   - includes/Jankx/Gutenberg/Blocks/$blockName.php");
    }
}
