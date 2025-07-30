<?php

namespace Tests\Bootstrappers\Gutenberg;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper;
use Illuminate\Container\Container;

/**
 * Test GutenbergBootstrapper
 *
 * @package Tests\Bootstrappers\Gutenberg
 * @since 2.0.0
 */
class GutenbergBootstrapperTest extends TestCase
{
    /**
     * @var GutenbergBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new GutenbergBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper'));
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
        $this->assertTrue(method_exists($this->bootstrapper, 'registerBlockCategories'));
    }

    /**
     * Test bootstrapper name
     */
    public function testBootstrapperName()
    {
        $this->assertEquals('gutenberg', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(10, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should not run when register_block_type not available
     */
    public function testBootstrapperShouldNotRunWhenRegisterBlockTypeNotAvailable()
    {
        // Mock is_admin function
        if (!function_exists('is_admin')) {
            function is_admin() {
                return true;
            }
        }

        // Mock register_block_type to not exist
        if (function_exists('register_block_type')) {
            $this->markTestSkipped('register_block_type already exists');
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
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
        if (!function_exists('add_filter')) {
            function add_filter($hook, $callback) {
                // Mock implementation
            }
        }

        if (!function_exists('__')) {
            function __($text, $domain = 'default') {
                return $text;
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
     * Test registerBlockCategories method
     */
    public function testRegisterBlockCategoriesMethod()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'registerBlockCategories'));
    }

    /**
     * Test bootstrapper is in correct namespace
     */
    public function testBootstrapperNamespace()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $this->assertEquals('Jankx\Bootstrappers\Gutenberg', $reflection->getNamespaceName());
    }

    /**
     * Test bootstrapper class name
     */
    public function testBootstrapperClassName()
    {
        $this->assertEquals('Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper', get_class($this->bootstrapper));
    }

    /**
     * Test bootstrapper has proper documentation
     */
    public function testBootstrapperHasDocumentation()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $docComment = $reflection->getDocComment();

        // Check if class has any documentation
        $this->assertNotEmpty($docComment, 'Class should have documentation');
    }
}