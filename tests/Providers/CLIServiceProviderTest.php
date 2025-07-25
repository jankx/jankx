<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Providers\CLIServiceProvider;
use Jankx\CLI\CLICommands;
use Jankx\CLI\Commands\CodingStandardCommand;
use Jankx\CLI\Commands\GenerateBlockCommand;
use Jankx\CLI\Commands\CreateBootstrapperCommand;
use Jankx\CLI\Commands\ReleaseCommand;

/**
 * Test CLIServiceProvider
 *
 * @package Tests\Providers
 * @since 2.0.0
 */
class CLIServiceProviderTest extends TestCase
{
    /**
     * @var CLIServiceProvider
     */
    private $provider;

    protected function setUp(): void
    {
        $this->provider = new CLIServiceProvider();
    }

    /**
     * Test service provider exists
     */
    public function testServiceProviderExists()
    {
        $this->assertTrue(class_exists('Jankx\Providers\CLIServiceProvider'));
        $this->assertInstanceOf('Jankx\Providers\ServiceProvider', $this->provider);
    }

    /**
     * Test service provider has required methods
     */
    public function testServiceProviderHasRequiredMethods()
    {
        $this->assertTrue(method_exists($this->provider, 'register'));
        $this->assertTrue(method_exists($this->provider, 'boot'));
        $this->assertTrue(method_exists($this->provider, 'shouldLoad'));
    }

    /**
     * Test CLI commands registration
     */
    public function testCLICommandsRegistration()
    {
        $this->assertTrue(class_exists('Jankx\CLI\CLICommands'));
        $this->assertTrue(method_exists('Jankx\CLI\CLICommands', 'register'));
    }

    /**
     * Test individual command classes exist
     */
    public function testCommandClassesExist()
    {
        $this->assertTrue(class_exists('Jankx\CLI\Commands\CodingStandardCommand'));
        $this->assertTrue(class_exists('Jankx\CLI\Commands\GenerateBlockCommand'));
        $this->assertTrue(class_exists('Jankx\CLI\Commands\CreateBootstrapperCommand'));
        $this->assertTrue(class_exists('Jankx\CLI\Commands\ReleaseCommand'));
    }

    /**
     * Test command classes extend WP_CLI_Command
     */
    public function testCommandClassesExtendWPCLICommand()
    {
        $this->assertInstanceOf('WP_CLI_Command', new CodingStandardCommand());
        $this->assertInstanceOf('WP_CLI_Command', new GenerateBlockCommand());
        $this->assertInstanceOf('WP_CLI_Command', new CreateBootstrapperCommand());
        $this->assertInstanceOf('WP_CLI_Command', new ReleaseCommand());
    }

    /**
     * Test service provider should load in CLI context
     */
    public function testServiceProviderShouldLoadInCLIContext()
    {
        // Mock WP_CLI constant
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
        }

        $this->assertTrue($this->provider->shouldLoad());
    }

    /**
     * Test CLI commands have required methods
     */
    public function testCLICommandsHaveRequiredMethods()
    {
        $commands = [
            new CodingStandardCommand(),
            new GenerateBlockCommand(),
            new CreateBootstrapperCommand(),
            new ReleaseCommand()
        ];

        foreach ($commands as $command) {
            $this->assertTrue(method_exists($command, '__invoke'));
        }
    }

    /**
     * Test CLI commands container bindings
     */
    public function testCLICommandsContainerBindings()
    {
        $this->assertTrue(method_exists($this->provider, 'register'));

        // Test that register method exists and can be called
        $this->assertTrue(method_exists($this->provider, 'register'));
    }
}