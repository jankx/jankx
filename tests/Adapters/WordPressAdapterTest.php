<?php

namespace Tests\Adapters;

use PHPUnit\Framework\TestCase;
use Jankx\Adapters\WordPressAdapter;

/**
 * WordPressAdapter Test
 *
 * @package Tests\Adapters
 * @since 2.0.0
 */
class WordPressAdapterTest extends TestCase
{
    private $adapter;

    protected function setUp(): void
    {
        $this->adapter = new WordPressAdapter();
    }

    public function testIsAdminReturnsBoolean()
    {
        $result = $this->adapter->isAdmin();

        $this->assertIsBool($result);
    }

    public function testIsBlockEditorReturnsBoolean()
    {
        $result = $this->adapter->isBlockEditor();

        $this->assertIsBool($result);
    }

    public function testHasBlocksReturnsBoolean()
    {
        $result = $this->adapter->hasBlocks('<!-- wp:paragraph --><p>Test</p><!-- /wp:paragraph -->');

        $this->assertIsBool($result);
    }

    public function testGetCurrentContentReturnsString()
    {
        $result = $this->adapter->getCurrentContent();

        $this->assertIsString($result);
    }

    public function testGetCurrentExcerptReturnsString()
    {
        $result = $this->adapter->getCurrentExcerpt();

        $this->assertIsString($result);
    }

    public function testGetTemplatePartsCountReturnsInteger()
    {
        $result = $this->adapter->getTemplatePartsCount();

        $this->assertIsInt($result);
        $this->assertGreaterThanOrEqual(0, $result);
    }
}