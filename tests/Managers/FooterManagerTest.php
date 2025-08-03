<?php

namespace Tests\Managers;

use PHPUnit\Framework\TestCase;
use Jankx\Managers\FooterManager;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class FooterManagerTest extends TestCase
{
    protected $app;
    protected $footerManager;
    protected $mockMenuManager;

    protected function setUp(): void
    {
        parent::setUp();

        // Create mock Application
        $this->app = $this->createMock(Application::class);

        // Create mock MenuManager
        $this->mockMenuManager = $this->createMock(\Jankx\Managers\MenuManager::class);

        // Set up Application mock to return different services based on key
        $this->app->method('make')
            ->willReturnCallback(function ($key) {
                if ($key === 'layout.menu') {
                    return $this->mockMenuManager;
                }
                if ($key === 'config') {
                    return $this->createMock(\Jankx\Config\Repository::class);
                }
                return null;
            });

        // Set up Config facade
        Config::setFacadeApplication($this->app);

        $this->footerManager = new FooterManager($this->app);
    }

    /**
     * Helper method to create FooterManager with mocked config
     */
    private function createFooterManagerWithConfig($config)
    {
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn($config);

        $appMock = $this->createMock(Application::class);
        $appMock->method('make')
            ->willReturnCallback(function ($key) use ($configMock) {
                if ($key === 'layout.menu') {
                    return $this->mockMenuManager;
                }
                if ($key === 'config') {
                    return $configMock;
                }
                return null;
            });

        return new FooterManager($appMock);
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(FooterManager::class, $this->footerManager);
    }

    public function testGetFooterMenu()
    {
        $expectedMenu = '<nav class="menu-footer" id="menu-footer"><ul class="menu"><li><a href="#">Footer Menu Item</a></li></ul></nav>';

        $this->mockMenuManager->method('getFooterMenu')
            ->willReturn($expectedMenu);

        $result = $this->footerManager->getFooterMenu();
        $this->assertEquals($expectedMenu, $result);
    }

    public function testGetFooterMenuWithArgs()
    {
        $args = ['container_class' => 'custom-footer-menu'];
        $expectedMenu = '<nav class="custom-footer-menu" id="menu-footer"><ul class="menu"><li><a href="#">Footer Menu Item</a></li></ul></nav>';

        $this->mockMenuManager->method('getFooterMenu')
            ->with($args)
            ->willReturn($expectedMenu);

        $result = $this->footerManager->getFooterMenu($args);
        $this->assertEquals($expectedMenu, $result);
    }

    public function testGetFooterWidgets()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'widgets' => [
                'enabled' => true,
                'columns' => 3,
            ],
        ]);

        $result = $footerManager->getFooterWidgets();

        $this->assertStringContainsString('<div class="footer-widgets">', $result);
        $this->assertStringContainsString('footer-widget-column-1', $result);
        $this->assertStringContainsString('footer-widget-column-2', $result);
        $this->assertStringContainsString('footer-widget-column-3', $result);
    }

    public function testGetFooterWidgetsWithCustomColumns()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'widgets' => [
                'enabled' => true,
                'columns' => 2,
            ],
        ]);

        $result = $footerManager->getFooterWidgets();

        $this->assertStringContainsString('footer-widget-column-1', $result);
        $this->assertStringContainsString('footer-widget-column-2', $result);
        $this->assertStringNotContainsString('footer-widget-column-3', $result);
    }

    public function testGetFooterContent()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'content' => '© 2024 Test Theme. All rights reserved.',
        ]);

        $result = $footerManager->getFooterContent();
        $this->assertEquals('© 2024 Test Theme. All rights reserved.', $result);
    }

    public function testGetFooterContentEmpty()
    {
        $footerManager = $this->createFooterManagerWithConfig([]);

        $result = $footerManager->getFooterContent();
        $this->assertEquals('', $result);
    }

    public function testRenderFooter()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'widgets' => ['enabled' => true, 'columns' => 3],
            'menu' => ['enabled' => true],
            'content' => '© 2024 Test Theme',
        ]);

        $this->mockMenuManager->method('getFooterMenu')
            ->willReturn('<nav class="footer-menu">Menu</nav>');

        $result = $footerManager->renderFooter();

        $this->assertStringContainsString('<footer class="site-footer">', $result);
        $this->assertStringContainsString('<div class="footer-widgets">', $result);
        $this->assertStringContainsString('<div class="footer-menu-wrapper">', $result);
        $this->assertStringContainsString('<div class="footer-content">', $result);
        $this->assertStringContainsString('© 2024 Test Theme', $result);
    }

    public function testRenderFooterWithoutWidgets()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'widgets' => ['enabled' => false],
            'menu' => ['enabled' => true],
            'content' => '© 2024 Test Theme',
        ]);

        $this->mockMenuManager->method('getFooterMenu')
            ->willReturn('<nav class="footer-menu">Menu</nav>');

        $result = $footerManager->renderFooter();

        $this->assertStringContainsString('<footer class="site-footer">', $result);
        $this->assertStringNotContainsString('<div class="footer-widgets">', $result);
        $this->assertStringContainsString('<div class="footer-menu-wrapper">', $result);
        $this->assertStringContainsString('<div class="footer-content">', $result);
    }

    public function testIsFooterMenuEnabled()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'menu' => ['enabled' => true],
        ]);

        $result = $footerManager->isFooterMenuEnabled();
        $this->assertTrue($result);
    }

    public function testIsFooterMenuDisabled()
    {
        $footerManager = $this->createFooterManagerWithConfig([
            'menu' => ['enabled' => false],
        ]);

        $result = $footerManager->isFooterMenuEnabled();
        $this->assertFalse($result);
    }

    public function testIsFooterWidgetsEnabled()
    {
        // Mock Config to return footer config with widgets enabled
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['enabled' => true],
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->isFooterWidgetsEnabled();
        $this->assertTrue($result);
    }

    public function testIsFooterWidgetsDisabled()
    {
        // Mock Config to return footer config with widgets disabled
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['enabled' => false],
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->isFooterWidgetsEnabled();
        $this->assertFalse($result);
    }

    public function testGetFooterWidgetColumns()
    {
        // Mock Config to return footer config with 4 columns
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['columns' => 4],
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->getFooterWidgetColumns();
        $this->assertEquals(4, $result);
    }

    public function testGetFooterWidgetColumnsDefault()
    {
        // Mock Config to return footer config without columns
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->getFooterWidgetColumns();
        $this->assertEquals(3, $result);
    }

    public function testGetFooterConfig()
    {
        $expectedConfig = [
            'widgets' => ['enabled' => true, 'columns' => 3],
            'menu' => ['enabled' => true],
            'content' => '© 2024 Test Theme',
        ];

        // Mock Config to return footer config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn($expectedConfig);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->getFooterConfig();
        $this->assertEquals($expectedConfig, $result);
    }

    public function testHasFooterContent()
    {
        // Mock Config to return footer config with content
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['enabled' => false],
                'menu' => ['enabled' => false],
                'content' => '© 2024 Test Theme',
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->hasFooterContent();
        $this->assertTrue($result);
    }

    public function testHasFooterContentWithWidgets()
    {
        // Mock Config to return footer config with widgets enabled
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['enabled' => true],
                'menu' => ['enabled' => false],
                'content' => '',
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->hasFooterContent();
        $this->assertTrue($result);
    }

    public function testHasFooterContentWithMenu()
    {
        // Mock Config to return footer config with menu enabled
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['enabled' => false],
                'menu' => ['enabled' => true],
                'content' => '',
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->hasFooterContent();
        $this->assertTrue($result);
    }

    public function testHasFooterContentEmpty()
    {
        // Mock Config to return footer config with no content
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['enabled' => false],
                'menu' => ['enabled' => false],
                'content' => '',
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->hasFooterContent();
        $this->assertFalse($result);
    }

    public function testGetFooterWidgetAreas()
    {
        // Mock Config to return footer config with 3 columns
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'widgets' => ['columns' => 3],
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->getFooterWidgetAreas();
        $expected = ['footer-widget-1', 'footer-widget-2', 'footer-widget-3'];
        $this->assertEquals($expected, $result);
    }

    public function testIsFooterWidgetActive()
    {
        $result = $this->footerManager->isFooterWidgetActive(1);
        $this->assertTrue($result);
    }

    public function testIsFooterWidgetInactive()
    {
        $result = $this->footerManager->isFooterWidgetActive(999);
        $this->assertFalse($result);
    }

    public function testGetFooterWidgetContent()
    {
        $result = $this->footerManager->getFooterWidgetContent(1);
        $this->assertStringContainsString('Widget content for footer-widget-1', $result);
    }

    public function testGetFooterWidgetContentInactive()
    {
        $result = $this->footerManager->getFooterWidgetContent(999);
        $this->assertEquals('', $result);
    }

    public function testGetFooterLayoutClass()
    {
        // Mock Config to return footer config with layout
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([
                'layout' => 'centered',
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->getFooterLayoutClass();
        $this->assertEquals('footer-layout-centered', $result);
    }

    public function testGetFooterLayoutClassDefault()
    {
        // Mock Config to return footer config without layout
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.footer', [])
            ->willReturn([]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->footerManager->getFooterLayoutClass();
        $this->assertEquals('footer-layout-default', $result);
    }
}
