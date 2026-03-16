<?php

namespace Tests\Extensions;

use PHPUnit\Framework\TestCase;
use Jankx\Extensions\PerUnitExtension;
use Brain\Monkey;
use Jankx\Facades\Config;
use Jankx\Foundation\Application;

class PerUnitExtensionTest extends TestCase
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
        $extension = new PerUnitExtension();

        Monkey\Actions\expectAdded('init')->once();
        Monkey\Actions\expectAdded('add_meta_boxes')->once();
        Monkey\Actions\expectAdded('save_post')->once();

        $extension->register_hooks();
        $this->assertTrue(true);
    }

    public function test_register_per_unit_metabox_adds_metabox_when_enabled()
    {
        $extension = new PerUnitExtension();

        // Mock Config responses
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')->willReturnMap([
            ['per_unit.enabled', null, true],
            ['per_unit.post_types', null, ['product']]
        ]);
        $this->app->singleton('config', function () use ($config) {
            return $config;
        });

        Monkey\Functions\expect('add_meta_box')
            ->once()
            ->with(
                'jankx_per_unit',
                'Per Unit',
                [$extension, 'renderPerUnitMetabox'],
                'product',
                'side',
                'default'
            );

        $extension->registerPerUnitMetabox();
    }

    public function test_save_per_unit_metabox_saves_data()
    {
        $extension = new PerUnitExtension();
        $post_id = 123;

        $_POST['jankx_per_unit_nonce'] = 'test_nonce';
        $_POST['jankx_per_unit_value'] = 'kg';

        Monkey\Functions\expect('wp_verify_nonce')->andReturn(true);
        Monkey\Functions\expect('current_user_can')->andReturn(true);
        Monkey\Functions\expect('sanitize_text_field')->andReturnArg(1);
        Monkey\Functions\expect('update_post_meta')
            ->once()
            ->with($post_id, '_unit', 'kg');

        $extension->savePerUnitMetabox($post_id);

        unset($_POST['jankx_per_unit_nonce']);
        unset($_POST['jankx_per_unit_value']);
    }
}
