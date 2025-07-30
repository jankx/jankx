<?php

namespace Tests\CLI\Checkers;

use Jankx\CLI\Checkers\ExitUsageChecker;
use Tests\TestCase;

/**
 * ExitUsageChecker Test
 *
 * @package Tests\CLI\Checkers
 * @since 2.0.0
 */
class ExitUsageCheckerTest extends TestCase
{
    protected ExitUsageChecker $checker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->checker = new ExitUsageChecker();
    }

    public function testExitUsageCheckerExtendsAbstractIssueChecker()
    {
        $this->assertInstanceOf(\Jankx\CLI\Checkers\AbstractIssueChecker::class, $this->checker);
    }

    public function testCheckWithProperExitUsage()
    {
        $content = "<?php\nif (!defined('ABSPATH')) exit('Direct access not allowed');\n\nclass TestClass {\n}";
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

    public function testCheckWithImproperExitUsage()
    {
        $content = "<?php\n\nexit('Direct access not allowed');\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);

        $issue = $issues[0];
        $this->assertEquals('improper_exit', $issue['type']);
        $this->assertEquals('error', $issue['severity']);
        $this->assertEquals('exit() used without ABSPATH check', $issue['message']);
    }

    public function testCheckWithMultipleImproperExits()
    {
        $content = "<?php\n\nexit('First exit');\n\nexit('Second exit');\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 7]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(2, $issues);

        foreach ($issues as $issue) {
            $this->assertEquals('improper_exit', $issue['type']);
            $this->assertEquals('error', $issue['severity']);
            $this->assertEquals('exit() used without ABSPATH check', $issue['message']);
        }
    }

    public function testCheckWithExitInFunction()
    {
        $content = "<?php\n\nfunction testFunction() {\n    exit('Function exit');\n}\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [
                ['line' => 3]
            ],
            'classes' => [
                ['line' => 7]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);
    }

    public function testCheckWithExitInClass()
    {
        $content = "<?php\n\nclass TestClass {\n    public function testMethod() {\n        exit('Class exit');\n    }\n}";
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
    }

    public function testCheckWithNoExitUsage()
    {
        $content = "<?php\n\nclass TestClass {\n    public function testMethod() {\n        echo 'Hello';\n    }\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 3]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithExitWithDifferentQuotes()
    {
        $content = "<?php\n\nexit(\"Double quotes\");\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);
    }

    public function testCheckWithExitWithoutQuotes()
    {
        $content = "<?php\n\nexit();\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);
    }

    public function testCheckWithExitWithWhitespace()
    {
        $content = "<?php\n\nexit ( 'With whitespace' );\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);
    }

    public function testCheckWithMixedContent()
    {
        $content = "<?php\n// Comment\nexit('First exit');\n\n/* Block comment */\nexit('Second exit');\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 9]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(2, $issues);
    }
}