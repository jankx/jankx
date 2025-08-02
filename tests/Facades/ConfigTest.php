<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Config;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;

class ConfigTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
        Config::setFacadeApplication($this->app);
    }

    public function testConfigFacadeCanGetValues()
    {
        $config = $this->app->make('config');
        $config->set('app.name', 'Jankx');

        $this->assertEquals('Jankx', Config::get('app.name'));
    }



    public function testConfigFacadeReturnsDefaultValueWhenKeyNotFound()
    {
        $value = Config::get('nonexistent.key', 'default');
        $this->assertEquals('default', $value);
    }

    public function testConfigFacadeCanGetNestedValues()
    {
        Config::set('app', [
            'name' => 'Jankx',
            'providers' => [
                'ConfigServiceProvider'
            ]
        ]);

        $this->assertEquals('Jankx', Config::get('app.name'));
        $this->assertEquals(['ConfigServiceProvider'], Config::get('app.providers'));
    }
}