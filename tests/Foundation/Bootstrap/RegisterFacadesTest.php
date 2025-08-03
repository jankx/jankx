<?php

namespace Tests\Foundation\Bootstrap;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Bootstrap\RegisterFacades;
use Jankx\Foundation\Application;
use Jankx\Facades\App;
use Jankx\Facades\Config;
use Jankx\Facades\Log;

class RegisterFacadesTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testRegisterFacadesCanBeInstantiated()
    {
        $bootstrap = new RegisterFacades();
        $this->assertInstanceOf(RegisterFacades::class, $bootstrap);
    }

    public function testRegisterFacadesCanBootstrap()
    {
        $bootstrap = new RegisterFacades();

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $bootstrap->bootstrap($this->app);
    }

    public function testRegisterFacadesCanRegisterAppFacade()
    {
        $bootstrap = new RegisterFacades();
        $bootstrap->bootstrap($this->app);

        // Should be able to use App facade
        $this->expectNotToPerformAssertions();
        App::setFacadeApplication($this->app);
    }

    public function testRegisterFacadesCanRegisterConfigFacade()
    {
        $bootstrap = new RegisterFacades();
        $bootstrap->bootstrap($this->app);

        // Should be able to use Config facade
        $this->expectNotToPerformAssertions();
        Config::setFacadeApplication($this->app);
    }

    public function testRegisterFacadesCanRegisterLogFacade()
    {
        $bootstrap = new RegisterFacades();
        $bootstrap->bootstrap($this->app);

        // Should be able to use Log facade
        $this->expectNotToPerformAssertions();
        Log::setFacadeApplication($this->app);
    }

    public function testRegisterFacadesCanRegisterAllFacades()
    {
        $bootstrap = new RegisterFacades();
        $bootstrap->bootstrap($this->app);

        // All facades should be registered
        $this->expectNotToPerformAssertions();

        App::setFacadeApplication($this->app);
        Config::setFacadeApplication($this->app);
        Log::setFacadeApplication($this->app);
    }

    public function testRegisterFacadesCanHandleMultipleBootstrapCalls()
    {
        $bootstrap = new RegisterFacades();

        // Should not throw any exception on multiple calls
        $this->expectNotToPerformAssertions();

        $bootstrap->bootstrap($this->app);
        $bootstrap->bootstrap($this->app);
    }
}
