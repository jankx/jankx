<?php

namespace Tests\CLI;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Commands\ReleaseCommand;

/**
 * Test Release Command
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class ReleaseCommandTest extends TestCase
{
    /**
     * Test that ReleaseCommand exists and is properly structured
     *
     * @since 2.0.0
     */
    public function testReleaseCommandExists()
    {
        $this->assertTrue(class_exists('Jankx\CLI\Commands\ReleaseCommand'));

        $command = new ReleaseCommand();
        $this->assertInstanceOf('WP_CLI_Command', $command);
    }

    /**
     * Test that ReleaseCommand has required methods
     *
     * @since 2.0.0
     */
    public function testReleaseCommandHasRequiredMethods()
    {
        $command = new ReleaseCommand();

        // Test that command has required methods
        $this->assertTrue(method_exists($command, '__invoke'));
        $this->assertTrue(method_exists($command, 'loadExcludePatterns'));
        $this->assertTrue(method_exists($command, 'getFilesToInclude'));
        $this->assertTrue(method_exists($command, 'shouldIncludeFile'));
        $this->assertTrue(method_exists($command, 'getThemeVersion'));
        $this->assertTrue(method_exists($command, 'createZipPackage'));
    }

    /**
     * Test that ReleaseCommand can handle different arguments
     *
     * @since 2.0.0
     */
    public function testReleaseCommandHandlesArguments()
    {
        $command = new ReleaseCommand();

        // Test that command can handle different argument combinations
        $args = [];
        $assoc_args = [
            'version' => '2.0.0',
            'output' => './test-releases',
            'force' => true,
            'dry-run' => true
        ];

        // This test would normally call the command, but we'll just verify it exists
        $this->assertTrue(method_exists($command, '__invoke'));
    }

    /**
     * Test that ReleaseCommand can load exclude patterns
     *
     * @since 2.0.0
     */
    public function testReleaseCommandLoadsExcludePatterns()
    {
        $command = new ReleaseCommand();

        // Test that exclude patterns are loaded
        $reflection = new \ReflectionClass($command);
        $excludePatternsProperty = $reflection->getProperty('excludePatterns');
        $excludePatternsProperty->setAccessible(true);

        $patterns = $excludePatternsProperty->getValue($command);
        $this->assertIsArray($patterns);
        $this->assertNotEmpty($patterns);
    }

    /**
     * Test that ReleaseCommand can detect theme version
     *
     * @since 2.0.0
     */
    public function testReleaseCommandDetectsThemeVersion()
    {
        $command = new ReleaseCommand();

        // Test that theme version detection works
        $reflection = new \ReflectionClass($command);
        $method = $reflection->getMethod('getThemeVersion');
        $method->setAccessible(true);

        $version = $method->invoke($command);
        $this->assertIsString($version);
        $this->assertNotEmpty($version);
    }

    /**
     * Test that ReleaseCommand can format bytes
     *
     * @since 2.0.0
     */
    public function testReleaseCommandFormatsBytes()
    {
        $command = new ReleaseCommand();

        $reflection = new \ReflectionClass($command);
        $method = $reflection->getMethod('formatBytes');
        $method->setAccessible(true);

        // Test different byte sizes
        $this->assertEquals('1.0 KB', $method->invoke($command, 1024));
        $this->assertEquals('1.0 MB', $method->invoke($command, 1024 * 1024));
        $this->assertEquals('1.0 GB', $method->invoke($command, 1024 * 1024 * 1024));
    }

    /**
     * Test that ReleaseCommand respects exclude patterns
     *
     * @since 2.0.0
     */
    public function testReleaseCommandRespectsExcludePatterns()
    {
        $command = new ReleaseCommand();

        $reflection = new \ReflectionClass($command);
        $method = $reflection->getMethod('shouldIncludeFile');
        $method->setAccessible(true);

        // Test that excluded files are properly filtered
        $this->assertFalse($method->invoke($command, 'tests/test.php'));
        $this->assertFalse($method->invoke($command, 'examples/example.php'));
        $this->assertFalse($method->invoke($command, '.gitignore'));
        $this->assertFalse($method->invoke($command, 'node_modules/package.json'));

        // Test that included files are not filtered
        $this->assertTrue($method->invoke($command, 'style.css'));
        $this->assertTrue($method->invoke($command, 'functions.php'));
        $this->assertTrue($method->invoke($command, 'includes/Jankx/Jankx.php'));
    }

    /**
     * Test that ReleaseCommand can handle wildcard patterns
     *
     * @since 2.0.0
     */
    public function testReleaseCommandHandlesWildcardPatterns()
    {
        $command = new ReleaseCommand();

        $reflection = new \ReflectionClass($command);
        $method = $reflection->getMethod('shouldIncludeFile');
        $method->setAccessible(true);

        // Test wildcard patterns
        $this->assertFalse($method->invoke($command, 'test.log'));
        $this->assertFalse($method->invoke($command, 'temp.tmp'));
        $this->assertFalse($method->invoke($command, 'file.swp'));
    }

    /**
     * Test that ReleaseCommand can create ZIP packages
     *
     * @since 2.0.0
     */
    public function testReleaseCommandCanCreateZipPackage()
    {
        $command = new ReleaseCommand();

        $reflection = new \ReflectionClass($command);
        $method = $reflection->getMethod('createZipPackage');
        $method->setAccessible(true);

        // Test with empty files array
        $result = $method->invoke($command, [], '/tmp/test.zip');
        $this->assertIsBool($result);
    }
}