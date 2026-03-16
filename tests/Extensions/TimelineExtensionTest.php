<?php

namespace Tests\Extensions;

use PHPUnit\Framework\TestCase;
use Jankx\Extensions\TimelineExtension;
use Brain\Monkey;
use Jankx\Facades\Config;
use Jankx\Foundation\Application;

class TimelineExtensionTest extends TestCase
{
    protected $app;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();

        $this->app = new Application();
        Config::setFacadeApplication($this->app);
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function test_register_hooks_adds_actions()
    {
        $extension = new TimelineExtension();

        Monkey\Actions\expectAdded('init')->once();
        Monkey\Actions\expectAdded('add_meta_boxes')->once();
        Monkey\Actions\expectAdded('save_post')->once();
        Monkey\Actions\expectAdded('admin_enqueue_scripts')->once();

        $extension->register_hooks();
        $this->assertTrue(true);
    }

    public function test_register_timeline_metabox_adds_metabox_when_enabled()
    {
        $extension = new TimelineExtension();

        // Mock Config responses
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')->willReturnMap([
            ['timeline.enabled', null, true],
            ['timeline.post_types', null, ['post']]
        ]);
        $this->app->singleton('config', function () use ($config) {
            return $config;
        });

        Monkey\Functions\expect('add_meta_box')
            ->once()
            ->with(
                'jankx_timeline',
                'Timeline',
                [$extension, 'renderTimelineMetabox'],
                'post',
                'normal',
                'high'
            );

        $extension->registerTimelineMetabox();
    }

    public function test_enqueue_timeline_assets_enqueues_styles_and_scripts()
    {
        $extension = $this->getMockBuilder(TimelineExtension::class)
            ->onlyMethods(['get_extension_url'])
            ->getMock();
        
        $extension->method('get_extension_url')->willReturn('http://example.com/extension');

        // Mock Config
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')->willReturnMap([
            ['timeline.enabled', null, true],
            ['timeline.post_types', null, ['post']],
            ['timeline.image_enabled', null, true]
        ]);
        $this->app->singleton('config', function () use ($config) {
            return $config;
        });

        // Mock get_current_screen
        Monkey\Functions\expect('get_current_screen')->andReturn((object)['post_type' => 'post']);
        Monkey\Functions\expect('wp_enqueue_media')->once();
        Monkey\Functions\expect('wp_enqueue_style')->once()->with(
            'jankx-timeline-admin',
            'http://example.com/extension/block/assets/admin/css/admin.css',
            [],
            '1.0.0'
        );
        Monkey\Functions\expect('wp_enqueue_script')->once()->with(
            'jankx-timeline-admin',
            'http://example.com/extension/block/assets/admin/js/admin.js',
            ['jquery'],
            '1.0.0',
            true
        );

        $extension->enqueueTimelineAssets();
    }
}
