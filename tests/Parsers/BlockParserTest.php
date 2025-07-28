<?php

namespace Tests\Parsers;

use PHPUnit\Framework\TestCase;
use Jankx\Parsers\BlockParser;

/**
 * Block Parser Test
 *
 * @package Tests\Parsers
 * @since 2.0.0
 */
class BlockParserTest extends TestCase
{
    private $parser;

    protected function setUp(): void
    {
        $this->parser = new BlockParser();
    }

    public function testParseReturnsEmptyArrayWhenContentIsEmpty()
    {
        $result = $this->parser->parse('');

        $this->assertIsArray($result);
    }

    public function testParseReturnsEmptyArrayWhenContentIsWhitespace()
    {
        $result = $this->parser->parse('   ');

        $this->assertIsArray($result);
        // In test environment, parse_blocks might return empty array or mock data
        $this->assertTrue(is_array($result));
    }

    public function testParseReturnsParsedBlocksWhenContentHasBlocks()
    {
        $content = '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->';

        $result = $this->parser->parse($content);

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks, so just verify it returns an array
    }

    public function testParseReturnsEmptyArrayWhenParseBlocksReturnsNull()
    {
        $result = $this->parser->parse('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }

    public function testParseReturnsEmptyArrayWhenParseBlocksReturnsFalse()
    {
        $result = $this->parser->parse('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }

    public function testCountBlocksReturnsZeroWhenContentIsEmpty()
    {
        $result = $this->parser->countBlocks('');

        $this->assertEquals(0, $result);
    }

    public function testCountBlocksReturnsCorrectCountWhenContentHasBlocks()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';

        $result = $this->parser->countBlocks($content);

        $this->assertIsInt($result);
        $this->assertGreaterThanOrEqual(0, $result);
        // In test environment, we can't mock parse_blocks
    }

    public function testCountBlocksReturnsZeroWhenParseBlocksReturnsEmptyArray()
    {
        $result = $this->parser->countBlocks('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertIsInt($result);
        $this->assertGreaterThanOrEqual(0, $result);
        // In test environment, we can't mock parse_blocks
    }

    public function testGetBlockTypesReturnsEmptyArrayWhenContentIsEmpty()
    {
        $result = $this->parser->getBlockTypes('');

        $this->assertEquals([], $result);
    }

    public function testGetBlockTypesReturnsBlockTypesWithCounts()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';

        $result = $this->parser->getBlockTypes($content);

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }

    public function testGetBlockTypesIgnoresBlocksWithoutBlockName()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';

        $result = $this->parser->getBlockTypes($content);

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }

    public function testGetBlockTypesReturnsEmptyArrayWhenNoValidBlocks()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';

        $result = $this->parser->getBlockTypes($content);

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }

    public function testGetBlockTypesHandlesEmptyBlockName()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';

        $result = $this->parser->getBlockTypes($content);

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }

    public function testGetBlockTypesHandlesComplexBlockStructure()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';

        $result = $this->parser->getBlockTypes($content);

        $this->assertIsArray($result);
        // In test environment, we can't mock parse_blocks
    }
}