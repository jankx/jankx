<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Foundation\Cli\Commands\JankxCommand;
use Jankx\Foundation\Cli\Commands\CacheCommand;
use Jankx\Foundation\Cli\Commands\ConfigCommand;
use Jankx\Foundation\Cli\Commands\SystemCommand;
use Jankx\Foundation\Cli\Commands\SeedCommand;
use Jankx\Foundation\Cli\Commands\DemoCommand;
use Jankx\Foundation\Cli\Commands\ExtensionCommand;
use Jankx\Foundation\Cli\Commands\ExtensionReleaseCommand;
use Jankx\Foundation\Cli\Seeders\SeederRegistry;
use Jankx\Demo\Seeders\GamingPortalSeeder;
use Jankx\Demo\Seeders\BlogDemoSeeder;

/**
 * WordPress CLI Service Provider
 *
 * Registers all WP-CLI commands for the Jankx Framework:
 *   wp jankx         — framework info & cache helpers
 *   wp jankx cache   — cache management
 *   wp jankx config  — configuration helpers
 *   wp jankx system  — system health, maintenance, optimization
 *   wp jankx seed    — data seeders for quick demo generation
 *   wp jankx demo    — full demo import / reset
 *
 * Additional commands can be added via config/cli.php.
 * Additional seeders can be added via the 'jankx/cli/seeders' filter.
 *
 * @package Jankx\Support\Providers
 * @since 1.0.0
 */
class WordPressCliServiceProvider extends ServiceProvider
{
    /**
     * Built-in seeder classes bundled with the framework.
     *
     * @var array<class-string<\Jankx\Foundation\Cli\Seeders\SeederInterface>>
     */
    protected array $defaultSeeders = [
        GamingPortalSeeder::class,
        BlogDemoSeeder::class,
        \Jankx\Demo\Seeders\PetShopSeeder::class,
    ];

    // ─── register() ──────────────────────────────────────────────────────────

    /**
     * Register services into the container.
     *
     * @param Application $app
     * @return void
     */
    public function register(Application $app)
    {
        // ── Core commands ────────────────────────────────────────────────────
        $this->app->singleton('jankx.command', function () {
            return new JankxCommand();
        });

        $this->app->singleton('jankx.cache.command', function () {
            return new CacheCommand();
        });

        $this->app->singleton('jankx.config.command', function () {
            return new ConfigCommand();
        });

        // ── New system commands ───────────────────────────────────────────────
        $this->app->singleton('jankx.system.command', function () {
            return new SystemCommand();
        });

        $this->app->singleton('jankx.seed.command', function () {
            return new SeedCommand();
        });

        $this->app->singleton('jankx.demo.command', function () {
            return new DemoCommand();
        });

        $this->app->singleton('jankx.extension.command', function () {
            return new ExtensionCommand();
        });

        $this->app->singleton('jankx.extension.release.command', function () {
            return new ExtensionReleaseCommand();
        });

        // ── Extra commands from config/cli.php ───────────────────────────────
        $commands = $this->app['config']->get('cli.commands', []);
        if (is_array($commands)) {
            foreach ($commands as $name => $class) {
                $binding = "cli.command.{$name}";
                $this->app->singleton($binding, function () use ($class) {
                    return new $class();
                });
            }
        }

        // ── Register default seeders ─────────────────────────────────────────
        SeederRegistry::registerMany($this->defaultSeeders);

        // Extra seeders listed in config/cli.php under cli.seeders
        $extraSeeders = $this->app['config']->get('cli.seeders', []);
        if (!empty($extraSeeders)) {
            SeederRegistry::registerMany($extraSeeders);
        }
    }

    // ─── boot() ──────────────────────────────────────────────────────────────

    /**
     * Bootstrap services (register WP-CLI hooks).
     *
     * @param Application $app
     * @return void
     */
    public function boot(Application $app)
    {
        add_action('cli_init', [$this, 'registerCommands']);
    }

    // ─── Command registration ─────────────────────────────────────────────────

    /**
     * Register all WP-CLI commands.
     *
     * @return void
     */
    public function registerCommands()
    {
        if (!defined('WP_CLI') || !WP_CLI) {
            return;
        }

        // Core
        \WP_CLI::add_command('jankx',        $this->app->make('jankx.command'));
        \WP_CLI::add_command('jankx cache',  $this->app->make('jankx.cache.command'));
        \WP_CLI::add_command('jankx config', $this->app->make('jankx.config.command'));

        // New system-level commands
        \WP_CLI::add_command('jankx system', $this->app->make('jankx.system.command'));
        \WP_CLI::add_command('jankx seed',   $this->app->make('jankx.seed.command'));
        \WP_CLI::add_command('jankx demo',   $this->app->make('jankx.demo.command'));
        \WP_CLI::add_command('jankx extension', $this->app->make('jankx.extension.command'));
        \WP_CLI::add_command('jankx extension release', $this->app->make('jankx.extension.release.command'));

        // Commands defined in config/cli.php → cli.commands
        $commands = $this->app->get('config')->get('cli.commands', []);
        if (is_array($commands)) {
            foreach ($commands as $wpCliName => $class) {
                \WP_CLI::add_command($wpCliName, $this->app->make("cli.command.{$wpCliName}"));
            }
        }
    }

    // ─── Introspection ────────────────────────────────────────────────────────

    /**
     * Return the full map of registered commands and their descriptions.
     *
     * @return array<string, array<string, string>>
     */
    public function getAvailableCommands(): array
    {
        return [
            'jankx' => [
                'info'         => 'Show Jankx Framework information',
                'build-blocks' => 'Build Gutenberg blocks',
                'clear-cache'  => 'Clear all Jankx caches',
                'cache-status' => 'Show cache status',
            ],
            'jankx cache' => [
                'clear'        => 'Clear all Jankx caches',
                'clear-config' => 'Clear config cache',
                'clear-blocks' => 'Clear block cache',
                'clear-widgets'=> 'Clear widget cache',
                'clear-users'  => 'Clear user cache',
                'status'       => 'Show cache status',
            ],
            'jankx config' => [
                'clone' => 'Clone config from parent theme to child theme',
            ],
            'jankx system' => [
                'status'      => 'Show framework + environment status',
                'health'      => 'Run health checks',
                'maintenance' => 'Enable / disable maintenance mode',
                'optimize'    => 'Flush rules, purge expired transients, clear caches',
                'extensions'  => 'List installed extensions',
                'providers'   => 'List registered service providers',
            ],
            'jankx seed' => [
                'list'     => 'List all available seeders',
                'run'      => 'Run one or more seeders',
                'rollback' => 'Roll back data created by a seeder',
            ],
            'jankx demo' => [
                'list'   => 'List available demo packages',
                'import' => 'Import a demo package',
                'reset'  => 'Remove imported demo content',
            ],
            'jankx extension' => [
                'release setup' => 'Setup GitHub Actions release workflow for extensions',
                'release list'  => 'List extensions for release builds',
            ],
        ];
    }
}
