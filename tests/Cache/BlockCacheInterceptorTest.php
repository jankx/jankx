<?php

namespace Tests\Cache;

use Tests\Helpers\TestCase;
use Jankx\Cache\BlockCacheInterceptor;
use Jankx\Cache\BlockCache;
use Jankx\Cache\CacheManager;
use Jankx\Cache\Drivers\SQLite3Driver;

class BlockCacheInterceptorTest extends TestCase
{
    private BlockCacheInterceptor $interceptor;
    private static string $testDb;

    public static function setUpBeforeClass(): void
    {
        self::$testDb = sys_get_temp_dir() . '/jankx_test_interceptor_' . getmypid() . '.sqlite';
    }

    public static function tearDownAfterClass(): void
    {
        @unlink(self::$testDb);
    }

    protected function setUp(): void
    {
        parent::setUp();
        @unlink(self::$testDb);

        CacheManager::reset();
        BlockCache::reset();

        $driver = new SQLite3Driver(['path' => self::$testDb]);
        CacheManager::createWithDriver($driver, 'blocks_');

        $this->interceptor = new BlockCacheInterceptor();
    }

    protected function tearDown(): void
    {
        CacheManager::reset();
        BlockCache::reset();
        parent::tearDown();
    }

    /**
     * Mark cache as valid by setting version and last_build
     */
    private function makeCacheValid(): void
    {
        $cache = CacheManager::instance();
        $cache->set('version', '2.0.0');
        $cache->set('last_build', time());
    }

    public function testInterceptRequestReturnsOriginalWhenCacheInvalid(): void
    {
        $request = new \WP_REST_Request('GET', '/wp/v2/block-types');
        $original = ['data' => 'original'];

        $result = $this->interceptor->interceptRequest($original, $request, '/wp/v2/block-types');
        $this->assertEquals($original, $result);
    }

    public function testInterceptRequestReturnsCachedBlockTypes(): void
    {
        $this->makeCacheValid();

        $blockCache = BlockCache::instance();
        $blockCache->saveBlockType('core/paragraph', [
            'name' => 'core/paragraph',
            'title' => 'Paragraph',
            'category' => 'text',
        ]);

        $request = new \WP_REST_Request('GET', '/wp/v2/block-types');

        $result = $this->interceptor->interceptRequest(null, $request, '/wp/v2/block-types');
        $this->assertInstanceOf(\WP_REST_Response::class, $result);
    }

    public function testInterceptRequestReturnsCachedPatterns(): void
    {
        $this->makeCacheValid();

        $request = new \WP_REST_Request('GET', '/wp/v2/block-patterns/patterns');
        $result = $this->interceptor->interceptRequest(null, $request, '/wp/v2/block-patterns/patterns');
        $this->assertInstanceOf(\WP_REST_Response::class, $result);
    }

    public function testInterceptRequestReturnsCachedCategories(): void
    {
        $this->makeCacheValid();

        $request = new \WP_REST_Request('GET', '/wp/v2/block-patterns/categories');
        $result = $this->interceptor->interceptRequest(null, $request, '/wp/v2/block-patterns/categories');
        $this->assertInstanceOf(\WP_REST_Response::class, $result);
    }

    public function testFilterByContextView(): void
    {
        $reflection = new \ReflectionClass($this->interceptor);
        $method = $reflection->getMethod('filterByContext');
        $method->setAccessible(true);

        $data = [
            'name' => 'core/paragraph',
            'editor_script_handles' => ['wp-blocks'],
            'editor_style_handles' => ['wp-blocks'],
            'title' => 'Paragraph',
        ];

        $result = $method->invoke($this->interceptor, $data, 'view');
        $this->assertArrayNotHasKey('editor_script_handles', $result);
        $this->assertArrayNotHasKey('editor_style_handles', $result);
        $this->assertEquals('Paragraph', $result['title']);
    }

    public function testFilterByContextEdit(): void
    {
        $reflection = new \ReflectionClass($this->interceptor);
        $method = $reflection->getMethod('filterByContext');
        $method->setAccessible(true);

        $data = [
            'name' => 'core/paragraph',
            'editor_script_handles' => ['wp-blocks'],
            'editor_style_handles' => ['wp-blocks'],
            'title' => 'Paragraph',
        ];

        $result = $method->invoke($this->interceptor, $data, 'edit');
        $this->assertArrayHasKey('editor_script_handles', $result);
        $this->assertArrayHasKey('editor_style_handles', $result);
    }

    public function testAddPreloadPaths(): void
    {
        $this->makeCacheValid();

        $blockCache = BlockCache::instance();
        $blockCache->saveBlockType('test/block', ['name' => 'test/block']);

        $paths = ['/wp/v2/block-types'];
        $context = new \WP_Block_Editor_Context();
        $result = $this->interceptor->addPreloadPaths($paths, $context);

        $this->assertContains('/wp/v2/block-types?context=edit', $result);
        $this->assertContains('/wp/v2/block-patterns/patterns', $result);
        $this->assertContains('/wp/v2/block-patterns/categories', $result);
        $this->assertContains('/wp/v2/block-types', $result);
    }

    public function testAddPreloadPathsWhenInvalid(): void
    {
        $paths = ['/wp/v2/block-types'];
        $context = new \WP_Block_Editor_Context();
        $result = $this->interceptor->addPreloadPaths($paths, $context);
        $this->assertEquals($paths, $result);
    }

    public function testInvalidate(): void
    {
        $this->makeCacheValid();
        $blockCache = BlockCache::instance();
        $this->assertTrue($blockCache->isValid());

        $this->interceptor->invalidate();
        $this->assertFalse($blockCache->isValid());
    }

    public function testInterceptRequestReturnsOriginalForUnknownRoute(): void
    {
        $this->makeCacheValid();
        $blockCache = BlockCache::instance();
        $this->assertTrue($blockCache->isValid());

        $request = new \WP_REST_Request('GET', '/wp/v2/posts');
        $original = ['data' => 'original'];

        $result = $this->interceptor->interceptRequest($original, $request, '/wp/v2/posts');
        $this->assertEquals($original, $result);
    }
}
