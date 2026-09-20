<?php

namespace Tests\Cache;

use Tests\Helpers\TestCase;
use Jankx\Cache\CacheManager;
use Jankx\Cache\Drivers\SQLite3Driver;

class CacheManagerTest extends TestCase
{
    private CacheManager $manager;
    private static string $testDb;

    public static function setUpBeforeClass(): void
    {
        self::$testDb = sys_get_temp_dir() . '/jankx_test_manager_' . getmypid() . '.sqlite';
    }

    public static function tearDownAfterClass(): void
    {
        @unlink(self::$testDb);
    }

    protected function setUp(): void
    {
        parent::setUp();
        @unlink(self::$testDb);
        $driver = new SQLite3Driver(['path' => self::$testDb]);
        $this->manager = CacheManager::createWithDriver($driver);
    }

    protected function tearDown(): void
    {
        $this->manager->flush();
        CacheManager::reset();
        parent::tearDown();
    }

    public function testSingleton(): void
    {
        $a = CacheManager::instance();
        $b = CacheManager::instance();
        $this->assertSame($a, $b);
    }

    public function testGetDriver(): void
    {
        $this->assertInstanceOf(SQLite3Driver::class, $this->manager->getDriver());
    }

    public function testSetAndGet(): void
    {
        $this->assertTrue($this->manager->set('mykey', 'myvalue'));
        $this->assertEquals('myvalue', $this->manager->get('mykey'));
    }

    public function testGetDefault(): void
    {
        $this->assertEquals('fallback', $this->manager->get('missing', 'fallback'));
    }

    public function testDelete(): void
    {
        $this->manager->set('del', 1);
        $this->assertTrue($this->manager->delete('del'));
        $this->assertFalse($this->manager->has('del'));
    }

    public function testHas(): void
    {
        $this->assertFalse($this->manager->has('nope'));
        $this->manager->set('yep', 1);
        $this->assertTrue($this->manager->has('yep'));
    }

    public function testSetManyAndGetMany(): void
    {
        $this->assertTrue($this->manager->setMany(['a' => 1, 'b' => 2, 'c' => 3]));
        $result = $this->manager->getMany(['a', 'b', 'c']);
        $this->assertEquals(1, $result['a']);
        $this->assertEquals(2, $result['b']);
        $this->assertEquals(3, $result['c']);
    }

    public function testDeleteMany(): void
    {
        $this->manager->set('x', 1);
        $this->manager->set('y', 2);
        $this->assertTrue($this->manager->deleteMany(['x', 'y']));
        $this->assertFalse($this->manager->has('x'));
        $this->assertFalse($this->manager->has('y'));
    }

    public function testFlush(): void
    {
        $this->manager->set('z', 1);
        $this->assertTrue($this->manager->flush());
        $this->assertFalse($this->manager->has('z'));
    }

    public function testSetPrefix(): void
    {
        $this->manager->setPrefix('custom_');
        $this->manager->set('test', 'val');
        $driver = $this->manager->getDriver();
        $this->assertTrue($driver->has('custom_test'));
        $this->assertFalse($driver->has('test'));
    }

    public function testStats(): void
    {
        $stats = $this->manager->stats();
        $this->assertArrayHasKey('driver', $stats);
    }

    public function testTtl(): void
    {
        $this->assertTrue($this->manager->set('short', 'val', 60));
        $this->assertEquals('val', $this->manager->get('short'));
    }

    public function testComplexValues(): void
    {
        $data = ['users' => [1 => 'Alice', 2 => 'Bob'], 'count' => 2];
        $this->manager->set('complex', $data);
        $this->assertEquals($data, $this->manager->get('complex'));
    }

    public function testResetCreatesFreshInstance(): void
    {
        CacheManager::reset();
        $a = CacheManager::instance();
        CacheManager::reset();
        $b = CacheManager::instance();
        $this->assertNotSame($a, $b);
    }
}
