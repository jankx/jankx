<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\LayoutSwitcherBlock;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Mockery;
use WP_Block;

/**
 * Unit tests for LayoutSwitcherBlock
 */
class LayoutSwitcherBlockTest extends BlockTestCase
{
    protected LayoutSwitcherBlock $block;
    protected $layoutManagerMock;
    protected $urlManagerMock;

    protected function setUp(): void
    {
        parent::setUp();

        $app = \Jankx\Foundation\Application::getInstance();
        $app->bind('blocks.path', function() {
            return dirname(__DIR__, 3) . '/resources/blocks';
        });

        // Mock BlockTemplateLayoutManager and UrlManager
        $this->layoutManagerMock = Mockery::mock(BlockTemplateLayoutManager::class);
        $this->urlManagerMock = Mockery::mock(\Jankx\Managers\UrlManager::class);
        
        $this->block = new LayoutSwitcherBlock($this->layoutManagerMock, $this->urlManagerMock);
        
        BlockTemplateLayoutManager::setInstance($this->layoutManagerMock);
    }

    protected function tearDown(): void
    {
        BlockTemplateLayoutManager::setInstance(null);
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/layout-switcher';
    }

    protected function createBlockInstance(): LayoutSwitcherBlock
    {
        return new LayoutSwitcherBlock($this->layoutManagerMock, $this->urlManagerMock);
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'supportedLayouts' => ['grid', 'list'],
            'displayType' => 'icons',
            'alignment' => 'left'
        ];
    }

    public function test_render_with_icons_only()
    {
        $attributes = $this->getDefaultAttributes();
        
        $mockLayoutGrid = Mockery::mock(BlockTemplateLayoutInterface::class);
        $mockLayoutGrid->shouldReceive('getIcon')->andReturn('dashicons-grid-view');
        $mockLayoutGrid->shouldReceive('getTitle')->andReturn('Grid');

        $mockLayoutList = Mockery::mock(BlockTemplateLayoutInterface::class);
        $mockLayoutList->shouldReceive('getIcon')->andReturn('dashicons-list-view');
        $mockLayoutList->shouldReceive('getTitle')->andReturn('List');

        $this->layoutManagerMock->shouldReceive('getLayoutsForPostType')
            ->with('post')
            ->andReturn([
                'grid' => 'GridClass',
                'list' => 'ListClass'
            ]);

        $this->layoutManagerMock->shouldReceive('createLayout')
            ->with('grid')
            ->andReturn($mockLayoutGrid);

        $this->layoutManagerMock->shouldReceive('createLayout')
            ->with('list')
            ->andReturn($mockLayoutList);

        // Mock WP_Block for context
        $block = new WP_Block([
            'blockName' => 'jankx/layout-switcher',
            'attrs' => $attributes,
        ]);
        $block->context = [
            'queryId' => 'test-query',
            'postType' => 'post',
            'displayLayout' => 'grid'
        ];

        $html = $this->block->render($attributes, '', $block);

        $this->assertStringContainsString('jankx-layout-switcher', $html);
        $this->assertStringContainsString('layout-switcher--type-icons', $html);
        $this->assertStringContainsString('data-layout="grid"', $html);
        $this->assertStringContainsString('is-active', $html);
        $this->assertStringContainsString('dashicons-grid-view', $html);
        $this->assertStringContainsString('dashicons-list-view', $html);
        $this->assertStringNotContainsString('layout-label', $html);
    }

    public function test_render_with_labels_only()
    {
        $attributes = [
            'supportedLayouts' => ['grid'],
            'displayType' => 'labels',
            'alignment' => 'center'
        ];
        
        $mockLayoutGrid = Mockery::mock(BlockTemplateLayoutInterface::class);
        $mockLayoutGrid->shouldReceive('getIcon')->andReturn('dashicons-grid-view');
        $mockLayoutGrid->shouldReceive('getTitle')->andReturn('Grid View');

        $this->layoutManagerMock->shouldReceive('getLayoutsForPostType')
            ->andReturn(['grid' => 'GridClass']);

        $this->layoutManagerMock->shouldReceive('createLayout')
            ->with('grid')
            ->andReturn($mockLayoutGrid);

        $block = new WP_Block(['blockName' => 'jankx/layout-switcher', 'attrs' => $attributes]);
        $block->context = ['queryId' => 'q1', 'postType' => 'post', 'displayLayout' => 'list'];

        $html = $this->block->render($attributes, '', $block);

        $this->assertStringContainsString('layout-switcher--type-labels', $html);
        $this->assertStringContainsString('layout-switcher--align-center', $html);
        $this->assertStringContainsString('Grid View', $html);
        $this->assertStringNotContainsString('layout-icon', $html);
    }

    public function test_render_with_both_icon_and_label()
    {
        $attributes = [
            'supportedLayouts' => ['grid'],
            'displayType' => 'both',
            'alignment' => 'right'
        ];
        
        $mockLayoutGrid = Mockery::mock(BlockTemplateLayoutInterface::class);
        $mockLayoutGrid->shouldReceive('getIcon')->andReturn('dashicons-grid-view');
        $mockLayoutGrid->shouldReceive('getTitle')->andReturn('Grid View');

        $this->layoutManagerMock->shouldReceive('getLayoutsForPostType')
            ->andReturn(['grid' => 'GridClass']);

        $this->layoutManagerMock->shouldReceive('createLayout')
            ->andReturn($mockLayoutGrid);

        $block = new WP_Block(['blockName' => 'jankx/layout-switcher', 'attrs' => $attributes]);
        $block->context = ['queryId' => 'q1', 'postType' => 'post'];

        $html = $this->block->render($attributes, '', $block);

        $this->assertStringContainsString('layout-switcher--type-both', $html);
        $this->assertStringContainsString('layout-icon', $html);
        $this->assertStringContainsString('layout-label', $html);
        $this->assertStringContainsString('Grid View', $html);
    }

    public function test_empty_query_id_returns_placeholder_in_admin()
    {
        // Force is_admin to return true (handled by global mock in bootstrap)
        $GLOBALS['mock_is_admin'] = true;
        
        $this->layoutManagerMock->shouldReceive('getLayoutsForPostType')
            ->andReturn([]); // Empty available layouts should trigger the placeholder

        $attributes = $this->getDefaultAttributes();
        $block = new WP_Block(['blockName' => 'jankx/layout-switcher', 'attrs' => $attributes]);
        $block->context = ['postType' => 'post']; // Missing queryId

        $html = $this->block->render($attributes, '', $block);
        
        $this->assertStringContainsString('jankx-layout-switcher-placeholder', $html);
        $this->assertStringContainsString('No layouts available', $html);
    }
}
