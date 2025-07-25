<?php

namespace Tests\Bootstrappers\Frontend;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper;
use Illuminate\Container\Container;

/**
 * Test WooCommerceBootstrapper
 *
 * @package Tests\Bootstrappers\Frontend
 * @since 2.0.0
 */
class WooCommerceBootstrapperTest extends TestCase
{
    /**
     * @var WooCommerceBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new WooCommerceBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper'));
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
        $this->assertEquals('woocommerce', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(40, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should run when WooCommerce is active
     */
    public function testBootstrapperShouldRunWhenWooCommerceActive()
    {
        // Mock class_exists function to return true for WooCommerce
        if (!function_exists('class_exists')) {
            function class_exists($class) {
                return $class === 'WooCommerce';
            }
        }

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run when WooCommerce is not active
     */
    public function testBootstrapperShouldNotRunWhenWooCommerceInactive()
    {
        // Mock class_exists function to return false for WooCommerce
        if (!function_exists('class_exists')) {
            function class_exists($class) {
                return $class !== 'WooCommerce';
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

    /**
     * Test bootstrapper is in correct namespace
     */
    public function testBootstrapperNamespace()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $this->assertEquals('Jankx\Bootstrappers\Frontend', $reflection->getNamespaceName());
    }

    /**
     * Test bootstrapper class name
     */
    public function testBootstrapperClassName()
    {
        $this->assertEquals('WooCommerceBootstrapper', get_class($this->bootstrapper));
    }
} 