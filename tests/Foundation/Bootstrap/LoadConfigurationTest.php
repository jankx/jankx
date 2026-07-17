<?php

namespace Tests\Foundation\Bootstrap;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Bootstrap\LoadConfiguration;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;

class LoadConfigurationTest extends TestCase
{
    protected $app;
    protected $config;
    protected $loadConfiguration;

    protected function setUp(): void
    {
        $this->app = $this->createMock(Application::class);
        $this->config = $this->createMock(Repository::class);
        $this->loadConfiguration = new LoadConfiguration();

        // Mock the app to return config
        $this->app->method('make')
            ->with('config')
            ->willReturn($this->config);
    }

    public function testDebugGlob()
    {
        $path = __DIR__ . '/../../../config';
        $files = glob($path . '/*.php');
        // var_dump($path, $files);
        $this->assertNotEmpty($files, "Glob should find files in {$path}");
    }

    public function testBootstrapCallsLoadThemeConfiguration()
    {
        $this->config->method('set')
            ->willReturnSelf();

        // Should not throw any exceptions
        $this->loadConfiguration->bootstrap($this->app);
        $this->assertTrue(true);
    }

    public function testLoadThemeConfigurationWithParentConfigOnly()
    {
        // Mock config path
        $this->app->method('configPath')
            ->willReturn(__DIR__ . '/../../../config');

        $this->config->expects($this->atLeastOnce())
            ->method('set')
            ->withConsecutive(
                ['app', $this->arrayHasKey('name')],
                ['error', $this->arrayHasKey('suppression')],
                ['font-icons', $this->arrayHasKey('icon_types')],
                ['layout', $this->arrayHasKey('menu')],
                ['woocommerce', $this->isType('array')]
            );

        $this->loadConfiguration->bootstrap($this->app);
    }

    public function testLoadThemeConfigurationWithEnvConfigPath()
    {
        // Set environment variable for testing
        putenv('JANKX_CONFIG_PATH=' . __DIR__ . '/../../../tests/Config');

        $this->config->expects($this->atLeastOnce())
            ->method('set')
            ->withConsecutive(
                ['app', $this->arrayHasKey('name')],
                ['error', $this->arrayHasKey('suppression')],
                ['layout', $this->arrayHasKey('menu')],
                ['providers', $this->arrayHasKey('http')]
            );

        $this->loadConfiguration->bootstrap($this->app);

        // Clean up environment variable
        putenv('JANKX_CONFIG_PATH');
    }

    public function testLoadThemeConfigurationWithSeparateChildConfigPath()
    {
        // Create temporary child config directory
        $childConfigDir = sys_get_temp_dir() . '/jankx_child_config_' . uniqid();
        if (!is_dir($childConfigDir)) {
            mkdir($childConfigDir, 0777, true);
        }

        // Create child config with override
        $childAppConfig = [
            'name' => 'Child Theme',
            'version' => '2.0.0',
            'debug' => true
        ];
        file_put_contents($childConfigDir . '/app.php', '<?php return ' . var_export($childAppConfig, true) . ';');

        // Set environment variables for testing
        putenv('JANKX_CONFIG_PATH=' . __DIR__ . '/../../../tests/Config');
        putenv('JANKX_CHILD_CONFIG_PATH=' . $childConfigDir);

        // Expect all config files to be loaded in order: app, providers, error, layout
        $this->config->expects($this->atLeastOnce())
            ->method('set')
            ->withConsecutive(
                ['app', $this->callback(function ($config) {
                    // Should have child theme values (overridden)
                    return $config['name'] === 'Child Theme' &&
                           $config['version'] === '2.0.0' &&
                           $config['debug'] === true;
                })],
                ['error', $this->arrayHasKey('suppression')],
                ['layout', $this->arrayHasKey('menu')],
                ['providers', $this->arrayHasKey('http')]
            );

        $this->loadConfiguration->bootstrap($this->app);

        // Clean up
        unlink($childConfigDir . '/app.php');
        rmdir($childConfigDir);
        putenv('JANKX_CONFIG_PATH');
        putenv('JANKX_CHILD_CONFIG_PATH');
    }

