<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Layout;
use Brain\Monkey\Functions;

class LayoutFacadeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testGetLayout()
    {
        $expectedLayout = 'content-sidebar';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($expectedLayout);

        $result = Layout::get();

        $this->assertEquals($expectedLayout, $result);
    }

    public function testSetLayout()
    {
        $layout = 'full-width';

        Functions\expect('set_theme_mod')
            ->once()
            ->with('layout', $layout)
            ->andReturn(true);

        $result = Layout::set($layout);

        $this->assertTrue($result);
    }

    public function testGetSidebarPosition()
    {
        $layout = 'content-sidebar';
        $expectedPosition = 'right';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getSidebarPosition();

        $this->assertEquals($expectedPosition, $result);
    }

    public function testGetSidebarPositionWithLeftSidebar()
    {
        $layout = 'sidebar-content';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getSidebarPosition();

        $this->assertEquals('left', $result);
    }

    public function testGetSidebarPositionWithNoSidebar()
    {
        $layout = 'full-width';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getSidebarPosition();

        $this->assertEquals('none', $result);
    }

    public function testHasSidebar()
    {
        $layout = 'content-sidebar';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::hasSidebar();

        $this->assertTrue($result);
    }

    public function testHasSidebarWithNoSidebar()
    {
        $layout = 'full-width';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::hasSidebar();

        $this->assertFalse($result);
    }

    public function testIsFullWidth()
    {
        $layout = 'full-width';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::isFullWidth();

        $this->assertTrue($result);
    }

    public function testIsFullWidthWithSidebar()
    {
        $layout = 'content-sidebar';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::isFullWidth();

        $this->assertFalse($result);
    }

    public function testGetContentWidth()
    {
        $layout = 'content-sidebar';
        $expectedWidth = '66.666667%';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getContentWidth();

        $this->assertEquals($expectedWidth, $result);
    }

    public function testGetContentWidthWithFullWidth()
    {
        $layout = 'full-width';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getContentWidth();

        $this->assertEquals('100%', $result);
    }

    public function testGetSidebarWidth()
    {
        $layout = 'content-sidebar';
        $expectedWidth = '33.333333%';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getSidebarWidth();

        $this->assertEquals($expectedWidth, $result);
    }

    public function testGetSidebarWidthWithNoSidebar()
    {
        $layout = 'full-width';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getSidebarWidth();

        $this->assertEquals('0%', $result);
    }

    public function testGetAvailableLayouts()
    {
        $expectedLayouts = [
            'content-sidebar' => 'Content Sidebar',
            'sidebar-content' => 'Sidebar Content',
            'full-width' => 'Full Width',
            'content-sidebar-sidebar' => 'Content Sidebar Sidebar',
        ];

        $result = Layout::getAvailableLayouts();

        $this->assertEquals($expectedLayouts, $result);
    }

    public function testIsValidLayout()
    {
        $validLayout = 'content-sidebar';
        $invalidLayout = 'invalid-layout';

        $this->assertTrue(Layout::isValid($validLayout));
        $this->assertFalse(Layout::isValid($invalidLayout));
    }

    public function testGetLayoutClass()
    {
        $layout = 'content-sidebar';
        $expectedClass = 'layout-content-sidebar';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getClass();

        $this->assertEquals($expectedClass, $result);
    }

    public function testGetLayoutClassWithCustomLayout()
    {
        $layout = 'custom-layout';
        $expectedClass = 'layout-custom-layout';

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getClass();

        $this->assertEquals($expectedClass, $result);
    }

    public function testGetLayoutData()
    {
        $layout = 'content-sidebar';
        $expectedData = [
            'layout' => $layout,
            'sidebar_position' => 'right',
            'has_sidebar' => true,
            'is_full_width' => false,
            'content_width' => '66.666667%',
            'sidebar_width' => '33.333333%',
            'class' => 'layout-content-sidebar',
        ];

        Functions\expect('get_theme_mod')
            ->once()
            ->with('layout', 'content-sidebar')
            ->andReturn($layout);

        $result = Layout::getData();

        $this->assertEquals($expectedData, $result);
    }

    public function testResetLayout()
    {
        Functions\expect('remove_theme_mod')
            ->once()
            ->with('layout')
            ->andReturn(true);

        $result = Layout::reset();

        $this->assertTrue($result);
    }
} 