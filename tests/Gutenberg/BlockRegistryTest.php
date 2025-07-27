<?php

namespace Tests\Gutenberg;

use PHPUnit\Framework\TestCase;
use Jankx\Gutenberg\BlockRegistry;
use Mockery;

/**
 * Test class for BlockRegistry
 */
class BlockRegistryTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Reset static properties
        $this->resetBlockRegistry();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        $this->resetBlockRegistry();
        parent::tearDown();
    }

    protected function resetBlockRegistry()
    {
        $reflection = new \ReflectionClass(BlockRegistry::class);

        $blocksProperty = $reflection->getProperty('blocks');
        $blocksProperty->setAccessible(true);
        $blocksProperty->setValue(null, []);

        $initializedProperty = $reflection->getProperty('initialized');
        $initializedProperty->setAccessible(true);
        $initializedProperty->setValue(null, false);
    }

    public function testInit()
    {
        BlockRegistry::init();

        $reflection = new \ReflectionClass(BlockRegistry::class);
        $initializedProperty = $reflection->getProperty('initialized');
        $initializedProperty->setAccessible(true);

        $this->assertTrue($initializedProperty->getValue());
    }

    public function testInitDoesNotReinitialize()
    {
        BlockRegistry::init();
        BlockRegistry::init(); // Second call should not reinitialize

        $reflection = new \ReflectionClass(BlockRegistry::class);
        $initializedProperty = $reflection->getProperty('initialized');
        $initializedProperty->setAccessible(true);

        $this->assertTrue($initializedProperty->getValue());
    }

    public function testBoot()
    {
        BlockRegistry::boot();

        $reflection = new \ReflectionClass(BlockRegistry::class);
        $initializedProperty = $reflection->getProperty('initialized');
        $initializedProperty->setAccessible(true);

        $this->assertTrue($initializedProperty->getValue());
    }

    public function testEnqueueEditorAssets()
    {
        // Mock WordPress functions
        if (!function_exists('wp_enqueue_script')) {
            function wp_enqueue_script($handle, $src = false, $deps = array(), $ver = false, $in_footer = false) {
                // Mock implementation
            }
        }

        if (!function_exists('wp_enqueue_style')) {
            function wp_enqueue_style($handle, $src = false, $deps = array(), $ver = false, $media = 'all') {
                // Mock implementation
            }
        }

        if (!function_exists('wp_localize_script')) {
            function wp_localize_script($handle, $object_name, $l10n) {
                // Mock implementation
            }
        }

        if (!function_exists('admin_url')) {
            function admin_url($path = '') {
                return 'http://localhost/wp-admin/' . $path;
            }
        }

        if (!function_exists('wp_create_nonce')) {
            function wp_create_nonce($action = -1) {
                return 'test_nonce';
            }
        }

        if (!function_exists('get_template_directory_uri')) {
            function get_template_directory_uri() {
                return 'http://localhost/wp-content/themes/bookix';
            }
        }

        // Define constants if not defined
        if (!defined('JANKX_ABSPATH')) {
            define('JANKX_ABSPATH', __DIR__ . '/../../');
        }

        // Version is now handled by Jankx::getFrameworkVersion()

        // This should not throw an exception
        BlockRegistry::enqueueEditorAssets();
        $this->assertTrue(true);
    }

    public function testEnqueueFrontendAssets()
    {
        // Mock WordPress functions
        if (!function_exists('wp_enqueue_style')) {
            function wp_enqueue_style($handle, $src = false, $deps = array(), $ver = false, $media = 'all') {
                // Mock implementation
            }
        }

        if (!function_exists('get_template_directory_uri')) {
            function get_template_directory_uri() {
                return 'http://localhost/wp-content/themes/bookix';
            }
        }

        // Version is now handled by Jankx::getFrameworkVersion()

        // This should not throw an exception
        BlockRegistry::enqueueFrontendAssets();
        $this->assertTrue(true);
    }

    public function testGetBlockData()
    {
        $blockData = BlockRegistry::getBlockData();
        $this->assertIsArray($blockData);
    }

    public function testGetBlocks()
    {
        $blocks = BlockRegistry::getBlocks();
        $this->assertIsArray($blocks);
    }

    public function testGetBlock()
    {
        // Test with non-existent block
        $block = BlockRegistry::getBlock('non-existent');
        $this->assertNull($block);

        // Test with existing block (should be null since no blocks are registered)
        $block = BlockRegistry::getBlock('test-block');
        $this->assertNull($block);
    }
}