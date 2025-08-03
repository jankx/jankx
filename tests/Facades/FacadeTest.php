<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Facade;
use Jankx\Foundation\Application;

class FacadeTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
        Facade::setFacadeApplication($this->app);
    }

    public function testFacadeCanSetFacadeApplication()
    {
        $this->expectNotToPerformAssertions();
        Facade::setFacadeApplication($this->app);
    }

    public function testFacadeCanGetFacadeApplication()
    {
        $app = Facade::getFacadeApplication();
        $this->assertInstanceOf(Application::class, $app);
    }

    public function testFacadeCanClearResolvedInstance()
    {
        $this->expectNotToPerformAssertions();
        Facade::clearResolvedInstance('app');
    }

    public function testFacadeCanClearResolvedInstances()
    {
        $this->expectNotToPerformAssertions();
        Facade::clearResolvedInstances();
    }
}
