<?php

namespace Jankx\Tests\Support\Blocks\MasterDataLayout;

use Tests\Helpers\TestCase;
use Jankx\Layouts\DynamicDataLayout\Supports\GridLayout;
use Jankx\Layouts\DynamicDataLayout\Supports\ListLayout;
use Jankx\Layouts\DynamicDataLayout\Supports\CardLayout;
use Jankx\Layouts\DynamicDataLayout\Supports\CarouselLayout;

class MasterDataLayoutStructureTest extends TestCase
{
    /**
     * Test Grid Layout Structure
     */
    public function testGridLayoutStructure()
    {
        $layout = new GridLayout();
        
        // Default options
        $structure = $layout->getHtmlStructure(['columns' => 4]);
        
        // Verify Container
        $this->assertEquals('ul', $structure['container']['tag']);
        $this->assertContains('post-type-layout-grid', $structure['container']['classes']);
        $this->assertContains('columns-4', $structure['container']['classes']);
        $this->assertEquals('4', $structure['container']['styles']['--columns-desktop']);
        
        // Verify Item Wrapper
        $this->assertEquals('li', $structure['itemWrapper']['tag']);
        $this->assertContains('post-item', $structure['itemWrapper']['classes']);
    }

    /**
     * Test List Layout Structure
     */
    public function testListLayoutStructure()
    {
        $layout = new ListLayout();
        $structure = $layout->getHtmlStructure();
        
        $this->assertEquals('div', $structure['container']['tag']);
        $this->assertContains('post-type-layout-list', $structure['container']['classes']);
        
        // List items usually div or article, checking default
        $this->assertEquals('article', $structure['itemWrapper']['tag']);
    }

    /**
     * Test Card Layout Structure
     */
    public function testCardLayoutStructure()
    {
        $layout = new CardLayout();
        $structure = $layout->getHtmlStructure();
        
        $this->assertEquals('div', $structure['container']['tag']);
        $this->assertContains('post-type-layout-card', $structure['container']['classes']);
        
        $this->assertEquals('article', $structure['itemWrapper']['tag']);
        $this->assertContains('jankx-card', $structure['itemWrapper']['classes']);
    }

    /**
     * Test Carousel Layout Structure (Embla)
     */
    public function testCarouselLayoutStructure()
    {
        $layout = new CarouselLayout();
        $structure = $layout->getHtmlStructure(['columns' => 3]);
        
        // Container (Main wrapper)
        $this->assertEquals('div', $structure['container']['tag']);
        $this->assertContains('jankx-carousel', $structure['container']['classes']);
        $this->assertContains('embla', $structure['container']['classes']);
        
        // Should have children (Viewport -> Container)
        $this->assertArrayHasKey('children', $structure['container']);
        $viewport = $structure['container']['children'][0];
        $this->assertContains('embla__viewport', $viewport['classes']);
        
        $container = $viewport['children'][0];
        $this->assertContains('embla__container', $container['classes']);
        
        // Item Wrapper (Slide)
        $this->assertEquals('div', $structure['itemWrapper']['tag']);
        $this->assertContains('embla__slide', $structure['itemWrapper']['classes']);
        
        // Should contain article inside slide
        $this->assertArrayHasKey('children', $structure['itemWrapper']);
        $article = $structure['itemWrapper']['children'][0];
        $this->assertEquals('article', $article['tag']);
        $this->assertContains('post-item', $article['classes']);
    }

    /**
     * Test Layout Structure Consistency
     */
    public function testAllLayoutsReturnValidStructure()
    {
        $layouts = [
            new GridLayout(),
            new ListLayout(),
            new CardLayout(),
            new CarouselLayout(),
        ];

        foreach ($layouts as $layout) {
            $structure = $layout->getHtmlStructure();
            
            $this->assertArrayHasKey('layout', $structure);
            $this->assertArrayHasKey('container', $structure);
            $this->assertArrayHasKey('itemWrapper', $structure);
            $this->assertArrayHasKey('emptyState', $structure);
            $this->assertArrayHasKey('paginationWrapper', $structure);
            
            // Verify JSON serializability
            $this->assertJson(json_encode($structure));
        }
    }
}
