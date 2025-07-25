<?php

namespace Tests\Bootstrappers\Gutenberg;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper;
use Illuminate\Container\Container;

/**
 * Test GutenbergAjaxBootstrapper
 *
 * @package Tests\Bootstrappers\Gutenberg
 * @since 2.0.0
 */
class GutenbergAjaxBootstrapperTest extends TestCase
{
    /**
     * @var GutenbergAjaxBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new GutenbergAjaxBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper'));
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
        $this->assertTrue(method_exists($this->bootstrapper, 'handleBlockRender'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleLayoutLoad'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleGetBlockData'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleGetBlockOptions'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handlePerformanceStats'));
    }

    /**
     * Test bootstrapper name
     */
    public function testBootstrapperName()
    {
        $this->assertEquals('gutenberg-ajax', $this->bootstrapper->getName());
    }

    /**
     * Test bootstrapper priority
     */
    public function testBootstrapperPriority()
    {
        $this->assertEquals(5, $this->bootstrapper->getPriority());
    }

    /**
     * Test bootstrapper should run in AJAX context with Gutenberg action
     */
    public function testBootstrapperShouldRunInAjaxContextWithGutenbergAction()
    {
        // Mock required functions
        if (!function_exists('wp_doing_ajax')) {
            function wp_doing_ajax() {
                return true;
            }
        }
        
        // Mock $_POST and $_GET
        $_POST['action'] = 'jankx_gutenberg_render_block';
        $_GET = [];

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should run with GET action
     */
    public function testBootstrapperShouldRunWithGetAction()
    {
        // Mock required functions
        if (!function_exists('wp_doing_ajax')) {
            function wp_doing_ajax() {
                return true;
            }
        }
        
        // Mock $_POST and $_GET
        $_POST = [];
        $_GET['action'] = 'jankx_gutenberg_load_layout';

        $this->assertTrue($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run when not doing AJAX
     */
    public function testBootstrapperShouldNotRunWhenNotDoingAjax()
    {
        // Mock wp_doing_ajax to return false
        if (!function_exists('wp_doing_ajax')) {
            function wp_doing_ajax() {
                return false;
            }
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run with non-Gutenberg action
     */
    public function testBootstrapperShouldNotRunWithNonGutenbergAction()
    {
        // Mock required functions
        if (!function_exists('wp_doing_ajax')) {
            function wp_doing_ajax() {
                return true;
            }
        }
        
        // Mock $_POST and $_GET with non-Gutenberg action
        $_POST['action'] = 'other_action';
        $_GET = [];

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
     * Test AJAX handler methods exist
     */
    public function testAjaxHandlerMethodsExist()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'handleBlockRender'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleLayoutLoad'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleGetBlockData'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleGetBlockOptions'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handlePerformanceStats'));
    }

    /**
     * Test private methods exist
     */
    public function testPrivateMethodsExist()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        
        $this->assertTrue($reflection->hasMethod('registerAjaxHooks'));
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
        $this->assertEquals('GutenbergAjaxBootstrapper', get_class($this->bootstrapper));
    }

    /**
     * Test bootstrapper has proper documentation
     */
    public function testBootstrapperHasDocumentation()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        $docComment = $reflection->getDocComment();
        
        $this->assertStringContainsString('@package', $docComment);
        $this->assertStringContainsString('@since', $docComment);
    }
} 