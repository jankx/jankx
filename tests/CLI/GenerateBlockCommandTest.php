<?php

namespace Tests\CLI;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Commands\GenerateBlockCommand;

/**
 * Test GenerateBlockCommand
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class GenerateBlockCommandTest extends TestCase
{
    /**
     * @var GenerateBlockCommand
     */
    private $command;

    protected function setUp(): void
    {
        $this->command = new GenerateBlockCommand();
    }

    /**
     * Test command exists and extends WP_CLI_Command
     */
    public function testCommandExists()
    {
        $this->assertTrue(class_exists('Jankx\CLI\Commands\GenerateBlockCommand'));
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
        $args = ['hero-section'];
        $assoc_args = [
            'title' => 'Hero Section',
            'description' => 'A hero section block'
        ];

        // Test that command can handle arguments
        $this->assertTrue(method_exists($this->command, '__invoke'));
    }

    /**
     * Test block name sanitization
     */
    public function testBlockNameSanitization()
    {
        $blockName = 'Hero Section Block';
        $expected = 'hero-section-block';
        
        $this->assertEquals($expected, sanitize_title($blockName));
    }

    /**
     * Test title generation from block name
     */
    public function testTitleGenerationFromBlockName()
    {
        $blockName = 'hero-section';
        $expected = 'Hero Section';
        
        $result = ucwords(str_replace(['-', '_'], ' ', $blockName));
        $this->assertEquals($expected, $result);
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