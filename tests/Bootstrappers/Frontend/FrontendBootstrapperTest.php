<?php

namespace Tests\Bootstrappers\Frontend;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Frontend\FrontendBootstrapper;
use Illuminate\Container\Container;

/**
 * Test FrontendBootstrapper
 *
 * @package Tests\Bootstrappers\Frontend
 * @since 2.0.0
 */
class FrontendBootstrapperTest extends TestCase
{
    /**
     * @var FrontendBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new FrontendBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Frontend\FrontendBootstrapper'));
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
        $this->assertTrue(method_exists($this->bootstrapper, 'loadFrontendServices'));
        $this->assertTrue(method_exists($this->bootstrapper, 'loadFrontendAssets'));
    }

    /**
     * Test bootstrapper name
     */
    public function testBootstrapperName()
    {
        $this->assertEquals('frontend', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(15, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should run in frontend context
     */
    public function testBootstrapperShouldRunInFrontendContext()
    {
        // Mock required functions
        if (!function_exists('is_admin')) {
            function is_admin() {
                return false;
            }
        }
        
        if (!defined('REST_REQUEST')) {
            define('REST_REQUEST', false);
        }
        
        if (!defined('WP_CLI')) {
            define('WP_CLI', false);
        }

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run in admin context
     */
    public function testBootstrapperShouldNotRunInAdminContext()
    {
        // Mock is_admin function to return true
        if (!function_exists('is_admin')) {
            function is_admin() {
                return true;
            }
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run in REST context
     */
    public function testBootstrapperShouldNotRunInRESTContext()
    {
        // Mock REST_REQUEST constant
        if (!defined('REST_REQUEST')) {
            define('REST_REQUEST', true);
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run in CLI context
     */
    public function testBootstrapperShouldNotRunInCLIContext()
    {
        // Mock WP_CLI constant
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
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
     * Test loadFrontendServices method
     */
    public function testLoadFrontendServicesMethod()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'loadFrontendServices'));
    }

    /**
     * Test loadFrontendAssets method
     */
    public function testLoadFrontendAssetsMethod()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'loadFrontendAssets'));
    }

    /**
     * Test private methods exist
     */
    public function testPrivateMethodsExist()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        
        $this->assertTrue($reflection->hasMethod('loadEssentialServices'));
        $this->assertTrue($reflection->hasMethod('deferHeavyServices'));
        $this->assertTrue($reflection->hasMethod('setupFrontendHooks'));
    }
} 