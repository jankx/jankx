<?php

namespace Tests\Extensions;

use PHPUnit\Framework\TestCase;
use Jankx\Extensions\MetricsExtension;
use Brain\Monkey;
use Jankx\Facades\App;
use Jankx\Foundation\Application;

class MetricsExtensionTest extends TestCase
{
    protected $app;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();

        $this->app = new Application();
        App::setFacadeApplication($this->app);
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function test_init_registers_autoloader()
    {
        $extension = new MetricsExtension();
        
        // Count autoloaders before
        $initialCount = count(spl_autoload_functions());
        
        $extension->init();
        
        // Count autoloaders after
        $finalCount = count(spl_autoload_functions());
        
        $this->assertGreaterThan($initialCount, $finalCount);
    }

    public function test_register_hooks_initializes_provider()
    {
        $extension = $this->getMockBuilder(MetricsExtension::class)
            ->onlyMethods(['get_extension_url'])
            ->getMock();
        $extension->method('get_extension_url')->willReturn('http://example.com/metrics');

        Monkey\Functions\expect('spl_autoload_register')->andReturn(true);
        Monkey\Filters\expectAdded('jankx/metrics/asset_url')->once();

        $extension->register_hooks();
        $this->assertTrue(true);
    }
}
