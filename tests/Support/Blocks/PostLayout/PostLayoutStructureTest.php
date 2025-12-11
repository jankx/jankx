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
use Jankx\Layouts\PostLayout\Supports\CarouselLayout;
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

    public function testCarouselLayoutContainerStructure()
    {
        $layout = new CarouselLayout();
        $layout->setOptions([
            'columns' => 3,
            'columnsTablet' => 2,
            'columnsMobile' => 1,
            'slidesToScroll' => 1,
            'loop' => false,
            'autoplay' => false,
        ]);

        $structure = $layout->getHtmlStructure();
        
        $this->assertIsArray($structure);
        $this->assertEquals('carousel', $structure['layout']);
        $this->assertArrayHasKey('container', $structure);
        
        $container = $structure['container'];
        $this->assertEquals('div', $container['tag']);
        $this->assertContains('post-type-layout-carousel', $container['classes']);
        $this->assertContains('columns-3', $container['classes']);
        $this->assertArrayHasKey('attributes', $container);
        $this->assertEquals('', $container['attributes']['data-embla-carousel']);
        $this->assertEquals('3', $container['attributes']['data-slides-per-view']);
        $this->assertEquals('1', $container['attributes']['data-slides-to-scroll']);
        
        // Carousel should have nested structure: viewport -> container
        $this->assertArrayHasKey('children', $container);
        $this->assertCount(1, $container['children']);
        $viewport = $container['children'][0];
        $this->assertEquals('div', $viewport['tag']);
        $this->assertContains('embla__viewport', $viewport['classes']);
        $this->assertArrayHasKey('children', $viewport);
        $this->assertCount(1, $viewport['children']);
        $emblaContainer = $viewport['children'][0];
        $this->assertEquals('div', $emblaContainer['tag']);
        $this->assertContains('embla__container', $emblaContainer['classes']);
    }

    public function testCarouselLayoutItemWrapperStructure()
    {
        $layout = new CarouselLayout();
        $layout->setOptions([
            'thumbnailPosition' => 'top',
            'showFeaturedImage' => true,
        ]);

        // Pass options directly to getHtmlStructure to ensure they're used
        $structure = $layout->getHtmlStructure([
            'thumbnailPosition' => 'top',
            'showFeaturedImage' => true,
        ]);
        
        $this->assertArrayHasKey('itemWrapper', $structure);
        $itemWrapper = $structure['itemWrapper'];
        $this->assertEquals('div', $itemWrapper['tag']);
        $this->assertContains('embla__slide', $itemWrapper['classes']);
        
        // Carousel item wrapper should have nested structure: embla__slide -> article
        $this->assertArrayHasKey('children', $itemWrapper);
        $this->assertCount(1, $itemWrapper['children']);
        $article = $itemWrapper['children'][0];
        $this->assertEquals('article', $article['tag']);
        $this->assertIsArray($article['classes']);
        $this->assertContains('post-item', $article['classes']);
        $this->assertContains('thumbnail-position-top', $article['classes']);
        $this->assertContains('has-thumbnail', $article['classes']);
    }

    public function testCarouselLayoutWithAllOptions()
    {
        $layout = new CarouselLayout();
        $layout->setOptions([
            'columns' => 4,
            'columnsTablet' => 3,
            'columnsMobile' => 2,
            'slidesToScroll' => 2,
            'loop' => true,
            'autoplay' => true,
            'autoplayDelay' => 5000,
            'carouselAlign' => 'center',
            'carouselAxis' => 'x',
            'carouselDirection' => 'ltr',
            'carouselStartIndex' => 1,
            'carouselDuration' => 50,
            'carouselDragFree' => true,
            'carouselDragThreshold' => 15,
            'carouselSkipSnaps' => true,
            'carouselContainScroll' => 'keepSnaps',
            'carouselInViewThreshold' => 0.5,
        ]);

        $structure = $layout->getHtmlStructure();
        $container = $structure['container'];
        $attributes = $container['attributes'];
        
        // Test all carousel options are included in attributes
        $this->assertEquals('center', $attributes['data-align']);
        $this->assertEquals('x', $attributes['data-axis']);
        $this->assertEquals('ltr', $attributes['data-direction']);
        $this->assertEquals('1', $attributes['data-start-index']);
        $this->assertEquals('50', $attributes['data-duration']);
        $this->assertEquals('15', $attributes['data-drag-threshold']);
        $this->assertEquals('keepSnaps', $attributes['data-contain-scroll']);
        $this->assertEquals('0.5', $attributes['data-in-view-threshold']);
        $this->assertEquals('true', $attributes['data-loop']);
        $this->assertEquals('true', $attributes['data-autoplay']);
        $this->assertEquals('5000', $attributes['data-autoplay-delay']);
        $this->assertEquals('true', $attributes['data-drag-free']);
        $this->assertEquals('true', $attributes['data-skip-snaps']);
    }

    public function testCarouselLayoutStructureIsJsonSerializable()
    {
        $layout = new CarouselLayout();
        $layout->setOptions([
            'columns' => 3,
            'carouselAlign' => 'start',
            'carouselAxis' => 'x',
        ]);

        $structure = $layout->getHtmlStructure();
        
        // Should be JSON serializable
        $json = json_encode($structure, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $this->assertNotFalse($json, 'Carousel structure should be JSON serializable');
        
        // Should decode back to same structure
        $decoded = json_decode($json, true);
        $this->assertIsArray($decoded);
        $this->assertEquals('carousel', $decoded['layout']);
        $this->assertArrayHasKey('container', $decoded);
        $this->assertArrayHasKey('itemWrapper', $decoded);
        $this->assertArrayHasKey('children', $decoded['container']);
    }

    public function testCarouselLayoutOptionsUpdate()
    {
        $layout = new CarouselLayout();
        
        // Test with default options
        $structure1 = $layout->getHtmlStructure([
            'columns' => 3,
            'carouselAlign' => 'start',
            'carouselAxis' => 'x',
            'carouselDirection' => 'ltr',
            'carouselStartIndex' => 0,
            'carouselDuration' => 25,
            'carouselDragFree' => false,
            'carouselDragThreshold' => 10,
            'carouselSkipSnaps' => false,
            'carouselContainScroll' => 'trimSnaps',
            'carouselInViewThreshold' => 0,
        ]);
        
        $container1 = $structure1['container'];
        $attrs1 = $container1['attributes'];
        
        $this->assertEquals('start', $attrs1['data-align']);
        $this->assertEquals('x', $attrs1['data-axis']);
        $this->assertEquals('ltr', $attrs1['data-direction']);
        $this->assertEquals('0', $attrs1['data-start-index']);
        $this->assertEquals('25', $attrs1['data-duration']);
        $this->assertEquals('10', $attrs1['data-drag-threshold']);
        $this->assertEquals('trimSnaps', $attrs1['data-contain-scroll']);
        $this->assertEquals('0', $attrs1['data-in-view-threshold']);
        $this->assertArrayNotHasKey('data-loop', $attrs1);
        $this->assertArrayNotHasKey('data-autoplay', $attrs1);
        $this->assertArrayNotHasKey('data-drag-free', $attrs1);
        $this->assertArrayNotHasKey('data-skip-snaps', $attrs1);
        
        // Test with updated options
        $structure2 = $layout->getHtmlStructure([
            'columns' => 4,
            'carouselAlign' => 'center',
            'carouselAxis' => 'y',
            'carouselDirection' => 'rtl',
            'carouselStartIndex' => 2,
            'carouselDuration' => 50,
            'carouselDragFree' => true,
            'carouselDragThreshold' => 20,
            'carouselSkipSnaps' => true,
            'carouselContainScroll' => 'keepSnaps',
            'carouselInViewThreshold' => 0.5,
            'loop' => true,
            'autoplay' => true,
            'autoplayDelay' => 5000,
        ]);
        
        $container2 = $structure2['container'];
        $attrs2 = $container2['attributes'];
        
        // Verify all options are updated
        $this->assertEquals('center', $attrs2['data-align']);
        $this->assertEquals('y', $attrs2['data-axis']);
        $this->assertEquals('rtl', $attrs2['data-direction']);
        $this->assertEquals('2', $attrs2['data-start-index']);
        $this->assertEquals('50', $attrs2['data-duration']);
        $this->assertEquals('20', $attrs2['data-drag-threshold']);
        $this->assertEquals('keepSnaps', $attrs2['data-contain-scroll']);
        $this->assertEquals('0.5', $attrs2['data-in-view-threshold']);
        $this->assertEquals('true', $attrs2['data-loop']);
        $this->assertEquals('true', $attrs2['data-autoplay']);
        $this->assertEquals('5000', $attrs2['data-autoplay-delay']);
        $this->assertEquals('true', $attrs2['data-drag-free']);
        $this->assertEquals('true', $attrs2['data-skip-snaps']);
        
        // Verify old values are not present
        $this->assertNotEquals('start', $attrs2['data-align']);
        $this->assertNotEquals('x', $attrs2['data-axis']);
        $this->assertNotEquals('ltr', $attrs2['data-direction']);
    }

    public function testCarouselLayoutAlignOptionsUpdate()
    {
        $layout = new CarouselLayout();
        
        $aligns = ['start', 'center', 'end'];
        
        foreach ($aligns as $align) {
            $structure = $layout->getHtmlStructure([
                'carouselAlign' => $align,
            ]);
            
            $attrs = $structure['container']['attributes'];
            $this->assertEquals($align, $attrs['data-align'], "Align should be {$align}");
        }
    }

    public function testCarouselLayoutAxisOptionsUpdate()
    {
        $layout = new CarouselLayout();
        
        // Test x axis
        $structureX = $layout->getHtmlStructure(['carouselAxis' => 'x']);
        $this->assertEquals('x', $structureX['container']['attributes']['data-axis']);
        
        // Test y axis
        $structureY = $layout->getHtmlStructure(['carouselAxis' => 'y']);
        $this->assertEquals('y', $structureY['container']['attributes']['data-axis']);
    }

    public function testCarouselLayoutDirectionOptionsUpdate()
    {
        $layout = new CarouselLayout();
        
        // Test ltr
        $structureLtr = $layout->getHtmlStructure(['carouselDirection' => 'ltr']);
        $this->assertEquals('ltr', $structureLtr['container']['attributes']['data-direction']);
        
        // Test rtl
        $structureRtl = $layout->getHtmlStructure(['carouselDirection' => 'rtl']);
        $this->assertEquals('rtl', $structureRtl['container']['attributes']['data-direction']);
    }

    public function testCarouselLayoutContainScrollOptionsUpdate()
    {
        $layout = new CarouselLayout();
        
        $options = ['false', 'trimSnaps', 'keepSnaps'];
        
        foreach ($options as $option) {
            $structure = $layout->getHtmlStructure([
                'carouselContainScroll' => $option,
            ]);
            
            $attrs = $structure['container']['attributes'];
            $this->assertEquals($option, $attrs['data-contain-scroll'], "ContainScroll should be {$option}");
        }
    }

    public function testCarouselLayoutPreservesOtherAttributesWhenOptionsChange()
    {
        $layout = new CarouselLayout();
        
        $structure1 = $layout->getHtmlStructure([
            'columns' => 3,
            'carouselAlign' => 'start',
            'slidesToScroll' => 1,
        ]);
        
        $structure2 = $layout->getHtmlStructure([
            'columns' => 3,
            'carouselAlign' => 'center', // Changed
            'slidesToScroll' => 1,
        ]);
        
        $attrs1 = $structure1['container']['attributes'];
        $attrs2 = $structure2['container']['attributes'];
        
        // Align should be different
        $this->assertNotEquals($attrs1['data-align'], $attrs2['data-align']);
        
        // Other attributes should be preserved
        $this->assertEquals($attrs1['data-slides-per-view'], $attrs2['data-slides-per-view']);
        $this->assertEquals($attrs1['data-slides-to-scroll'], $attrs2['data-slides-to-scroll']);
        $this->assertEquals($attrs1['data-embla-carousel'], $attrs2['data-embla-carousel']);
    }
}
