<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\BlockIntegrationTestCase;
use Jankx\Gutenberg\Blocks\LanguageSwitcherBlock;

/**
 * Integration tests for LanguageSwitcherBlock
 * 
 * Tests block in real WordPress environment
 */
class LanguageSwitcherBlockIntegrationTest extends BlockIntegrationTestCase
{
    protected LanguageSwitcherBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock Application for Facade
        $app = \Mockery::mock(\Jankx\Foundation\Application::class);
        $service = \Mockery::mock(\App\Services\LanguageSwitcherService::class);
        $service->shouldReceive('getLanguages')->andReturn([
            ['code' => 'en', 'name' => 'English', 'url' => '#en', 'flag' => 'en.png'],
            ['code' => 'vi', 'name' => 'Vietnamese', 'url' => '#vi', 'flag' => 'vi.png'],
        ])->byDefault();
        $service->shouldReceive('getCurrentLanguage')->andReturn([
            'code' => 'en', 'name' => 'English', 'url' => '#en', 'flag' => 'en.png'
        ])->byDefault();
        
        $app->shouldReceive('make')->andReturnUsing(function($abstract) use ($app, $service) {
            if ($abstract === 'app' || $abstract === \Jankx\Foundation\Application::class) {
                return $app;
            }
            if ($abstract === \App\Services\LanguageSwitcherService::class) {
                return $service;
            }
            return null;
        })->byDefault();
        
        \Jankx\Facades\App::setFacadeApplication($app);
        
        $this->block = new LanguageSwitcherBlock('/fake/path');
        register_block_type('jankx/language-switcher', [
            'render_callback' => [$this->block, 'render']
        ]);
    }

    protected function tearDown(): void
    {
        \Mockery::close();
        parent::tearDown();
    }

    /**
     * Test block is registered in WordPress
     */
    public function test_block_is_registered(): void
    {
        $this->assertBlockIsRegistered('jankx/language-switcher');
    }

    /**
     * Test block renders in post content
     */
    public function test_block_renders_in_post_content(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'dropdown',
        ];

        $this->assertBlockRenders('jankx/language-switcher', $attributes);
    }

    /**
     * Test block can be inserted into post
     */
    public function test_block_can_be_inserted_into_post(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'displayType' => 'list',
        ];

        $postId = $this->createPostWithBlock('jankx/language-switcher', $attributes);
        $this->assertGreaterThan(0, $postId);

        $html = $this->extractBlockFromPost($postId, 'jankx/language-switcher');
        $this->assertNotNull($html);
        $this->assertNotEmpty($html);
        $this->assertStringContainsString('language-switcher-block', $html);

        // Cleanup
        wp_delete_post($postId, true);
    }
}
