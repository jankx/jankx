<?php

namespace Jankx\Tests\Integration\MasterDataLayout;

use Tests\Helpers\TestCase;
use Jankx\Gutenberg\Blocks\MasterDataLayoutBlock;
use Jankx\Gutenberg\Blocks\MasterDataTemplateBlock;

class MasterDataLayoutIntegrationTest extends TestCase
{
    /**
     * Test Block Classes Existence
     */
    public function testBlockClassesExist()
    {
        $this->assertTrue(class_exists(MasterDataLayoutBlock::class), 'MasterDataLayoutBlock class should exist');
        $this->assertTrue(class_exists(MasterDataTemplateBlock::class), 'MasterDataTemplateBlock class should exist');
    }

    /**
     * Helper to get block path
     */
    protected function getBlockPath($blockDir)
    {
        return dirname(dirname(dirname(dirname(__DIR__)))) . '/resources/blocks/' . $blockDir;
    }

    /**
     * Test Layout Support Registration
     */
    public function testLayoutRegistration()
    {
        if (!class_exists(MasterDataLayoutBlock::class)) {
            $this->markTestSkipped('MasterDataLayoutBlock class does not exist');
        }

        $block = new MasterDataLayoutBlock($this->getBlockPath('master-data-layout'));
        $layouts = $block->getSupportedLayouts();
        
        $this->assertArrayHasKey('grid', $layouts);
        $this->assertArrayHasKey('list', $layouts);
        $this->assertArrayHasKey('card', $layouts);
        $this->assertArrayHasKey('carousel', $layouts);
    }

    /**
     * Test Block Renderer Callback
     */
    public function testRenderCallback()
    {
        if (!class_exists(MasterDataLayoutBlock::class)) {
            $this->markTestSkipped('MasterDataLayoutBlock class does not exist');
        }

        // Skip if WordPress environment is not loaded (WP_Query not available)
        if (!class_exists('WP_Query')) {
            $this->markTestSkipped('WordPress environment not loaded. WP_Query class not found.');
        }

        $block = new MasterDataLayoutBlock($this->getBlockPath('master-data-layout'));
        
        // Mock attributes
        $attributes = [
            'layout' => 'grid',
            'postType' => 'post',
            'columns' => 3
        ];

        // Expect render method to return string (HTML)
        // We pass an empty array for content (parsed_block) for now
        // render($attributes, $content, $block)
        // $block here is WP_Block instance
        
        // Since we can't easily mock full WP_Block execution in this environment without full WP load,
        // we might hit issues with PostLayoutManager trying to run queries.
        // But let's try invoking render.
        
        // We need to mock WP_Query behavior if possible, or rely on integration test DB.
        // Assuming standard WP test suite is running with DB.
        
        $output = $block->render($attributes, '', null);
        $this->assertIsString($output);
        // If there are no posts, it might return empty or "No posts found"
        // But we check it returns a string at least.
    }
}
