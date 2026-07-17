<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\PostTypeBadgeBlock;
use Mockery;

class PostTypeBadgeBlockTest extends BlockTestCase
{
    protected PostTypeBadgeBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new PostTypeBadgeBlock();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/post-type-badge';
    }

    protected function createBlockInstance(): PostTypeBadgeBlock
    {
        return new PostTypeBadgeBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'position' => 'top-right',
            'offsetX' => '12px',
            'offsetY' => '12px',
            'backgroundColor' => '#2e7d32',
            'textColor' => '#ffffff',
            'borderRadius' => 8,
            'showLabel' => true,
        ];
    }

    public function test_render_with_default_attributes(): void
    {
        $attributes = $this->getDefaultAttributes();

        $block = $this->createMockBlock($attributes);
        $block->context = ['postId' => 1];

        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertValidHtml($html);
    }

    public function test_hide_label_when_show_label_is_false(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['showLabel'] = false;

        $block = $this->createMockBlock($attributes);
        $block->context = ['postId' => 1];

        $html = $this->block->render($attributes, '', $block);

        $this->assertEmpty($html);
    }

    public function test_styles_and_classes_are_present(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['position'] = 'bottom-left';
        $attributes['offsetX'] = '10px';
        $attributes['offsetY'] = '5px';
        $attributes['backgroundColor'] = '#ff0000';
        $attributes['textColor'] = '#000000';
        $attributes['borderRadius'] = 4;

        $block = $this->createMockBlock($attributes);
        $block->context = ['postId' => 1];

        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('position-bottom-left', $html);
        $this->assertStringContainsString('background', $html);
        $this->assertStringContainsString('border-radius', $html);
    }
}
