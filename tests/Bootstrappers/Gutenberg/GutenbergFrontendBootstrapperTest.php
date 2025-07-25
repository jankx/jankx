<?php

namespace Tests\Bootstrappers\Gutenberg;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper;
use Illuminate\Container\Container;

/**
 * Test GutenbergFrontendBootstrapper
 *
 * @package Tests\Bootstrappers\Gutenberg
 * @since 2.0.0
 */
class GutenbergFrontendBootstrapperTest extends TestCase
{
    /**
     * @var GutenbergFrontendBootstrapper
     */
    private $bootstrapper;

    protected function setUp(): void
    {
        $this->bootstrapper = new GutenbergFrontendBootstrapper();
    }

    /**
     * Test bootstrapper exists and extends AbstractBootstrapper
     */
    public function testBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper'));
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
        $this->assertTrue(method_exists($this->bootstrapper, 'enqueueFrontendAssets'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleBlockRender'));
        $this->assertTrue(method_exists($this->bootstrapper, 'getBlockStats'));
        $this->assertTrue(method_exists($this->bootstrapper, 'isBlockUsed'));
        $this->assertTrue(method_exists($this->bootstrapper, 'getUsedBlocks'));
    }

    /**
     * Test bootstrapper name
     */
    public function testBootstrapperName()
    {
        $this->assertEquals('gutenberg-frontend', $this->bootstrapper->getName());
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
        
        if (!function_exists('wp_doing_ajax')) {
            function wp_doing_ajax() {
                return false;
            }
        }
        
        if (!function_exists('wp_doing_cron')) {
            function wp_doing_cron() {
                return false;
            }
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
     * Test bootstrapper should not run in AJAX context
     */
    public function testBootstrapperShouldNotRunInAjaxContext()
    {
        // Mock wp_doing_ajax function to return true
        if (!function_exists('wp_doing_ajax')) {
            function wp_doing_ajax() {
                return true;
            }
        }

        $this->assertFalse($this->bootstrapper->shouldRun());
    }

    /**
     * Test bootstrapper should not run in cron context
     */
    public function testBootstrapperShouldNotRunInCronContext()
    {
        // Mock wp_doing_cron function to return true
        if (!function_exists('wp_doing_cron')) {
            function wp_doing_cron() {
                return true;
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
     * Test public methods exist
     */
    public function testPublicMethodsExist()
    {
        $this->assertTrue(method_exists($this->bootstrapper, 'enqueueFrontendAssets'));
        $this->assertTrue(method_exists($this->bootstrapper, 'handleBlockRender'));
        $this->assertTrue(method_exists($this->bootstrapper, 'getBlockStats'));
        $this->assertTrue(method_exists($this->bootstrapper, 'isBlockUsed'));
        $this->assertTrue(method_exists($this->bootstrapper, 'getUsedBlocks'));
    }

    /**
     * Test protected methods exist
     */
    public function testProtectedMethodsExist()
    {
        $reflection = new \ReflectionClass($this->bootstrapper);
        
        $this->assertTrue($reflection->hasMethod('parseUsedBlocks'));
        $this->assertTrue($reflection->hasMethod('extractJankxBlocks'));
        $this->assertTrue($reflection->hasMethod('getWidgetContent'));
        $this->assertTrue($reflection->hasMethod('registerUsedBlocks'));
        $this->assertTrue($reflection->hasMethod('initializePartialHydration'));
        $this->assertTrue($reflection->hasMethod('getPartialHydrationSettings'));
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
        $this->assertEquals('GutenbergFrontendBootstrapper', get_class($this->bootstrapper));
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