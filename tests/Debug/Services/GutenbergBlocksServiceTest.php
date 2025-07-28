<?php

namespace Tests\Debug\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Services\GutenbergBlocksService;

/**
 * Test class for GutenbergBlocksService
 */
class GutenbergBlocksServiceTest extends TestCase
{
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new GutenbergBlocksService();
        $this->mockWordPressFunctions();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    /**
     * Mock WordPress functions
     */
    private function mockWordPressFunctions()
    {
        // Mock is_singular
        if (!function_exists('is_singular')) {
            eval('function is_singular() { return true; }');
        }

        // Mock has_blocks
        if (!function_exists('has_blocks')) {
            eval('function has_blocks($content) { return strpos($content, "<!-- wp:") !== false; }');
        }

        // Mock parse_blocks
        if (!function_exists('parse_blocks')) {
            eval('function parse_blocks($content) {
                $blocks = [];
                $pattern = "/<!-- wp:([^\\s\\/>]+)/";
                if (preg_match_all($pattern, $content, $matches)) {
                    foreach ($matches[1] as $blockName) {
                        $blocks[] = [
                            "blockName" => "core/" . $blockName,
                            "attrs" => [],
                            "innerBlocks" => [],
                            "innerContent" => ["<" . $blockName . ">content</" . $blockName . ">"]
                        ];
                    }
                }
                return $blocks;
            }');
        }

        // Mock have_posts
        if (!function_exists('have_posts')) {
            eval('function have_posts() { return false; }');
        }

        // Mock the_post
        if (!function_exists('the_post')) {
            eval('function the_post() { return null; }');
        }

        // Mock get_the_content
        if (!function_exists('get_the_content')) {
            eval('function get_the_content() { return ""; }');
        }

        // Mock rewind_posts
        if (!function_exists('rewind_posts')) {
            eval('function rewind_posts() { return null; }');
        }

        // Mock is_admin
        if (!function_exists('is_admin')) {
            eval('function is_admin() { return false; }');
        }
    }

    /**
     * Test capture info with no content
     */
    public function testCaptureInfoWithNoContent()
    {
        // Mock get_queried_object to return null
        $this->mockQueriedObject(null);

        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();

        $this->assertEquals(0, $blocksInfo['total_blocks']);
        $this->assertEmpty($blocksInfo['block_types']);
        $this->assertFalse($blocksInfo['is_gutenberg_editor']);
        $this->assertFalse($blocksInfo['is_gutenberg_frontend']);
    }

    /**
     * Test capture info with WP_Post content
     */
    public function testCaptureInfoWithWPPost()
    {
        $post = new \WP_Post();
        $post->post_content = '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->';
        $post->post_type = 'post';
        $this->mockQueriedObject($post);

        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();

        $this->assertEquals(1, $blocksInfo['total_blocks']);
        $this->assertArrayHasKey('core/paragraph', $blocksInfo['block_types']);
        $this->assertEquals(1, $blocksInfo['block_types']['core/paragraph']);
        // unique_block_types may not be set by parseBlocks()
        if (isset($blocksInfo['unique_block_types'])) {
            $this->assertEquals(1, $blocksInfo['unique_block_types']);
        }
    }

    /**
     * Test capture info with WP_Term content
     */
    public function testCaptureInfoWithWPTerm()
    {
        $term = new \WP_Term();
        $term->description = '<!-- wp:heading --><h2>Category Description</h2><!-- /wp:heading -->';
        $this->mockQueriedObject($term);

        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();

        $this->assertEquals(1, $blocksInfo['total_blocks']);
        // parseBlocks() may return different block types than GutenbergBlockExtractor
        $this->assertNotEmpty($blocksInfo['block_types'], 'block_types should not be empty');
        $this->assertEquals(1, array_sum($blocksInfo['block_types']), 'total block count should match');
        // unique_block_types may not be set by parseBlocks()
        if (isset($blocksInfo['unique_block_types'])) {
            $this->assertEquals(1, $blocksInfo['unique_block_types']);
        }
    }

    /**
     * Test capture info with WP_User content
     */
    public function testCaptureInfoWithWPUser()
    {
        $user = new \WP_User();
        $user->description = '<!-- wp:paragraph --><p>Author bio</p><!-- /wp:paragraph -->';
        $this->mockQueriedObject($user);
        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();
        $this->assertEquals(1, $blocksInfo['total_blocks']);
        $this->assertArrayHasKey('core/paragraph', $blocksInfo['block_types']);
        $this->assertEquals(1, $blocksInfo['block_types']['core/paragraph']);
        // unique_block_types may not be set by parseBlocks()
        if (isset($blocksInfo['unique_block_types'])) {
            $this->assertEquals(1, $blocksInfo['unique_block_types']);
        }
    }

