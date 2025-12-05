<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\AdvancedImageBoxBlock;
use Mockery;

/**
 * Unit tests for AdvancedImageBoxBlock
 * 
 * Tests the PHP rendering logic of the advanced image box block
 */
class AdvancedImageBoxBlockTest extends BlockTestCase
{
    protected AdvancedImageBoxBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new AdvancedImageBoxBlock();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/advanced-image-box';
    }

    protected function createBlockInstance(): AdvancedImageBoxBlock
    {
        return new AdvancedImageBoxBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'url' => '',
            'alt' => '',
            'title' => '',
            'id' => null,
            'width' => null,
            'height' => null,
            'aspectRatio' => null,
            'scale' => null,
            'sizeSlug' => null,
            'href' => '',
            'linkTarget' => '',
            'rel' => '',
            'caption' => '',
            'showOverlayOnHover' => true,
            'overlayAnimation' => 'fadeIn',
            'overlayAnimationDuration' => 1000,
            'overlayAnimationDelay' => 0,
            'overlayPosition' => 'center',
            'overlayBackground' => 'rgba(0, 0, 0, 0.7)',
            'overlayOpacity' => 1,
            'imageHoverEffect' => 'zoom',
            'borderRadius' => '0px',
        ];
    }

    /**
     * Test block ID is correct
     */
    public function test_block_id_is_correct(): void
    {
        $this->assertEquals('jankx/advanced-image-box', $this->getBlockId());
    }

    /**
     * Test render with image URL
     */
    public function test_render_with_image_url(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['url'] = 'https://example.com/image.jpg';
        $attributes['alt'] = 'Test Image';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('https://example.com/image.jpg', $html);
        $this->assertStringContainsString('Test Image', $html);
    }

    /**
     * Test render with overlay settings
     */
    public function test_render_with_overlay_settings(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['url'] = 'https://example.com/image.jpg';
        $attributes['showOverlayOnHover'] = true;
        $attributes['overlayPosition'] = 'bottom';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertValidHtml($html);
    }

    /**
     * Test render with link
     */
    public function test_render_with_link(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['url'] = 'https://example.com/image.jpg';
        $attributes['href'] = 'https://example.com/page';
        $attributes['linkTarget'] = '_blank';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('https://example.com/page', $html);
        $this->assertStringContainsString('target="_blank"', $html);
    }

    /**
     * Test render with caption
     */
    public function test_render_with_caption(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['url'] = 'https://example.com/image.jpg';
        $attributes['caption'] = '<p>Image caption</p>';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('Image caption', $html);
    }

    /**
     * Test HTML output is properly escaped
     */
    public function test_html_output_is_properly_escaped(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['url'] = 'https://example.com/image.jpg';
        $attributes['alt'] = '<script>alert("xss")</script>';
        $attributes['caption'] = '<script>alert("xss")</script>';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        // XSS attempts should be escaped
        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringNotContainsString('alert("xss")', $html);
    }
}
