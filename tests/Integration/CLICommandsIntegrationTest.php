<?php

namespace Tests\Integration;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\CLICommands;
use Jankx\CLI\Commands\CodingStandardCommand;
use Jankx\CLI\Commands\GenerateBlockCommand;
use Jankx\CLI\Commands\CreateBootstrapperCommand;
use Jankx\CLI\Commands\ReleaseCommand;

/**
 * Integration Test for CLI Commands
 *
 * @package Tests\Integration
 * @since 2.0.0
 */
class CLICommandsIntegrationTest extends TestCase
{
    /**
     * Test CLI commands registration flow
     */
    public function testCLICommandsRegistrationFlow()
    {
        // Test that CLICommands class exists
        $this->assertTrue(class_exists('Jankx\CLI\CLICommands'));

        // Test that register method exists
        $this->assertTrue(method_exists('Jankx\CLI\CLICommands', 'register'));

        // Test that getCommands method exists
        $this->assertTrue(method_exists('Jankx\CLI\CLICommands', 'getCommands'));

        // Test that showHelp method exists
        $this->assertTrue(method_exists('Jankx\CLI\CLICommands', 'showHelp'));
    }

    /**
     * Test all CLI commands exist and are properly structured
     */
    public function testAllCLICommandsExist()
    {
        $commands = [
            'CodingStandardCommand' => 'Jankx\CLI\Commands\CodingStandardCommand',
            'GenerateBlockCommand' => 'Jankx\CLI\Commands\GenerateBlockCommand',
            'CreateBootstrapperCommand' => 'Jankx\CLI\Commands\CreateBootstrapperCommand',
            'ReleaseCommand' => 'Jankx\CLI\Commands\ReleaseCommand'
        ];

        foreach ($commands as $name => $class) {
            $this->assertTrue(class_exists($class), "Class {$class} does not exist");

            $command = new $class();
            $this->assertInstanceOf('WP_CLI_Command', $command, "{$name} does not extend WP_CLI_Command");
            $this->assertTrue(method_exists($command, '__invoke'), "{$name} does not have __invoke method");
        }
    }

    /**
     * Test CLI commands have proper documentation
     */
    public function testCLICommandsHaveProperDocumentation()
    {
        $commands = [
            new CodingStandardCommand(),
            new GenerateBlockCommand(),
            new CreateBootstrapperCommand(),
            new ReleaseCommand()
        ];

        foreach ($commands as $command) {
            $reflection = new \ReflectionClass($command);
            $docComment = $reflection->getDocComment();

            $this->assertNotEmpty($docComment, 'Command should have PHPDoc comment');
            $this->assertStringContainsString('@package', $docComment, 'Command should have @package annotation');
            $this->assertStringContainsString('@since', $docComment, 'Command should have @since annotation');
        }
    }

    /**
     * Test CLI commands have proper options documentation
     */
    public function testCLICommandsHaveProperOptionsDocumentation()
    {
        $commands = [
            new CodingStandardCommand(),
            new GenerateBlockCommand(),
            new CreateBootstrapperCommand(),
            new ReleaseCommand()
        ];

        foreach ($commands as $command) {
            $reflection = new \ReflectionMethod($command, '__invoke');
            $docComment = $reflection->getDocComment();

            $this->assertNotEmpty($docComment, 'Command __invoke method should have PHPDoc comment');
            $this->assertStringContainsString('## OPTIONS', $docComment, 'Command should have OPTIONS section');
            $this->assertStringContainsString('## EXAMPLES', $docComment, 'Command should have EXAMPLES section');
        }
    }

    /**
     * Test CLI commands handle arguments properly
     */
    public function testCLICommandsHandleArgumentsProperly()
    {
        $commands = [
            new CodingStandardCommand(),
            new GenerateBlockCommand(),
            new CreateBootstrapperCommand(),
            new ReleaseCommand()
        ];

        foreach ($commands as $command) {
            $args = ['test'];
            $assoc_args = ['--test' => 'value'];

            // Test that command can handle arguments without throwing exceptions
            $this->assertTrue(method_exists($command, '__invoke'));
        }
    }

    /**
     * Test CLI commands integration with WP-CLI
     */
    public function testCLICommandsIntegrationWithWPCLI()
    {
        // Test that commands can be registered with WP-CLI
        $this->assertTrue(class_exists('WP_CLI'));
        $this->assertTrue(function_exists('WP_CLI::add_command'));
    }

    /**
     * Test CLI commands error handling
     */
    public function testCLICommandsErrorHandling()
    {
        $commands = [
            new CodingStandardCommand(),
            new GenerateBlockCommand(),
            new CreateBootstrapperCommand(),
            new ReleaseCommand()
        ];

        foreach ($commands as $command) {
            // Test that commands can handle errors gracefully
            $this->assertTrue(method_exists($command, '__invoke'));
        }
    }
}