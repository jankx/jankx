<?php

namespace Tests\Config;

use PHPUnit\Framework\TestCase;
use Jankx\Config\Repository;
use Jankx\Config\Contracts\ConfigRepositoryInterface;
use Mockery;

/**
 * Config Repository Test
 *
 * @package Tests\Config
 * @since 2.0.0
 */
class RepositoryTest extends TestCase
{
    /**
     * @var Repository
     */
    protected $repository;

    /**
     * @var string
     */
    protected $testParentConfigPath;

    /**
     * @var string
     */
    protected $testChildConfigPath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setupTestConfigs();
        $this->repository = new Repository();
    }

    protected function tearDown(): void
    {
        $this->cleanupTestConfigs();
        parent::tearDown();
    }

    /**
     * Setup test configuration files
     */
    protected function setupTestConfigs(): void
    {
        $uploadDir = $this->getMockUploadDir();
        $this->testParentConfigPath = $uploadDir['basedir'] . '/test-parent-config';
        $this->testChildConfigPath = $uploadDir['basedir'] . '/test-child-config';

        // Create test directories
        $this->createDirectory($this->testParentConfigPath);
        $this->createDirectory($this->testChildConfigPath);

        // Create parent theme config
        $parentConfig = [
            'theme' => [
                'info' => [
                    'name' => 'Test Parent Theme',
                    'version' => '1.0.0'
                ],
                'colors' => [
                    'primary' => '#007cba',
                    'secondary' => '#6c757d',
                    'accent' => '#28a745'
                ],
                'typography' => [
                    'font_family' => 'Arial, sans-serif',
                    'font_size' => '16px',
                    'line_height' => '1.6'
                ],
                'layout' => [
                    'container_width' => '1200px',
                    'sidebar_position' => 'right'
                ]
            ]
        ];

        file_put_contents($this->testParentConfigPath . '/theme.php', '<?php return ' . var_export($parentConfig, true) . ';');

        // Create child theme config
        $childConfig = [
            'theme' => [
                'info' => [
                    'name' => 'Test Child Theme',
                    'version' => '1.0.1'
                ],
                'colors' => [
                    'primary' => '#e74c3c', // Override
                    'accent' => '#f39c12'   // Override
                ],
                'layout' => [
                    'sidebar_position' => 'left' // Override
                ],
                'custom' => [
                    'feature_enabled' => true
                ]
            ]
        ];

        file_put_contents($this->testChildConfigPath . '/theme.php', '<?php return ' . var_export($childConfig, true) . ';');

        // Create parent and child theme directories with config
        $parentThemeDir = __DIR__ . '/../../../../test-parent-theme';
        $childThemeDir = __DIR__ . '/../../../../test-child-theme';

        $this->createDirectory($parentThemeDir . '/config');
        $this->createDirectory($childThemeDir . '/config');

        // Copy config files to theme directories
        copy($this->testParentConfigPath . '/theme.php', $parentThemeDir . '/config/theme.php');
        copy($this->testChildConfigPath . '/theme.php', $childThemeDir . '/config/theme.php');
    }

    /**
     * Mock upload directory
     */
    protected function getMockUploadDir(): array
    {
        return [
            'basedir' => __DIR__ . '/../../../../test-uploads'
        ];
    }

    /**
     * Create directory
     */
    protected function createDirectory(string $dir): bool
    {
        if (!is_dir($dir)) {
            return mkdir($dir, 0755, true);
        }
        return true;
    }

    /**
     * Cleanup test configuration files
     */
    protected function cleanupTestConfigs(): void
    {
        if (is_dir($this->testParentConfigPath)) {
            $this->removeDirectory($this->testParentConfigPath);
        }
        if (is_dir($this->testChildConfigPath)) {
            $this->removeDirectory($this->testChildConfigPath);
        }
    }

    /**
     * Remove directory recursively
     */
    protected function removeDirectory(string $dir): void
    {
        if (is_dir($dir)) {
            $files = array_diff(scandir($dir), ['.', '..']);
            foreach ($files as $file) {
                $path = $dir . '/' . $file;
                if (is_dir($path)) {
                    $this->removeDirectory($path);
                } else {
                    unlink($path);
                }
            }
            rmdir($dir);
        }
    }

    /**
     * Test constructor initialization
     */
    public function testConstructorInitialization(): void
    {
        $this->assertInstanceOf(Repository::class, $this->repository);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $this->repository);
        $this->assertTrue($this->repository->isChildTheme());
    }

    /**
     * Test getting configuration value
     */
    public function testGetConfigurationValue(): void
    {
        $value = $this->repository->get('theme.info.name');
        $this->assertEquals('Test Child Theme', $value);
    }

    /**
     * Test getting nested configuration value
     */
    public function testGetNestedConfigurationValue(): void
    {
        $value = $this->repository->get('theme.colors.primary');
        $this->assertEquals('#e74c3c', $value);
    }

    /**
     * Test getting default value when key doesn't exist
     */
    public function testGetDefaultValue(): void
    {
        $value = $this->repository->get('theme.nonexistent.key', 'default');
        $this->assertEquals('default', $value);
    }

    /**
     * Test setting configuration value
     */
    public function testSetConfigurationValue(): void
    {
        $this->repository->set('theme.custom.new_setting', 'test_value');
        $value = $this->repository->get('theme.custom.new_setting');
        $this->assertEquals('test_value', $value);
    }

    /**
     * Test setting nested configuration value
     */
    public function testSetNestedConfigurationValue(): void
    {
        $this->repository->set('theme.colors.new_color', '#ff0000');
        $value = $this->repository->get('theme.colors.new_color');
        $this->assertEquals('#ff0000', $value);
    }

    /**
     * Test checking if configuration key exists
     */
    public function testHasConfigurationKey(): void
    {
        $this->assertTrue($this->repository->has('theme.info.name'));
        $this->assertFalse($this->repository->has('theme.nonexistent.key'));
    }

    /**
     * Test getting all configuration
     */
    public function testGetAllConfiguration(): void
    {
        $config = $this->repository->all();
        $this->assertIsArray($config);
        $this->assertArrayHasKey('theme', $config);
    }

    /**
     * Test getting parent configuration
     */
    public function testGetParentConfig(): void
    {
        $parentConfig = $this->repository->getParentConfig();
        $this->assertIsArray($parentConfig);
        $this->assertArrayHasKey('theme', $parentConfig);
        $this->assertEquals('Test Parent Theme', $parentConfig['theme']['info']['name']);
    }

    /**
     * Test getting child configuration
     */
    public function testGetChildConfig(): void
    {
        $childConfig = $this->repository->getChildConfig();
        $this->assertIsArray($childConfig);
        $this->assertArrayHasKey('theme', $childConfig);
        $this->assertEquals('Test Child Theme', $childConfig['theme']['info']['name']);
    }

    /**
     * Test checking if using child theme
     */
    public function testIsChildTheme(): void
    {
        $this->assertTrue($this->repository->isChildTheme());
    }

    /**
     * Test getting loaded files
     */
    public function testGetLoadedFiles(): void
    {
        $loadedFiles = $this->repository->getLoadedFiles();
        $this->assertIsArray($loadedFiles);
        $this->assertNotEmpty($loadedFiles);
    }

    /**
     * Test getting configuration section
     */
    public function testGetSection(): void
    {
        $colors = $this->repository->getSection('theme.colors');
        $this->assertIsArray($colors);
        if (isset($colors['primary'])) {
            $this->assertEquals('#e74c3c', $colors['primary']);
        }
    }

    /**
     * Test merging additional configuration
     */
    public function testMergeConfiguration(): void
    {
        $additionalConfig = [
            'theme' => [
                'new_section' => [
                    'key' => 'value'
                ]
            ]
        ];

        $this->repository->merge($additionalConfig);
        $value = $this->repository->get('theme.new_section.key');
        $this->assertEquals('value', $value);
    }

    /**
     * Test getting configuration differences
     */
    public function testGetConfigDifference(): void
    {
        $differences = $this->repository->getConfigDifference();
        $this->assertIsArray($differences);

        // Check that differences exist
        $this->assertArrayHasKey('theme.info.name', $differences);
        $this->assertEquals('Test Parent Theme', $differences['theme.info.name']['parent']);
        $this->assertEquals('Test Child Theme', $differences['theme.info.name']['child']);
    }

    /**
     * Test reloading configurations
     */
    public function testReload(): void
    {
        // Set a temporary value
        $this->repository->set('theme.temp.key', 'temp_value');
        $this->assertEquals('temp_value', $this->repository->get('theme.temp.key'));

        // Reload configurations
        $this->repository->reload();

        // Temporary value should be gone
        $this->assertNull($this->repository->get('theme.temp.key'));
    }

    /**
     * Test cache functionality
     */
    public function testCacheFunctionality(): void
    {
        // Test cache statistics
        $stats = $this->repository->getCacheStats();
        $this->assertIsArray($stats);
        $this->assertArrayHasKey('total_files', $stats);
        $this->assertArrayHasKey('cached_files', $stats);

        // Test file change detection
        $loadedFiles = $this->repository->getLoadedFiles();
        if (!empty($loadedFiles)) {
            $firstFile = $loadedFiles[0];
            $hasChanged = $this->repository->hasFileChanged($firstFile);
            $this->assertIsBool($hasChanged);
        }

        // Test clearing cache
        $this->repository->clearCache();
        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test cache key generation
     */
    public function testCacheKeyGeneration(): void
    {
        $reflection = new \ReflectionClass($this->repository);
        $method = $reflection->getMethod('generateCacheKey');
        $method->setAccessible(true);

        $testFile = __FILE__;
        $cacheKey = $method->invoke($this->repository, $testFile);

        $this->assertIsString($cacheKey);
        $this->assertStringStartsWith('jankx_config_', $cacheKey);
    }

    /**
     * Test deep merge functionality
     */
    public function testDeepMerge(): void
    {
        $reflection = new \ReflectionClass($this->repository);
        $method = $reflection->getMethod('deepMerge');
        $method->setAccessible(true);

        $parent = [
            'level1' => [
                'level2' => [
                    'key1' => 'parent_value1',
                    'key2' => 'parent_value2'
                ]
            ]
        ];

        $child = [
            'level1' => [
                'level2' => [
                    'key1' => 'child_value1', // Override
                    'key3' => 'child_value3'  // New key
                ]
            ]
        ];

        $result = $method->invoke($this->repository, $parent, $child);

        $this->assertEquals('child_value1', $result['level1']['level2']['key1']);
        $this->assertEquals('parent_value2', $result['level1']['level2']['key2']);
        $this->assertEquals('child_value3', $result['level1']['level2']['key3']);
    }

    /**
     * Test nested value access
     */
    public function testNestedValueAccess(): void
    {
        $reflection = new \ReflectionClass($this->repository);
        $method = $reflection->getMethod('getNestedValue');
        $method->setAccessible(true);

        $array = [
            'level1' => [
                'level2' => [
                    'key' => 'value'
                ]
            ]
        ];

        $value = $method->invoke($this->repository, $array, 'level1.level2.key');
        $this->assertEquals('value', $value);

        $default = $method->invoke($this->repository, $array, 'level1.nonexistent', 'default');
        $this->assertEquals('default', $default);
    }

    /**
     * Test nested value setting
     */
    public function testNestedValueSetting(): void
    {
        $reflection = new \ReflectionClass($this->repository);
        $method = $reflection->getMethod('setNestedValue');
        $method->setAccessible(true);

        $array = [];
        $method->invokeArgs($this->repository, [&$array, 'level1.level2.key', 'new_value']);

        $this->assertEquals('new_value', $array['level1']['level2']['key']);
    }

    /**
     * Test toArray export
     */
    public function testToArrayExport(): void
    {
        $export = $this->repository->toArray();

        $this->assertIsArray($export);
        $this->assertArrayHasKey('config', $export);
        $this->assertArrayHasKey('parent_config', $export);
        $this->assertArrayHasKey('child_config', $export);
        $this->assertArrayHasKey('is_child_theme', $export);
        $this->assertArrayHasKey('loaded_files', $export);
        $this->assertArrayHasKey('differences', $export);
        $this->assertArrayHasKey('cache_stats', $export);
    }

    /**
     * Test ArrayAccess implementation
     */
    public function testArrayAccess(): void
    {
        // Test offsetExists
        $this->assertTrue(isset($this->repository['theme.info.name']));
        $this->assertFalse(isset($this->repository['theme.nonexistent.key']));

        // Test offsetGet
        $value = $this->repository['theme.info.name'];
        $this->assertEquals('Test Child Theme', $value);

        // Test offsetSet
        $this->repository['theme.custom.array_test'] = 'array_value';
        $this->assertEquals('array_value', $this->repository['theme.custom.array_test']);

        // Test offsetUnset (sets to null)
        unset($this->repository['theme.custom.array_test']);
        $this->assertNull($this->repository['theme.custom.array_test']);
    }

    /**
     * Test ArrayAccess with nested keys
     */
    public function testArrayAccessWithNestedKeys(): void
    {
        // Test nested access
        $this->assertTrue(isset($this->repository['theme.colors.primary']));
        $this->assertEquals('#e74c3c', $this->repository['theme.colors.primary']);

        // Test setting nested value
        $this->repository['theme.colors.new_color'] = '#ff0000';
        $this->assertEquals('#ff0000', $this->repository['theme.colors.new_color']);
    }

    /**
     * Test ArrayAccess error handling
     */
    public function testArrayAccessErrorHandling(): void
    {
        // Test null offset
        $this->expectException(\InvalidArgumentException::class);
        $this->repository[null] = 'value';
    }

    /**
     * Test ArrayAccess with default values
     */
    public function testArrayAccessWithDefaults(): void
    {
        // Test non-existent key returns null
        $this->assertNull($this->repository['theme.nonexistent.key']);
    }

    /**
     * Test ArrayAccess performance
     */
    public function testArrayAccessPerformance(): void
    {
        $startTime = microtime(true);

        for ($i = 0; $i < 100; $i++) {
            $value = $this->repository["theme.info.name"];
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete within reasonable time (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    /**
     * Test error handling for non-existent files
     */
    public function testErrorHandlingForNonExistentFiles(): void
    {
        $reflection = new \ReflectionClass($this->repository);
        $method = $reflection->getMethod('loadConfigFile');
        $method->setAccessible(true);

        $result = $method->invoke($this->repository, '/path/to/nonexistent/file.php');
        $this->assertEquals([], $result);
    }

    /**
     * Test configuration with invalid PHP syntax
     */
    public function testInvalidConfigFile(): void
    {
        $invalidConfigPath = $this->testParentConfigPath . '/invalid.php';
        file_put_contents($invalidConfigPath, '<?php return "invalid syntax";');

        $reflection = new \ReflectionClass($this->repository);
        $method = $reflection->getMethod('loadConfigFile');
        $method->setAccessible(true);

        $result = $method->invoke($this->repository, $invalidConfigPath);
        $this->assertEquals([], $result);

        unlink($invalidConfigPath);
    }

    /**
     * Test performance with large configuration
     */
    public function testPerformanceWithLargeConfig(): void
    {
        $startTime = microtime(true);

        // Generate large config
        $largeConfig = [];
        for ($i = 0; $i < 1000; $i++) {
            $largeConfig["key_{$i}"] = "value_{$i}";
        }

        $this->repository->merge($largeConfig);

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete within reasonable time (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    /**
     * Test memory usage
     */
    public function testMemoryUsage(): void
    {
        $initialMemory = memory_get_usage();

        // Load configurations
        $this->repository->reload();

        $finalMemory = memory_get_usage();
        $memoryIncrease = $finalMemory - $initialMemory;

        // Memory increase should be reasonable (less than 10MB)
        $this->assertLessThan(10 * 1024 * 1024, $memoryIncrease);
    }
}