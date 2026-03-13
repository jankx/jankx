<?php

namespace Tests\App\Providers;

use App\Providers\ImageSizeServiceProvider;
use Jankx\Foundation\Application;
use Tests\Helpers\TestCase;

class ImageSizeServiceProviderTest extends TestCase
{
    protected $app;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();
        $this->provider = new ImageSizeServiceProvider($this->app);
        $GLOBALS['mock_is_admin'] = false;
        unset($_GET['page']);
        $GLOBALS['options'] = [];
    }
    
    protected function tearDown(): void {
        unset($GLOBALS['mock_is_admin']);
        unset($_GET['page']);
        unset($GLOBALS['options']);
        parent::tearDown();
    }

    public function testFilterImageSizesWithNoOption()
    {
        // Mock get_option to return false (default)
        $sizes = ['thumbnail', 'medium', 'large'];
        $result = $this->provider->filterImageSizes($sizes);
        $this->assertEquals($sizes, $result);
    }

    public function testFilterImageSizesWithOption()
    {
        $GLOBALS['options']['jankx_enabled_image_sizes'] = ['thumbnail'];
        $sizes = ['thumbnail', 'medium', 'large'];
        $result = $this->provider->filterImageSizes($sizes);
        $this->assertEquals(['thumbnail'], $result);
    }

    public function testFilterImageSizesInAdminUtilitiesPage()
    {
        $GLOBALS['mock_is_admin'] = true;
        $_GET['page'] = 'jankx-utilities';
        $GLOBALS['options']['jankx_enabled_image_sizes'] = ['thumbnail'];
        
        $sizes = ['thumbnail', 'medium', 'large'];
        $result = $this->provider->filterImageSizes($sizes);
        $this->assertEquals($sizes, $result); // Should return all because of utilities page
    }

    public function testFilterAdvancedImageSizes()
    {
        $GLOBALS['options']['jankx_enabled_image_sizes'] = ['thumbnail'];
        $sizes = [
            'thumbnail' => ['width' => 150],
            'medium' => ['width' => 300],
            'large' => ['width' => 1024]
        ];
        $result = $this->provider->filterAdvancedImageSizes($sizes);
        $this->assertEquals(['thumbnail' => ['width' => 150]], $result);
    }
}
