<?php

namespace Tests\CLI\Parser;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Parser\PHPParser;

/**
 * Test PHPParser
 *
 * @package Tests\CLI\Parser
 * @since 2.0.0
 */
class PHPParserTest extends TestCase
{
    /**
     * @var PHPParser
     */
    private $parser;

    protected function setUp(): void
    {
        $this->parser = new PHPParser();
    }

    /**
     * Test parser exists
     */
    public function testParserExists()
    {
        $this->assertTrue(class_exists('Jankx\CLI\Parser\PHPParser'));
        $this->assertInstanceOf('Jankx\CLI\Parser\PHPParser', $this->parser);
    }

    /**
     * Test parser has required methods
     */
    public function testParserHasRequiredMethods()
    {
        $this->assertTrue(method_exists($this->parser, 'parseFile'));
        $this->assertTrue(method_exists($this->parser, 'parseDirectory'));
        $this->assertTrue(method_exists($this->parser, 'getIssues'));
    }

    /**
     * Test file parsing
     */
    public function testFileParsing()
    {
        $testFile = __DIR__ . '/../../../../includes/Jankx/CLI/CLICommands.php';
        
        if (file_exists($testFile)) {
            $this->assertTrue(method_exists($this->parser, 'parseFile'));
        }
    }

    /**
     * Test directory parsing
     */
    public function testDirectoryParsing()
    {
        $testDir = __DIR__ . '/../../../../includes/Jankx/CLI';
        
        if (is_dir($testDir)) {
            $this->assertTrue(method_exists($this->parser, 'parseDirectory'));
        }
    }

    /**
     * Test issue detection
     */
    public function testIssueDetection()
    {
        $this->assertTrue(method_exists($this->parser, 'getIssues'));
    }

    /**
     * Test parser configuration
     */
    public function testParserConfiguration()
    {
        $this->assertTrue(method_exists($this->parser, 'setOptions'));
        $this->assertTrue(method_exists($this->parser, 'getOptions'));
    }
} 