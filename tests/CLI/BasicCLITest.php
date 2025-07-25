<?php

use PHPUnit\Framework\TestCase;

/**
 * Basic CLI Test
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class BasicCLITest extends TestCase
{
    /**
     * Test basic CLI context isolation
     *
     * @since 2.0.0
     */
    public function testBasicCLIContextIsolation()
    {
        // Test that ABSPATH is defined
        $this->assertTrue(defined('ABSPATH'), 'ABSPATH should be defined in test environment');

        // Test that we're not in CLI context
        $this->assertFalse(defined('WP_CLI'), 'Should not be in CLI context during test');

        // Test that CLI classes can be loaded
        $this->assertTrue(class_exists('Jankx\CLI\Commands\CodingStandardCommand'), 'CLI command class should be loadable');

        // Test that CLI bootstrapper exists and respects context
        $this->assertTrue(class_exists('Jankx\Bootstrappers\CLI\CLIBootstrapper'), 'CLI bootstrapper should be loadable');

        $bootstrapper = new Jankx\Bootstrappers\CLI\CLIBootstrapper();
        $this->assertFalse($bootstrapper->shouldRun(), 'CLI bootstrapper should not run in non-CLI context');
    }
}