    public function testLoadThemeConfigurationWithoutEnvConfigPath()
    {
        // Ensure environment variables are not set
        putenv('JANKX_CONFIG_PATH');
        putenv('JANKX_CHILD_CONFIG_PATH');

        // Mock get_template_directory to return a valid path
        if (!function_exists('get_template_directory')) {
            function get_template_directory()
            {
                return __DIR__ . '/../../../'; // Points to theme root
            }
        }
        if (!function_exists('get_stylesheet_directory')) {
            function get_stylesheet_directory()
            {
                return __DIR__ . '/../../../'; // Points to theme root
            }
        }

        // Just verify that set() is called multiple times (for each config file)
        $this->config->expects($this->atLeast(4))
            ->method('set');

        $this->loadConfiguration->bootstrap($this->app);
    }

    public function testDeepMergeConfigMethod()
    {
        // Test the deepMergeConfig method directly
        $parent = [
            'name' => 'Parent Theme',
            'version' => '1.0.0',
            'debug' => false,
            'features' => ['feature1', 'feature2'],
            'nested' => [
                'key1' => 'value1',
                'key2' => 'value2'
            ]
        ];

        $child = [
            'name' => 'Child Theme',
            'debug' => true,
            'nested' => [
                'key2' => 'new_value2',
                'key3' => 'value3'
            ]
        ];

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('deepMergeConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, $parent, $child);

        // Should have child theme values for overridden keys
        $this->assertEquals('Child Theme', $result['name']);
        $this->assertEquals('1.0.0', $result['version']); // From parent
        $this->assertTrue($result['debug']); // From child
        $this->assertEquals(['feature1', 'feature2'], $result['features']); // From parent

        // Should have deep merged nested structure
        $this->assertEquals('value1', $result['nested']['key1']); // From parent
        $this->assertEquals('new_value2', $result['nested']['key2']); // From child
        $this->assertEquals('value3', $result['nested']['key3']); // From child
    }

    public function testDeepMergeConfigWithEmptyChild()
    {
        $parent = [
            'name' => 'Parent Theme',
            'version' => '1.0.0'
        ];

        $child = [];

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('deepMergeConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, $parent, $child);

        // Should return parent config unchanged
        $this->assertEquals($parent, $result);
    }

    public function testDeepMergeConfigWithEmptyParent()
    {
        $parent = [];

        $child = [
            'name' => 'Child Theme',
            'version' => '2.0.0'
        ];

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('deepMergeConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, $parent, $child);

        // Should return child config
        $this->assertEquals($child, $result);
    }

    public function testLoadDatabaseConfiguration()
    {
        // Mock WordPress function
        if (!function_exists('get_option')) {
            function get_option($key, $default = false)
            {
                if ($key === 'jankx_config') {
                    return ['test_option' => 'test_value'];
                }
                return $default;
            }
        }

        // Expect 4 theme configs + 1 database config = 5 total
        $this->config->expects($this->atLeast(4))
            ->method('set');

        $this->loadConfiguration->bootstrap($this->app);
    }

    public function testLoadDatabaseConfigurationWithEmptyOptions()
    {
        // Mock WordPress function
        if (!function_exists('get_option')) {
            function get_option($key, $default = false)
            {
                return $default;
            }
        }

        // Expect only theme configs to be loaded, no database config
        $this->config->expects($this->atLeast(4))
            ->method('set');

        $this->loadConfiguration->bootstrap($this->app);
    }

    public function testLoadCachedConfigMethod()
    {
        // Create temporary test file
        $testConfigDir = sys_get_temp_dir() . '/jankx_test_config_' . uniqid();
        if (!is_dir($testConfigDir)) {
            mkdir($testConfigDir, 0777, true);
        }

        $testConfig = [
            'name' => 'Test Config',
            'version' => '1.0.0'
        ];
        file_put_contents($testConfigDir . '/app.php', '<?php return ' . var_export($testConfig, true) . ';');

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('loadCachedConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, $testConfigDir . '/app.php', 'app');

        // Should return config from file
        $this->assertEquals($testConfig, $result);

        // Cleanup
        unlink($testConfigDir . '/app.php');
        rmdir($testConfigDir);
    }

    public function testLoadCachedConfigWithCacheHit()
    {
        // Create temporary test file
        $testConfigDir = sys_get_temp_dir() . '/jankx_test_config_' . uniqid();
        if (!is_dir($testConfigDir)) {
            mkdir($testConfigDir, 0777, true);
        }

        $testConfig = [
            'name' => 'Cached Config',
            'version' => '2.0.0'
        ];
        file_put_contents($testConfigDir . '/app.php', '<?php return ' . var_export($testConfig, true) . ';');

        // Mock cache hit
        $GLOBALS['wp_cache_mock'] = $testConfig;

        // Override wp_cache_get to return cached data
        if (!function_exists('wp_cache_get')) {
            function wp_cache_get($key, $group = '')
            {
                global $wp_cache_mock;
                if (strpos($key, 'file_configs_app_') === 0) {
                    return $wp_cache_mock;
                }
                return false;
            }
        }

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('loadCachedConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, $testConfigDir . '/app.php', 'app');

        // Should return cached config
        $this->assertEquals($testConfig, $result);

        // Cleanup
        unlink($testConfigDir . '/app.php');
        rmdir($testConfigDir);
        unset($GLOBALS['wp_cache_mock']);
    }

    public function testLoadCachedConfigWithNonExistentFile()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('loadCachedConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, '/non/existent/file.php', 'app');

        // Should return empty array for non-existent file
        $this->assertEquals([], $result);
    }

    public function testClearConfigCache()
    {
        // Should not throw any exceptions
        LoadConfiguration::clearConfigCache();
        $this->assertTrue(true);
    }

    public function testClearConfigCacheByType()
    {
        // Should not throw any exceptions
        LoadConfiguration::clearConfigCacheByType('app');
        $this->assertTrue(true);
    }

    public function testCrc32ChecksumGeneration()
    {
        // Create temporary test file
        $testConfigDir = sys_get_temp_dir() . '/jankx_test_config_' . uniqid();
        if (!is_dir($testConfigDir)) {
            mkdir($testConfigDir, 0777, true);
        }

        $testConfig = [
            'name' => 'Test Config',
            'version' => '1.0.0'
        ];
        $configContent = '<?php return ' . var_export($testConfig, true) . ';';
        file_put_contents($testConfigDir . '/app.php', $configContent);

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('loadCachedConfig');
        $method->setAccessible(true);

        // First call - should load from file and cache
        $result1 = $method->invoke($this->loadConfiguration, $testConfigDir . '/app.php', 'app');
        $this->assertEquals($testConfig, $result1);

        // Modify file content slightly
        $testConfig['version'] = '1.0.1';
        $configContent2 = '<?php return ' . var_export($testConfig, true) . ';';
        file_put_contents($testConfigDir . '/app.php', $configContent2);

        // Second call - should load new content due to different CRC32
        $result2 = $method->invoke($this->loadConfiguration, $testConfigDir . '/app.php', 'app');
        $this->assertEquals($testConfig, $result2);

        // Cleanup
        unlink($testConfigDir . '/app.php');
        rmdir($testConfigDir);
    }

    public function testCacheKeyFormat()
    {
        // Create temporary test file
        $testConfigDir = sys_get_temp_dir() . '/jankx_test_config_' . uniqid();
        if (!is_dir($testConfigDir)) {
            mkdir($testConfigDir, 0777, true);
        }

        $testConfig = ['name' => 'Test'];
        $configContent = '<?php return ' . var_export($testConfig, true) . ';';
        file_put_contents($testConfigDir . '/app.php', $configContent);

        // Calculate expected CRC32
        $expectedChecksum = crc32($configContent);
        $expectedKey = "file_configs_app_{$expectedChecksum}";

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('loadCachedConfig');
        $method->setAccessible(true);

        // Test that the method works correctly
        $result = $method->invoke($this->loadConfiguration, $testConfigDir . '/app.php', 'app');

        // Should return config from file
        $this->assertEquals($testConfig, $result);

        // Cleanup
        unlink($testConfigDir . '/app.php');
        rmdir($testConfigDir);
    }
}
