<?php

namespace Tests\Debug;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\DebugInfo;

/**
 * Test Gutenberg Blocks Debug Information
 *
 * @package Tests\Debug
 * @since 2.0.1
 */
class GutenbergBlocksDebugTest extends TestCase
{
    /**
     * Test that Gutenberg blocks info method exists
     *
     * @since 2.0.1
     */
    public function testGutenbergBlocksInfoMethodExists()
    {
        $this->assertTrue(method_exists('Jankx\Debug\DebugInfo', 'getGutenbergBlocksInfo'));
    }

    /**
     * Test Gutenberg blocks info structure
     *
     * @since 2.0.1
     */
    public function testGutenbergBlocksInfoStructure()
    {
        // Use reflection to access private method
        $reflection = new \ReflectionClass('Jankx\Debug\DebugInfo');
        $method = $reflection->getMethod('getGutenbergBlocksInfo');
        $method->setAccessible(true);

        $blocksInfo = $method->invoke(null);

        $this->assertIsArray($blocksInfo);
        $this->assertArrayHasKey('total_blocks', $blocksInfo);
        $this->assertArrayHasKey('block_types', $blocksInfo);
        $this->assertArrayHasKey('is_gutenberg_editor', $blocksInfo);
        $this->assertArrayHasKey('is_gutenberg_frontend', $blocksInfo);

        $this->assertIsInt($blocksInfo['total_blocks']);
        $this->assertIsArray($blocksInfo['block_types']);
        $this->assertIsBool($blocksInfo['is_gutenberg_editor']);
        $this->assertIsBool($blocksInfo['is_gutenberg_frontend']);
    }

    /**
     * Test that debug info includes Gutenberg blocks
     *
     * @since 2.0.1
     */
    public function testDebugInfoIncludesGutenbergBlocks()
    {
        $debugInfo = DebugInfo::getDebugInfo();

        $this->assertArrayHasKey('gutenberg_blocks', $debugInfo);
        $this->assertIsArray($debugInfo['gutenberg_blocks']);
    }

    /**
     * Test Gutenberg blocks info in different contexts
     *
     * @since 2.0.1
     */
    public function testGutenbergBlocksInfoInDifferentContexts()
    {
        // Use reflection to access private method
        $reflection = new \ReflectionClass('Jankx\Debug\DebugInfo');
        $method = $reflection->getMethod('getGutenbergBlocksInfo');
        $method->setAccessible(true);

        $blocksInfo = $method->invoke(null);

        // Test that total_blocks is non-negative
        $this->assertGreaterThanOrEqual(0, $blocksInfo['total_blocks']);

        // Test that block_types is array
        $this->assertIsArray($blocksInfo['block_types']);

        // Test that boolean flags are actually boolean
        $this->assertIsBool($blocksInfo['is_gutenberg_editor']);
        $this->assertIsBool($blocksInfo['is_gutenberg_frontend']);
    }

    /**
     * Test that Gutenberg blocks info is accessible via reflection
     *
     * @since 2.0.1
     */
    public function testGutenbergBlocksInfoAccessibleViaReflection()
    {
        $reflection = new \ReflectionClass('Jankx\Debug\DebugInfo');

        $this->assertTrue($reflection->hasMethod('getGutenbergBlocksInfo'));

        $method = $reflection->getMethod('getGutenbergBlocksInfo');
        $this->assertTrue($method->isPrivate());
    }
}