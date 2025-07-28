<?php

namespace Tests\CLI;

use PHPUnit\Framework\TestCase;
use Jankx\Providers\CLIServiceProvider;
use Jankx\CLI\Commands\CodingStandardCommand;
use Jankx\CLI\Commands\GenerateBlockCommand;
use Jankx\CLI\Commands\CreateBootstrapperCommand;
use Illuminate\Container\Container;

/**
 * Test CLI Service Provider
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class CLIServiceProviderTest extends TestCase
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var CLIServiceProvider
     */
    protected $serviceProvider;

    /**
     * Set up test environment
     *
     * @since 2.0.0
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->container = new Container();
        $this->serviceProvider = new CLIServiceProvider($this->container);
    }

    /**
     * Test that service provider should load in CLI context
     *
     * @since 2.0.0
     */
    public function testShouldLoadInCLIContext()
    {
        // Mock CLI context
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
        }

        $this->assertTrue($this->serviceProvider->shouldLoad(),
            'Service provider should load in CLI context');
    }

    /**
     * Test that CLI commands are registered in container
     *
     * @since 2.0.0
     */
    public function testCLICommandsRegisteredInContainer()
    {
        $this->serviceProvider->register();

        // Test that CLI commands container is registered
        $this->assertTrue($this->container->bound('cli.commands'),
            'CLI commands should be bound to container');

        // Test that individual command classes are registered
        $this->assertTrue($this->container->bound('cli.command.coding-standard'),
            'CodingStandardCommand should be bound to container');
        $this->assertTrue($this->container->bound('cli.command.generate-block'),
            'GenerateBlockCommand should be bound to container');
        $this->assertTrue($this->container->bound('cli.command.create-bootstrapper'),
            'CreateBootstrapperCommand should be bound to container');
    }

    /**
     * Test that CLI command instances are singletons
     *
     * @since 2.0.0
     */
    public function testCLICommandsAreSingletons()
    {
        $this->serviceProvider->register();

        $command1 = $this->container->make('cli.command.coding-standard');
        $command2 = $this->container->make('cli.command.coding-standard');

        $this->assertSame($command1, $command2,
            'CLI commands should be singletons');
    }

    /**
     * Test that CLI command instances are correct types
     *
     * @since 2.0.0
     */
    public function testCLICommandsAreCorrectTypes()
    {
        $this->serviceProvider->register();

        $this->assertInstanceOf(CodingStandardCommand::class,
            $this->container->make('cli.command.coding-standard'));
        $this->assertInstanceOf(GenerateBlockCommand::class,
            $this->container->make('cli.command.generate-block'));
        $this->assertInstanceOf(CreateBootstrapperCommand::class,
            $this->container->make('cli.command.create-bootstrapper'));
    }

    /**
     * Test that boot method only runs in CLI context
     *
     * @since 2.0.0
     */
    public function testBootMethodOnlyRunsInCLIContext()
    {
        // Mock CLI context
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
        }

        // Should not throw exception in CLI context
        $this->serviceProvider->boot();
        $this->assertTrue(true, 'Boot method should run without error in CLI context');
    }

    /**
     * Test that service provider follows service provider pattern
     *
     * @since 2.0.0
     */
    public function testServiceProviderFollowsPattern()
    {
        $this->assertTrue(method_exists($this->serviceProvider, 'register'),
            'Service provider should have register method');
        $this->assertTrue(method_exists($this->serviceProvider, 'boot'),
            'Service provider should have boot method');
        $this->assertTrue(method_exists($this->serviceProvider, 'shouldLoad'),
            'Service provider should have shouldLoad method');
    }

    /**
     * Test that service provider has proper documentation
     *
     * @since 2.0.0
     */
    public function testServiceProviderHasProperDocumentation()
    {
        $reflection = new \ReflectionClass($this->serviceProvider);

        $this->assertNotEmpty($reflection->getDocComment(),
            'Service provider should have class documentation');

        $registerMethod = $reflection->getMethod('register');
        $this->assertNotEmpty($registerMethod->getDocComment(),
            'Register method should have documentation');

        $bootMethod = $reflection->getMethod('boot');
        $this->assertNotEmpty($bootMethod->getDocComment(),
            'Boot method should have documentation');

        $shouldLoadMethod = $reflection->getMethod('shouldLoad');
        $this->assertNotEmpty($shouldLoadMethod->getDocComment(),
            'ShouldLoad method should have documentation');
    }
}