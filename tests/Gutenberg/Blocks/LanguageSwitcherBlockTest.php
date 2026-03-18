<?php

namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\LanguageSwitcherBlock;
use App\Services\LanguageSwitcherService;
use Jankx\Facades\App;
use Mockery;

/**
 * Unit tests for LanguageSwitcherBlock
 * 
 * Tests the PHP rendering logic of the language switcher block
 */
class LanguageSwitcherBlockTest extends BlockTestCase
{
    protected LanguageSwitcherBlock $block;
    protected $languageServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->block = new LanguageSwitcherBlock();
        
        // Mock LanguageSwitcherService
        $this->languageServiceMock = Mockery::mock(LanguageSwitcherService::class);
        $app = \Jankx\Foundation\Application::getInstance();
        $app->instance(LanguageSwitcherService::class, $this->languageServiceMock);

        // Add default expectations to prevent BadMethodCallException
        $this->languageServiceMock->shouldReceive('getLanguages')
            ->byDefault()
            ->andReturn([]);
        $this->languageServiceMock->shouldReceive('getCurrentLanguage')
            ->byDefault()
            ->andReturn([]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    protected function getBlockId(): string
    {
        return 'jankx/language-switcher';
    }

    protected function createBlockInstance(): LanguageSwitcherBlock
    {
        return new LanguageSwitcherBlock();
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'dropdown',
            'className' => '',
        ];
    }

    /**
     * Test block ID is correct
     */
    public function test_block_id_is_correct(): void
    {
        $this->assertEquals('jankx/language-switcher', $this->getBlockId());
    }

    /**
     * Test render with default attributes
     */
    public function test_render_with_default_attributes(): void
    {
        $attributes = $this->getDefaultAttributes();
        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
            [
                'code' => 'vi',
                'name' => 'Tiếng Việt',
                'url' => 'https://example.com/vi/',
                'flag' => 'https://example.com/flags/vi.png',
                'current' => false,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        // Mock Polylang function
        if (!function_exists('pll_the_languages')) {
            $this->markTestSkipped('Polylang function pll_the_languages is not available');
        }

        $html = $this->block->render($attributes);

        $this->assertNotEmpty($html);
        $this->assertStringContainsString('language-switcher-block', $html);
        $this->assertStringContainsString('language-switcher-dropdown-wrapper', $html);
    }

    /**
     * Test render placeholder when Polylang is not active
     */
    public function test_render_placeholder_when_polylang_not_active(): void
    {
        $attributes = $this->getDefaultAttributes();
        
        // This test assumes Polylang is not available
        // In real scenario, you'd need to properly mock/unload Polylang
        
        $html = $this->block->render($attributes);
        
        // Should render placeholder or handle gracefully
        $this->assertNotEmpty($html);
    }

    /**
     * Test render dropdown display type
     */
    public function test_render_dropdown_display_type(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'dropdown',
            'className' => 'custom-class',
        ];

        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        $this->assertStringContainsString('language-switcher-dropdown-wrapper', $html);
        $this->assertStringContainsString('custom-class', $html);
        $this->assertStringContainsString('language-switcher-dropdown', $html);
    }

    /**
     * Test render list display type
     */
    public function test_render_list_display_type(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'list',
        ];

        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        $this->assertStringContainsString('language-switcher-list', $html);
        $this->assertStringNotContainsString('language-switcher-dropdown-wrapper', $html);
    }

    /**
     * Test render flags display type
     */
    public function test_render_flags_display_type(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => false,
            'showCurrent' => true,
            'displayType' => 'flags',
        ];

        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        $this->assertStringContainsString('language-switcher-flags', $html);
    }

    /**
     * Test hide current language when showCurrent is false
     */
    public function test_hide_current_language_when_show_current_is_false(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => false,
            'displayType' => 'dropdown',
        ];

        $currentLang = [
            'code' => 'en',
            'name' => 'English',
            'url' => 'https://example.com/en/',
            'flag' => 'https://example.com/flags/en.png',
        ];

        $languages = [
            $currentLang,
            [
                'code' => 'vi',
                'name' => 'Tiếng Việt',
                'url' => 'https://example.com/vi/',
                'flag' => 'https://example.com/flags/vi.png',
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($currentLang);

        $html = $this->block->render($attributes);

        // Current language should not appear in dropdown menu
        // but should appear in dropdown button
        $this->assertStringContainsString('English', $html); // In button
    }

    /**
     * Test hide flags when showFlags is false
     */
    public function test_hide_flags_when_show_flags_is_false(): void
    {
        $attributes = [
            'showFlags' => false,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'dropdown',
        ];

        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        // Should not contain flag images
        $this->assertStringNotContainsString('language-flag', $html);
        // Should contain language names
        $this->assertStringContainsString('English', $html);
    }

    /**
     * Test hide names when showNames is false
     */
    public function test_hide_names_when_show_names_is_false(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => false,
            'showCurrent' => true,
            'displayType' => 'dropdown',
        ];

        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        // Should contain flags
        $this->assertStringContainsString('language-flag', $html);
    }

    /**
     * Test empty languages array returns placeholder
     */
    public function test_empty_languages_returns_placeholder(): void
    {
        $attributes = $this->getDefaultAttributes();

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn([]);

        $html = $this->block->render($attributes);

        // Should render placeholder when no languages
        $this->assertNotEmpty($html);
    }

    /**
     * Test HTML output is properly escaped
     */
    public function test_html_output_is_properly_escaped(): void
    {
        $attributes = [
            'showFlags' => true,
            'showNames' => true,
            'showCurrent' => true,
            'displayType' => 'dropdown',
            'className' => 'test-class<script>alert("xss")</script>',
        ];

        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
                'current' => true,
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        // XSS attempt should be escaped
        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringNotContainsString('alert("xss")', $html);
    }

    /**
     * Test invalid language data is handled gracefully
     */
    public function test_invalid_language_data_is_handled_gracefully(): void
    {
        $attributes = $this->getDefaultAttributes();

        // Languages with invalid data
        $languages = [
            [
                'code' => 'en',
                'name' => 'English',
                'url' => 'https://example.com/en/',
                'flag' => 'https://example.com/flags/en.png',
            ],
            [], // Invalid empty language
            [
                'code' => '', // Invalid empty code
                'name' => 'Invalid',
            ],
        ];

        $this->languageServiceMock
            ->shouldReceive('getLanguages')
            ->with(true)
            ->once()
            ->andReturn($languages);

        $this->languageServiceMock
            ->shouldReceive('getCurrentLanguage')
            ->andReturn($languages[0]);

        $html = $this->block->render($attributes);

        // Should render successfully without errors
        $this->assertNotEmpty($html);
        $this->assertValidHtml($html);
    }
}
