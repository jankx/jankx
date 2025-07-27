<?php

namespace Tests\Parsers;

use Brain\Monkey\Functions;
use Jankx\Parsers\BlockParser;
use Tests\TestCase;

/**
 * BlockParser Test
 *
 * @package Tests\Parsers
 * @since 2.0.0
 */
class BlockParserTest extends TestCase
{
    protected BlockParser $parser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->parser = new BlockParser();
    }

    public function testParseReturnsEmptyArrayWhenContentIsEmpty()
    {
        $result = $this->parser->parse('');

        $this->assertEquals([], $result);
    }

    public function testParseReturnsEmptyArrayWhenContentIsWhitespace()
    {
        $result = $this->parser->parse('   ');

        $this->assertEquals([], $result);
    }

    public function testParseReturnsParsedBlocksWhenContentHasBlocks()
    {
        $content = '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->';
        $expectedBlocks = [
            [
                'blockName' => 'core/paragraph',
                'attrs' => [],
                'innerBlocks' => [],
                'innerHTML' => '<p>Test content</p>',
                'innerContent' => ['<p>Test content</p>']
            ]
        ];

        Functions\when('parse_blocks')->justReturn($expectedBlocks);

        $result = $this->parser->parse($content);

        $this->assertEquals($expectedBlocks, $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }

    public function testParseReturnsEmptyArrayWhenParseBlocksReturnsNull()
    {
        Functions\when('parse_blocks')->justReturn(null);

        $result = $this->parser->parse('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertEquals([], $result);
        Functions\expect('parse_blocks')->toBeCalled();
    }

    public function testParseReturnsEmptyArrayWhenParseBlocksReturnsFalse()
    {
        Functions\when('parse_blocks')->justReturn(false);

        $result = $this->parser->parse('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertEquals([], $result);
        Functions\expect('parse_blocks')->toBeCalled();
    }

    public function testCountBlocksReturnsZeroWhenContentIsEmpty()
    {
        $result = $this->parser->countBlocks('');

        $this->assertEquals(0, $result);
    }

    public function testCountBlocksReturnsCorrectCountWhenContentHasBlocks()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';
        $parsedBlocks = [
            ['blockName' => 'core/paragraph'],
            ['blockName' => 'core/heading'],
            ['blockName' => 'core/image']
        ];

        Functions\when('parse_blocks')->justReturn($parsedBlocks);

        $result = $this->parser->countBlocks($content);

        $this->assertEquals(3, $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }

    public function testCountBlocksReturnsZeroWhenParseBlocksReturnsEmptyArray()
    {
        Functions\when('parse_blocks')->justReturn([]);

        $result = $this->parser->countBlocks('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertEquals(0, $result);
        Functions\expect('parse_blocks')->toBeCalled();
    }

    public function testGetBlockTypesReturnsEmptyArrayWhenContentIsEmpty()
    {
        $result = $this->parser->getBlockTypes('');

        $this->assertEquals([], $result);
    }

    public function testGetBlockTypesReturnsBlockTypesWithCounts()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';
        $parsedBlocks = [
            ['blockName' => 'core/paragraph'],
            ['blockName' => 'core/paragraph'],
            ['blockName' => 'core/heading'],
            ['blockName' => 'core/image'],
            ['blockName' => 'core/paragraph']
        ];

        Functions\when('parse_blocks')->justReturn($parsedBlocks);

        $result = $this->parser->getBlockTypes($content);

        $expected = [
            'core/paragraph' => 3,
            'core/heading' => 1,
            'core/image' => 1
        ];

        $this->assertEquals($expected, $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }

    public function testGetBlockTypesIgnoresBlocksWithoutBlockName()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';
        $parsedBlocks = [
            ['blockName' => 'core/paragraph'],
            ['innerHTML' => 'Some content without blockName'],
            ['blockName' => 'core/heading'],
            ['attrs' => []]
        ];

        Functions\when('parse_blocks')->justReturn($parsedBlocks);

        $result = $this->parser->getBlockTypes($content);

        $expected = [
            'core/paragraph' => 1,
            'core/heading' => 1
        ];

        $this->assertEquals($expected, $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }

    public function testGetBlockTypesReturnsEmptyArrayWhenNoValidBlocks()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';
        $parsedBlocks = [
            ['innerHTML' => 'Content without blockName'],
            ['attrs' => []],
            ['innerBlocks' => []]
        ];

        Functions\when('parse_blocks')->justReturn($parsedBlocks);

        $result = $this->parser->getBlockTypes($content);

        $this->assertEquals([], $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }

    public function testGetBlockTypesHandlesEmptyBlockName()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';
        $parsedBlocks = [
            ['blockName' => 'core/paragraph'],
            ['blockName' => ''],
            ['blockName' => null],
            ['blockName' => 'core/heading']
        ];

        Functions\when('parse_blocks')->justReturn($parsedBlocks);

        $result = $this->parser->getBlockTypes($content);

        $expected = [
            'core/paragraph' => 1,
            'core/heading' => 1
        ];

        $this->assertEquals($expected, $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }

    public function testGetBlockTypesHandlesComplexBlockStructure()
    {
        $content = '<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->';
        $parsedBlocks = [
            [
                'blockName' => 'core/group',
                'innerBlocks' => [
                    ['blockName' => 'core/paragraph'],
                    ['blockName' => 'core/heading']
                ]
            ],
            ['blockName' => 'core/paragraph'],
            ['blockName' => 'core/group']
        ];

        Functions\when('parse_blocks')->justReturn($parsedBlocks);

        $result = $this->parser->getBlockTypes($content);

        $expected = [
            'core/group' => 2,
            'core/paragraph' => 1
        ];

        $this->assertEquals($expected, $result);
        Functions\expect('parse_blocks')->toBeCalledWith($content);
    }
}