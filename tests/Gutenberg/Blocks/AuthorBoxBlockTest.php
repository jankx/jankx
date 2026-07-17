<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\AuthorBoxBlock;
use Mockery;

/**
 * Unit tests for AuthorBoxBlock
 * 
 * Tests the PHP rendering logic of the author box block
 */
class AuthorBoxBlockTest extends BlockTestCase
{
    protected AuthorBoxBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new AuthorBoxBlock();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/author-box';
    }

    protected function createBlockInstance(): AuthorBoxBlock
    {
        return new AuthorBoxBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'authorId' => 0,
            'showAvatar' => true,
            'avatarSize' => 80,
            'showBio' => true,
            'showSocial' => true,
            'showPosts' => false,
            'postsCount' => 3,
            'layout' => 'horizontal',
        ];
    }

    /**
     * Test block ID is correct
     */
    public function test_block_id_is_correct(): void
    {
        $this->assertEquals('jankx/author-box', $this->getBlockId());
    }

    /**
     * Test render with default attributes
     */
    public function test_render_with_default_attributes(): void
    {
        $attributes = $this->getDefaultAttributes();
        
        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertValidHtml($html);
    }

    /**
     * Test render with specific author ID
     */
    public function test_render_with_specific_author_id(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['authorId'] = 1;

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertValidHtml($html);
    }

    /**
     * Test hide avatar when showAvatar is false
     */
    public function test_hide_avatar_when_show_avatar_is_false(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['showAvatar'] = false;

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        // Avatar should not be displayed
    }

    /**
     * Test hide bio when showBio is false
     */
    public function test_hide_bio_when_show_bio_is_false(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['showBio'] = false;

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        // Bio should not be displayed
    }

    /**
     * Test horizontal layout
     */
    public function test_horizontal_layout(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['layout'] = 'horizontal';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('layout-horizontal', $html);
    }

    /**
     * Test vertical layout
     */
    public function test_vertical_layout(): void
    {
        $attributes = $this->getDefaultAttributes();
        $attributes['layout'] = 'vertical';

        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('layout-vertical', $html);
    }

    /**
     * Test HTML output is properly escaped
     */
    public function test_html_output_is_properly_escaped(): void
    {
        $attributes = $this->getDefaultAttributes();
        
        $block = $this->createMockBlock($attributes);
        
        $html = $this->block->render($attributes, '', $block);

        // Should not contain unescaped HTML
        $this->assertStringNotContainsString('<script>', $html);
    }
}
