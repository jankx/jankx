<?php

/**
 * Integration tests to ensure PHP and JavaScript render the same HTML structure
 */

namespace Tests\Integration\PostLayout;

use Tests\Helpers\TestCase;
use Tests\Helpers\HtmlAssertions;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\GridLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\ListLayout;
use Jankx\Gutenberg\Blocks\DynamicDataLayoutBlock;
use WP_Query;

class PostLayoutRenderIntegrationTest extends TestCase
{
    use HtmlAssertions;
    protected $layoutManager;
    protected $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->layoutManager = BlockTemplateLayoutManager::getInstance();
        
        // Provide block path for DynamicDataLayoutBlock
        $blockPath = dirname(__DIR__, 3) . '/resources/blocks/dynamic-data-layout';
        $this->block = new DynamicDataLayoutBlock($blockPath);
    }

    /**
     * Test that PHP getHtmlStructure matches actual render output structure
     */
    public function testGridLayoutStructureMatchesRender()
    {
        $layout = new GridLayout();
        $layout->setOptions([
            'columns' => 3,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
            'thumbnailPosition' => 'top',
            'showFeaturedImage' => true,
            'showTitle' => true,
            'showDate' => true,
            'showAuthor' => false,
            'showExcerpt' => true,
        ]);

        $structure = $layout->getHtmlStructure();
        
        // Verify container structure
        $this->assertEquals('ul', $structure['container']['tag']);
        $this->assertContains('post-type-layout-grid', $structure['container']['classes']);
        $this->assertContains('columns-3', $structure['container']['classes']);
        
        // Verify item wrapper
        $this->assertEquals('li', $structure['itemWrapper']['tag']);
        $this->assertContains('post-item', $structure['itemWrapper']['classes']);
        $this->assertContains('thumbnail-position-top', $structure['itemWrapper']['classes']);
    }

    /**
     * Test that structure can be localized and used by JavaScript
     */
    public function testStructureCanBeLocalized()
    {
        $layout = new GridLayout();
        $layout->setOptions(['columns' => 3]);
        
        $structure = $layout->getHtmlStructure();
        
        // Should be JSON serializable
        $json = json_encode($structure);
        $this->assertNotFalse($json);
        
        // Decode and verify structure
        $decoded = json_decode($json, true);
        $this->assertIsArray($decoded);
        $this->assertArrayHasKey('layout', $decoded);
        $this->assertArrayHasKey('container', $decoded);
        $this->assertArrayHasKey('itemWrapper', $decoded);
        
        // Verify nested structure
        $this->assertIsArray($decoded['container']);
        $this->assertArrayHasKey('tag', $decoded['container']);
        $this->assertArrayHasKey('classes', $decoded['container']);
    }

    /**
     * Test that DynamicDataLayoutBlock localizes structures correctly
     */
    public function testDynamicDataLayoutBlockLocalizesStructures()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass(DynamicDataLayoutBlock::class);
        $method = $reflection->getMethod('getLayoutStructures');
        $method->setAccessible(true);
        
        $structures = $method->invoke($this->block);
        
        $this->assertIsArray($structures);
        $this->assertArrayHasKey('layouts', $structures);
        $this->assertArrayHasKey('postItem', $structures);
        
        // Verify at least common_grid layout is present (new naming convention context_layout)
        $this->assertArrayHasKey('common_grid', $structures['layouts']);
        $this->assertEquals('grid', $structures['layouts']['common_grid']['layout']);
    }


    /**
     * Test that different layouts have different structures
     */
    public function testLayoutsHaveDifferentStructures()
    {
        $gridLayout = new GridLayout();
        $listLayout = new ListLayout();
        
        $gridStructure = $gridLayout->getHtmlStructure();
        $listStructure = $listLayout->getHtmlStructure();
        
        // Grid uses ul for container
        $this->assertEquals('ul', $gridStructure['container']['tag']);
        // List uses div for container (default)
        $this->assertEquals('div', $listStructure['container']['tag']);
        
        // Grid uses li, List uses article (base default)
        $this->assertEquals('li', $gridStructure['itemWrapper']['tag']);
        $this->assertEquals('article', $listStructure['itemWrapper']['tag']);
        
        // Classes should be different
        $this->assertContains('post-type-layout-grid', $gridStructure['container']['classes']);
        $this->assertContains('post-type-layout-list', $listStructure['container']['classes']);
    }

    /**
     * Test that structure includes all necessary attributes
     */
    public function testStructureIncludesAllAttributes()
    {
        $layout = new GridLayout();
        $layout->setOptions([
            'columns' => 3,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
            'thumbnailPosition' => 'top',
            'showFeaturedImage' => true,
        ]);

        $structure = $layout->getHtmlStructure();
        
        // Container should have styles
        $this->assertArrayHasKey('styles', $structure['container']);
        $this->assertArrayHasKey('--columns-desktop', $structure['container']['styles']);
        $this->assertArrayHasKey('--columns-tablet', $structure['container']['styles']);
        $this->assertArrayHasKey('--columns-mobile', $structure['container']['styles']);
        
        // Container should have data attributes
        $this->assertArrayHasKey('attributes', $structure['container']);
        $this->assertArrayHasKey('data-layout', $structure['container']['attributes']);
        
        // Item wrapper should have id attribute
        $this->assertArrayHasKey('attributes', $structure['itemWrapper']);
        $this->assertArrayHasKey('id', $structure['itemWrapper']['attributes']);
    }

    /**
     * Test that structure handles empty options correctly
     */
    public function testStructureHandlesEmptyOptions()
    {
        $layout = new GridLayout();
        // Don't set any options
        
        $structure = $layout->getHtmlStructure();
        
        // Should still return valid structure
        $this->assertIsArray($structure);
        $this->assertArrayHasKey('container', $structure);
        $this->assertArrayHasKey('itemWrapper', $structure);
        
        // Should use default values
        $container = $structure['container'];
        $this->assertIsArray($container['classes']);
        $this->assertIsArray($container['styles']);
    }

    /**
     * Test that structure is consistent across multiple calls
     */
    public function testStructureIsConsistent()
    {
        $layout = new GridLayout();
        $layout->setOptions(['columns' => 3]);
        
        $structure1 = $layout->getHtmlStructure();
        $structure2 = $layout->getHtmlStructure();
        
        $this->assertEquals($structure1, $structure2);
    }
}
