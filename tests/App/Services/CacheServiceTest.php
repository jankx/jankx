<?php

namespace Tests\App\Services;

use App\Services\CacheService;
use Jankx\Foundation\Application;
use Tests\Helpers\TestCase;

class CacheServiceTest extends TestCase
{
    protected $app;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();
        $GLOBALS['transients'] = [];
        $this->app = new Application();
        $this->service = new CacheService($this->app);
    }

    public function testSetAndGet()
    {
        $this->service->set('foo', 'bar');
        $this->assertEquals('bar', $this->service->get('foo'));
    }

    public function testGetDefault()
    {
        $this->assertEquals('baz', $this->service->get('non_existent', 'baz'));
    }

    public function testHas()
    {
        $this->assertFalse($this->service->has('foo'));
        $this->service->set('foo', 'bar');
        $this->assertTrue($this->service->has('foo'));
    }

    public function testForget()
    {
        $this->service->set('foo', 'bar');
        $this->service->forget('foo');
        $this->assertFalse($this->service->has('foo'));
    }

    public function testFlush()
    {
        $this->service->set('foo', 'bar');
        $this->service->set('baz', 'qux');
        $this->service->flush();
        $this->assertFalse($this->service->has('foo'));
        $this->assertFalse($this->service->has('baz'));
    }

    public function testRemember()
    {
        $called = 0;
        $callback = function () use (&$called) {
            $called++;
            return 'bar';
        };

        $result = $this->service->remember('foo', $callback);
        $this->assertEquals('bar', $result);
        $this->assertEquals(1, $called);

        $result = $this->service->remember('foo', $callback);
        $this->assertEquals('bar', $result);
        $this->assertEquals(1, $called); // Still 1, loaded from cache
    }

    public function testCacheExpiration()
    {
        $this->service->set('foo', 'bar', -10); // Expired 10 seconds ago
        $this->assertNull($this->service->get('foo'));
    }

    public function testStats()
    {
        $this->service->set('valid', 'val');
        $this->service->set('expired', 'val', -10);

        $stats = $this->service->getStats();
        $this->assertEquals(2, $stats['total']);
        $this->assertEquals(1, $stats['valid']);
        $this->assertEquals(1, $stats['expired']);
    }

    public function testSaveAndLoadFromTransient()
    {
        $this->service->set('foo', 'bar');
        $this->service->saveToTransient();

        $this->assertArrayHasKey('app_cache_service', $GLOBALS['transients']);
        $this->assertEquals('bar', $GLOBALS['transients']['app_cache_service']['foo']['value']);
        
        // New instance should load from transient
        $newService = new CacheService($this->app);
        $newService->initialize();
        
        $this->assertEquals('bar', $newService->get('foo'));
    }
}
