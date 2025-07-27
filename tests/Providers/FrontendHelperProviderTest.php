<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Providers\FrontendHelperProvider;
use Illuminate\Container\Container;
use Brain\Monkey\Functions;

class FrontendHelperProviderTest extends TestCase
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

    public function testRegister()
    {
        $provider = new FrontendHelperProvider();
        $container = new Container();

        Functions\expect('add_action')
            ->once()
            ->with('wp_enqueue_scripts', [$provider, 'enqueueFrontendAssets']);

        Functions\expect('add_action')
            ->once()
            ->with('wp_head', [$provider, 'addMetaTags']);

        Functions\expect('add_action')
            ->once()
            ->with('wp_footer', [$provider, 'addFooterScripts']);

        $provider->register($container);

        $this->assertTrue(true);
    }

    public function testEnqueueFrontendAssets()
    {
        $provider = new FrontendHelperProvider();

        Functions\expect('wp_enqueue_style')
            ->once()
            ->with('jankx-frontend', '/assets/css/frontend.css', [], '2.0.0');

        Functions\expect('wp_enqueue_script')
            ->once()
            ->with('jankx-frontend', '/assets/js/frontend.js', ['jquery'], '2.0.0', true);

        $provider->enqueueFrontendAssets();

        $this->assertTrue(true);
    }

    public function testAddMetaTags()
    {
        $provider = new FrontendHelperProvider();

        Functions\expect('wp_head')
            ->once();

        $provider->addMetaTags();

        $this->assertTrue(true);
    }

    public function testAddFooterScripts()
    {
        $provider = new FrontendHelperProvider();

        Functions\expect('wp_footer')
            ->once();

        $provider->addFooterScripts();

        $this->assertTrue(true);
    }

    public function testGetAssetUrl()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/frontend.css';
        $expectedUrl = 'https://example.com/assets/css/frontend.css';

        Functions\expect('get_template_directory_uri')
            ->once()
            ->andReturn('https://example.com');

        $result = $provider->getAssetUrl($assetPath);

        $this->assertEquals($expectedUrl, $result);
    }

    public function testGetAssetUrlWithLeadingSlash()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = '/css/frontend.css';
        $expectedUrl = 'https://example.com/css/frontend.css';

        Functions\expect('get_template_directory_uri')
            ->once()
            ->andReturn('https://example.com');

        $result = $provider->getAssetUrl($assetPath);

        $this->assertEquals($expectedUrl, $result);
    }

    public function testGetAssetVersion()
    {
        $provider = new FrontendHelperProvider();
        $expectedVersion = '2.0.0';

        $result = $provider->getAssetVersion();

        $this->assertEquals($expectedVersion, $result);
    }

    public function testIsDevelopment()
    {
        $provider = new FrontendHelperProvider();

        Functions\expect('defined')
            ->with('WP_DEBUG')
            ->andReturn(true);

        Functions\expect('WP_DEBUG')
            ->andReturn(true);

        $result = $provider->isDevelopment();

        $this->assertTrue($result);
    }

    public function testIsDevelopmentWhenNotDebug()
    {
        $provider = new FrontendHelperProvider();

        Functions\expect('defined')
            ->with('WP_DEBUG')
            ->andReturn(true);

        Functions\expect('WP_DEBUG')
            ->andReturn(false);

        $result = $provider->isDevelopment();

        $this->assertFalse($result);
    }

    public function testIsDevelopmentWhenDebugNotDefined()
    {
        $provider = new FrontendHelperProvider();

        Functions\expect('defined')
            ->with('WP_DEBUG')
            ->andReturn(false);

        $result = $provider->isDevelopment();

        $this->assertFalse($result);
    }

    public function testGetAssetPath()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/frontend.css';
        $expectedPath = '/path/to/theme/assets/css/frontend.css';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        $result = $provider->getAssetPath($assetPath);

        $this->assertEquals($expectedPath, $result);
    }

    public function testAssetExists()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/frontend.css';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('file_exists')
            ->once()
            ->with('/path/to/theme/assets/css/frontend.css')
            ->andReturn(true);

        $result = $provider->assetExists($assetPath);

        $this->assertTrue($result);
    }

    public function testAssetExistsWithNonExistentAsset()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/non-existent.css';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('file_exists')
            ->once()
            ->with('/path/to/theme/assets/css/non-existent.css')
            ->andReturn(false);

        $result = $provider->assetExists($assetPath);

        $this->assertFalse($result);
    }

    public function testGetAssetContents()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/frontend.css';
        $expectedContents = 'body { color: red; }';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('file_get_contents')
            ->once()
            ->with('/path/to/theme/assets/css/frontend.css')
            ->andReturn($expectedContents);

        $result = $provider->getAssetContents($assetPath);

        $this->assertEquals($expectedContents, $result);
    }

    public function testGetAssetContentsWithNonExistentAsset()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/non-existent.css';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('file_get_contents')
            ->once()
            ->with('/path/to/theme/assets/css/non-existent.css')
            ->andReturn(false);

        $result = $provider->getAssetContents($assetPath);

        $this->assertFalse($result);
    }

    public function testInlineAsset()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/inline.css';
        $assetContents = 'body { color: red; }';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('file_get_contents')
            ->once()
            ->with('/path/to/theme/assets/css/inline.css')
            ->andReturn($assetContents);

        Functions\expect('wp_add_inline_style')
            ->once()
            ->with('jankx-frontend', $assetContents);

        $provider->inlineAsset($assetPath);

        $this->assertTrue(true);
    }

    public function testInlineAssetWithNonExistentAsset()
    {
        $provider = new FrontendHelperProvider();
        $assetPath = 'css/non-existent.css';

        Functions\expect('get_template_directory')
            ->once()
            ->andReturn('/path/to/theme');

        Functions\expect('file_get_contents')
            ->once()
            ->with('/path/to/theme/assets/css/non-existent.css')
            ->andReturn(false);

        Functions\expect('wp_add_inline_style')
            ->never();

        $provider->inlineAsset($assetPath);

        $this->assertTrue(true);
    }
}