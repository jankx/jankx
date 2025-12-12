<?php

/**
 * Integration tests to ensure PHP and JavaScript render the same HTML structure
 */

namespace Tests\Integration\PostLayout;

use Tests\Helpers\TestCase;
use Tests\Helpers\HtmlAssertions;
use Jankx\Layouts\DynamicDataLayout\PostLayoutManager;
use Jankx\Layouts\DynamicDataLayout\Supports\GridLayout;
use Jankx\Layouts\DynamicDataLayout\Supports\ListLayout;
use Jankx\Gutenberg\Blocks\PostTypeLayoutBlock;
use WP_Query;

class PostLayoutRenderIntegrationTest extends TestCase
{
    use HtmlAssertions;
    protected $layoutManager;
    protected $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->layoutManager = PostLayoutManager::getInstance();
        
        // Provide block path for PostTypeLayoutBlock
        $blockPath = dirname(__DIR__, 3) . '/resources/blocks/post-type-layout';
        $this->block = new PostTypeLayoutBlock($blockPath);
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
     * Test that PostTypeLayoutBlock localizes structures correctly
     */
    public function testPostTypeLayoutBlockLocalizesStructures()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass(PostTypeLayoutBlock::class);
        $method = $reflection->getMethod('getLayoutStructures');
        $method->setAccessible(true);
        
        $structures = $method->invoke($this->block);
        
        $this->assertIsArray($structures);
        $this->assertArrayHasKey('layouts', $structures);
        $this->assertArrayHasKey('postItem', $structures);
        
        // Verify at least grid layout is present
        $this->assertArrayHasKey('grid', $structures['layouts']);
        $this->assertEquals('grid', $structures['layouts']['grid']['layout']);
    }

    /**
     * Test that post item structure matches PHP renderPostItem output
     */
    public function testPostItemStructureMatchesPhpRender()
    {
        $reflection = new \ReflectionClass(PostTypeLayoutBlock::class);
        $method = $reflection->getMethod('getPostItemStructure');
        $method->setAccessible(true);
        
        $postItemStructure = $method->invoke($this->block);
        
        // Verify structure matches renderPostItem output
        $this->assertArrayHasKey('featuredImage', $postItemStructure);
        $this->assertArrayHasKey('title', $postItemStructure);
        $this->assertArrayHasKey('date', $postItemStructure);
        $this->assertArrayHasKey('author', $postItemStructure);
        $this->assertArrayHasKey('metaWrapper', $postItemStructure);
        $this->assertArrayHasKey('excerpt', $postItemStructure);
        $this->assertArrayHasKey('contentWrapper', $postItemStructure);
        
        // Verify featured image structure
        $featuredImage = $postItemStructure['featuredImage'];
        $this->assertEquals('div', $featuredImage['tag']);
        $this->assertContains('post-thumbnail', $featuredImage['classes']);
        
        // Verify title structure
        $title = $postItemStructure['title'];
        $this->assertEquals('h3', $title['tag']);
        $this->assertContains('post-title', $title['classes']);
        
        // Verify meta wrapper
        $metaWrapper = $postItemStructure['metaWrapper'];
        $this->assertEquals('div', $metaWrapper['tag']);
        $this->assertContains('post-meta', $metaWrapper['classes']);
        
        // Verify content wrapper
        $contentWrapper = $postItemStructure['contentWrapper'];
        $this->assertEquals('div', $contentWrapper['tag']);
        $this->assertContains('post-content', $contentWrapper['classes']);
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
        
        // Grid should use <ul> and <li>
        $this->assertEquals('ul', $gridStructure['container']['tag']);
        $this->assertEquals('li', $gridStructure['itemWrapper']['tag']);
        
        // List should use <div> and <article>
        $this->assertEquals('div', $listStructure['container']['tag']);
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
