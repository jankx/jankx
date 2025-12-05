<?php

namespace Tests\Gutenberg;

use Tests\Helpers\TestCase;
use WP_Block_Type_Registry;

/**
 * Base test case for Gutenberg block integration tests
 * 
 * Tests blocks in WordPress environment with real database and functions
 */
abstract class BlockIntegrationTestCase extends TestCase
{
    /**
     * Ensure WordPress is loaded
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        if (!defined('ABSPATH')) {
            $this->markTestSkipped('WordPress not loaded');
        }
    }

    /**
     * Create a post with block content
     * 
     * @param string $blockName Block name
     * @param array $attributes Block attributes
     * @param string $content Inner content (optional)
     * @return int Post ID
     */
    protected function createPostWithBlock(string $blockName, array $attributes = [], string $content = ''): int
    {
        $blockJson = wp_json_encode([
            'blockName' => $blockName,
            'attrs' => $attributes,
            'innerContent' => [$content],
            'innerBlocks' => [],
        ]);

        $postContent = '<!-- wp:paragraph -->
<p>Before block</p>
<!-- /wp:paragraph -->

' . serialize_block([
            'blockName' => $blockName,
            'attrs' => $attributes,
            'innerHTML' => $content,
            'innerContent' => [$content],
        ]) . '

<!-- wp:paragraph -->
<p>After block</p>
<!-- /wp:paragraph -->';

        $postId = wp_insert_post([
            'post_title' => 'Test Post with Block',
            'post_content' => $postContent,
            'post_status' => 'publish',
            'post_type' => 'post',
        ]);

        return $postId;
    }

    /**
     * Render post content and extract block HTML
     * 
     * @param int $postId Post ID
     * @param string $blockName Block name to extract
     * @return string|null Block HTML or null if not found
     */
    protected function extractBlockFromPost(int $postId, string $blockName): ?string
    {
        $post = get_post($postId);
        if (!$post) {
            return null;
        }

        $blocks = parse_blocks($post->post_content);
        
        foreach ($blocks as $block) {
            if (($block['blockName'] ?? '') === $blockName) {
                return render_block($block);
            }
            
            // Recursively search inner blocks
            if (!empty($block['innerBlocks'])) {
                foreach ($block['innerBlocks'] as $innerBlock) {
                    if (($innerBlock['blockName'] ?? '') === $blockName) {
                        return render_block($innerBlock);
                    }
                }
            }
        }

        return null;
    }

    /**
     * Assert block is registered in WordPress
     * 
     * @param string $blockName Block name
     */
    protected function assertBlockIsRegistered(string $blockName): void
    {
        $registry = WP_Block_Type_Registry::get_instance();
        $this->assertTrue(
            $registry->is_registered($blockName),
            "Block '{$blockName}' should be registered"
        );
    }

    /**
     * Assert block renders without errors
     * 
     * @param string $blockName Block name
     * @param array $attributes Block attributes
     */
    protected function assertBlockRenders(string $blockName, array $attributes = []): void
    {
        $blockJson = [
            'blockName' => $blockName,
            'attrs' => $attributes,
            'innerHTML' => '',
            'innerContent' => [''],
            'innerBlocks' => [],
        ];

        $html = render_block($blockJson);
        
        $this->assertNotNull($html, "Block '{$blockName}' should render HTML");
        $this->assertNotEmpty($html, "Block '{$blockName}' should not render empty HTML");
    }
}
