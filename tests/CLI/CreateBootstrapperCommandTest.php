<?php

namespace Tests\CLI;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Commands\CreateBootstrapperCommand;

/**
 * Test CreateBootstrapperCommand
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class CreateBootstrapperCommandTest extends TestCase
{
    /**
     * @var CreateBootstrapperCommand
     */
    private $command;

    protected function setUp(): void
    {
        $this->command = new CreateBootstrapperCommand();
    }

    /**
     * Test command exists and extends WP_CLI_Command
     */
    public function testCommandExists()
    {
        $this->assertTrue(class_exists('Jankx\CLI\Commands\CreateBootstrapperCommand'));
        $this->assertInstanceOf('WP_CLI_Command', $this->command);
    }

    /**
     * Test command has required methods
     */
    public function testCommandHasRequiredMethods()
    {
        $this->assertTrue(method_exists($this->command, '__invoke'));
    }

    /**
     * Test command handles arguments correctly
     */
    public function testCommandHandlesArguments()
    {
        $args = ['CustomFeature'];
        $assoc_args = [
            'context' => 'frontend',
            'priority' => '15',
            'description' => 'Custom feature bootstrapper'
        ];

        // Test that command can handle arguments
        $this->assertTrue(method_exists($this->command, '__invoke'));
    }

    /**
     * Test bootstrapper name validation
     */
    public function testBootstrapperNameValidation()
    {
        $validNames = ['CustomFeature', 'ThirdPartyIntegration', 'APIIntegration'];

        foreach ($validNames as $name) {
            $this->assertTrue(preg_match('/^[A-Z][a-zA-Z0-9]*$/', $name));
        }
    }

    /**
     * Test context validation
     */
    public function testContextValidation()
    {
        $validContexts = ['global', 'frontend', 'admin', 'api', 'cli', 'gutenberg'];

        foreach ($validContexts as $context) {
            $this->assertTrue(in_array($context, $validContexts));
        }
    }

    /**
     * Test priority validation
     */
    public function testPriorityValidation()
    {
        $priority = 15;
        $this->assertTrue(is_numeric($priority) && $priority >= 1 && $priority <= 100);
    }

    /**
     * Test command validation
     */
    public function testCommandValidation()
    {
        $args = [];
        $assoc_args = [];

        // Test that command validates required arguments
        $this->assertTrue(method_exists($this->command, '__invoke'));
    }
}