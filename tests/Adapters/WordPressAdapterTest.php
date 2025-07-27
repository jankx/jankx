<?php

namespace Tests\Adapters;

use Brain\Monkey\Functions;
use Brain\Monkey\WP\Filters;
use Jankx\Adapters\WordPressAdapter;
use Tests\TestCase;

/**
 * WordPressAdapter Test
 *
 * @package Tests\Adapters
 * @since 2.0.0
 */
class WordPressAdapterTest extends TestCase
{
    protected WordPressAdapter $adapter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->adapter = new WordPressAdapter();
    }

    public function testIsAdminReturnsTrueWhenInAdmin()
    {
        Functions\when('is_admin')->justReturn(true);

        $result = $this->adapter->isAdmin();

        $this->assertTrue($result);
        Functions\expect('is_admin')->toBeCalled();
    }

    public function testIsAdminReturnsFalseWhenNotInAdmin()
    {
        Functions\when('is_admin')->justReturn(false);

        $result = $this->adapter->isAdmin();

        $this->assertFalse($result);
        Functions\expect('is_admin')->toBeCalled();
    }

    public function testIsBlockEditorReturnsTrueWhenInBlockEditor()
    {
        Functions\when('get_current_screen')->justReturn(
            (object) [
                'is_block_editor' => function() { return true; }
            ]
        );

        $result = $this->adapter->isBlockEditor();

        $this->assertTrue($result);
        Functions\expect('get_current_screen')->toBeCalled();
    }

    public function testIsBlockEditorReturnsFalseWhenNotInBlockEditor()
    {
        Functions\when('get_current_screen')->justReturn(
            (object) [
                'is_block_editor' => function() { return false; }
            ]
        );

        $result = $this->adapter->isBlockEditor();

        $this->assertFalse($result);
        Functions\expect('get_current_screen')->toBeCalled();
    }

    public function testIsBlockEditorReturnsFalseWhenGetCurrentScreenNotExists()
    {
        Functions\when('get_current_screen')->justReturn(null);

        $result = $this->adapter->isBlockEditor();

        $this->assertFalse($result);
    }

    public function testIsBlockEditorReturnsFalseWhenScreenHasNoIsBlockEditorMethod()
    {
        Functions\when('get_current_screen')->justReturn(
            (object) []
        );

        $result = $this->adapter->isBlockEditor();

        $this->assertFalse($result);
    }

    public function testHasBlocksReturnsTrueWhenContentHasBlocks()
    {
        Functions\when('has_blocks')->justReturn(true);

        $result = $this->adapter->hasBlocks('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertTrue($result);
        Functions\expect('has_blocks')->toBeCalledWith('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');
    }

    public function testHasBlocksReturnsFalseWhenContentHasNoBlocks()
    {
        Functions\when('has_blocks')->justReturn(false);

        $result = $this->adapter->hasBlocks('Plain text content');

        $this->assertFalse($result);
        Functions\expect('has_blocks')->toBeCalledWith('Plain text content');
    }

    public function testGetCurrentContentReturnsContent()
    {
        Functions\when('get_the_content')->justReturn('Test content');

        $result = $this->adapter->getCurrentContent();

        $this->assertEquals('Test content', $result);
        Functions\expect('get_the_content')->toBeCalled();
    }

    public function testGetCurrentContentReturnsEmptyStringWhenNoContent()
    {
        Functions\when('get_the_content')->justReturn('');

        $result = $this->adapter->getCurrentContent();

        $this->assertEquals('', $result);
        Functions\expect('get_the_content')->toBeCalled();
    }

    public function testGetCurrentContentReturnsEmptyStringWhenContentIsNull()
    {
        Functions\when('get_the_content')->justReturn(null);

        $result = $this->adapter->getCurrentContent();

        $this->assertEquals('', $result);
        Functions\expect('get_the_content')->toBeCalled();
    }

    public function testGetCurrentExcerptReturnsExcerpt()
    {
        Functions\when('get_the_excerpt')->justReturn('Test excerpt');

        $result = $this->adapter->getCurrentExcerpt();

        $this->assertEquals('Test excerpt', $result);
        Functions\expect('get_the_excerpt')->toBeCalled();
    }

    public function testGetCurrentExcerptReturnsEmptyStringWhenNoExcerpt()
    {
        Functions\when('get_the_excerpt')->justReturn('');

        $result = $this->adapter->getCurrentExcerpt();

        $this->assertEquals('', $result);
        Functions\expect('get_the_excerpt')->toBeCalled();
    }

    public function testGetCurrentExcerptReturnsEmptyStringWhenExcerptIsNull()
    {
        Functions\when('get_the_excerpt')->justReturn(null);

        $result = $this->adapter->getCurrentExcerpt();

        $this->assertEquals('', $result);
        Functions\expect('get_the_excerpt')->toBeCalled();
    }

    public function testGetTemplatePartsCountReturnsCountWhenFunctionExists()
    {
        Functions\when('get_block_template_parts')->justReturn([
            'header' => ['header.html'],
            'footer' => ['footer.html'],
            'sidebar' => ['sidebar.html']
        ]);

        $result = $this->adapter->getTemplatePartsCount();

        $this->assertEquals(3, $result);
        Functions\expect('get_block_template_parts')->toBeCalled();
    }

    public function testGetTemplatePartsCountReturnsZeroWhenFunctionNotExists()
    {
        Functions\when('get_block_template_parts')->justReturn(null);

        $result = $this->adapter->getTemplatePartsCount();

        $this->assertEquals(0, $result);
    }

    public function testGetTemplatePartsCountReturnsZeroWhenResultIsNotArray()
    {
        Functions\when('get_block_template_parts')->justReturn('not_an_array');

        $result = $this->adapter->getTemplatePartsCount();

        $this->assertEquals(0, $result);
        Functions\expect('get_block_template_parts')->toBeCalled();
    }

    public function testGetTemplatePartsCountReturnsZeroWhenResultIsEmptyArray()
    {
        Functions\when('get_block_template_parts')->justReturn([]);

        $result = $this->adapter->getTemplatePartsCount();

        $this->assertEquals(0, $result);
        Functions\expect('get_block_template_parts')->toBeCalled();
    }
} 