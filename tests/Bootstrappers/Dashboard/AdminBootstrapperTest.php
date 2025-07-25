<?php

namespace Tests\Bootstrappers\Dashboard;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Dashboard\AdminBootstrapper;
use Illuminate\Container\Container;

/**
 * Test AdminBootstrapper
 *
 * @package Tests\Bootstrappers\Dashboard
 * @since 2.0.0
 */
class AdminBootstrapperTest extends TestCase
{
    /**
     * @var AdminBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new AdminBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Dashboard\AdminBootstrapper'));
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
        $this->assertTrue(method_exists($this->bootstrapper, 'loadAdminServices'));
        $this->assertTrue(method_exists($this->bootstrapper, 'loadAdminAssets'));
    }

    /**
     * Test bootstrapper name
     */
    public function testBootstrapperName()
    {
        $this->assertEquals('admin', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(20, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should run in admin context
     */
    public function testBootstrapperShouldRunInAdminContext()
    {
        // Mock is_admin function
        if (!function_exists('is_admin')) {
            function is_admin() {
                return true;
            }
        }

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run in non-admin context
     */
    public function testBootstrapperShouldNotRunInNonAdminContext()
    {
        // Mock is_admin function to return false
        if (!function_exists('is_admin')) {
            function is_admin() {
                return false;
            }
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper bootstrap method
     */
    public function testBootstrapperBootstrapMethod()
    {
        $container = new Container();
        
        // Mock required functions
        if (!function_exists('add_action')) {
            function add_action($hook, $callback) {
                // Mock implementation
            }
        }
        
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

    /**
     * Test loadAdminServices method
     */
    public function testLoadAdminServicesMethod()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'loadAdminServices'));
    }

    /**
     * Test loadAdminAssets method
     */
    public function testLoadAdminAssetsMethod()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'loadAdminAssets'));
    }

    /**
     * Test private methods exist
     */
    public function testPrivateMethodsExist()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        
        $this->assertTrue($reflection->hasMethod('loadEssentialServices'));
        $this->assertTrue($reflection->hasMethod('deferHeavyServices'));
        $this->assertTrue($reflection->hasMethod('setupAdminHooks'));
    }
} 