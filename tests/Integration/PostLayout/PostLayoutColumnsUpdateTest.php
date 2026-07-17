<?php

/**
 * Integration test for dynamic columns update in container structure
 * 
 * Tests that container structure can be updated with different columns values
 * and that the structure contains correct CSS variables and classes
 */

namespace Tests\Integration\PostLayout;

use Tests\Helpers\TestCase;
use Tests\Helpers\HtmlAssertions;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\GridLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\ListLayout;

class PostLayoutColumnsUpdateTest extends TestCase
{
    use HtmlAssertions;

    protected $layoutManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->layoutManager = BlockTemplateLayoutManager::getInstance();
    }

    /**
     * Test that getContainerStructure updates columns correctly
     */
    public function testGridLayoutContainerUpdatesColumns()
    {
        $layout = new GridLayout();
        
        // Test with default columns
        $structure1 = $layout->getHtmlStructure([
            'columns' => 3,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
        ]);
        
        $container1 = $structure1['container'];
        $this->assertContains('columns-3', $container1['classes']);
        $this->assertContains('columns-tablet-2', $container1['classes']);
        $this->assertContains('columns-mobile-1', $container1['classes']);
        $this->assertEquals('3', $container1['styles']['--columns-desktop']);
        $this->assertEquals('2', $container1['styles']['--columns-tablet']);
        $this->assertEquals('1', $container1['styles']['--columns-mobile']);

        // Test with updated columns
        $structure2 = $layout->getHtmlStructure([
            'columns' => 5,
            'columnsTablet' => 3,
            'columnsMobile' => 2,
        ]);
        
        $container2 = $structure2['container'];
        $this->assertContains('columns-5', $container2['classes']);
        $this->assertContains('columns-tablet-3', $container2['classes']);
        $this->assertContains('columns-mobile-2', $container2['classes']);
        $this->assertEquals('5', $container2['styles']['--columns-desktop']);
        $this->assertEquals('3', $container2['styles']['--columns-tablet']);
        $this->assertEquals('2', $container2['styles']['--columns-mobile']);

        // Ensure old columns are not present
        $this->assertNotContains('columns-3', $container2['classes']);
        $this->assertNotContains('columns-tablet-2', $container2['classes']);
        $this->assertNotContains('columns-mobile-1', $container2['classes']);
    }

    /**
     * Test that structure preserves other classes when columns change
     */
    public function testContainerPreservesOtherClassesWhenColumnsChange()
    {
        $layout = new GridLayout();
        
        $structure = $layout->getHtmlStructure([
            'columns' => 4,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
        ]);
        
        $container = $structure['container'];
        
        // Should have base classes
        $this->assertContains('post-type-layout-grid', $container['classes']);
        $this->assertContains('is-flex-container', $container['classes']);
        
        // Should have column classes
        $this->assertContains('columns-4', $container['classes']);
        $this->assertContains('columns-tablet-2', $container['classes']);
        $this->assertContains('columns-mobile-1', $container['classes']);
    }

    /**
     * Test that different column values produce different structures
     */
    public function testDifferentColumnsProduceDifferentStructures()
    {
        $layout = new GridLayout();
        
        $structure1 = $layout->getHtmlStructure(['columns' => 2]);
        $structure2 = $layout->getHtmlStructure(['columns' => 6]);
        
        $container1 = $structure1['container'];
        $container2 = $structure2['container'];
        
        // Should have different column classes
        $this->assertContains('columns-2', $container1['classes']);
        $this->assertContains('columns-6', $container2['classes']);
        
        // Should have different CSS variables
        $this->assertEquals('2', $container1['styles']['--columns-desktop']);
        $this->assertEquals('6', $container2['styles']['--columns-desktop']);
    }

    /**
     * Test that ListLayout handles columns correctly
     */
    public function testListLayoutContainerStructure()
    {
        $layout = new ListLayout();
        
        $structure = $layout->getHtmlStructure([
            'columns' => 1,
        ]);
        
        $container = $structure['container'];
        
        // List layout should have container structure
        $this->assertEquals('div', $container['tag']);
        $this->assertContains('post-type-layout-list', $container['classes']);
    }

    /**
     * Test that structure is JSON serializable with different columns
     */
    public function testStructureIsJsonSerializableWithDifferentColumns()
    {
        $layout = new GridLayout();
        
        $columns = [2, 3, 4, 5, 6];
        
        foreach ($columns as $col) {
            $structure = $layout->getHtmlStructure(['columns' => $col]);
            
            // Should be JSON serializable
            $json = json_encode($structure);
            $this->assertNotFalse($json, "Structure should be JSON serializable for columns={$col}");
            
            // Should decode back correctly
            $decoded = json_decode($json, true);
            $this->assertIsArray($decoded);
            $this->assertArrayHasKey('container', $decoded);
            $this->assertContains("columns-{$col}", $decoded['container']['classes']);
        }
    }

    /**
     * Test that CSS variables are strings (not numbers with px)
     */
    public function testCssVariablesAreStringsWithoutUnits()
    {
        $layout = new GridLayout();
        
        $structure = $layout->getHtmlStructure([
            'columns' => 5,
            'columnsTablet' => 3,
            'columnsMobile' => 2,
        ]);
        
        $styles = $structure['container']['styles'];
        
        // CSS variables should be strings without units
        $this->assertIsString($styles['--columns-desktop']);
        $this->assertIsString($styles['--columns-tablet']);
        $this->assertIsString($styles['--columns-mobile']);
        
        // Should not contain 'px'
        $this->assertStringNotContainsString('px', $styles['--columns-desktop']);
        $this->assertStringNotContainsString('px', $styles['--columns-tablet']);
        $this->assertStringNotContainsString('px', $styles['--columns-mobile']);
        
        // Should be numeric strings
        $this->assertEquals('5', $styles['--columns-desktop']);
        $this->assertEquals('3', $styles['--columns-tablet']);
        $this->assertEquals('2', $styles['--columns-mobile']);
    }
}
