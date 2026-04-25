<?php
namespace Jankx\Extensions\GutenbergFileSync\Tests\Handlers;

use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;
use Jankx\Extensions\GutenbergFileSync\Handlers\RestApiHandler;
use WP_Post;

class RestApiHandlerTest extends TestCase
{
    protected $tempDir;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
        
        // Create a temporary directory for file sync tests
        $this->tempDir = sys_get_temp_dir() . '/jankx_sync_test_' . uniqid();
        mkdir($this->tempDir);
        mkdir($this->tempDir . '/templates');
        mkdir($this->tempDir . '/parts');
    }

    protected function tearDown(): void
    {
        // Cleanup temp directory
        $this->recursiveDelete($this->tempDir);
        Monkey\tearDown();
        parent::tearDown();
    }

    protected function recursiveDelete($dir) {
        if (!is_dir($dir)) return;
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? $this->recursiveDelete("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    public function test_sync_template_to_file()
    {
        $handler = new RestApiHandler();

        // Prepare mock data
        $post = new WP_Post([
            'ID' => 123,
            'post_type' => 'wp_template',
            'post_name' => 'single-custom',
            'post_content' => '<!-- wp:paragraph --><p>Hello World</p><!-- /wp:paragraph -->'
        ]);

        // Mock WP functions
        Functions\when('get_stylesheet_directory')->justReturn($this->tempDir);
        Functions\expect('wp_delete_post')
            ->once()
            ->with(123, true);

        // Execute handler
        $handler->sync_template_to_file($post, null, false);

        // Assertions
        $expectedFilePath = $this->tempDir . '/templates/single-custom.html';
        $this->assertFileExists($expectedFilePath);
        $this->assertEquals($post->post_content, file_get_contents($expectedFilePath));
    }

    public function test_sync_template_part_to_file()
    {
        $handler = new RestApiHandler();

        // Prepare mock data
        $post = new WP_Post([
            'ID' => 456,
            'post_type' => 'wp_template_part',
            'post_name' => 'header-custom',
            'post_content' => '<header>My Header</header>'
        ]);

        // Mock WP functions
        Functions\when('get_stylesheet_directory')->justReturn($this->tempDir);
        Functions\expect('wp_delete_post')
            ->once()
            ->with(456, true);

        // Execute handler
        $handler->sync_template_to_file($post, null, false);

        // Assertions
        $expectedFilePath = $this->tempDir . '/parts/header-custom.html';
        $this->assertFileExists($expectedFilePath);
        $this->assertEquals($post->post_content, file_get_contents($expectedFilePath));
    }
}
