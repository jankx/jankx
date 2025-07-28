<?php

namespace Tests\CLI\Checkers;

use Jankx\CLI\Checkers\ABSPATHChecker;
use Tests\TestCase;

/**
 * ABSPATHChecker Test
 *
 * @package Tests\CLI\Checkers
 * @since 2.0.0
 */
class ABSPATHCheckerTest extends TestCase
{
    protected ABSPATHChecker $checker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->checker = new ABSPATHChecker();
    }

    public function testABSPATHCheckerImplementsInterface()
    {
        $this->assertInstanceOf(\Jankx\CLI\Checkers\IssueCheckerInterface::class, $this->checker);
    }

    public function testCheckWithValidABSPATHCheck()
    {
        $content = "<?php\nif (!defined('ABSPATH')) exit;\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 4]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithMissingABSPATHCheck()
    {
        $content = "<?php\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 3]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);

        $issue = $issues[0];
        $this->assertEquals('missing_abspath_check', $issue['type']);
        $this->assertEquals('error', $issue['severity']);
        $this->assertEquals('PHP file header is missing ABSPATH security check', $issue['message']);
    }
}