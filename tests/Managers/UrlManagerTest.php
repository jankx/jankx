<?php

namespace Tests\Managers;

use Jankx\Managers\UrlManager;
use PHPUnit\Framework\TestCase;

class UrlManagerTest extends TestCase
{
    protected $urlManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->urlManager = new UrlManager();
    }

    public function testGetThemeUrl()
    {
        $themeUrl = $this->urlManager->getThemeUrl();
        $this->assertEquals('http://example.com/wp-content/themes/bookix', $themeUrl);
    }

    public function testGetChildThemeUrl()
    {
        $childThemeUrl = $this->urlManager->getChildThemeUrl();
        $this->assertEquals('http://example.com/wp-content/themes/bookix-child', $childThemeUrl);
    }

    public function testAsset()
    {
        $assetUrl = $this->urlManager->asset('css/style.css');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/assets/css/style.css', $assetUrl);
    }

    public function testBlockAsset()
    {
        $blockUrl = $this->urlManager->blockAsset('widget-renderer/build/index.js');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/resources/blocks/widget-renderer/build/index.js', $blockUrl);
    }

    public function testImage()
    {
        $imageUrl = $this->urlManager->image('logo.png');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/assets/images/logo.png', $imageUrl);
    }

    public function testCss()
    {
        $cssUrl = $this->urlManager->css('style.css');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/assets/css/style.css', $cssUrl);
    }

    public function testJs()
    {
        $jsUrl = $this->urlManager->js('app.js');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/assets/js/app.js', $jsUrl);
    }

    public function testVendor()
    {
        $vendorUrl = $this->urlManager->vendor('bootstrap/css/bootstrap.css');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/vendor/bootstrap/css/bootstrap.css', $vendorUrl);
    }

    public function testUploads()
    {
        $uploadsUrl = $this->urlManager->uploads('2024/01/image.jpg');
        $this->assertEquals('http://example.com/wp-content/uploads/2024/01/image.jpg', $uploadsUrl);
    }

    public function testSite()
    {
        $siteUrl = $this->urlManager->site('about');
        $this->assertEquals('http://example.com/about', $siteUrl);
    }

    public function testHome()
    {
        $homeUrl = $this->urlManager->home('blog');
        $this->assertEquals('http://example.com/blog', $homeUrl);
    }

    public function testAdmin()
    {
        $adminUrl = $this->urlManager->admin('themes.php');
        $this->assertEquals('http://example.com/wp-admin/themes.php', $adminUrl);
    }

    public function testContent()
    {
        $contentUrl = $this->urlManager->content('plugins/my-plugin/style.css');
        $this->assertEquals('http://example.com/wp-content/plugins/my-plugin/style.css', $contentUrl);
    }

    public function testIncludes()
    {
        $includesUrl = $this->urlManager->includes('Jankx/Config/Repository.php');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/includes/Jankx/Config/Repository.php', $includesUrl);
    }

    public function testResources()
    {
        $resourcesUrl = $this->urlManager->resources('blocks/widget-renderer/index.js');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/resources/blocks/widget-renderer/index.js', $resourcesUrl);
    }

    public function testAssetWithLeadingSlash()
    {
        $assetUrl = $this->urlManager->asset('/css/style.css');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/assets/css/style.css', $assetUrl);
    }

    public function testImageWithLeadingSlash()
    {
        $imageUrl = $this->urlManager->image('/logo.png');
        $this->assertEquals('http://example.com/wp-content/themes/bookix/assets/images/logo.png', $imageUrl);
    }
} 