<?php

namespace Tests\Managers;

use PHPUnit\Framework\TestCase;
use Jankx\Managers\MenuManager;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class MenuManagerTest extends TestCase
{
    protected $app;
    protected $menuManager;

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

        $this->menuManager = new MenuManager($this->app);
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(MenuManager::class, $this->menuManager);
    }

    public function testGetMenu()
    {
        $result = $this->menuManager->getMenu('primary');

        $this->assertStringContainsString('<nav class="menu-primary" id="menu-primary">', $result);
        $this->assertStringContainsString('<ul class="menu">', $result);
        $this->assertStringContainsString('<li><a href="#">Menu Item</a></li>', $result);
    }

    public function testGetMenuWithCustomArgs()
    {
        $args = [
            'container_class' => 'custom-menu',
            'menu_class' => 'custom-menu-list',
        ];

        $result = $this->menuManager->getMenu('primary', $args);

        $this->assertStringContainsString('class="custom-menu"', $result);
        $this->assertStringContainsString('class="custom-menu-list"', $result);
    }

    public function testGetPrimaryMenu()
    {
        $result = $this->menuManager->getPrimaryMenu();

        $this->assertStringContainsString('<nav class="menu-primary" id="menu-primary">', $result);
        $this->assertStringContainsString('<ul class="menu">', $result);
    }

    public function testGetSecondaryMenu()
    {
        $result = $this->menuManager->getSecondaryMenu();

        $this->assertStringContainsString('<nav class="menu-secondary" id="menu-secondary">', $result);
        $this->assertStringContainsString('<ul class="menu">', $result);
    }

    public function testGetFooterMenu()
    {
        $result = $this->menuManager->getFooterMenu();

        $this->assertStringContainsString('<nav class="menu-footer" id="menu-footer">', $result);
        $this->assertStringContainsString('<ul class="menu">', $result);
    }

    public function testHasMenu()
    {
        $result = $this->menuManager->hasMenu('primary');
        $this->assertTrue($result);
    }

    public function testHasMenuNonExistent()
    {
        $result = $this->menuManager->hasMenu('non-existent');
        $this->assertFalse($result);
    }

    public function testHasPrimaryMenu()
    {
        $result = $this->menuManager->hasPrimaryMenu();
        $this->assertTrue($result);
    }

    public function testHasSecondaryMenu()
    {
        $result = $this->menuManager->hasSecondaryMenu();
        $this->assertTrue($result);
    }

    public function testHasFooterMenu()
    {
        $result = $this->menuManager->hasFooterMenu();
        $this->assertTrue($result);
    }

    public function testGetMenuItems()
    {
        $result = $this->menuManager->getMenuItems('primary');

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('Home', $result[0]->title);
        $this->assertEquals('About', $result[1]->title);
    }

    public function testGetMenuItemsNonExistentLocation()
    {
        $result = $this->menuManager->getMenuItems('non-existent');

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testRenderMobileMenu()
    {
        $result = $this->menuManager->renderMobileMenu();

        $this->assertStringContainsString('<div class="mobile-menu-wrapper">', $result);
        $this->assertStringContainsString('<button class="mobile-menu-toggle"', $result);
        $this->assertStringContainsString('<div class="mobile-menu">', $result);
        $this->assertStringContainsString('<nav class="menu-primary"', $result);
    }

    public function testRenderMobileMenuWithoutPrimaryMenu()
    {
        // Mock has_nav_menu to return false for primary
        $this->menuManager = $this->getMockBuilder(MenuManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['hasPrimaryMenu', 'getPrimaryMenu'])
            ->getMock();

        $this->menuManager->method('hasPrimaryMenu')
            ->willReturn(false);

        $result = $this->menuManager->renderMobileMenu();
        $this->assertEquals('', $result);
    }

    public function testGetMenuLocations()
    {
        $result = $this->menuManager->getMenuLocations();

        $expected = [
            'primary' => 1,
            'secondary' => 2,
            'footer' => 3,
        ];

        $this->assertEquals($expected, $result);
    }

    public function testIsCurrentPageInMenu()
    {
        // Mock get_permalink to return URL that matches menu items
        $this->menuManager = $this->getMockBuilder(MenuManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getMenuItems'])
            ->getMock();

        $this->menuManager->method('getMenuItems')
            ->with('primary')
            ->willReturn([
                (object) [
                    'ID' => 1,
                    'title' => 'Home',
                    'url' => 'http://example.com/current-page/',
                    'menu_item_parent' => 0,
                ],
            ]);

        $result = $this->menuManager->isCurrentPageInMenu('primary');
        $this->assertTrue($result);
    }

    public function testIsCurrentPageNotInMenu()
    {
        // Mock get_permalink to return URL that doesn't match menu items
        $this->menuManager = $this->getMockBuilder(MenuManager::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getMenuItems'])
            ->getMock();

        $this->menuManager->method('getMenuItems')
            ->with('secondary')
            ->willReturn([
                (object) [
                    'ID' => 2,
                    'title' => 'About',
                    'url' => 'http://example.com/about/',
                    'menu_item_parent' => 0,
                ],
            ]);

        $result = $this->menuManager->isCurrentPageInMenu('secondary');
        $this->assertFalse($result);
    }

    public function testGetMenuConfig()
    {
        // Mock Config to return menu config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.menu', [])
            ->willReturn([
                'primary' => true,
                'secondary' => true,
                'footer' => true,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->menuManager->getMenuConfig();

        $expected = [
            'primary' => true,
            'secondary' => true,
            'footer' => true,
        ];

        $this->assertEquals($expected, $result);
    }

    public function testIsMenuEnabled()
    {
        // Mock Config to return menu config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.menu', [])
            ->willReturn([
                'primary' => true,
                'secondary' => false,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->menuManager->isMenuEnabled('primary');
        $this->assertTrue($result);
    }

    public function testIsMenuDisabled()
    {
        // Mock Config to return menu config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.menu', [])
            ->willReturn([
                'primary' => true,
                'secondary' => false,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->menuManager->isMenuEnabled('secondary');
        $this->assertFalse($result);
    }

    public function testIsMenuEnabledNonExistent()
    {
        // Mock Config to return menu config
        $configMock = $this->createMock(\Jankx\Config\Repository::class);
        $configMock->method('get')
            ->with('layout.menu', [])
            ->willReturn([
                'primary' => true,
            ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($configMock);

        $result = $this->menuManager->isMenuEnabled('non-existent');
        $this->assertFalse($result);
    }
}
