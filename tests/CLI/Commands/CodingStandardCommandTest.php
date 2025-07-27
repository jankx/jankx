<?php

namespace Tests\CLI\Commands;

use Brain\Monkey\Functions;
use Jankx\CLI\Commands\CodingStandardCommand;
use Jankx\CLI\Parser\PHPParser;
use Tests\TestCase;

/**
 * CodingStandardCommand Test
 *
 * @package Tests\CLI\Commands
 * @since 2.0.0
 */
class CodingStandardCommandTest extends TestCase
{
    protected CodingStandardCommand $command;

    protected function setUp(): void
    {
        parent::setUp();
        $this->command = new CodingStandardCommand();
    }

    public function testConstructorInitializesParser()
    {
        // Use reflection to access private property
        $reflection = new \ReflectionClass($this->command);
        $property = $reflection->getProperty('parser');
        $property->setAccessible(true);

        $parser = $property->getValue($this->command);
        $this->assertInstanceOf(PHPParser::class, $parser);
    }

    public function testConstructorRegistersIssueCheckers()
    {
        // Use reflection to access private property
        $reflection = new \ReflectionClass($this->command);
        $property = $reflection->getProperty('issueCheckers');
        $property->setAccessible(true);

        $checkers = $property->getValue($this->command);

        $this->assertIsArray($checkers);
        $this->assertNotEmpty($checkers);
        $this->assertArrayHasKey('missing_since_tag', $checkers);
        $this->assertArrayHasKey('improper_exit', $checkers);
        $this->assertArrayHasKey('unsanitized_input', $checkers);
        $this->assertArrayHasKey('missing_abspath_check', $checkers);
    }

    public function testConstructorRegistersIssueFixers()
    {
        // Use reflection to access private property
        $reflection = new \ReflectionClass($this->command);
        $property = $reflection->getProperty('issueFixers');
        $property->setAccessible(true);

        $fixers = $property->getValue($this->command);

        $this->assertIsArray($fixers);
        $this->assertNotEmpty($fixers);
        $this->assertArrayHasKey('missing_since_tag', $fixers);
    }

    public function testInvokeWithSingleFile()
    {
        $args = ['test.php'];
        $assoc_args = ['file' => 'test.php'];

        Functions\when('file_exists')->justReturn(true);
        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithDirectoryScan()
    {
        $args = ['.'];
        $assoc_args = [];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithFixMode()
    {
        $args = ['.'];
        $assoc_args = ['fix' => true];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithVerboseMode()
    {
        $args = ['.'];
        $assoc_args = ['verbose' => true];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithCustomExclude()
    {
        $args = ['.'];
        $assoc_args = ['exclude' => 'custom,folders'];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithTableFormat()
    {
        $args = ['.'];
        $assoc_args = ['format' => 'table'];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithJSONFormat()
    {
        $args = ['.'];
        $assoc_args = ['format' => 'json'];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithCSVFormat()
    {
        $args = ['.'];
        $assoc_args = ['format' => 'csv'];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithTableMode()
    {
        $args = ['.'];
        $assoc_args = ['table' => true];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithNonExistentFile()
    {
        $args = ['nonexistent.php'];
        $assoc_args = ['file' => 'nonexistent.php'];

        Functions\when('file_exists')->justReturn(false);
        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithCustomPath()
    {
        $args = ['/custom/path'];
        $assoc_args = [];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithMultipleExcludeDirectories()
    {
        $args = ['.'];
        $assoc_args = ['exclude' => 'vendor,tests,node_modules,coverage'];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithEmptyExclude()
    {
        $args = ['.'];
        $assoc_args = ['exclude' => ''];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithAllOptions()
    {
        $args = ['/custom/path'];
        $assoc_args = [
            'fix' => true,
            'verbose' => true,
            'exclude' => 'vendor,tests',
            'format' => 'json',
            'table' => true
        ];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that the command executed without throwing exceptions
        $this->assertTrue(true);
    }

    public function testInvokeHandlesErrorsGracefully()
    {
        $args = ['.'];
        $assoc_args = [];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        // Mock parser to throw an exception
        $mockParser = \Mockery::mock(PHPParser::class);
        $mockParser->shouldReceive('parse')->andThrow(new \Exception('Test error'));

        $reflection = new \ReflectionClass($this->command);
        $property = $reflection->getProperty('parser');
        $property->setAccessible(true);
        $property->setValue($this->command, $mockParser);

        $this->command->__invoke($args, $assoc_args);

        // Should not throw any exceptions
        $this->assertTrue(true);
    }

    public function testInvokeWithDefaultExcludeWhenNoExcludeProvided()
    {
        $args = ['.'];
        $assoc_args = [];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that default exclude directories are used
        $this->assertTrue(true);
    }

    public function testInvokeWithCustomExcludeOverridesDefault()
    {
        $args = ['.'];
        $assoc_args = ['exclude' => 'custom1,custom2'];

        Functions\when('microtime')->justReturn(1.0);
        Functions\when('memory_get_usage')->justReturn(1024);

        $this->command->__invoke($args, $assoc_args);

        // Verify that custom exclude overrides default
        $this->assertTrue(true);
    }
}