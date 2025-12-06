<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\BlockIntegrationTestCase;
use Jankx\Gutenberg\Blocks\LanguageSwitcherBlock;

/**
 * Integration tests for LanguageSwitcherBlock
 * 
 * Tests block in real WordPress environment
 */
class LanguageSwitcherBlockIntegrationTest extends BlockIntegrationTestCase
{
    protected LanguageSwitcherBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $this->block = new LanguageSwitcherBlock();
        $this->block->init();
    }

    /**
     * Test block is registered in WordPress
     */
    public function test_block_is_registered(): void
    {
        $this->assertBlockIsRegistered('jankx/language-switcher');
    }

    /**
     * Test block renders in post content
     */
    public function test_block_renders_in_post_content(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'dropdown',
        ];

        $this->assertBlockRenders('jankx/language-switcher', $attributes);
    }

    /**
     * Test block can be inserted into post
     */
    public function test_block_can_be_inserted_into_post(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'displayType' => 'list',
        ];

        $postId = $this->createPostWithBlock('jankx/language-switcher', $attributes);
        $this->assertGreaterThan(0, $postId);

        $html = $this->extractBlockFromPost($postId, 'jankx/language-switcher');
        $this->assertNotNull($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('language-switcher-block', $html);

        // Cleanup
        wp_delete_post($postId, true);
    }
}
