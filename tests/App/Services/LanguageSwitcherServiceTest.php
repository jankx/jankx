<?php

namespace Tests\App\Services;

use App\Services\LanguageSwitcherService;
use Jankx\Foundation\Application;
use Tests\Helpers\TestCase;

class LanguageSwitcherServiceTest extends TestCase
{
    protected $app;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();
        $this->service = new LanguageSwitcherService($this->app);
    }

    public function testInitLanguages()
    {
        $GLOBALS['mock_pll_current_language'] = 'vi';
        $GLOBALS['mock_pll_languages'] = [
            [
                'slug' => 'vi',
                'name' => 'Tiếng Việt',
                'url' => 'http://example.com/vi/',
                'flag' => '<img src="vi.png">',
                'current_lang' => true
            ],
            [
                'slug' => 'en',
                'name' => 'English',
                'url' => 'http://example.com/en/',
                'flag' => '<img src="en.png">',
                'current_lang' => false
            ]
        ];

        $this->service->initialize(); // Triggers boot -> initLanguages
        
        $languages = $this->service->getLanguages();
        $this->assertCount(2, $languages);
        $this->assertEquals('vi', $languages[0]['code']);
        $this->assertEquals('vi.png', $languages[0]['flag']);
        $this->assertTrue($languages[0]['current']);
        
        $current = $this->service->getCurrentLanguage();
        $this->assertEquals('vi', $current['code']);
    }

    public function testExtractFlagSrc()
    {
        $html = '<img src="https://example.com/flag.png" alt="flag">';
        $this->assertEquals('https://example.com/flag.png', $this->service->extractFlagSrc($html));
        
        $html = "<img src='https://example.com/flag.jpg'>";
        $this->assertEquals('https://example.com/flag.jpg', $this->service->extractFlagSrc($html));
        
        $this->assertEquals('', $this->service->extractFlagSrc('no src here'));
    }

    public function testGetName()
    {
        $this->assertEquals('language-switcher', $this->service->getName());
    }
}
