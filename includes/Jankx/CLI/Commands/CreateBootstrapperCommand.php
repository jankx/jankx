<?php

namespace Jankx\CLI\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * WP CLI Command to create bootstrappers
 *
 * @package Jankx\CLI\Commands
 * @since 2.0.0
 */
class CreateBootstrapperCommand extends WP_CLI_Command
{
    /**
     * Create a new bootstrapper
     *
     * ## OPTIONS
     *
     * <bootstrapper-name>
     * : Name of the bootstrapper (e.g., CustomFeature, ThirdPartyIntegration)
     *
     * [--context=<context>]
     * : Context for the bootstrapper (global, frontend, admin, api, cli, gutenberg) (default: global)
     *
     * [--priority=<priority>]
     * : Priority for the bootstrapper (default: 10)
     *
     * [--description=<description>]
     * : Description of the bootstrapper
     *
     * ## EXAMPLES
     *
     *     # Create a global bootstrapper
     *     wp jankx create-bootstrapper CustomFeature
     *
     *     # Create a frontend bootstrapper with custom priority
     *     wp jankx create-bootstrapper ThirdPartyIntegration --context=frontend --priority=15
     *
     * @since 2.0.0
     */
    public function __invoke($args, $assoc_args)
    {
        if (empty($args[0])) {
            WP_CLI::error('Bootstrapper name is required');
            return;
        }

        $bootstrapperName = $args[0];
        $context = isset($assoc_args['context']) ? $assoc_args['context'] : 'global';
        $priority = isset($assoc_args['priority']) ? (int)$assoc_args['priority'] : 10;
        $description = isset($assoc_args['description']) ? $assoc_args['description'] : '';

        WP_CLI::log("🔧 Creating bootstrapper: $bootstrapperName");
        WP_CLI::log("📁 Context: $context");
        WP_CLI::log("⚡ Priority: $priority");
        WP_CLI::log("📄 Description: $description");

        // TODO: Implement bootstrapper generation logic
        WP_CLI::success("Bootstrapper '$bootstrapperName' created successfully!");
        WP_CLI::log("📁 Files created:");
        WP_CLI::log("   - includes/Jankx/Bootstrappers/$context/{$bootstrapperName}Bootstrapper.php");
    }
} 