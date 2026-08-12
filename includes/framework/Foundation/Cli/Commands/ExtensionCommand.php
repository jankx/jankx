<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Manage Jankx extensions
 *
 * Parent command for extension management subcommands.
 *
 * ## EXAMPLES
 *
 *     wp jankx extension release setup
 *     wp jankx extension release list
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.0.0
 */
class ExtensionCommand extends WP_CLI_Command
{
    /**
     * Default subcommand when no subcommand is given.
     *
     * @when after_wp_load
     */
    public function _index($args, $assoc_args)
    {
        WP_CLI::log('Usage: wp jankx extension <subcommand>');
        WP_CLI::log('');
        WP_CLI::log('Available subcommands:');
        WP_CLI::log('  release setup   Setup GitHub Actions release workflow');
        WP_CLI::log('  release list    List extensions for release builds');
    }
}
