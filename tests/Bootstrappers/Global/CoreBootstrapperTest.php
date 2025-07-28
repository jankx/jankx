<?php

namespace Tests\Bootstrappers\Global;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Global\CoreBootstrapper;
use Illuminate\Container\Container;

/**
 * Test CoreBootstrapper
 *
 * @package Tests\Bootstrappers\Global
 * @since 2.0.0
 */
class CoreBootstrapperTest extends TestCase
{
    /**
     * @var CoreBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new CoreBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Global\CoreBootstrapper'));
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
        $this->assertEquals('core', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(10, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should always run
     */
    public function testBootstrapperShouldAlwaysRun()
    {
        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper bootstrap method
     */
    public function testBootstrapperBootstrapMethod()
    {
        $container = new Container();

        // Mock required functions
        if (!function_exists('defined')) {
            function defined($constant) {
                return $constant === 'JANKX_DEBUG';
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
     * Test bootstrapper is final class
     */
    public function testBootstrapperIsFinalClass()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $this->assertTrue($reflection->isFinal());
    }

    /**
     * Test bootstrapper is in correct namespace
     */
    public function testBootstrapperNamespace()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $this->assertEquals('Jankx\Bootstrappers\Global', $reflection->getNamespaceName());
    }

    /**
     * Test bootstrapper class name
     */
    public function testBootstrapperClassName()
    {
        $this->assertEquals('Jankx\Bootstrappers\Global\CoreBootstrapper', get_class($this->bootstrapper));
    }

    /**
     * Test bootstrapper has proper documentation
     */
    public function testBootstrapperHasDocumentation()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $docComment = $reflection->getDocComment();

        $this->assertStringContainsString('@package', $docComment);
        $this->assertStringContainsString('@author', $docComment);
    }
}