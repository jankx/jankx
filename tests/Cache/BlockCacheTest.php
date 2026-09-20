<?php

namespace Tests\Cache;

use Tests\Helpers\TestCase;
use Jankx\Cache\BlockCache;
use Jankx\Cache\CacheManager;
use Jankx\Cache\Drivers\SQLite3Driver;

class BlockCacheTest extends TestCase
{
    private BlockCache $blockCache;
    private static string $testDb;

    public static function setUpBeforeClass(): void
    {
        self::$testDb = sys_get_temp_dir() . '/jankx_test_blocks_' . getmypid() . '.sqlite';
    }

    public static function tearDownAfterClass(): void
    {
        @unlink(self::$testDb);
    }

    protected function setUp(): void
    {
        parent::setUp();
        @unlink(self::$testDb);

        // Reset singletons and create with test driver
        CacheManager::reset();
        BlockCache::reset();

        $driver = new SQLite3Driver(['path' => self::$testDb]);
        CacheManager::createWithDriver($driver, 'blocks_');

        $this->blockCache = BlockCache::instance();
    }

    protected function tearDown(): void
    {
        $this->blockCache->flush();
        CacheManager::reset();
        BlockCache::reset();
        parent::tearDown();
    }

    public function testSingleton(): void
    {
        $a = BlockCache::instance();
        $b = BlockCache::instance();
        $this->assertSame($a, $b);
    }

    public function testInvalidWhenEmpty(): void
    {
        $this->assertFalse($this->blockCache->isValid());
    }

    public function testBuild(): void
    {
        $this->blockCache->build();
        $this->assertIsArray($this->blockCache->getBlockTypes());
    }

    public function testGetBlockTypesDefault(): void
    {
        $this->assertEquals([], $this->blockCache->getBlockTypes());
    }

    public function testGetBlockTypeNotFound(): void
    {
        $this->assertNull($this->blockCache->getBlockType('nonexistent/block'));
    }

    public function testSaveAndGetBlockType(): void
    {
        $data = [
            'name' => 'test/block',
            'title' => 'Test Block',
            'category' => 'text',
        ];

        $this->assertTrue($this->blockCache->saveBlockType('test/block', $data));
        $this->assertEquals($data, $this->blockCache->getBlockType('test/block'));
    }

    public function testDeleteBlockType(): void
    {
        $this->blockCache->saveBlockType('to/delete', ['name' => 'to/delete']);
        $this->assertTrue($this->blockCache->deleteBlockType('to/delete'));
        $this->assertNull($this->blockCache->getBlockType('to/delete'));
    }

    public function testGetPatternsDefault(): void
    {
        $this->assertEquals([], $this->blockCache->getPatterns());
    }

    public function testGetCategoriesDefault(): void
    {
        $this->assertEquals([], $this->blockCache->getCategories());
    }

    public function testInvalidate(): void
    {
        $this->blockCache->build();
        $this->assertTrue($this->blockCache->isValid());
        $this->assertTrue($this->blockCache->invalidate());
        $this->assertFalse($this->blockCache->isValid());
    }

    public function testFlush(): void
    {
        $this->blockCache->build();
        $this->assertTrue($this->blockCache->flush());
        $this->assertFalse($this->blockCache->isValid());
    }

    public function testStats(): void
    {
        $this->blockCache->build();
        $stats = $this->blockCache->stats();

        $this->assertArrayHasKey('driver', $stats);
        $this->assertArrayHasKey('block_count', $stats);
        $this->assertArrayHasKey('pattern_count', $stats);
        $this->assertArrayHasKey('category_count', $stats);
        $this->assertArrayHasKey('is_valid', $stats);
        $this->assertArrayHasKey('last_build', $stats);
        $this->assertArrayHasKey('last_build_human', $stats);
        $this->assertArrayHasKey('cache_version', $stats);
    }

    public function testMultipleBlockTypes(): void
    {
        $blocks = [
            'core/paragraph' => ['name' => 'core/paragraph', 'title' => 'Paragraph'],
            'core/image' => ['name' => 'core/image', 'title' => 'Image'],
            'core/heading' => ['name' => 'core/heading', 'title' => 'Heading'],
        ];

        foreach ($blocks as $name => $data) {
            $this->blockCache->saveBlockType($name, $data);
        }

        $all = $this->blockCache->getBlockTypes();
        $this->assertCount(3, $all);
        $this->assertEquals('Paragraph', $all['core/paragraph']['title']);
        $this->assertEquals('Image', $all['core/image']['title']);
    }
}
