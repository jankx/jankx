<?php

namespace Jankx\CLI;

use WP_CLI;

/**
 * WP CLI Commands for Jankx Framework
 *
 * @package Jankx\CLI
 * @since 2.0.0
 */
class CLICommands
{
    /**
     * Register all Jankx CLI commands
     *
     * @since 2.0.0
     */
    public static function register()
    {
        if (!defined('WP_CLI') || !WP_CLI) {
            return;
        }

        // Register generate-block command
        WP_CLI::add_command('jankx generate-block', 'Jankx\\CLI\\Commands\\GenerateBlockCommand');

        // Register create-bootstrapper command
        WP_CLI::add_command('jankx create-bootstrapper', 'Jankx\\CLI\\Commands\\CreateBootstrapperCommand');

        // Register code command
        WP_CLI::add_command('jankx code', 'Jankx\\CLI\\Commands\\CodingStandardCommand');

        // Register release command
        WP_CLI::add_command('jankx release', 'Jankx\\CLI\\Commands\\ReleaseCommand');
    }

    /**
     * Get available Jankx commands
     *
     * @return array
     * @since 2.0.0
     */
    public static function getCommands()
    {
        return [
            'add-since' => [
                'description' => 'Add @since tags to Jankx classes and methods',
                'usage' => 'wp jankx add-since [--version=<version>] [--dry-run] [--verbose]',
                'examples' => [
                    'wp jankx add-since',
                    'wp jankx add-since --version=2.1.0',
                    'wp jankx add-since --dry-run --verbose'
                ]
            ],
            'generate-block' => [
                'description' => 'Generate a new Gutenberg block',
                'usage' => 'wp jankx generate-block <block-name> [--title=<title>] [--description=<description>] [--category=<category>] [--icon=<icon>] [--keywords=<keywords>] [--attributes=<attributes>]',
                'examples' => [
                    'wp jankx generate-block hero-section',
                    'wp jankx generate-block feature-grid --title="Feature Grid" --description="Display features in a grid layout"',
                    'wp jankx generate-block testimonial --attributes=\'{"title":{"type":"string","default":""},"content":{"type":"string","default":""}}\''
                ]
            ],
            'create-bootstrapper' => [
                'description' => 'Create a new bootstrapper',
                'usage' => 'wp jankx create-bootstrapper <bootstrapper-name> [--context=<context>] [--priority=<priority>] [--description=<description>]',
                'examples' => [
                    'wp jankx create-bootstrapper CustomFeature',
                    'wp jankx create-bootstrapper ThirdPartyIntegration --context=frontend --priority=15',
                    'wp jankx create-bootstrapper AdminPanel --context=admin --description="Custom admin panel integration"'
                ]
            ],
            'code' => [
                'description' => 'Check and fix WordPress Coding Standards',
                'usage' => 'wp jankx code [--fix] [--path=<path>] [--exclude=<exclude>] [--verbose] [--format=<format>]',
                'examples' => [
                    'wp jankx code',
                    'wp jankx code --fix',
                    'wp jankx code --path=includes/Jankx/Kernel',
                    'wp jankx code --exclude=vendor,tests --format=json'
                ]
            ],
            'release' => [
                'description' => 'Create release package for Jankx Framework',
                'usage' => 'wp jankx release [--version=<version>] [--output=<output>] [--force] [--dry-run]',
                'examples' => [
                    'wp jankx release',
                    'wp jankx release --version=2.0.0',
                    'wp jankx release --output=/path/to/releases',
                    'wp jankx release --dry-run',
                    'wp jankx release --force'
                ]
            ]
        ];
    }

    /**
     * Show help for Jankx commands
     *
     * @since 2.0.0
     */
    public static function showHelp()
    {
        WP_CLI::log("🎯 Jankx Framework CLI Commands");
        WP_CLI::log("===============================\n");

        $commands = self::getCommands();
        foreach ($commands as $command => $info) {
            WP_CLI::log("📝 $command");
            WP_CLI::log("   {$info['description']}");
            WP_CLI::log("   Usage: {$info['usage']}");
            if (!empty($info['examples'])) {
                WP_CLI::log("   Examples:");
                foreach ($info['examples'] as $example) {
                    WP_CLI::log("     $example");
                }
            }
            WP_CLI::log("");
        }
    }
}