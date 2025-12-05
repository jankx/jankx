<?php

/**
 * Unit tests for PostLayout HTML structure methods
 */

namespace Tests\Support\Blocks\PostLayout;

use Tests\Helpers\TestCase;
use Tests\Helpers\HtmlAssertions;
use Jankx\Layouts\PostLayout\PostLayout;
use Jankx\Layouts\PostLayout\Supports\GridLayout;
use Jankx\Layouts\PostLayout\Supports\ListLayout;
use Jankx\Layouts\PostLayout\PostLayoutManager;

class PostLayoutStructureTest extends TestCase
{
    use HtmlAssertions;
    protected $layoutManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->layoutManager = PostLayoutManager::getInstance();
    }

    public function testPostLayoutHasGetHtmlStructureMethod()
    {
        $layout = new GridLayout();
        $this->assertTrue(
            method_exists($layout, 'getHtmlStructure'),
            'GridLayout should have getHtmlStructure method'
        );
    }

    public function testGridLayoutContainerStructure()
    {
        $layout = new GridLayout();
        $layout->setOptions([
            'columns' => 3,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
        ]);

        $structure = $layout->getHtmlStructure();
        
        $this->assertIsArray($structure);
        $this->assertEquals('grid', $structure['layout']);
        $this->assertArrayHasKey('container', $structure);
        
        $container = $structure['container'];
        $this->assertEquals('ul', $container['tag']);
        $this->assertContains('post-type-layout-grid', $container['classes']);
        $this->assertContains('columns-3', $container['classes']);
        $this->assertContains('columns-tablet-2', $container['classes']);
        $this->assertContains('columns-mobile-1', $container['classes']);
        $this->assertArrayHasKey('styles', $container);
        $this->assertEquals('3', $container['styles']['--columns-desktop']);
    }

    public function testGridLayoutItemWrapperStructure()
    {
        $layout = new GridLayout();
        $layout->setOptions([
            'thumbnailPosition' => 'top',
            'showFeaturedImage' => true,
        ]);

        $structure = $layout->getHtmlStructure();
        
        $this->assertArrayHasKey('itemWrapper', $structure);
        $itemWrapper = $structure['itemWrapper'];
        $this->assertEquals('li', $itemWrapper['tag']); // Grid uses <li>
        $this->assertContains('post-item', $itemWrapper['classes']);
        $this->assertContains('thumbnail-position-top', $itemWrapper['classes']);
        $this->assertContains('has-thumbnail', $itemWrapper['classes']);
        $this->assertArrayHasKey('attributes', $itemWrapper);
        $this->assertStringContainsString('post-', $itemWrapper['attributes']['id']);
    }

    public function testListLayoutContainerStructure()
    {
        $layout = new ListLayout();
        $structure = $layout->getHtmlStructure();
        
        $this->assertIsArray($structure);
        $this->assertEquals('list', $structure['layout']);
        $this->assertArrayHasKey('container', $structure);
        
        $container = $structure['container'];
        $this->assertEquals('div', $container['tag']);
        $this->assertContains('post-type-layout-list', $container['classes']);
    }

    public function testListLayoutItemWrapperStructure()
    {
        $layout = new ListLayout();
        $layout->setOptions([
            'thumbnailPosition' => 'left',
            'showFeaturedImage' => false,
        ]);

        $structure = $layout->getHtmlStructure();
        
        $itemWrapper = $structure['itemWrapper'];
        $this->assertEquals('article', $itemWrapper['tag']); // List uses <article>
        $this->assertContains('post-item', $itemWrapper['classes']);
        $this->assertContains('thumbnail-position-left', $itemWrapper['classes']);
        $this->assertContains('no-thumbnail', $itemWrapper['classes']);
    }

    public function testEmptyStateStructure()
    {
        $layout = new GridLayout();
        $structure = $layout->getHtmlStructure();
        
        $this->assertArrayHasKey('emptyState', $structure);
        $emptyState = $structure['emptyState'];
        $this->assertEquals('div', $emptyState['tag']);
        $this->assertContains('post-layout-no-results', $emptyState['classes']);
        $this->assertArrayHasKey('text', $emptyState);
    }

    public function testPaginationWrapperStructure()
    {
        $layout = new GridLayout();
        $layout->setOptions([
            'paginationAlignment' => 'center',
        ]);

        $structure = $layout->getHtmlStructure();
        
        $this->assertArrayHasKey('paginationWrapper', $structure);
        $paginationWrapper = $structure['paginationWrapper'];
        $this->assertEquals('div', $paginationWrapper['tag']);
        $this->assertContains('post-layout-pagination', $paginationWrapper['classes']);
        $this->assertContains('pagination-align-center', $paginationWrapper['classes']);
    }

    public function testStructureMatchesPhpRender()
    {
        $layout = new GridLayout();
        $layout->setOptions([
            'columns' => 3,
            'thumbnailPosition' => 'top',
            'showFeaturedImage' => true,
        ]);

        $structure = $layout->getHtmlStructure();
        
        // Verify container structure matches renderDefault output
        $container = $structure['container'];
        $this->assertEquals('ul', $container['tag']);
        $this->assertContains('post-type-layout-grid', $container['classes']);
        
        // Verify item wrapper matches renderPostItem output
        $itemWrapper = $structure['itemWrapper'];
        $this->assertEquals('li', $itemWrapper['tag']);
        $this->assertContains('post-item', $itemWrapper['classes']);
        $this->assertContains('thumbnail-position-top', $itemWrapper['classes']);
    }

    public function testStructureIsValidJson()
    {
        $layout = new GridLayout();
        $structure = $layout->getHtmlStructure();
        
        // Should be able to encode as JSON (for localization)
        $json = json_encode($structure);
        $this->assertNotFalse($json);
        
        // Should be able to decode back
        $decoded = json_decode($json, true);
        $this->assertIsArray($decoded);
        $this->assertEquals('grid', $decoded['layout']);
    }

    public function testAllLayoutsHaveStructure()
    {
        $layouts = $this->layoutManager->getLayouts(['field' => 'all']);
        
        foreach ($layouts as $layoutInfo) {
            $layoutName = $layoutInfo['name'] ?? '';
            if (empty($layoutName)) {
                continue;
            }

            try {
                $decorator = $this->layoutManager->createLayout($layoutName, []);
                $layout = $decorator->getLayout();
                
                if ($layout && method_exists($layout, 'getHtmlStructure')) {
                    $structure = $layout->getHtmlStructure();
                    
                    $this->assertIsArray($structure, "Layout {$layoutName} should return array structure");
                    $this->assertArrayHasKey('layout', $structure);
                    $this->assertArrayHasKey('container', $structure);
                    $this->assertEquals($layoutName, $structure['layout']);
                }
            } catch (\Exception $e) {
                $this->fail("Failed to get structure for layout {$layoutName}: " . $e->getMessage());
            }
        }
    }

    public function testContainerStructureUpdatesWithDifferentColumns()
    {
        $layout = new GridLayout();
        
        // Test with columns = 3
        $structure1 = $layout->getHtmlStructure(['columns' => 3, 'columnsTablet' => 2, 'columnsMobile' => 1]);
        $container1 = $structure1['container'];
        $this->assertContains('columns-3', $container1['classes']);
        $this->assertEquals('3', $container1['styles']['--columns-desktop']);
        
        // Test with columns = 5
        $structure2 = $layout->getHtmlStructure(['columns' => 5, 'columnsTablet' => 3, 'columnsMobile' => 2]);
        $container2 = $structure2['container'];
        $this->assertContains('columns-5', $container2['classes']);
        $this->assertEquals('5', $container2['styles']['--columns-desktop']);
        
        // Ensure structures are different
        $this->assertNotEquals($container1['classes'], $container2['classes']);
    }

    public function testCssVariablesAreStringsWithoutUnits()
    {
        $layout = new GridLayout();
        $structure = $layout->getHtmlStructure([
            'columns' => 4,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
        ]);
        
        $styles = $structure['container']['styles'];
        
        // CSS variables should be strings without units
        $this->assertIsString($styles['--columns-desktop']);
        $this->assertStringNotContainsString('px', $styles['--columns-desktop']);
        $this->assertEquals('4', $styles['--columns-desktop']);
    }
}
