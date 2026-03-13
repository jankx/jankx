<?php

namespace Tests\Features\ContentTemplates\Services;

use Jankx\Features\ContentTemplates\Services\ContentTemplateService;
use Tests\Helpers\TestCase;
use Jankx\Multilingual\MultilingualFactory;
use Jankx\Multilingual\MultilingualInterface;

class ContentTemplateServiceTest extends TestCase
{
    protected $service;
    protected $tempDir;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ContentTemplateService();
        $this->tempDir = sys_get_temp_dir() . '/jankx_test_' . uniqid();
        mkdir($this->tempDir, 0777, true);
        
        // Setup mock theme directories
        $GLOBALS['test_parent_theme_path'] = $this->tempDir . '/parent';
        $GLOBALS['test_child_theme_path'] = $this->tempDir . '/child';
        
        mkdir($this->tempDir . '/parent/resources/content-templates', 0777, true);
        mkdir($this->tempDir . '/child/resources/content-templates', 0777, true);
        
        $GLOBALS['mock_is_child_theme'] = true;
        
        MultilingualFactory::reset();
    }

    protected function tearDown(): void
    {
        $this->removeDir($this->tempDir);
        unset($GLOBALS['test_parent_theme_path']);
        unset($GLOBALS['test_child_theme_path']);
        unset($GLOBALS['mock_is_child_theme']);
        MultilingualFactory::reset();
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

    public function testFilterDefaultContentLoadsFromParent()
    {
        file_put_contents($this->tempDir . '/parent/resources/content-templates/post.html', 'parent content');
        
        $post = (object)['post_type' => 'post'];
        $content = $this->service->filterDefaultContent('', $post);
        
        $this->assertEquals('parent content', $content);
    }

    public function testFilterDefaultContentLoadsFromChild()
    {
        file_put_contents($this->tempDir . '/parent/resources/content-templates/post.html', 'parent content');
        file_put_contents($this->tempDir . '/child/resources/content-templates/post.html', 'child content');
        
        $post = (object)['post_type' => 'post'];
        $content = $this->service->filterDefaultContent('', $post);
        
        $this->assertEquals('child content', $content);
    }

    public function testFilterDefaultContentMultilingual()
    {
        // Mock multilingual adapter
        $adapter = $this->getMockBuilder(MultilingualInterface::class)->getMock();
        $adapter->method('isActive')->willReturn(true);
        $adapter->method('getCurrentLanguage')->willReturn('vi');
        
        // Use reflection to set private static adapter
        $reflection = new \ReflectionClass(MultilingualFactory::class);
        $property = $reflection->getProperty('adapter');
        $property->setAccessible(true);
        $property->setValue(null, $adapter);

        file_put_contents($this->tempDir . '/parent/resources/content-templates/post-vi.html', 'vi content');
        file_put_contents($this->tempDir . '/parent/resources/content-templates/post.html', 'default content');
        
        $post = (object)['post_type' => 'post'];
        $content = $this->service->filterDefaultContent('', $post);
        
        $this->assertEquals('vi content', $content);
    }

    public function testSetDefaultContent()
    {
        file_put_contents($this->tempDir . '/parent/resources/content-templates/post.html', 'template content');
        
        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'auto-draft',
            'post_content' => ''
        ];
        
        global $wpdb;
        $wpdb = $this->getMockBuilder(\stdClass::class)
                     ->addMethods(['update'])
                     ->getMock();
        $wpdb->posts = 'wp_posts';
        
        $wpdb->expects($this->once())
             ->method('update')
             ->with(
                 'wp_posts',
                 ['post_content' => 'template content'],
                 ['ID' => 123],
                 ['%s'],
                 ['%d']
             );

        $this->service->setDefaultContent(123, $post, false);
    }

    public function testSetDefaultContentSkippedIfUpdate()
    {
        $post = (object)['post_type' => 'post'];
        
        global $wpdb;
        $wpdb = $this->getMockBuilder(\stdClass::class)->addMethods(['update'])->getMock();
        $wpdb->expects($this->never())->method('update');

        $this->service->setDefaultContent(123, $post, true);
    }
}
