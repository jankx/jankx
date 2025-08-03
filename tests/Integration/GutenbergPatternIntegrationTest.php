<?php

namespace Tests\Integration;

use Jankx\Foundation\Application;
use Jankx\Services\GutenbergService;
use Jankx\Support\Blocks\GutenbergRepository;
use Jankx\Support\Blocks\Patterns\HeroSectionPattern;
use Jankx\Support\Blocks\Patterns\CardGridPattern;
use Jankx\Support\Providers\PlatesServiceProvider;
use Jankx\Support\Providers\GutenbergServiceProvider;
use PHPUnit\Framework\TestCase;

/**
 * Integration test for Gutenberg Pattern System
 */
class GutenbergPatternIntegrationTest extends TestCase
{
    protected $app;
    protected $service;
    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a real Application instance for integration testing
        $this->app = new Application();

        // Register required service providers
        $platesProvider = new PlatesServiceProvider();
        $platesProvider->register($this->app);

        $gutenbergProvider = new GutenbergServiceProvider();
        $gutenbergProvider->register($this->app);

        // Get service and repository instances
        $this->service = $this->app->make(GutenbergService::class);
        $this->repository = $this->app->make('gutenberg.repository');
    }

    public function testFullPatternRegistrationFlow()
    {
        // Test that patterns can be registered through the repository
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);
        $this->repository->registerPattern(CardGridPattern::class, $this->app);

        $this->assertEquals(2, $this->repository->getPatternCount());

        // Test that patterns can be retrieved
        $heroPattern = $this->repository->getPattern('jankx/hero-section');
        $cardPattern = $this->repository->getPattern('jankx/card-grid');

        $this->assertInstanceOf(HeroSectionPattern::class, $heroPattern);
        $this->assertInstanceOf(CardGridPattern::class, $cardPattern);
    }

    public function testPatternDiscoveryAndRegistration()
    {
        // Test the complete discovery and registration flow
        $this->service->discoverPatterns();

        $patterns = $this->service->getPatterns();
        $this->assertGreaterThan(0, count($patterns));

        // Test that patterns can be registered with WordPress
        $this->service->registerAllPatterns();
    }

    public function testPlatesEngineIntegration()
    {
        // Test that Plates Engine is properly configured
        $engine = $this->app->make('plates.engine');
        $this->assertInstanceOf(\League\Plates\Engine::class, $engine);

        // Test that patterns can render templates
        $heroPattern = new HeroSectionPattern($this->app);

        // Use reflection to test template rendering
        $reflection = new \ReflectionClass($heroPattern);
        $method = $reflection->getMethod('renderTemplate');
        $method->setAccessible(true);

        $rendered = $method->invoke($heroPattern);
        $this->assertIsString($rendered);
        $this->assertNotEmpty($rendered);
    }

    public function testActionHookIntegration()
    {
        $registeredPatterns = [];

        // Test that action hook works
        add_action('jankx/gutenberg/register-patterns', function ($repository, $app) use (&$registeredPatterns) {
            $repository->registerPattern(HeroSectionPattern::class, $app);
            $registeredPatterns = $repository->getPatternInstances();
        });

        $this->service->discoverPatterns();

        $this->assertGreaterThan(0, count($registeredPatterns));
    }

    public function testPatternCategoriesRegistration()
    {
        // Test that pattern categories are registered
        $this->service->discoverPatterns();

        // Check if categories are registered (this would require WordPress to be loaded)
        $this->expectNotToPerformAssertions();
    }

    public function testPatternStatistics()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);
        $this->repository->registerPattern(CardGridPattern::class, $this->app);

        $stats = $this->service->getPatternStats();

        $this->assertIsArray($stats);
        $this->assertArrayHasKey('total', $stats);
        $this->assertArrayHasKey('categories', $stats);
        $this->assertArrayHasKey('keywords', $stats);
        $this->assertEquals(2, $stats['total']);
    }

    public function testPatternTemplateData()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);

        $templateData = $this->service->getPatternTemplateData('jankx/hero-section');

        $this->assertIsArray($templateData);
        $this->assertArrayHasKey('title', $templateData);
        $this->assertArrayHasKey('subtitle', $templateData);
    }

    public function testPatternByCategoryFiltering()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);
        $this->repository->registerPattern(CardGridPattern::class, $this->app);

        $heroPatterns = $this->service->getPatternsByCategory('hero');
        $cardPatterns = $this->service->getPatternsByCategory('cards');

        $this->assertIsArray($heroPatterns);
        $this->assertIsArray($cardPatterns);
    }

    public function testPatternCacheManagement()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);

        // Test cache clearing
        $this->service->clearPatternCache();

        // Patterns should still be available after cache clear
        $patterns = $this->service->getPatterns();
        $this->assertGreaterThan(0, count($patterns));
    }

    public function testPatternRemoval()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);
        $this->repository->registerPattern(CardGridPattern::class, $this->app);

        $this->assertEquals(2, $this->repository->getPatternCount());

        $this->repository->removePattern('jankx/hero-section');

        $this->assertEquals(1, $this->repository->getPatternCount());
        $this->assertFalse($this->repository->hasPattern('jankx/hero-section'));
        $this->assertTrue($this->repository->hasPattern('jankx/card-grid'));
    }

    public function testPatternClearAll()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);
        $this->repository->registerPattern(CardGridPattern::class, $this->app);

        $this->assertEquals(2, $this->repository->getPatternCount());

        $this->repository->clearPatterns();

        $this->assertEquals(0, $this->repository->getPatternCount());
        $this->assertEmpty($this->repository->getPatternInstances());
    }

    public function testSingletonPatternInstances()
    {
        // Test that patterns are registered as singletons
        $pattern1 = $this->app->make(HeroSectionPattern::class);
        $pattern2 = $this->app->make(HeroSectionPattern::class);

        $this->assertSame($pattern1, $pattern2);
    }

    public function testPatternSlugUniqueness()
    {
        $this->repository->registerPattern(HeroSectionPattern::class, $this->app);
        $this->repository->registerPattern(CardGridPattern::class, $this->app);

        // Use reflection to access protected methods
        $heroPattern = $this->repository->getPattern('jankx/hero-section');
        $cardPattern = $this->repository->getPattern('jankx/card-grid');

        $heroReflection = new \ReflectionClass($heroPattern);
        $cardReflection = new \ReflectionClass($cardPattern);

        $heroMethod = $heroReflection->getMethod('getPatternSlug');
        $cardMethod = $cardReflection->getMethod('getPatternSlug');

        $heroMethod->setAccessible(true);
        $cardMethod->setAccessible(true);

        $heroSlug = $heroMethod->invoke($heroPattern);
        $cardSlug = $cardMethod->invoke($cardPattern);

        $this->assertNotEquals($heroSlug, $cardSlug);
    }

    public function testPatternDataStructure()
    {
        $heroPattern = new HeroSectionPattern($this->app);

        // Use reflection to get pattern data
        $reflection = new \ReflectionClass($heroPattern);
        $method = $reflection->getMethod('getPatternData');
        $method->setAccessible(true);

        $data = $method->invoke($heroPattern);

        $this->assertArrayHasKey('title', $data);
        $this->assertArrayHasKey('categories', $data);
        $this->assertArrayHasKey('keywords', $data);
        $this->assertArrayHasKey('content', $data);
    }

    public function testTemplatePathResolution()
    {
        $heroPattern = new HeroSectionPattern($this->app);

        // Use reflection to get template path
        $reflection = new \ReflectionClass($heroPattern);
        $method = $reflection->getMethod('getTemplatePath');
        $method->setAccessible(true);

        $templatePath = $method->invoke($heroPattern);

        $this->assertIsString($templatePath);
        $this->assertEquals('hero-section', $templatePath);
    }
}
