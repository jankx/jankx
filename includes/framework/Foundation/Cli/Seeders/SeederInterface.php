<?php

namespace Jankx\Foundation\Cli\Seeders;

/**
 * Interface for all Jankx data seeders.
 *
 * A Seeder is responsible for inserting demonstration or test data
 * into the WordPress database. Seeders are discoverable and runnable
 * via: wp jankx seed run <name>
 *
 * @package Jankx\Foundation\Cli\Seeders
 * @since 2.1.0
 */
interface SeederInterface
{
    /**
     * Return the unique machine-readable name of this seeder.
     *
     * The name is used on the command line, e.g. "gaming-posts".
     *
     * @return string
     */
    public static function getName(): string;

    /**
     * Return a short human-readable description shown in seeder listings.
     *
     * @return string
     */
    public static function getDescription(): string;

    /**
     * Return the name of this seeder's target demo group (optional).
     *
     * For example: "gaming", "ecommerce", "blog".
     * Used to group seeders by demo theme.
     *
     * @return string
     */
    public static function getGroup(): string;

    /**
     * Run the seeder.
     *
     * Implementations should be idempotent where possible —
     * i.e., running twice should not result in duplicate data.
     *
     * @param array $options  Associative array of options passed from CLI
     * @return void
     */
    public function run(array $options = []): void;

    /**
     * Roll back the data created by this seeder.
     *
     * @return void
     */
    public function rollback(): void;

    /**
     * Estimate the number of items this seeder will create.
     *
     * Used to show progress. Return 0 if unknown.
     *
     * @return int
     */
    public function count(): int;
}
