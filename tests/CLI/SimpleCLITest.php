<?php

use PHPUnit\Framework\TestCase;

/**
 * Simple CLI Test
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class SimpleCLITest extends TestCase
{
    /**
     * Test that CLI classes are not loaded in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIClassesNotLoadedInNonCLIContext()
    {
        // Test that we're not in CLI context
        $this->assertFalse(defined('WP_CLI'));

        // Test that CLI classes are not autoloaded by default
        $this->assertFalse(class_exists('Jankx\CLI\Commands\CodingStandardCommand', false));

        // Test that CLI classes can be loaded when needed
        $this->assertTrue(class_exists('Jankx\CLI\Commands\CodingStandardCommand'));
    }

    /**
     * Test that CLI bootstrapper respects context
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperRespectsContext()
    {
        // Test that CLI bootstrapper exists
        $this->assertTrue(class_exists('Jankx\Bootstrappers\CLI\CLIBootstrapper'));

        // Test that bootstrapper has context detection
        $bootstrapper = new Jankx\Bootstrappers\CLI\CLIBootstrapper();
        $this->assertTrue(method_exists($bootstrapper, 'shouldRun'));

        // Test that bootstrapper returns false in non-CLI context
        $this->assertFalse($bootstrapper->shouldRun());
    }
}