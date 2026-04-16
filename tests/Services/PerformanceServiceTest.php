<?php

namespace Tests\Services;

use Jankx\Foundation\Application;
use Jankx\Services\PerformanceService;
use PHPUnit\Framework\TestCase;
use Brain\Monkey;

/**
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class PerformanceServiceTest extends TestCase
{
    private $app;
    private $service;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();

        $this->app = $this->createMock(Application::class);
        $this->service = new PerformanceService($this->app);
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function testBootRegistersHooks()
    {
        Monkey\Functions\expect('remove_action')->atLeast()->times(1);
        Monkey\Functions\expect('remove_filter')->atLeast()->times(1);
        Monkey\Functions\expect('add_filter')->with('script_loader_tag', [$this->service, 'deferScripts'], 10, 3)->once();
        Monkey\Functions\expect('add_filter')->with('tiny_mce_plugins', [$this->service, 'disableEmojisTinymce'])->once();
        Monkey\Functions\expect('add_filter')->with('wp_resource_hints', [$this->service, 'disableEmojisRemoveDnsPrefetch'], 10, 2)->once();
        Monkey\Functions\expect('add_action')->with('wp_enqueue_scripts', [$this->service, 'optimizeDashicons'], 99)->once();

        $this->service->boot();

        // The assertions above will pass if boot was called and expectations were met
        $this->assertTrue(true);
    }

    public function testDisableEmojisTinymce()
    {
        $plugins = ['table', 'wpemoji', 'lists'];
        $result = $this->service->disableEmojisTinymce($plugins);

        $this->assertIsArray($result);
        $this->assertNotContains('wpemoji', $result);
        $this->assertContains('table', $result);
        $this->assertContains('lists', $result);
    }

    public function testDisableEmojisTinymceWithNonArray()
    {
        $result = $this->service->disableEmojisTinymce('not_array');
        $this->assertEquals([], $result);
    }

    public function testDisableEmojisRemoveDnsPrefetch()
    {
        Monkey\Functions\expect('apply_filters')
            ->with('emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/')
            ->andReturn('https://s.w.org/images/core/emoji/2/svg/');

        $urls = ['https://fonts.googleapis.com', 'https://s.w.org/images/core/emoji/2/svg/'];
        $result = $this->service->disableEmojisRemoveDnsPrefetch($urls, 'dns-prefetch');

        $this->assertCount(1, $result);
        $this->assertContains('https://fonts.googleapis.com', $result);
        $this->assertNotContains('https://s.w.org/images/core/emoji/2/svg/', $result);
    }

    public function testDisableEmojisRemoveDnsPrefetchOtherRelationType()
    {
        $urls = ['https://fonts.googleapis.com', 'https://s.w.org/images/core/emoji/2/svg/'];
        $result = $this->service->disableEmojisRemoveDnsPrefetch($urls, 'preconnect');

        // Should return unchanged because relation_type is not dns-prefetch
        $this->assertEquals($urls, $result);
    }

    public function testOptimizeDashiconsWhenNotLoggedIn()
    {
        Monkey\Functions\expect('is_user_logged_in')->andReturn(false);
        Monkey\Functions\expect('wp_deregister_style')->with('dashicons')->once();

        $this->service->optimizeDashicons();
    }

    public function testOptimizeDashiconsWhenLoggedIn()
    {
        Monkey\Functions\expect('is_user_logged_in')->andReturn(true);
        Monkey\Functions\expect('wp_deregister_style')->never();

        $this->service->optimizeDashicons();
    }

    public function testDeferScriptsWithJquery()
    {
        $tag = '<script src="jquery.js"></script>';
        $result = $this->service->deferScripts($tag, 'jquery', 'jquery.js');

        $this->assertEquals($tag, $result);
    }

    public function testDeferScriptsForAdmin()
    {
        Monkey\Functions\expect('is_admin')->andReturn(true);
        
        $tag = '<script src="app.js"></script>';
        $result = $this->service->deferScripts($tag, 'app-scripts', 'app.js');

        $this->assertEquals($tag, $result);
    }

    public function testDeferScriptsForFrontendNotDeferredYet()
    {
        Monkey\Functions\expect('is_admin')->andReturn(false);
        
        $tag = '<script src="app.js"></script>';
        $result = $this->service->deferScripts($tag, 'app-scripts', 'app.js');

        $this->assertStringContainsString('defer="defer"', $result);
    }

    public function testDeferScriptsAlreadyDeferred()
    {
        Monkey\Functions\expect('is_admin')->andReturn(false);
        
        $tag = '<script defer src="app.js"></script>';
        $result = $this->service->deferScripts($tag, 'app-scripts', 'app.js');

        $this->assertEquals($tag, $result); // Should remain unchanged
    }
}
