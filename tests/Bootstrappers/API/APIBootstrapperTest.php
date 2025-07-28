<?php

namespace Tests\Bootstrappers\API;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\API\APIBootstrapper;
use Illuminate\Container\Container;

/**
 * Test APIBootstrapper
 *
 * @package Tests\Bootstrappers\API
 * @since 2.0.0
 */
class APIBootstrapperTest extends TestCase
{
    /**
     * @var APIBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new APIBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\API\APIBootstrapper'));
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
        $this->assertEquals('api', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(25, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should run in REST API context
     */
    public function testBootstrapperShouldRunInRESTContext()
    {
        // Mock REST_REQUEST constant
        if (!defined('REST_REQUEST')) {
            define('REST_REQUEST', true);
        }

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper bootstrap method
     */
    public function testBootstrapperBootstrapMethod()
    {
        $container = new Container();

        // Test that bootstrap method can be called without errors
        $this->assertTrue(method_exists($this->bootstrapper, 'bootstrap'));

        // Mock action hook to prevent errors
        if (!function_exists('do_action')) {
            function do_action($hook, $container = null) {
                // Mock implementation
            }
        }

        // Test bootstrap execution
        $this->bootstrapper->bootstrap($container);
        $this->assertTrue(true); // If we reach here, no errors occurred
    }

    /**
     * Test bootstrapper inheritance
     */
    public function testBootstrapperInheritance()
    {
        $this->assertInstanceOf('Jankx\Bootstrappers\AbstractBootstrapper', $this->bootstrapper);
        $this->assertInstanceOf('Jankx\Contracts\BootstrapperInterface', $this->bootstrapper);
    }

    /**
     * Test bootstrapper dependencies
     */
    public function testBootstrapperDependencies()
    {
        $this->assertIsArray($this->bootstrapper->getDependencies());
    }

    /**
     * Test bootstrapper implements interface correctly
     */
    public function testBootstrapperImplementsInterface()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $this->assertTrue($reflection->implementsInterface('Jankx\Contracts\BootstrapperInterface'));
    }
}