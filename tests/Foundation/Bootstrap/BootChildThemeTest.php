<?php

namespace Tests\Foundation\Bootstrap;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Bootstrap\BootChildTheme;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;

/**
 * Test BootChildTheme Bootstrap
 */
class BootChildThemeTest extends TestCase
{
    protected $app;
    protected $config;
    protected $bootChildTheme;
    protected $tempChildThemePath;
    protected $tempComposerJsonPath;
    protected $tempVendorPath;
    protected $tempAutoloadPath;

    /**
     * Helper method to access protected methods using reflection
     */
    protected function callProtectedMethod($methodName, ...$args)
    {
        $reflection = new \ReflectionClass($this->bootChildTheme);
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);
        return $method->invoke($this->bootChildTheme, ...$args);
    }

    protected function setUp(): void
    {
        $this->app = $this->createMock(Application::class);
        $this->config = $this->createMock(Repository::class);
        $this->bootChildTheme = new BootChildTheme();

        // Create temporary child theme directory for testing
        $this->tempChildThemePath = sys_get_temp_dir() . '/jankx_child_theme_' . uniqid();
        $this->tempComposerJsonPath = $this->tempChildThemePath . '/composer.json';
        $this->tempVendorPath = $this->tempChildThemePath . '/vendor';
        $this->tempAutoloadPath = $this->tempVendorPath . '/autoload.php';

        // Create directory structure
        if (!is_dir($this->tempChildThemePath)) {
            mkdir($this->tempChildThemePath, 0777, true);
        }
        if (!is_dir($this->tempVendorPath)) {
            mkdir($this->tempVendorPath, 0777, true);
        }

        // Mock WordPress functions
        if (!function_exists('get_stylesheet_directory')) {
            function get_stylesheet_directory()
            {
                return $GLOBALS['test_child_theme_path'] ?? '/tmp/test-child-theme';
            }
        }

        if (!function_exists('get_template_directory')) {
            function get_template_directory()
            {
                return $GLOBALS['test_parent_theme_path'] ?? '/tmp/test-parent-theme';
            }
        }

        if (!function_exists('jankx_app')) {
            function jankx_app()
            {
                return $GLOBALS['test_jankx_app'] ?? null;
            }
        }

        // Set global test variables
        $GLOBALS['test_child_theme_path'] = $this->tempChildThemePath;
        $GLOBALS['test_parent_theme_path'] = '/tmp/test-parent-theme';
        $GLOBALS['test_jankx_app'] = $this->app;
    }

    protected function tearDown(): void
    {
        // Clean up temporary files
        if (file_exists($this->tempAutoloadPath)) {
            unlink($this->tempAutoloadPath);
        }
        if (file_exists($this->tempComposerJsonPath)) {
            unlink($this->tempComposerJsonPath);
        }
        if (is_dir($this->tempVendorPath)) {
            rmdir($this->tempVendorPath);
        }
        if (is_dir($this->tempChildThemePath)) {
            rmdir($this->tempChildThemePath);
        }

        // Clean up global variables
        unset($GLOBALS['test_child_theme_path']);
        unset($GLOBALS['test_parent_theme_path']);
        unset($GLOBALS['test_jankx_app']);
    }

    /**
     * Test bootstrap method with valid child theme composer setup
     */
    public function testBootstrapWithValidChildThemeComposer()
    {
        // Create valid composer.json
        $composerData = [
            'name' => 'test/child-theme',
            'version' => '1.0.0',
            'description' => 'Test child theme',
            'autoload' => [
                'psr-4' => [
                    'TestChild\\' => 'src/'
                ],
                'files' => [
                    'src/helpers.php'
                ]
            ],
            'require' => [
                'php' => '>=7.4'
            ]
        ];
        file_put_contents($this->tempComposerJsonPath, json_encode($composerData));

        // Create autoload.php
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload loaded";');

        // Mock app singleton method
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('child_theme.composer', $this->callback(function ($callback) {
                $packageInfo = $callback();
                return $packageInfo['name'] === 'test/child-theme' &&
                       $packageInfo['version'] === '1.0.0';
            }));

        // Should not throw any exceptions
        $this->bootChildTheme->bootstrap($this->app);
        $this->assertTrue(true);
    }

    /**
     * Test bootstrap method when not using child theme
     */
    public function testBootstrapWhenNotUsingChildTheme()
    {
        // Set same path for parent and child theme
        $GLOBALS['test_parent_theme_path'] = $this->tempChildThemePath;

        // Should not call singleton method
        $this->app->expects($this->never())
            ->method('singleton');

        $this->bootChildTheme->bootstrap($this->app);
        $this->assertTrue(true);
    }

    /**
     * Test bootstrap method when composer.json doesn't exist
     */
    public function testBootstrapWhenComposerJsonNotExists()
    {
        // Should not call singleton method
        $this->app->expects($this->never())
            ->method('singleton');

        $this->bootChildTheme->bootstrap($this->app);
        $this->assertTrue(true);
    }

    /**
     * Test shouldLoadChildThemeComposer method
     */
    public function testShouldLoadChildThemeComposer()
    {
        // Test with valid setup
        $composerJsonPath = $this->tempComposerJsonPath;
        $vendorPath = $this->tempVendorPath;

        // Create required files
        file_put_contents($composerJsonPath, '{"name": "test/child-theme"}');
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload";');

        $result = $this->callProtectedMethod('shouldLoadChildThemeComposer', $composerJsonPath, $vendorPath);
        $this->assertTrue($result);
    }

    /**
     * Test shouldLoadChildThemeComposer when not using child theme
     */
    public function testShouldLoadChildThemeComposerWhenNotChildTheme()
    {
        // Set same path for parent and child theme
        $GLOBALS['test_parent_theme_path'] = $this->tempChildThemePath;

        $composerJsonPath = $this->tempComposerJsonPath;
        $vendorPath = $this->tempVendorPath;

        $result = $this->callProtectedMethod('shouldLoadChildThemeComposer', $composerJsonPath, $vendorPath);
        $this->assertFalse($result);
    }

    /**
     * Test shouldLoadChildThemeComposer when composer.json doesn't exist
     */
    public function testShouldLoadChildThemeComposerWhenComposerJsonNotExists()
    {
        $composerJsonPath = '/non/existent/composer.json';
        $vendorPath = $this->tempVendorPath;

        $result = $this->callProtectedMethod('shouldLoadChildThemeComposer', $composerJsonPath, $vendorPath);
        $this->assertFalse($result);
    }

    /**
     * Test shouldLoadChildThemeComposer when vendor directory doesn't exist
     */
    public function testShouldLoadChildThemeComposerWhenVendorDirectoryNotExists()
    {
        $composerJsonPath = $this->tempComposerJsonPath;
        $vendorPath = '/non/existent/vendor';

        file_put_contents($composerJsonPath, '{"name": "test/child-theme"}');

        $result = $this->callProtectedMethod('shouldLoadChildThemeComposer', $composerJsonPath, $vendorPath);
        $this->assertFalse($result);
    }

    /**
     * Test shouldLoadChildThemeComposer when autoload.php doesn't exist
     */
    public function testShouldLoadChildThemeComposerWhenAutoloadPhpNotExists()
    {
        $composerJsonPath = $this->tempComposerJsonPath;
        $vendorPath = $this->tempVendorPath;

        file_put_contents($composerJsonPath, '{"name": "test/child-theme"}');
        // Don't create autoload.php

        $result = $this->callProtectedMethod('shouldLoadChildThemeComposer', $composerJsonPath, $vendorPath);
        $this->assertFalse($result);
    }

    /**
     * Test loadChildThemeComposer method
     */
    public function testLoadChildThemeComposer()
    {
        $childThemePath = $this->tempChildThemePath;
        $composerJsonPath = $this->tempComposerJsonPath;
        $vendorPath = $this->tempVendorPath;

        // Create valid composer.json
        $composerData = [
            'name' => 'test/child-theme',
            'version' => '1.0.0',
            'description' => 'Test child theme'
        ];
        file_put_contents($composerJsonPath, json_encode($composerData));

        // Create autoload.php
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload loaded";');

        // Mock app singleton method
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('child_theme.composer', $this->callback(function ($callback) {
                $packageInfo = $callback();
                return $packageInfo['name'] === 'test/child-theme' &&
                       $packageInfo['version'] === '1.0.0' &&
                       $packageInfo['description'] === 'Test child theme';
            }));

        $this->callProtectedMethod('loadChildThemeComposer', $childThemePath, $composerJsonPath, $vendorPath);
    }

    /**
     * Test loadChildThemeComposer with invalid composer.json
     */
    public function testLoadChildThemeComposerWithInvalidComposerJson()
    {
        $childThemePath = $this->tempChildThemePath;
        $composerJsonPath = $this->tempComposerJsonPath;
        $vendorPath = $this->tempVendorPath;

        // Create invalid composer.json
        file_put_contents($composerJsonPath, 'invalid json');

        // Create autoload.php
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload loaded";');

        // Should not call singleton method
        $this->app->expects($this->never())
            ->method('singleton');

        $this->callProtectedMethod('loadChildThemeComposer', $childThemePath, $composerJsonPath, $vendorPath);
    }

    /**
     * Test registerChildThemeComposerInfo method
     */
    public function testRegisterChildThemeComposerInfo()
    {
        $childThemePath = $this->tempChildThemePath;
        $composerJsonPath = $this->tempComposerJsonPath;

        // Create valid composer.json
        $composerData = [
            'name' => 'test/child-theme',
            'version' => '1.0.0',
            'description' => 'Test child theme',
            'authors' => [
                ['name' => 'Test Author', 'email' => 'test@example.com']
            ],
            'require' => [
                'php' => '>=7.4',
                'monolog/monolog' => '^2.0'
            ],
            'autoload' => [
                'psr-4' => [
                    'TestChild\\' => 'src/'
                ],
                'files' => [
                    'src/helpers.php'
                ]
            ]
        ];
        file_put_contents($composerJsonPath, json_encode($composerData));

        // Mock app singleton method
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('child_theme.composer', $this->callback(function ($callback) {
                $packageInfo = $callback();
                return $packageInfo['name'] === 'test/child-theme' &&
                       $packageInfo['version'] === '1.0.0' &&
                       $packageInfo['description'] === 'Test child theme' &&
                       isset($packageInfo['authors']) &&
                       isset($packageInfo['require']) &&
                       isset($packageInfo['autoload']) &&
                       $packageInfo['child_theme_path'] === $this->tempChildThemePath &&
                       $packageInfo['composer_json_path'] === $this->tempComposerJsonPath &&
                       $packageInfo['vendor_path'] === $this->tempChildThemePath . '/vendor';
            }));

        $this->callProtectedMethod('registerChildThemeComposerInfo', $childThemePath, $composerJsonPath);
    }

    /**
     * Test registerChildThemeComposerInfo with missing composer.json
     */
    public function testRegisterChildThemeComposerInfoWithMissingComposerJson()
    {
        $childThemePath = $this->tempChildThemePath;
        $composerJsonPath = '/non/existent/composer.json';

        // Should not call singleton method
        $this->app->expects($this->never())
            ->method('singleton');

        $this->callProtectedMethod('registerChildThemeComposerInfo', $childThemePath, $composerJsonPath);
    }

    /**
     * Test getChildThemeComposerInfo static method
     */
    public function testGetChildThemeComposerInfo()
    {
        // Mock jankx_app function
        $GLOBALS['test_jankx_app'] = $this->app;

        // Mock app make method
        $this->app->expects($this->once())
            ->method('make')
            ->with('child_theme.composer')
            ->willReturn(['name' => 'test/child-theme', 'version' => '1.0.0']);

        $result = BootChildTheme::getChildThemeComposerInfo();
        $this->assertEquals(['name' => 'test/child-theme', 'version' => '1.0.0'], $result);
    }

    /**
     * Test getChildThemeComposerInfo when jankx_app function doesn't exist
     */
    public function testGetChildThemeComposerInfoWhenJankxAppNotExists()
    {
        // Unset jankx_app function
        $GLOBALS['test_jankx_app'] = null;

        $result = BootChildTheme::getChildThemeComposerInfo();
        $this->assertNull($result);
    }

    /**
     * Test getChildThemeComposerInfo when app is null
     */
    public function testGetChildThemeComposerInfoWhenAppIsNull()
    {
        // Set jankx_app to return null
        $GLOBALS['test_jankx_app'] = null;

        $result = BootChildTheme::getChildThemeComposerInfo();
        $this->assertNull($result);
    }

    /**
     * Test getChildThemeComposerInfo when service doesn't exist
     */
    public function testGetChildThemeComposerInfoWhenServiceNotExists()
    {
        // Mock jankx_app function
        $GLOBALS['test_jankx_app'] = $this->app;

        // Mock app make method to throw exception
        $this->app->expects($this->once())
            ->method('make')
            ->with('child_theme.composer')
            ->willThrowException(new \Exception('Service not found'));

        $result = BootChildTheme::getChildThemeComposerInfo();
        $this->assertNull($result);
    }

    /**
     * Test hasChildThemeComposer static method
     */
    public function testHasChildThemeComposer()
    {
        // Create valid setup
        file_put_contents($this->tempComposerJsonPath, '{"name": "test/child-theme"}');
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload";');

        $result = BootChildTheme::hasChildThemeComposer();
        $this->assertTrue($result);
    }

    /**
     * Test hasChildThemeComposer when composer.json doesn't exist
     */
    public function testHasChildThemeComposerWhenComposerJsonNotExists()
    {
        $result = BootChildTheme::hasChildThemeComposer();
        $this->assertFalse($result);
    }

    /**
     * Test hasChildThemeComposer when vendor directory doesn't exist
     */
    public function testHasChildThemeComposerWhenVendorDirectoryNotExists()
    {
        file_put_contents($this->tempComposerJsonPath, '{"name": "test/child-theme"}');

        $result = BootChildTheme::hasChildThemeComposer();
        $this->assertFalse($result);
    }

    /**
     * Test hasChildThemeComposer when autoload.php doesn't exist
     */
    public function testHasChildThemeComposerWhenAutoloadPhpNotExists()
    {
        file_put_contents($this->tempComposerJsonPath, '{"name": "test/child-theme"}');
        // Don't create autoload.php

        $result = BootChildTheme::hasChildThemeComposer();
        $this->assertFalse($result);
    }

    /**
     * Test getChildThemeVendorPath static method
     */
    public function testGetChildThemeVendorPath()
    {
        // Create valid setup
        file_put_contents($this->tempComposerJsonPath, '{"name": "test/child-theme"}');
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload";');

        $result = BootChildTheme::getChildThemeVendorPath();
        $this->assertEquals($this->tempChildThemePath . '/vendor', $result);
    }

    /**
     * Test getChildThemeVendorPath when composer setup doesn't exist
     */
    public function testGetChildThemeVendorPathWhenComposerNotExists()
    {
        $result = BootChildTheme::getChildThemeVendorPath();
        $this->assertNull($result);
    }

    /**
     * Test getChildThemeComposerJsonPath static method
     */
    public function testGetChildThemeComposerJsonPath()
    {
        // Create valid setup
        file_put_contents($this->tempComposerJsonPath, '{"name": "test/child-theme"}');
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload";');

        $result = BootChildTheme::getChildThemeComposerJsonPath();
        $this->assertEquals($this->tempChildThemePath . '/composer.json', $result);
    }

    /**
     * Test getChildThemeComposerJsonPath when composer setup doesn't exist
     */
    public function testGetChildThemeComposerJsonPathWhenComposerNotExists()
    {
        $result = BootChildTheme::getChildThemeComposerJsonPath();
        $this->assertNull($result);
    }

    /**
     * Test bootstrap method with exception handling
     */
    public function testBootstrapWithException()
    {
        // Create valid composer.json
        $composerData = ['name' => 'test/child-theme'];
        file_put_contents($this->tempComposerJsonPath, json_encode($composerData));

        // Create autoload.php that throws exception
        file_put_contents($this->tempAutoloadPath, '<?php throw new Exception("Test exception");');

        // Should not throw exception
        $this->bootChildTheme->bootstrap($this->app);
        $this->assertTrue(true);
    }

    /**
     * Test bootstrap method with invalid composer.json
     */
    public function testBootstrapWithInvalidComposerJson()
    {
        // Create invalid composer.json
        file_put_contents($this->tempComposerJsonPath, 'invalid json');

        // Create autoload.php
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload loaded";');

        // Should not call singleton method
        $this->app->expects($this->never())
            ->method('singleton');

        $this->bootChildTheme->bootstrap($this->app);
        $this->assertTrue(true);
    }

    /**
     * Test bootstrap method with empty composer.json
     */
    public function testBootstrapWithEmptyComposerJson()
    {
        // Create empty composer.json
        file_put_contents($this->tempComposerJsonPath, '{}');

        // Create autoload.php
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload loaded";');

        // Mock app singleton method with default values
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('child_theme.composer', $this->callback(function ($callback) {
                $packageInfo = $callback();
                return $packageInfo['name'] === 'unknown/child-theme' &&
                       $packageInfo['version'] === '1.0.0' &&
                       $packageInfo['description'] === '';
            }));

        $this->bootChildTheme->bootstrap($this->app);
    }

    /**
     * Test bootstrap method with complex composer.json
     */
    public function testBootstrapWithComplexComposerJson()
    {
        // Create complex composer.json
        $composerData = [
            'name' => 'test/child-theme',
            'version' => '2.0.0',
            'description' => 'Complex test child theme',
            'type' => 'wordpress-theme',
            'license' => 'GPL-2.0',
            'authors' => [
                ['name' => 'Author 1', 'email' => 'author1@example.com'],
                ['name' => 'Author 2', 'email' => 'author2@example.com']
            ],
            'require' => [
                'php' => '>=7.4',
                'monolog/monolog' => '^2.0',
                'guzzlehttp/guzzle' => '^7.0'
            ],
            'require-dev' => [
                'phpunit/phpunit' => '^9.0'
            ],
            'autoload' => [
                'psr-4' => [
                    'TestChild\\' => 'src/',
                    'TestChild\\Services\\' => 'src/Services/',
                    'TestChild\\Controllers\\' => 'src/Controllers/'
                ],
                'files' => [
                    'src/helpers.php',
                    'src/functions.php'
                ]
            ],
            'autoload-dev' => [
                'psr-4' => [
                    'TestChild\\Tests\\' => 'tests/'
                ]
            ],
            'config' => [
                'optimize-autoloader' => true
            ]
        ];
        file_put_contents($this->tempComposerJsonPath, json_encode($composerData));

        // Create autoload.php
        file_put_contents($this->tempAutoloadPath, '<?php echo "autoload loaded";');

        // Mock app singleton method
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('child_theme.composer', $this->callback(function ($callback) {
                $packageInfo = $callback();
                return $packageInfo['name'] === 'test/child-theme' &&
                       $packageInfo['version'] === '2.0.0' &&
                       $packageInfo['description'] === 'Complex test child theme' &&
                       $packageInfo['type'] === 'wordpress-theme' &&
                       $packageInfo['license'] === 'GPL-2.0' &&
                       count($packageInfo['authors']) === 2 &&
                       count($packageInfo['require']) === 3 &&
                       count($packageInfo['require-dev']) === 1 &&
                       isset($packageInfo['autoload']['psr-4']) &&
                       isset($packageInfo['autoload']['files']) &&
                       isset($packageInfo['autoload-dev']['psr-4']) &&
                       isset($packageInfo['config']['optimize-autoloader']);
            }));

        $this->bootChildTheme->bootstrap($this->app);
    }
}
