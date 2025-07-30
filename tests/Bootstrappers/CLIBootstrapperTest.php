<?php

namespace Tests\Bootstrappers;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\CLI\CLIBootstrapper;
use Jankx\Providers\CLIServiceProvider;

/**
 * Test CLIBootstrapper
 *
 * @package Tests\Bootstrappers
 * @since 2.0.0
 */
class CLIBootstrapperTest extends TestCase
{
    /**
     * @var CLIBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new CLIBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\CLI\CLIBootstrapper'));
        $this->assertInstanceOf('Jankx\Bootstrappers\AbstractBootstrapper', $this->bootstrapper);
    }

    /**
     * Test bootstrapper has required methods
     */
    public function testBootstrapperHasRequiredMethods()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'getName'));
        $this->assertTrue(method_exists($this->bootstrapper, 'shouldRun'));
        $this->assertTrue(method_exists($this->bootstrapper, 'bootstrap'));
    }

    /**
     * Test bootstrapper name
     */
    public function testBootstrapperName()
    {
        $this->assertEquals('cli', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(30, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should run in CLI context
     */
    public function testBootstrapperShouldRunInCLIContext()
    {
        // Mock WP_CLI constant
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
        }

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run in non-CLI context
     */
    public function testBootstrapperShouldNotRunInNonCLIContext()
    {
        // Mock non-CLI context
        if (defined('WP_CLI')) {
            $this->markTestSkipped('WP_CLI already defined');
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
    }

    /**
     * Test CLI service provider exists
     */
    public function testCLIServiceProviderExists()
    {
        $this->assertTrue(class_exists('Jankx\Providers\CLIServiceProvider'));

        // Create a mock container
        $container = $this->createMock('Illuminate\Container\Container');
        $this->assertInstanceOf('Jankx\Providers\ServiceProvider', new CLIServiceProvider($container));
    }

    /**
     * Test bootstrapper bootstrap method
     */
    public function testBootstrapperBootstrapMethod()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'bootstrap'));
    }

    /**
     * Test bootstrapper inheritance
     */
    public function testBootstrapperInheritance()
    {
        $this->assertInstanceOf('Jankx\Bootstrappers\AbstractBootstrapper', $this->bootstrapper);
    }
}