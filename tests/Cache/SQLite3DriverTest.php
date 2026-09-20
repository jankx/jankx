<?php

namespace Tests\Cache;

use Tests\Helpers\TestCase;
use Jankx\Cache\Drivers\SQLite3Driver;

class SQLite3DriverTest extends TestCase
{
    private static string $testDb;
    private SQLite3Driver $driver;

    public static function setUpBeforeClass(): void
    {
        self::$testDb = sys_get_temp_dir() . '/jankx_test_cache_' . uniqid() . '.sqlite';
        @unlink(self::$testDb);
    }

    public static function tearDownAfterClass(): void
    {
        if (file_exists(self::$testDb)) {
            unlink(self::$testDb);
        }
    }

    protected function setUp(): void
    {
        parent::setUp();
        @unlink(self::$testDb);
        $this->driver = new SQLite3Driver(['path' => self::$testDb]);
    }

    protected function tearDown(): void
    {
        $this->driver->flush();
        $this->driver->close();
        parent::tearDown();
    }

    public function testIsAvailable(): void
    {
        $this->assertTrue(SQLite3Driver::isAvailable());
    }

    public function testImplementsInterface(): void
    {
        $this->assertInstanceOf(\Jankx\Cache\Contracts\CacheDriverInterface::class, $this->driver);
    }

    public function testSetAndGet(): void
    {
        $this->assertTrue($this->driver->set('test_key', 'test_value'));
        $this->assertEquals('test_value', $this->driver->get('test_key'));
    }

    public function testGetDefault(): void
    {
        $this->assertEquals('default', $this->driver->get('nonexistent', 'default'));
        $this->assertNull($this->driver->get('nonexistent'));
    }

    public function testSetWithTtl(): void
    {
        $this->assertTrue($this->driver->set('ttl_key', 'value', 1));
        $this->assertEquals('value', $this->driver->get('ttl_key'));
    }

    public function testHas(): void
    {
        $this->assertFalse($this->driver->has('not_here'));
        $this->driver->set('exists', 1);
        $this->assertTrue($this->driver->has('exists'));
    }

    public function testDelete(): void
    {
        $this->driver->set('to_delete', 'value');
        $this->assertTrue($this->driver->delete('to_delete'));
        $this->assertFalse($this->driver->has('to_delete'));
    }

    public function testSetManyAndGetMany(): void
    {
        $values = [
            'key1' => 'val1',
            'key2' => 'val2',
            'key3' => 'val3',
        ];

        $this->assertTrue($this->driver->setMany($values));
        $result = $this->driver->getMany(array_keys($values));
        $this->assertEquals($values, $result);
    }

    public function testDeleteMany(): void
    {
        $this->driver->set('a', 1);
        $this->driver->set('b', 2);
        $this->driver->set('c', 3);

        $this->assertTrue($this->driver->deleteMany(['a', 'c']));
        $this->assertFalse($this->driver->has('a'));
        $this->assertTrue($this->driver->has('b'));
        $this->assertFalse($this->driver->has('c'));
    }

    public function testFlush(): void
    {
        $this->driver->set('x', 1);
        $this->driver->set('y', 2);
        $this->assertTrue($this->driver->flush());
        $this->assertFalse($this->driver->has('x'));
        $this->assertFalse($this->driver->has('y'));
    }

    public function testStats(): void
    {
        $this->driver->set('item1', 'a');
        $this->driver->set('item2', 'b');
        $stats = $this->driver->stats();

        $this->assertEquals('sqlite3', $stats['driver']);
        $this->assertArrayHasKey('size', $stats);
        $this->assertArrayHasKey('total_items', $stats);
        $this->assertGreaterThanOrEqual(2, $stats['total_items']);
    }

    public function testOverwrite(): void
    {
        $this->driver->set('key', 'first');
        $this->driver->set('key', 'second');
        $this->assertEquals('second', $this->driver->get('key'));
    }

    public function testScalarValues(): void
    {
        $this->driver->set('int', 42);
        $this->assertEquals(42, $this->driver->get('int'));

        $this->driver->set('float', 3.14);
        $this->assertEquals(3.14, $this->driver->get('float'));

        $this->driver->set('bool', true);
        $this->assertTrue($this->driver->get('bool'));

        $this->driver->set('null', null);
        $this->assertNull($this->driver->get('null'));
    }

    public function testArrayValue(): void
    {
        $arr = ['foo' => 'bar', 'nested' => [1, 2, 3]];
        $this->driver->set('arr', $arr);
        $this->assertEquals($arr, $this->driver->get('arr'));
    }

    public function testGetDatabase(): void
    {
        $this->assertInstanceOf(\SQLite3::class, $this->driver->getDatabase());
    }
}
