<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;
use Jankx\Foundation\Cli\Seeders\SeederRegistry;

/**
 * Jankx Seed Commands
 *
 * Generate demo or test data for the Jankx theme quickly via WP-CLI.
 *
 * ## SYNOPSIS
 *
 *     wp jankx seed <command> [--options]
 *
 * ## SUBCOMMANDS
 *
 *     list        List all available seeders
 *     run         Run one or more seeders
 *     rollback    Roll back data created by a seeder
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class SeedCommand extends WP_CLI_Command
{
    /**
     * List all available seeders.
     *
     * ## OPTIONS
     *
     * [--group=<group>]
     * : Filter by group name (e.g. gaming, blog, ecommerce).
     *
     * [--format=<format>]
     * : Output format: table, json, yaml, csv. Default: table.
     *
     * ## EXAMPLES
     *
     *     wp jankx seed list
     *     wp jankx seed list --group=gaming
     *     wp jankx seed list --format=json
     *
     * @when after_wp_load
     */
    public function list($args, $assoc_args)
    {
        $group  = $assoc_args['group']  ?? null;
        $format = $assoc_args['format'] ?? 'table';

        $seeders = SeederRegistry::all();

        if (empty($seeders)) {
            WP_CLI::warning('No seeders registered. Add seeders via the "jankx/cli/seeders" filter.');
            return;
        }

        $items = [];
        foreach ($seeders as $name => $class) {
            /** @var \Jankx\Foundation\Cli\Seeders\SeederInterface $class */
            $seederGroup = $class::getGroup();

            if ($group && $seederGroup !== $group) {
                continue;
            }

            $items[] = [
                'Name'        => $name,
                'Group'       => $seederGroup,
                'Description' => $class::getDescription(),
                'Items'       => (new $class())->count() ?: '?',
            ];
        }

        if (empty($items)) {
            WP_CLI::warning(sprintf('No seeders found for group "%s".', $group));
            return;
        }

        WP_CLI\Utils\format_items($format, $items, ['Name', 'Group', 'Items', 'Description']);
    }

    /**
     * Run one or more seeders.
     *
     * ## OPTIONS
     *
     * <seeder>...
     * : One or more seeder names to run (as shown in `seed list`).
     *
     * [--all]
     * : Run all registered seeders.
     *
     * [--group=<group>]
     * : Run all seeders belonging to a specific group.
     *
     * [--class=<class>]
     * : Run a specific seeder using its Class name (Laravel style: --class=PetShopSeeder).
     *
     * [--verbose]
     * : Show detailed output for each inserted item.
     *
     * [--dry-run]
     * : Preview what would be seeded without making changes.
     *
     * ## EXAMPLES
     *
     *     wp jankx seed run gaming-portal
     *     wp jankx seed run gaming-portal blog-demo --verbose
     *     wp jankx seed run --all
     *     wp jankx seed run --group=gaming
     *     wp jankx seed run gaming-portal --dry-run
     *     wp jankx seed run --class=PetShopSeeder
     *     wp jankx seed run BlogDemoSeeder
     *
     * @when after_wp_load
     */
    public function run($args, $assoc_args)
    {
        $runAll  = isset($assoc_args['all']);
        $group   = $assoc_args['group']  ?? null;
        $class   = $assoc_args['class']  ?? null;
        $verbose = isset($assoc_args['verbose']);
        $dryRun  = isset($assoc_args['dry-run']);

        // Resolve which seeders to run
        if ($class) {
            $toRun = [$class];
        } else {
            $toRun = $this->resolveSeederList($args, $runAll, $group);
        }

        if (empty($toRun)) {
            WP_CLI::error('No seeders to run. Specify a name, --all, or --group=<group>.');
        }

        if ($dryRun) {
            WP_CLI::log('DRY RUN — no data will be written.');
            WP_CLI::log('');
        }

        $succeeded = 0;
        $failed    = 0;

        foreach ($toRun as $name) {
            WP_CLI::log(sprintf('▸ Running seeder: %s', $name));

            try {
                $seeder = SeederRegistry::resolve($name);
                $seeder->setVerbose($verbose);

                if (!$dryRun) {
                    $seeder->run($assoc_args);
                } else {
                    WP_CLI::log(sprintf(
                        '  [dry-run] Would create ~%d item(s)',
                        $seeder->count() ?: 0
                    ));
                }

                WP_CLI::success(sprintf('Seeder "%s" completed.', $name));
                $succeeded++;
            } catch (\Throwable $e) {
                WP_CLI::warning(sprintf('Seeder "%s" failed: %s', $name, $e->getMessage()));
                $failed++;
            }

            WP_CLI::log('');
        }

        WP_CLI::log(sprintf('Done: %d succeeded, %d failed.', $succeeded, $failed));
    }

    /**
     * Roll back the data created by a seeder.
     *
     * ## OPTIONS
     *
     * <seeder>
     * : Seeder name to roll back.
     *
     * [--yes]
     * : Skip the confirmation prompt.
     *
     * ## EXAMPLES
     *
     *     wp jankx seed rollback gaming-portal
     *     wp jankx seed rollback gaming-portal --yes
     *
     * @when after_wp_load
     */
    public function rollback($args, $assoc_args)
    {
        if (empty($args)) {
            WP_CLI::error('Please provide a seeder name. E.g.: wp jankx seed rollback gaming-portal');
        }

        $name = $args[0];
        $skip = isset($assoc_args['yes']);

        if (!$skip) {
            WP_CLI::confirm(sprintf('Are you sure you want to roll back seeder "%s"?', $name));
        }

        try {
            $seeder = SeederRegistry::resolve($name);
            $seeder->rollback();
            WP_CLI::success(sprintf('Seeder "%s" rolled back successfully.', $name));
        } catch (\Throwable $e) {
            WP_CLI::error('Rollback failed: ' . $e->getMessage());
        }
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Build the list of seeder names to run.
     *
     * @param array       $args
     * @param bool        $runAll
     * @param string|null $group
     * @return string[]
     */
    protected function resolveSeederList(array $args, bool $runAll, ?string $group): array
    {
        if ($runAll) {
            return array_keys(SeederRegistry::all());
        }

        if ($group) {
            $grouped = SeederRegistry::grouped();
            return array_keys($grouped[$group] ?? []);
        }

        return $args;
    }
}
