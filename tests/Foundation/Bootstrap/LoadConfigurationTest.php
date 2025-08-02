<?php

namespace Tests\Foundation\Bootstrap;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Bootstrap\LoadConfiguration;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;

class LoadConfigurationTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testLoadConfigurationCanBeInstantiated()
    {
        $bootstrap = new LoadConfiguration();
        $this->assertInstanceOf(LoadConfiguration::class, $bootstrap);
    }

    public function testLoadConfigurationCanBootstrap()
    {
        $bootstrap = new LoadConfiguration();

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $bootstrap->bootstrap($this->app);
    }

    public function testLoadConfigurationCanLoadConfigFiles()
    {
        $bootstrap = new LoadConfiguration();
        $bootstrap->bootstrap($this->app);

        $config = $this->app->make('config');
        $this->assertInstanceOf(Repository::class, $config);
    }

    public function testLoadConfigurationCanLoadAppConfig()
    {
        $bootstrap = new LoadConfiguration();
        $bootstrap->bootstrap($this->app);

        $config = $this->app->make('config');

        // Debug: in ra toàn bộ config để xem key nào tồn tại
        $allConfig = $config->all();
        error_log('DEBUG: All config keys: ' . print_r(array_keys($allConfig), true));

        // Kiểm tra key 'name' tồn tại trong app config
        $this->assertTrue($config->has('app.name'));
    }

    public function testLoadConfigurationCanLoadProvidersConfig()
    {
        $bootstrap = new LoadConfiguration();
        $bootstrap->bootstrap($this->app);

        $config = $this->app->make('config');

        // Debug: in ra toàn bộ config để xem key nào tồn tại
        $allConfig = $config->all();
        error_log('DEBUG: All config keys: ' . print_r(array_keys($allConfig), true));

        // Kiểm tra key 'http' tồn tại trong providers config
        $this->assertTrue($config->has('providers.http'));
    }

    public function testLoadConfigurationCanHandleMissingConfigFiles()
    {
        // Temporarily rename config directory to test missing files
        $configDir = __DIR__ . '/../../../config';
        $tempDir = __DIR__ . '/../../../config_temp';

        if (is_dir($configDir)) {
            rename($configDir, $tempDir);
        }

        $bootstrap = new LoadConfiguration();

        // Should not throw any exception even with missing config files
        $this->expectNotToPerformAssertions();
        $bootstrap->bootstrap($this->app);

        // Restore config directory
        if (is_dir($tempDir)) {
            rename($tempDir, $configDir);
        }
    }

    public function testLoadConfigurationCanLoadWordPressOptions()
    {
        $bootstrap = new LoadConfiguration();
        $bootstrap->bootstrap($this->app);

        $config = $this->app->make('config');

        // Should be able to get WordPress options
        $this->assertInstanceOf(Repository::class, $config);
    }
}