<?php

namespace Tests\App\Services;

use App\Services\ThemeOptionsService;
use Jankx\Foundation\Application;
use Jankx\Facades\Facade;
use Tests\Helpers\TestCase;

class ThemeOptionsServiceTest extends TestCase
{
    protected $app;
    protected $service;
    protected $tempDir;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();

        // Set facade root for Config to work
        Facade::setFacadeApplication($this->app);

        $this->tempDir = sys_get_temp_dir() . '/jankx_theme_options_' . uniqid();
        mkdir($this->tempDir, 0777, true);
        $GLOBALS['test_child_theme_path'] = $this->tempDir;

        // Create mock options directory
        mkdir($this->tempDir . '/resources/options/page1', 0777, true);
        file_put_contents($this->tempDir . '/resources/options/pages.php', '<?php return [["id" => "page1", "title" => "Page 1"]];');
        file_put_contents($this->tempDir . '/resources/options/page1/section1.php', '<?php return ["id" => "section1", "title" => "Section 1"];');

        $this->service = new ThemeOptionsService($this->app);
    }

    protected function tearDown(): void
    {
        $this->removeDir($this->tempDir);
        unset($GLOBALS['test_child_theme_path']);
        parent::tearDown();
    }

    private function removeDir($dir) {
        if (!is_dir($dir)) return;
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? $this->removeDir("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    public function testLoadOptionsData()
    {
        $data = $this->service->getOptionsData();
        
        $this->assertArrayHasKey('pages', $data);
        $this->assertCount(1, $data['pages']);
        $this->assertEquals('page1', $data['pages'][0]['id']);
        
        $this->assertArrayHasKey('sections', $data);
        $this->assertArrayHasKey('page1', $data['sections']);
        $this->assertArrayHasKey('section1', $data['sections']['page1']);
        $this->assertEquals('section1', $data['sections']['page1']['section1']['id']);
    }

    public function testGetMenuArgs()
    {
        $args = $this->service->getMenuArgs();
        $this->assertEquals('bookix_theme_options', $args['opt_name']);
        $this->assertEquals('jankx-theme-options', $args['page_slug']);
    }

    public function testGetName()
    {
        $this->assertEquals('theme-options', $this->service->getName());
    }
}
