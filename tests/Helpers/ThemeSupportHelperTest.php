<?php

namespace Tests\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Helpers\ThemeSupportHelper;
use Brain\Monkey\Functions;
use Brain\Monkey\Actions;

class ThemeSupportHelperTest extends TestCase
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

    public function testAddBasicSupports()
    {
        Functions\expect('add_theme_support')
            ->times(6)
            ->withAnyArgs();

        Functions\expect('add_action')
            ->times(1)
            ->with('after_setup_theme', [ThemeSupportHelper::class, 'addCustomImageSizes']);

        ThemeSupportHelper::addBasicSupports();

        $this->assertTrue(true); // If we reach here, no exceptions were thrown
    }

    public function testAddGutenbergSupports()
    {
        Functions\expect('add_theme_support')
            ->times(3)
            ->withAnyArgs();

        Functions\expect('add_theme_support')
            ->once()
            ->with('wp-block-styles');

        Functions\expect('add_theme_support')
            ->once()
            ->with('responsive-embeds');

        Functions\expect('add_theme_support')
            ->once()
            ->with('align-wide');

        ThemeSupportHelper::addGutenbergSupports();

        $this->assertTrue(true);
    }

    public function testAddCustomLogoSupport()
    {
        $args = [
            'height' => 100,
            'width' => 400,
            'flex-height' => true,
            'flex-width' => true,
        ];

        Functions\expect('add_theme_support')
            ->once()
            ->with('custom-logo', $args);

        ThemeSupportHelper::addCustomLogoSupport($args);

        $this->assertTrue(true);
    }

    public function testAddCustomBackgroundSupport()
    {
        $args = [
            'default-color' => 'ffffff',
            'default-image' => '',
        ];

        Functions\expect('add_theme_support')
            ->once()
            ->with('custom-background', $args);

        ThemeSupportHelper::addCustomBackgroundSupport($args);

        $this->assertTrue(true);
    }

    public function testAddCustomHeaderSupport()
    {
        $args = [
            'default-image' => '',
            'width' => 1000,
            'height' => 250,
            'flex-width' => true,
            'flex-height' => true,
        ];

        Functions\expect('add_theme_support')
            ->once()
            ->with('custom-header', $args);

        ThemeSupportHelper::addCustomHeaderSupport($args);

        $this->assertTrue(true);
    }

    public function testAddEditorColorPalette()
    {
        $colors = [
            [
                'name' => 'Primary',
                'slug' => 'primary',
                'color' => '#0073aa',
            ],
            [
                'name' => 'Secondary',
                'slug' => 'secondary',
                'color' => '#005a87',
            ],
        ];

        Functions\expect('add_theme_support')
            ->once()
            ->with('editor-color-palette', $colors);

        ThemeSupportHelper::addEditorColorPalette($colors);

        $this->assertTrue(true);
    }

    public function testAddEditorFontSizes()
    {
        $sizes = [
            [
                'name' => 'Small',
                'size' => 14,
                'slug' => 'small',
            ],
            [
                'name' => 'Large',
                'size' => 26,
                'slug' => 'large',
            ],
        ];

        Functions\expect('add_theme_support')
            ->once()
            ->with('editor-font-sizes', $sizes);

        ThemeSupportHelper::addEditorFontSizes($sizes);

        $this->assertTrue(true);
    }

    public function testAddCustomImageSizes()
    {
        Functions\expect('add_image_size')
            ->times(3)
            ->withAnyArgs();

        Functions\expect('add_image_size')
            ->once()
            ->with('jankx-thumbnail', 150, 150, true);

        Functions\expect('add_image_size')
            ->once()
            ->with('jankx-medium', 300, 300, false);

        Functions\expect('add_image_size')
            ->once()
            ->with('jankx-large', 1024, 1024, false);

        ThemeSupportHelper::addCustomImageSizes();

        $this->assertTrue(true);
    }

    public function testRegisterNavigationMenus()
    {
        $menus = [
            'primary' => 'Primary Menu',
            'footer' => 'Footer Menu',
        ];

        Functions\expect('register_nav_menus')
            ->once()
            ->with($menus);

        ThemeSupportHelper::registerNavigationMenus($menus);

        $this->assertTrue(true);
    }

    public function testLoadTextDomain()
    {
        $domain = 'jankx';
        $path = '/languages';

        Functions\expect('load_theme_textdomain')
            ->once()
            ->with($domain, $path);

        ThemeSupportHelper::loadTextDomain($domain, $path);

        $this->assertTrue(true);
    }

    public function testLoadTextDomainWithDefaultPath()
    {
        $domain = 'jankx';
        $defaultPath = get_template_directory() . '/languages';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('load_theme_textdomain')
            ->once()
            ->with($domain, $defaultPath);

        ThemeSupportHelper::loadTextDomain($domain);

        $this->assertTrue(true);
    }
} 