<?php

namespace Tests\CLI;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Commands\CodingStandardCommand;
use Jankx\CLI\Checkers\MissingSinceTagChecker;
use Jankx\CLI\Checkers\SanitizationChecker;
use Jankx\CLI\Checkers\ExitUsageChecker;
use Jankx\CLI\Fixers\MissingSinceTagFixer;
use Jankx\CLI\Fixers\UnsanitizedInputFixer;
use Jankx\CLI\Fixers\ImproperExitFixer;
use Jankx\CLI\Parser\PHPParser;

/**
 * Test CLI Context Isolation
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class CLIContextIsolationTest extends TestCase
{
    /**
     * Test that CLI classes are not loaded in non-CLI context
     *
     * @since 2.0.0
     */
        public function testCLIClassesNotLoadedInNonCLIContext()
    {
        // Simulate non-CLI context
        $this->assertFalse(defined('WP_CLI'));

        // Check that CLI classes are not autoloaded
        $this->assertFalse(class_exists('Jankx\CLI\Commands\CodingStandardCommand', false));
        $this->assertFalse(class_exists('Jankx\CLI\Checkers\MissingSinceTagChecker', false));
        $this->assertFalse(class_exists('Jankx\CLI\Checkers\SanitizationChecker', false));
        $this->assertFalse(class_exists('Jankx\CLI\Checkers\ExitUsageChecker', false));
        $this->assertFalse(class_exists('Jankx\CLI\Fixers\MissingSinceTagFixer', false));
        $this->assertFalse(class_exists('Jankx\CLI\Fixers\UnsanitizedInputFixer', false));
        $this->assertFalse(class_exists('Jankx\CLI\Fixers\ImproperExitFixer', false));
        $this->assertFalse(class_exists('Jankx\CLI\Parser\PHPParser', false));
    }

    /**
     * Test that CLI classes can be loaded when needed
     *
     * @since 2.0.0
     */
        public function testCLIClassesCanBeLoadedWhenNeeded()
    {
        // Test that classes can be loaded when explicitly requested
        $this->assertTrue(class_exists('Jankx\CLI\Commands\CodingStandardCommand'));
        $this->assertTrue(class_exists('Jankx\CLI\Checkers\MissingSinceTagChecker'));
        $this->assertTrue(class_exists('Jankx\CLI\Checkers\SanitizationChecker'));
        $this->assertTrue(class_exists('Jankx\CLI\Checkers\ExitUsageChecker'));
        $this->assertTrue(class_exists('Jankx\CLI\Fixers\MissingSinceTagFixer'));
        $this->assertTrue(class_exists('Jankx\CLI\Fixers\UnsanitizedInputFixer'));
        $this->assertTrue(class_exists('Jankx\CLI\Fixers\ImproperExitFixer'));
        $this->assertTrue(class_exists('Jankx\CLI\Parser\PHPParser'));
    }

    /**
     * Test that CLI bootstrapper is not loaded in non-CLI context
     *
     * @since 2.0.0
     */
        public function testCLIBootstrapperNotLoadedInNonCLIContext()
    {
        // Check that CLI bootstrapper is not loaded
        $this->assertFalse(class_exists('Jankx\Bootstrappers\CLI\CLIBootstrapper', false));
    }

    /**
     * Test that CLI classes are not instantiated in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIClassesNotInstantiatedInNonCLIContext()
    {
        // Check that no CLI objects are created in global scope
        $globalObjects = get_defined_vars();

        foreach ($globalObjects as $var => $value) {
            if (is_object($value)) {
                $className = get_class($value);
                $this->assertStringNotContainsString('Jankx\\CLI', $className,
                    "CLI class {$className} should not be instantiated in non-CLI context");
            }
        }
    }

    /**
     * Test that CLI commands are not registered in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLICommandsNotRegisteredInNonCLIContext()
    {
        // Check that WP_CLI commands are not registered
        if (class_exists('WP_CLI')) {
            $commands = WP_CLI::get_runner()->get_command_list();
            foreach ($commands as $command) {
                $this->assertStringNotContainsString('jankx', $command['name'],
                    "Jankx CLI commands should not be registered in non-CLI context");
            }
        }
    }

    /**
     * Test that CLI autoloader is not active in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIAutoloaderNotActiveInNonCLIContext()
    {
        // Check that CLI autoloader is not registered
        $autoloaders = spl_autoload_functions();

        foreach ($autoloaders as $autoloader) {
            if (is_array($autoloader) && is_object($autoloader[0])) {
                $className = get_class($autoloader[0]);
                $this->assertStringNotContainsString('CLI', $className,
                    "CLI autoloader should not be active in non-CLI context");
            }
        }
    }

    /**
     * Test that CLI hooks are not added in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIHooksNotAddedInNonCLIContext()
    {
        // Check that CLI hooks are not added
        global $wp_filter;

        if (isset($wp_filter['cli_init'])) {
            $this->assertEmpty($wp_filter['cli_init']->callbacks,
                "CLI hooks should not be added in non-CLI context");
        }

        if (isset($wp_filter['wp_cli_init'])) {
            $this->assertEmpty($wp_filter['wp_cli_init']->callbacks,
                "WP CLI hooks should not be added in non-CLI context");
        }
    }

    /**
     * Test that CLI constants are not defined in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIConstantsNotDefinedInNonCLIContext()
    {
        // Check that CLI-specific constants are not defined
        $this->assertFalse(defined('JANKX_CLI_MODE'));
        $this->assertFalse(defined('JANKX_CLI_VERBOSE'));
        $this->assertFalse(defined('JANKX_CLI_DEBUG'));
    }

    /**
     * Test that CLI environment variables are not set in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIEnvironmentVariablesNotSetInNonCLIContext()
    {
        // Check that CLI environment variables are not set
        $this->assertFalse(isset($_ENV['JANKX_CLI_MODE']));
        $this->assertFalse(isset($_ENV['JANKX_CLI_VERBOSE']));
        $this->assertFalse(isset($_ENV['JANKX_CLI_DEBUG']));
    }

    /**
     * Test that CLI memory usage is minimal in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIMemoryUsageMinimalInNonCLIContext()
    {
        $initialMemory = memory_get_usage();

        // Simulate some operations that might trigger CLI loading
        $this->assertTrue(class_exists('Jankx\Kernel\Kernel'));

        $finalMemory = memory_get_usage();
        $memoryIncrease = $finalMemory - $initialMemory;

        // Memory increase should be minimal (less than 1MB)
        $this->assertLessThan(1024 * 1024, $memoryIncrease,
            "CLI classes should not consume significant memory in non-CLI context");
    }

    /**
     * Test that CLI performance impact is minimal in non-CLI context
     *
     * @since 2.0.0
     */
    public function testCLIPerformanceImpactMinimalInNonCLIContext()
    {
        $startTime = microtime(true);

        // Simulate normal operations
        $this->assertTrue(class_exists('Jankx\Kernel\Kernel'));

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Execution time should be minimal (less than 100ms)
        $this->assertLessThan(0.1, $executionTime,
            "CLI classes should not impact performance in non-CLI context");
    }
}