<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\BlockParserService;
use Brain\Monkey\Functions;
use Brain\Monkey\Actions;

class BlockParserServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testParseBlockContent()
    {
        $service = new BlockParserService();
        $content = '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->';

        $result = $service->parseBlockContent($content);

        $this->assertIsArray($result);
        $this->assertNotEmpty($result);
    }

    public function testParseBlockContentWithEmptyContent()
    {
        $service = new BlockParserService();
        $content = '';

        $result = $service->parseBlockContent($content);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testParseBlockContentWithInvalidContent()
    {
        $service = new BlockParserService();
        $content = 'Invalid content without block comments';

        $result = $service->parseBlockContent($content);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testExtractBlockAttributes()
    {
        $service = new BlockParserService();
        $blockComment = '<!-- wp:paragraph {"align":"center","className":"test-class"} -->';

        $result = $service->extractBlockAttributes($blockComment);

        $this->assertIsArray($result);
        $this->assertEquals('paragraph', $result['blockName']);
        $this->assertEquals('center', $result['attributes']['align']);
        $this->assertEquals('test-class', $result['attributes']['className']);
    }

    public function testExtractBlockAttributesWithNoAttributes()
    {
        $service = new BlockParserService();
        $blockComment = '<!-- wp:paragraph -->';

        $result = $service->extractBlockAttributes($blockComment);

        $this->assertIsArray($result);
        $this->assertEquals('paragraph', $result['blockName']);
        $this->assertEmpty($result['attributes']);
    }

    public function testExtractBlockAttributesWithInvalidJson()
    {
        $service = new BlockParserService();
        $blockComment = '<!-- wp:paragraph {"invalid":json} -->';

        $result = $service->extractBlockAttributes($blockComment);

        $this->assertIsArray($result);
        $this->assertEquals('paragraph', $result['blockName']);
        $this->assertEmpty($result['attributes']);
    }

    public function testParseBlockContentWithMultipleBlocks()
    {
        $service = new BlockParserService();
        $content = '<!-- wp:paragraph --><p>First block</p><!-- /wp:paragraph -->' .
                  '<!-- wp:heading --><h2>Second block</h2><!-- /wp:heading -->';

        $result = $service->parseBlockContent($content);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('paragraph', $result[0]['blockName']);
        $this->assertEquals('heading', $result[1]['blockName']);
    }

    public function testGetBlockType()
    {
        $service = new BlockParserService();
        $blockName = 'core/paragraph';

        $result = $service->getBlockType($blockName);

        $this->assertEquals('paragraph', $result);
    }

    public function testGetBlockTypeWithCustomBlock()
    {
        $service = new BlockParserService();
        $blockName = 'custom/my-block';

        $result = $service->getBlockType($blockName);

        $this->assertEquals('my-block', $result);
    }

    public function testValidateBlockStructure()
    {
        $service = new BlockParserService();
        $block = [
            'blockName' => 'core/paragraph',
            'attributes' => [],
            'content' => '<p>Test</p>',
        ];

        $result = $service->validateBlockStructure($block);

        $this->assertTrue($result);
    }

    public function testValidateBlockStructureWithInvalidBlock()
    {
        $service = new BlockParserService();
        $block = [
            'blockName' => 'core/paragraph',
            // Missing required fields
        ];

        $result = $service->validateBlockStructure($block);

        $this->assertFalse($result);
    }

    public function testSanitizeBlockContent()
    {
        $service = new BlockParserService();
        $content = '<script>alert("xss")</script><p>Safe content</p>';

        $result = $service->sanitizeBlockContent($content);

        $this->assertStringNotContainsString('<script>', $result);
        $this->assertStringContainsString('<p>Safe content</p>', $result);
    }

    public function testParseBlockContentWithNestedBlocks()
    {
        $service = new BlockParserService();
        $content = '<!-- wp:group --><div class="wp-block-group">' .
                  '<!-- wp:paragraph --><p>Nested content</p><!-- /wp:paragraph -->' .
                  '</div><!-- /wp:group -->';

        $result = $service->parseBlockContent($content);

        $this->assertIsArray($result);
        $this->assertNotEmpty($result);
        // Should handle nested blocks appropriately
    }
} 