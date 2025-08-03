<?php

namespace Tests\Managers;

use PHPUnit\Framework\TestCase;
use Jankx\Managers\SidebarManager;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class SidebarManagerTest extends TestCase
{
    protected $app;
    protected $sidebarManager;

    protected function setUp(): void
    {
        parent::setUp();

        // Create mock Application
        $this->app = $this->createMock(Application::class);

        // Set up Application mock to return config service
        $this->app->method('make')
            ->willReturnCallback(function ($key) {
                if ($key === 'config') {
                    return $this->createMock(\Jankx\Config\Repository::class);
                }
                return null;
            });

        // Set up Config facade
        Config::setFacadeApplication($this->app);

        $this->sidebarManager = new SidebarManager($this->app);
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(SidebarManager::class, $this->sidebarManager);
    }

    public function testGetSidebar()
    {
        $result = $this->sidebarManager->getSidebar('primary-sidebar');

        $this->assertStringContainsString('<div class="widget">Widget content for primary-sidebar</div>', $result);
    }

    public function testGetPrimarySidebar()
    {
        $result = $this->sidebarManager->getPrimarySidebar();

        $this->assertStringContainsString('<aside class="sidebar primary-sidebar" id="primary-sidebar">', $result);
        $this->assertStringContainsString('<h3 class="sidebar-title">Primary Sidebar</h3>', $result);
        $this->assertStringContainsString('<div class="widget">Widget content for primary-sidebar</div>', $result);
    }

    public function testGetSecondarySidebar()
    {
        $result = $this->sidebarManager->getSecondarySidebar();

        $this->assertStringContainsString('<aside class="sidebar secondary-sidebar" id="secondary-sidebar">', $result);
        $this->assertStringContainsString('<h3 class="sidebar-title">Secondary Sidebar</h3>', $result);
        $this->assertStringContainsString('<div class="widget">Widget content for secondary-sidebar</div>', $result);
    }

    public function testIsSidebarActive()
    {
        $result = $this->sidebarManager->isSidebarActive('primary-sidebar');
        $this->assertTrue($result);
    }

    public function testIsSidebarInactive()
    {
        $result = $this->sidebarManager->isSidebarActive('non-existent-sidebar');
        $this->assertFalse($result);
    }

    public function testIsPrimarySidebarActive()
    {
        $result = $this->sidebarManager->isPrimarySidebarActive();
        $this->assertTrue($result);
    }

    public function testIsSecondarySidebarActive()
    {
        $result = $this->sidebarManager->isSecondarySidebarActive();
        $this->assertTrue($result);
    }

    public function testGetRegisteredSidebars()
    {
        $result = $this->sidebarManager->getRegisteredSidebars();

        $expected = [
            'primary-sidebar' => [
                'name' => 'Primary Sidebar',
                'id' => 'primary-sidebar',
                'description' => 'Primary sidebar area',
            ],
            'secondary-sidebar' => [
                'name' => 'Secondary Sidebar',
                'id' => 'secondary-sidebar',
                'description' => 'Secondary sidebar area',
            ],
        ];

        $this->assertEquals($expected, $result);
    }

    public function testGetSidebarData()
    {
        $result = $this->sidebarManager->getSidebarData('primary-sidebar');

        $expected = [
            'name' => 'Primary Sidebar',
            'id' => 'primary-sidebar',
            'description' => 'Primary sidebar area',
        ];

        $this->assertEquals($expected, $result);
    }

    public function testGetSidebarDataNonExistent()
    {
        $result = $this->sidebarManager->getSidebarData('non-existent-sidebar');
        $this->assertNull($result);
    }

    public function testRenderSidebar()
    {
        $result = $this->sidebarManager->renderSidebar('primary-sidebar');

        $this->assertStringContainsString('<aside class="sidebar" id="sidebar-primary-sidebar">', $result);
        $this->assertStringContainsString('<h3 class="sidebar-title">Primary Sidebar</h3>', $result);
        $this->assertStringContainsString('<div class="widget">Widget content for primary-sidebar</div>', $result);
    }

    public function testRenderSidebarWithCustomArgs()
    {
        $args = [
            'wrapper_class' => 'custom-sidebar',
            'wrapper_id' => 'custom-sidebar-id',
            'title' => 'Custom Title',
            'show_title' => true,
        ];

        $result = $this->sidebarManager->renderSidebar('primary-sidebar', $args);

        $this->assertStringContainsString('<aside class="custom-sidebar" id="custom-sidebar-id">', $result);
        $this->assertStringContainsString('<h3 class="sidebar-title">Custom Title</h3>', $result);
    }

    public function testRenderSidebarWithoutTitle()
    {
        $args = [
            'show_title' => false,
        ];

        $result = $this->sidebarManager->renderSidebar('primary-sidebar', $args);

        $this->assertStringContainsString('<aside class="sidebar" id="sidebar-primary-sidebar">', $result);
        $this->assertStringNotContainsString('<h3 class="sidebar-title">', $result);
    }

    public function testRenderSidebarInactive()
    {
        $result = $this->sidebarManager->renderSidebar('non-existent-sidebar');
        $this->assertEquals('', $result);
    }

    public function testShouldShowSidebar()
    {
        $result = $this->sidebarManager->shouldShowSidebar();
        $this->assertTrue($result);
    }

    public function testShouldShowSidebarOnFullWidthPage()
    {
        // Mock isPrimarySidebarActive to return true
        $this->sidebarManager = $this->getMockBuilder(SidebarManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['isPrimarySidebarActive'])
            ->getMock();

        $this->sidebarManager->method('isPrimarySidebarActive')
            ->willReturn(true);

        $result = $this->sidebarManager->shouldShowSidebar();
        $this->assertTrue($result);
    }

    public function testShouldShowSidebarOn404Page()
    {
        // Mock isPrimarySidebarActive to return true
        $this->sidebarManager = $this->getMockBuilder(SidebarManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['isPrimarySidebarActive'])
            ->getMock();

        $this->sidebarManager->method('isPrimarySidebarActive')
            ->willReturn(true);

        $result = $this->sidebarManager->shouldShowSidebar();
        $this->assertTrue($result);
    }

    public function testShouldShowSidebarWhenPrimarySidebarInactive()
    {
        // Mock isPrimarySidebarActive to return false
        $this->sidebarManager = $this->getMockBuilder(SidebarManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['isPrimarySidebarActive'])
            ->getMock();

        $this->sidebarManager->method('isPrimarySidebarActive')
            ->willReturn(false);

        $result = $this->sidebarManager->shouldShowSidebar();
        $this->assertFalse($result);
    }

    public function testGetSidebarLayoutClass()
    {
        $result = $this->sidebarManager->getSidebarLayoutClass();
        $this->assertEquals('sidebar-right', $result);
    }

    public function testGetSidebarLayoutClassNoSidebar()
    {
        // Mock shouldShowSidebar to return false
        $this->sidebarManager = $this->getMockBuilder(SidebarManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['shouldShowSidebar'])
            ->getMock();

        $this->sidebarManager->method('shouldShowSidebar')
            ->willReturn(false);

        $result = $this->sidebarManager->getSidebarLayoutClass();
        $this->assertEquals('no-sidebar', $result);
    }

    public function testGetWidgetCount()
    {
        $result = $this->sidebarManager->getWidgetCount('primary-sidebar');
        $this->assertEquals(2, $result);
    }

    public function testGetWidgetCountNonExistentSidebar()
    {
        $result = $this->sidebarManager->getWidgetCount('non-existent-sidebar');
        $this->assertEquals(0, $result);
    }

    public function testGetSidebarConfig()
    {
        // Mock Config to return sidebar config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.sidebar', [])
            ->willReturn([
                'primary' => true,
                'secondary' => true,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->sidebarManager->getSidebarConfig();

        $expected = [
            'primary' => true,
            'secondary' => true,
        ];

        $this->assertEquals($expected, $result);
    }

    public function testIsSidebarEnabled()
    {
        // Mock Config to return sidebar config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.sidebar', [])
            ->willReturn([
                'primary' => true,
                'secondary' => false,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->sidebarManager->isSidebarEnabled('primary');
        $this->assertTrue($result);
    }

    public function testIsSidebarDisabled()
    {
        // Mock Config to return sidebar config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.sidebar', [])
            ->willReturn([
                'primary' => true,
                'secondary' => false,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->sidebarManager->isSidebarEnabled('secondary');
        $this->assertFalse($result);
    }

    public function testIsSidebarEnabledNonExistent()
    {
        // Mock Config to return sidebar config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.sidebar', [])
            ->willReturn([
                'primary' => true,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->sidebarManager->isSidebarEnabled('non-existent');
        $this->assertFalse($result);
    }

    public function testIsPrimarySidebarEnabled()
    {
        // Mock Config to return sidebar config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.sidebar', [])
            ->willReturn([
                'primary' => true,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->sidebarManager->isPrimarySidebarEnabled();
        $this->assertTrue($result);
    }

    public function testIsSecondarySidebarEnabled()
    {
        // Mock Config to return sidebar config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.sidebar', [])
            ->willReturn([
                'secondary' => true,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->sidebarManager->isSecondarySidebarEnabled();
        $this->assertTrue($result);
    }
}