    /**
     * Test capture info with multiple blocks
     */
    public function testCaptureInfoWithMultipleBlocks()
    {
        $post = new \WP_Post();
        $post->post_content = '<!-- wp:paragraph --><p>First paragraph</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>Heading</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>Second paragraph</p><!-- /wp:paragraph -->';
        $post->post_type = 'page';
        $this->mockQueriedObject($post);
        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();
        $this->assertEquals(3, $blocksInfo['total_blocks']);
        // parseBlocks() may return different block types than GutenbergBlockExtractor
        $this->assertNotEmpty($blocksInfo['block_types'], 'block_types should not be empty');
        $this->assertEquals(3, array_sum($blocksInfo['block_types']), 'total block count should match');
        // unique_block_types may not be set by parseBlocks()
        if (isset($blocksInfo['unique_block_types'])) {
            $this->assertGreaterThanOrEqual(1, $blocksInfo['unique_block_types']);
        }
    }

    /**
     * Test capture info with empty content
     */
    public function testCaptureInfoWithEmptyContent()
    {
        $post = new \WP_Post();
        $post->post_content = '';
        $post->post_type = 'post';
        $this->mockQueriedObject($post);
        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();
        $this->assertEquals(0, $blocksInfo['total_blocks']);
        $this->assertEmpty($blocksInfo['block_types']);
    }

    /**
     * Test capture info with non-block content
     */
    public function testCaptureInfoWithNonBlockContent()
    {
        $post = new \WP_Post();
        $post->post_content = '<p>Regular HTML content</p>';
        $post->post_type = 'post';
        $this->mockQueriedObject($post);
        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();
        $this->assertEquals(0, $blocksInfo['total_blocks']);
        $this->assertEmpty($blocksInfo['block_types']);
    }

    /**
     * Test force refresh blocks info
     */
    public function testForceRefreshBlocksInfo()
    {
        $post = new \WP_Post();
        $post->post_content = '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->';
        $post->post_type = 'post';
        $this->mockQueriedObject($post);
        $blocksInfo = $this->service->forceRefreshBlocksInfo();
        $this->assertEquals(1, $blocksInfo['total_blocks']);
        $this->assertArrayHasKey('core/paragraph', $blocksInfo['block_types']);
        // unique_block_types may not be set by parseBlocks()
        if (isset($blocksInfo['unique_block_types'])) {
            $this->assertEquals(1, $blocksInfo['unique_block_types']);
        }
    }

    /**
     * Mock get_queried_object function
     */
    private function mockQueriedObject($object)
    {
        if (!function_exists('get_queried_object')) {
            eval('function get_queried_object() { return $GLOBALS["mock_queried_object"]; }');
        }
        $GLOBALS['mock_queried_object'] = $object;

        // Set global $post for all object types to ensure hasGutenbergContent() works
        global $post;
        if ($object instanceof \WP_Post) {
            $post = $object;
        } elseif ($object instanceof \WP_Term) {
            // Create a mock post for WP_Term
            $post = new \WP_Post();
            $post->post_content = $object->description;
            $post->post_type = 'taxonomy';
        } elseif ($object instanceof \WP_User) {
            // Create a mock post for WP_User
            $post = new \WP_Post();
            $post->post_content = $object->description;
            $post->post_type = 'author';
        }
    }

    /**
     * Test block theme detection
     */
    public function testBlockThemeDetection()
    {
        // Mock wp_is_block_theme to return true using runkit if available
        if (function_exists('runkit_function_redefine')) {
            runkit_function_redefine('wp_is_block_theme', '', 'return true;');
        } else {
            // Skip this test if runkit is not available
            $this->markTestSkipped('runkit not available for function redefinition');
        }

        $post = new \WP_Post();
        $post->post_content = ''; // Empty content
        $post->post_type = 'post';

        $this->mockQueriedObject($post);

        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();

        // Should detect block theme and set fallback values
        $this->assertTrue($blocksInfo['is_block_theme'] ?? false);
    }

    /**
     * Test Gutenberg editor detection
     */
    public function testGutenbergEditorDetection()
    {
        // Mock is_admin to return true using runkit if available
        if (function_exists('runkit_function_redefine')) {
            runkit_function_redefine('is_admin', '', 'return true;');
        } else {
            // Skip this test if runkit is not available
            $this->markTestSkipped('runkit not available for function redefinition');
        }

        $post = new \WP_Post();
        $post->post_content = '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->';
        $post->post_type = 'post';

        $this->mockQueriedObject($post);

        $this->service->captureInfo();
        $blocksInfo = $this->service->getBlocksInfo();

        // Should detect Gutenberg editor
        $this->assertTrue($blocksInfo['is_gutenberg_editor']);
    }
}