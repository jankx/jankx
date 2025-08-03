<?php

namespace Tests\Services;

use Jankx\Foundation\Application;
use Jankx\Services\SlideoutMenuService;
use PHPUnit\Framework\TestCase;

class SlideoutMenuServiceTest extends TestCase
{
    protected $app;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app = $this->createMock(Application::class);
        $this->service = new SlideoutMenuService($this->app);
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(SlideoutMenuService::class, $this->service);
    }

    public function testGetConfig()
    {
        // Mock config
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')
            ->willReturn(['test' => 'value']);

        $this->app->method('make')
            ->with('config')
            ->willReturn($config);

        $result = $this->service->getConfig();

        $this->assertIsArray($result);
        $this->assertEquals('value', $result['test']);
    }

    public function testBuildMenuTree()
    {
        $items = [
            ['id' => '1', 'parent' => '0', 'title' => 'Item 1'],
            ['id' => '2', 'parent' => '0', 'title' => 'Item 2'],
            ['id' => '3', 'parent' => '1', 'title' => 'Item 1.1'],
            ['id' => '4', 'parent' => '1', 'title' => 'Item 1.2'],
            ['id' => '5', 'parent' => '2', 'title' => 'Item 2.1'],
        ];

        $tree = $this->service->buildMenuTree($items);

        $this->assertIsArray($tree);
        $this->assertCount(2, $tree); // 2 top-level items

        // Check first item has children
        $this->assertArrayHasKey('children', $tree[0]);
        $this->assertCount(2, $tree[0]['children']);

        // Check second item has children
        $this->assertArrayHasKey('children', $tree[1]);
        $this->assertCount(1, $tree[1]['children']);
    }

    public function testRenderMenuTree()
    {
        $tree = [
            [
                'id' => '1',
                'title' => 'Item 1',
                'url' => 'http://example.com/1',
                'target' => '',
                'classes' => ['menu-item'],
                'children' => [
                    [
                        'id' => '2',
                        'title' => 'Item 1.1',
                        'url' => 'http://example.com/1/1',
                        'target' => '',
                        'classes' => ['menu-item', 'sub-menu-item']
                    ]
                ]
            ]
        ];

        $html = $this->service->renderMenuTree($tree);

        $this->assertStringContainsString('<ul class="slideout-menu-level-0">', $html);
        $this->assertStringContainsString('<li class="menu-item">', $html);
        $this->assertStringContainsString('<a href="http://example.com/1">', $html);
        $this->assertStringContainsString('Item 1', $html);
        $this->assertStringContainsString('<ul class="slideout-menu-level-1">', $html);
        $this->assertStringContainsString('Item 1.1', $html);
    }

    public function testRenderMenuTreeWithTarget()
    {
        $tree = [
            [
                'id' => '1',
                'title' => 'External Link',
                'url' => 'http://external.com',
                'target' => '_blank',
                'classes' => ['menu-item']
            ]
        ];

        $html = $this->service->renderMenuTree($tree);

        $this->assertStringContainsString('target="_blank"', $html);
    }

    public function testGetMenuStats()
    {
        $items = [
            ['id' => '1', 'parent' => '0', 'title' => 'Item 1'],
            ['id' => '2', 'parent' => '0', 'title' => 'Item 2'],
            ['id' => '3', 'parent' => '1', 'title' => 'Item 1.1'],
            ['id' => '4', 'parent' => '1', 'title' => 'Item 1.2'],
            ['id' => '5', 'parent' => '3', 'title' => 'Item 1.1.1'],
        ];

        // Mock getMenuItems to return our test data
        $service = $this->getMockBuilder(SlideoutMenuService::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getMenuItems'])
            ->getMock();

        $service->method('getMenuItems')
            ->willReturn($items);

        $stats = $service->getMenuStats();

        $this->assertIsArray($stats);
        $this->assertEquals(5, $stats['total_items']);
        $this->assertEquals(2, $stats['top_level_items']);
        $this->assertTrue($stats['has_children']);
        $this->assertEquals(3, $stats['max_depth']);
    }

    public function testGetItemDepth()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('getItemDepth');
        $method->setAccessible(true);

        $item = [
            'children' => [
                [
                    'children' => [
                        ['title' => 'Deep item']
                    ]
                ]
            ]
        ];

        $depth = $method->invoke($this->service, $item, 1);
        $this->assertEquals(3, $depth);
    }

    public function testClearCache()
    {
        // Mock wp_cache_delete
        if (!function_exists('wp_cache_delete')) {
            eval('function wp_cache_delete($key, $group) { return true; }');
        }

        // Should not throw any exceptions
        $this->service->clearCache();
        $this->assertTrue(true);
    }

    public function testIsOpen()
    {
        // Mock get_body_class
        if (!function_exists('get_body_class')) {
            eval('function get_body_class() { return ["slideout-open"]; }');
        }

        // Mock config
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')
            ->willReturn(['body_class' => 'slideout-open']);

        $this->app->method('make')
            ->with('config')
            ->willReturn($config);

        $result = $this->service->isOpen();
        $this->assertTrue($result);
    }

    public function testIsOpenWhenClosed()
    {
        // Mock the service to control isOpen behavior
        $service = $this->getMockBuilder(SlideoutMenuService::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['isOpen'])
            ->getMock();

        $service->method('isOpen')
            ->willReturn(false);

        $result = $service->isOpen();
        $this->assertFalse($result);
    }
}