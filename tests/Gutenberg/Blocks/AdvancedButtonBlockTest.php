<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\AdvancedButtonBlock;
use Jankx\Layouts\AdvancedButton\ButtonRendererFactory;
use Mockery;

/**
 * Unit tests for AdvancedButtonBlock
 * 
 * Tests the PHP rendering logic of the advanced button block
 */
class AdvancedButtonBlockTest extends BlockTestCase
{
    protected AdvancedButtonBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new AdvancedButtonBlock();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/advanced-button';
    }

    protected function createBlockInstance(): AdvancedButtonBlock
    {
        return new AdvancedButtonBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'triggerType' => 'link',
            'buttonType' => 'button',
            'text' => 'Button',
            'url' => '',
            'title' => '',
            'linkTarget' => '',
            'rel' => '',
            'backgroundColor' => null,
            'textColor' => null,
            'gradient' => null,
            'width' => null,
            'useIconBlocks' => false,
            'iconPosition' => 'left',
            'showLabel' => true,
        ];
    }

    /**
     * Test block ID is correct
     */
    public function test_block_id_is_correct(): void
    {
        $this->assertEquals('jankx/advanced-button', $this->getBlockId());
    }

    /**
     * Test render with default attributes as link
     */
    public function test_render_with_default_attributes_as_link(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['url'] = 'https://example.com';
        $attributes['text'] = 'Click Me';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('jankx-advanced-button', $html);
        $this->assertStringContainsString('https://example.com', $html);
        $this->assertStringContainsString('Click Me', $html);
    }

    /**
     * Test render button trigger type
     */
    public function test_render_button_trigger_type(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['triggerType'] = 'button';
        $attributes['buttonType'] = 'submit';
        $attributes['text'] = 'Submit';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('type="submit"', $html);
        $this->assertStringContainsString('Submit', $html);
    }

    /**
     * Test render modal trigger type
     */
    public function test_render_modal_trigger_type(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['triggerType'] = 'modal';
        $attributes['modalId'] = 'test-modal-123';
        $attributes['text'] = 'Open Modal';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('data-modal-id="test-modal-123"', $html);
        $this->assertStringContainsString('data-trigger-type="modal"', $html);
    }

    /**
     * Test render modal trigger without an ID should not add modal trigger class
     */
    public function test_render_modal_without_id_does_not_add_trigger_class(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['triggerType'] = 'modal';
        $attributes['modalId'] = '';
        $attributes['text'] = 'Open Modal';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringNotContainsString('jankx-button-modal-trigger', $html);
    }

    /**
     * Test render with inner blocks
     */
    public function test_render_with_inner_blocks(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['text'] = 'Button with Icon';
        $attributes['useIconBlocks'] = true;

        $innerBlocks = [
            [
                'blockName' => 'jankx/svg-icon',
                'attrs' => ['icon' => 'test-icon'],
            ],
        ];

        $block = $this->createMockBlock($attributes, '', $innerBlocks);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        // Should render inner blocks
        $this->assertStringContainsString('button-icon-wrapper', $html);
    }

    /**
     * Test render with custom styling
     */
    public function test_render_with_custom_styling(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['backgroundColor'] = '#ff0000';
        $attributes['textColor'] = '#ffffff';
        $attributes['text'] = 'Styled Button';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        // Should contain inline styles or classes for colors
        $this->assertStringContainsString('Styled Button', $html);
    }

    /**
     * Test HTML output is properly escaped
     */
    public function test_html_output_is_properly_escaped(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['text'] = 'Button<script>alert("xss")</script>';
        $attributes['url'] = 'https://example.com?param=<script>alert("xss")</script>';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        // XSS attempts should be escaped
        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringNotContainsString('alert("xss")', $html);
    }

    /**
     * Test render with detail-link trigger type
     */
    public function test_render_detail_link_trigger_type(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['triggerType'] = 'detail-link';
        $attributes['text'] = 'View Details';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('data-trigger-type="detail-link"', $html);
    }

    /**
     * Test render without label when showLabel is false
     */
    public function test_render_without_label_when_show_label_is_false(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['text'] = 'Hidden Text';
        $attributes['showLabel'] = false;
        $attributes['useIconBlocks'] = false;

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        // Text should not appear when showLabel is false
        $this->assertStringNotContainsString('Hidden Text', $html);
    }
}
