<?php

/**
 * Jankx CLI Configuration
 *
 * All WP-CLI related settings live here.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ADDING EXTRA COMMANDS
 * ──────────────────────────────────────────────────────────────────────────
 * Register additional WP-CLI command groups under 'commands'.
 * The key is the full WP-CLI route (e.g. 'jankx mymodule'),
 * the value is the FQCN of a class that extends WP_CLI_Command.
 *
 * Example (from a child theme's config/cli.php):
 *
 *     'commands' => [
 *         'jankx pets' => App\Console\Commands\PetsCommand::class,
 *     ],
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ADDING EXTRA SEEDERS
 * ──────────────────────────────────────────────────────────────────────────
 * Register additional data seeder classes under 'seeders'.
 * Each class must implement SeederInterface (or extend AbstractSeeder).
 *
 * Example:
 *
 *     'seeders' => [
 *         App\Console\Seeders\PetPortalSeeder::class,
 *     ],
 *
 * You can also register seeders at runtime via the WP filter:
 *
 *     add_filter('jankx/cli/seeders', function(array $seeders) {
 *         $seeders['pet-portal'] = App\Console\Seeders\PetPortalSeeder::class;
 *         return $seeders;
 *     });
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DEMO IMPORT SETTINGS
 * ──────────────────────────────────────────────────────────────────────────
 * 'demo.path' : Directory (relative to theme root) that holds demo packages.
 *               Each sub-directory is one demo, identified by its folder name.
 * 'demo.require_importer' : Abort if WordPress Importer plugin is missing.
 */

return [

    // ── Extra WP-CLI command groups (in addition to built-ins) ───────────────
    'commands' => [
        'jankx template' => \Jankx\Foundation\Cli\Commands\TemplateCommand::class,
    ],

    // ── Extra seeder classes (in addition to bundled defaults) ───────────────
    'seeders' => [
        // App\Console\Seeders\PetPortalSeeder::class,
    ],

    // ── Demo import settings ─────────────────────────────────────────────────
    'demo' => [
        /**
         * Relative path (from theme root) where demo packages are stored.
         * Each sub-directory is one demo, identified by its directory name.
         */
        'path' => 'demo',

        /**
         * If true, `wp jankx demo import` will abort with an error when
         * the WordPress Importer plugin is not active.
         * Set to false to skip the XML import step silently instead.
         */
        'require_importer' => false,

        /**
         * Maximum execution time (seconds) allowed for a single demo import.
         * Increase for large demo datasets.
         */
        'timeout' => 300,

        /**
         * Default author to assign to imported posts (WordPress user login).
         * Set to null to use the first administrator account.
         */
        'default_author' => null,
    ],

    // ── Seeder defaults ───────────────────────────────────────────────────────
    'seeder' => [
        /**
         * Default post_author ID for seeded posts.
         */
        'default_author_id' => 1,

        /**
         * Default post status for seeded posts.
         */
        'default_post_status' => 'publish',
    ],

];
