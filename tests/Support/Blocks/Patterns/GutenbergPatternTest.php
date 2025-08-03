<?php

namespace Tests\Support\Blocks\Patterns;

use Jankx\Foundation\Application;
use Jankx\Support\Blocks\Patterns\GutenbergPattern;
use Jankx\Support\Blocks\Patterns\HeroSectionPattern;
use Jankx\Support\Blocks\Patterns\CardGridPattern;
use Jankx\Facades\Log;
use PHPUnit\Framework\TestCase;

/**
 * Test GutenbergPattern abstract class
 */
class GutenbergPatternTest extends TestCase
{
    protected $app;
    protected $pattern;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock Application
        $this->app = $this->createMock(Application::class);

        // Create a concrete pattern instance for testing
        $this->pattern = new HeroSectionPattern($this->app);
    }

    public function testPatternInstanceCreation()
    {
        $this->assertInstanceOf(GutenbergPattern::class, $this->pattern);
        $this->assertInstanceOf(HeroSectionPattern::class, $this->pattern);
    }

    public function testGetPatternSlug()
    {
        $reflection = new \ReflectionClass($this->pattern);
        $method = $reflection->getMethod('getPatternSlug');
        $method->setAccessible(true);

        $slug = $method->invoke($this->pattern);

        $this->assertIsString($slug);
        $this->assertNotEmpty($slug);
        $this->assertEquals('jankx/hero-section', $slug);
    }

    public function testGetPatternData()
    {
        $reflection = new \ReflectionClass($this->pattern);
        $method = $reflection->getMethod('getPatternData');
        $method->setAccessible(true);

        $data = $method->invoke($this->pattern);

        $this->assertIsArray($data);
        $this->assertArrayHasKey('title', $data);
        $this->assertArrayHasKey('categories', $data);
        $this->assertArrayHasKey('keywords', $data);
        $this->assertEquals('Hero Section - Modern', $data['title']);
    }

    public function testGetTemplatePath()
    {
        $reflection = new \ReflectionClass($this->pattern);
        $method = $reflection->getMethod('getTemplatePath');
        $method->setAccessible(true);

        $templatePath = $method->invoke($this->pattern);

        $this->assertIsString($templatePath);
        $this->assertEquals('hero-section', $templatePath);
    }

    public function testGetTemplateData()
    {
        $reflection = new \ReflectionClass($this->pattern);
        $method = $reflection->getMethod('getTemplateData');
        $method->setAccessible(true);

        $templateData = $method->invoke($this->pattern);

        $this->assertIsArray($templateData);
        $this->assertArrayHasKey('title', $templateData);
        $this->assertArrayHasKey('subtitle', $templateData);
    }

    public function testRenderTemplate()
    {
        // Mock Plates Engine
        $mockEngine = $this->createMock(\League\Plates\Engine::class);
        $mockEngine->method('render')
            ->willReturn('<div class="hero-section">Test Content</div>');

        // Mock Application to return our mock engine
        $this->app->method('make')
            ->with('plates.engine')
            ->willReturn($mockEngine);

        $reflection = new \ReflectionClass($this->pattern);
        $method = $reflection->getMethod('renderTemplate');
        $method->setAccessible(true);

        $rendered = $method->invoke($this->pattern);

        $this->assertIsString($rendered);
        $this->assertStringContainsString('hero-section', $rendered);
    }

    public function testRegisterPattern()
    {
        // Mock WordPress function
        if (!function_exists('register_block_pattern')) {
            function register_block_pattern($slug, $args)
            {
                return true;
            }
        }

        $this->expectNotToPerformAssertions();
        $this->pattern->register();
    }

    public function testCardGridPattern()
    {
        $cardPattern = new CardGridPattern($this->app);

        $this->assertInstanceOf(GutenbergPattern::class, $cardPattern);
        $this->assertInstanceOf(CardGridPattern::class, $cardPattern);

        $reflection = new \ReflectionClass($cardPattern);
        $method = $reflection->getMethod('getPatternSlug');
        $method->setAccessible(true);

        $slug = $method->invoke($cardPattern);
        $this->assertEquals('jankx/card-grid', $slug);
    }
}
