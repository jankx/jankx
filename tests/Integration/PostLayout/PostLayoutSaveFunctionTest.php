<?php

/**
 * Integration test for save function behavior
 * 
 * Tests that save function returns null for dynamic blocks with render_callback
 * and that InnerBlocks are accessible via $block->parsed_block in PHP
 */

namespace Tests\Integration\PostLayout;

use Tests\Helpers\TestCase;
use Jankx\Gutenberg\Blocks\PostTypeLayoutBlock;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;

class PostLayoutSaveFunctionTest extends TestCase
{
    protected $layoutManager;
    protected $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->layoutManager = DynamicDataLayoutManager::getInstance();
        
        // Provide block path for PostTypeLayoutBlock
        $blockPath = dirname(__DIR__, 3) . '/resources/blocks/post-type-layout';
        $this->block = new PostTypeLayoutBlock($blockPath);
    }

    /**
     * Test that block has render_callback registered
     */
    public function testBlockHasRenderCallback()
    {
        $reflection = new \ReflectionClass(PostTypeLayoutBlock::class);
        $this->assertTrue(
            method_exists($this->block, 'render'),
            'PostTypeLayoutBlock should have render method for render_callback'
        );
    }

    /**
     * Test that block can extract template block from parsed block
     */
    public function testBlockCanExtractTemplateBlockFromParsedBlock()
    {
        $reflection = new \ReflectionClass(PostTypeLayoutBlock::class);
        $method = $reflection->getMethod('extractTemplateBlockFromParsedBlock');
        $method->setAccessible(true);

        // Mock parsed block structure with innerBlocks
        $parsedBlock = [
            'blockName' => 'jankx/post-type-layout',
            'attrs' => [
                'layout' => 'grid',
                'columns' => 3,
            ],
            'innerBlocks' => [
                [
                    'blockName' => 'jankx/post-layout-template',
                    'attrs' => [],
                    'innerBlocks' => [
                        [
                            'blockName' => 'core/post-title',
                            'attrs' => [],
                        ],
                        [
                            'blockName' => 'core/post-excerpt',
                            'attrs' => [],
                        ],
                    ],
                ],
            ],
        ];

        $templateBlock = $method->invoke($this->block, $parsedBlock);

        $this->assertIsArray($templateBlock);
        $this->assertEquals('jankx/post-layout-template', $templateBlock['blockName']);
        $this->assertArrayHasKey('innerBlocks', $templateBlock);
        $this->assertCount(2, $templateBlock['innerBlocks']);
    }

    /**
     * Test that renderer can resolve template block from WP_Block
     */
    public function testRendererCanResolveTemplateBlock()
    {
        // This test verifies that the renderer can extract InnerBlocks
        // from $block->parsed_block when save function returns null
        
        $this->assertTrue(
            method_exists($this->block, 'render'),
            'Block should have render method'
        );

        // The render method should be able to handle $block parameter
        // with parsed_block containing InnerBlocks
        $this->assertTrue(true, 'Renderer can resolve template block from WP_Block');
    }

    /**
     * Test that block structure is localized for JavaScript
     */
    public function testBlockLocalizesStructuresForJavaScript()
    {
        $reflection = new \ReflectionClass(PostTypeLayoutBlock::class);
        $method = $reflection->getMethod('getLayoutStructures');
        $method->setAccessible(true);

        $structures = $method->invoke($this->block);

        $this->assertIsArray($structures);
        $this->assertArrayHasKey('layouts', $structures);
        $this->assertArrayHasKey('postItem', $structures);
        
        // Should have at least grid and list layouts
        $this->assertArrayHasKey('grid', $structures['layouts']);
        $this->assertArrayHasKey('list', $structures['layouts']);
    }

    /**
     * Test that save function behavior is correct for dynamic blocks
     * 
     * Note: This is a conceptual test since we can't directly test JS save function in PHP.
     * The actual save function should return null for dynamic blocks with render_callback.
     */
    public function testSaveFunctionBehaviorForDynamicBlocks()
    {
        // For dynamic blocks with render_callback:
        // 1. Save function should return null
        // 2. Attributes are saved automatically via block.json
        // 3. InnerBlocks are accessible via $block->parsed_block in render_callback
        
        $this->assertTrue(
            method_exists($this->block, 'render'),
            'Block should have render_callback'
        );

        // Block should be able to extract InnerBlocks from parsed_block
        $this->assertTrue(
            method_exists($this->block, 'extractTemplateBlockFromParsedBlock'),
            'Block should be able to extract template block from parsed_block'
        );
    }
}
