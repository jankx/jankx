<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\App;
use Jankx\Foundation\Application;
use ReflectionClass;

class AppTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
        App::setFacadeApplication($this->app);
    }

    public function testAppFacadeCanGetFacadeAccessor()
    {
        $reflection = new ReflectionClass(App::class);
        $method = $reflection->getMethod('getFacadeAccessor');
        $method->setAccessible(true);

        $accessor = $method->invoke(null);
        $this->assertEquals('app', $accessor);
    }

    public function testAppFacadeCanResolveApplication()
    {
        $resolvedApp = App::getFacadeRoot();
        $this->assertInstanceOf(Application::class, $resolvedApp);
    }
}