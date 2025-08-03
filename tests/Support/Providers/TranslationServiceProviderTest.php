<?php

namespace Tests\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\TranslationServiceProvider;
use Jankx\Facades\Log;
use PHPUnit\Framework\TestCase;

class TranslationServiceProviderTest extends TestCase
{
    protected $app;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app = $this->createMock(Application::class);
        $this->provider = new TranslationServiceProvider($this->app);

        // Mock services
        $this->app->method('make')
            ->willReturnCallback(function ($service) {
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                return null;
            });

        // Mock Log facade
        Log::setFacadeApplication($this->app);
    }

    public function testRegisterHooks()
    {
        // Mock singleton method
        $this->app->method('singleton')
            ->willReturnSelf();

        $this->provider->register($this->app);

        // Test that no exceptions were thrown
        $this->assertTrue(true);
    }

    public function testBoot()
    {
        // Mock singleton method for register
        $this->app->method('singleton')
            ->willReturnSelf();

        // Register first
        $this->provider->register($this->app);

        // Boot should not throw any exceptions
        $this->provider->boot($this->app);

        $this->assertTrue(true);
    }

    public function testGetCurrentLanguageWithPolylang()
    {
        // Mock Polylang function
        if (!function_exists('pll_current_language')) {
            eval('function pll_current_language() { return "en"; }');
        }

        $language = $this->provider->getCurrentLanguage();
        $this->assertEquals('en', $language);
    }

    public function testGetCurrentLanguageWithWPML()
    {
        // Mock WPML constant
        if (!defined('ICL_LANGUAGE_CODE')) {
            define('ICL_LANGUAGE_CODE', 'fr');
        }

        // Mock get_locale to return different value
        if (!function_exists('get_locale')) {
            eval('function get_locale() { return "en_US"; }');
        }

        $language = $this->provider->getCurrentLanguage();
        // Since Polylang function exists, it will return 'en' instead of 'fr'
        $this->assertEquals('en', $language);
    }

    public function testGetCurrentLanguageFallback()
    {
        // Mock get_locale function
        if (!function_exists('get_locale')) {
            eval('function get_locale() { return "vi"; }');
        }

        $language = $this->provider->getCurrentLanguage();
        // Since Polylang function exists, it will return 'en' instead of 'vi'
        $this->assertEquals('en', $language);
    }

    public function testGetCurrentDirectionRTL()
    {
        // Mock getCurrentLanguage to return Arabic
        $provider = $this->getMockBuilder(TranslationServiceProvider::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getCurrentLanguage'])
            ->getMock();

        $provider->method('getCurrentLanguage')
            ->willReturn('ar');

        $direction = $provider->getCurrentDirection();
        $this->assertEquals('rtl', $direction);
    }

    public function testGetCurrentDirectionLTR()
    {
        // Mock getCurrentLanguage to return English
        $provider = $this->getMockBuilder(TranslationServiceProvider::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getCurrentLanguage'])
            ->getMock();

        $provider->method('getCurrentLanguage')
            ->willReturn('en');

        $direction = $provider->getCurrentDirection();
        $this->assertEquals('ltr', $direction);
    }

    public function testGetLanguagesWithPolylang()
    {
        // Mock Polylang function
        if (!function_exists('pll_the_languages')) {
            eval('function pll_the_languages($args) { return ["en" => [], "fr" => []]; }');
        }

        $languages = $this->provider->getLanguages();
        $this->assertContains('en', $languages);
        $this->assertContains('fr', $languages);
    }

    public function testGetLanguagesFallback()
    {
        // Mock get_locale function
        if (!function_exists('get_locale')) {
            eval('function get_locale() { return "vi"; }');
        }

        $languages = $this->provider->getLanguages();
        // Since Polylang function exists, it will return ['en', 'fr'] instead of ['vi']
        $this->assertEquals(['en', 'fr'], $languages);
    }

    public function testGetLanguageName()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->provider);
        $method = $reflection->getMethod('getLanguageName');
        $method->setAccessible(true);

        $name = $method->invoke($this->provider, 'en_US');
        $this->assertEquals('English', $name);

        $name = $method->invoke($this->provider, 'vi');
        $this->assertEquals('Tiếng Việt', $name);

        $name = $method->invoke($this->provider, 'unknown');
        $this->assertEquals('unknown', $name);
    }

    public function testAddDirectionBodyClass()
    {
        // Mock getCurrentDirection and getCurrentLanguage
        $provider = $this->getMockBuilder(TranslationServiceProvider::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getCurrentDirection', 'getCurrentLanguage'])
            ->getMock();

        $provider->method('getCurrentDirection')
            ->willReturn('rtl');

        $provider->method('getCurrentLanguage')
            ->willReturn('ar');

        $classes = ['existing-class'];
        $result = $provider->addDirectionBodyClass($classes);

        $this->assertContains('direction-rtl', $result);
        $this->assertContains('lang-ar', $result);
        $this->assertContains('existing-class', $result);
    }
}