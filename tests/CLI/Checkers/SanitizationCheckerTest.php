<?php

namespace Tests\CLI\Checkers;

use Jankx\CLI\Checkers\SanitizationChecker;
use Tests\TestCase;

/**
 * SanitizationChecker Test
 *
 * @package Tests\CLI\Checkers
 * @since 2.0.0
 */
class SanitizationCheckerTest extends TestCase
{
    protected SanitizationChecker $checker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->checker = new SanitizationChecker();
    }

    public function testSanitizationCheckerExtendsAbstractIssueChecker()
    {
        $this->assertInstanceOf(\Jankx\CLI\Checkers\AbstractIssueChecker::class, $this->checker);
    }

    public function testCheckWithSanitizedPOSTUsage()
    {
        $content = "<?php\n\n\$name = sanitize_text_field(\$_POST['name']);\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithUnsanitizedPOSTUsage()
    {
        $content = "<?php\n\n\$name = \$_POST['name'];\n\nclass TestClass {\n}";
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
        $this->assertEquals('unsanitized_input', $issue['type']);
        $this->assertEquals('error', $issue['severity']);
        $this->assertEquals('Unsanitized $_POST usage', $issue['message']);
        $this->assertTrue($issue['fixable']);
        $this->assertEquals('POST', $issue['fix']['input_type']);
    }

    public function testCheckWithSanitizedGETUsage()
    {
        $content = "<?php\n\n\$id = intval(\$_GET['id']);\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithUnsanitizedGETUsage()
    {
        $content = "<?php\n\n\$id = \$_GET['id'];\n\nclass TestClass {\n}";
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
        $this->assertEquals('unsanitized_input', $issue['type']);
        $this->assertEquals('error', $issue['severity']);
        $this->assertEquals('Unsanitized $_GET usage', $issue['message']);
        $this->assertTrue($issue['fixable']);
        $this->assertEquals('GET', $issue['fix']['input_type']);
    }

    public function testCheckWithMultipleSanitizationFunctions()
    {
        $content = "<?php\n\n\$name = sanitize_text_field(\$_POST['name']);\n\$email = sanitize_email(\$_POST['email']);\n\$url = sanitize_url(\$_GET['url']);\n\$content = wp_kses_post(\$_POST['content']);\n\$number = intval(\$_GET['number']);\n\$float = floatval(\$_GET['float']);\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 9]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithDifferentQuoteTypes()
    {
        $content = "<?php\n\n\$name = \$_POST[\"name\"];\n\$id = \$_GET[\"id\"];\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 6]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(2, $issues);
    }

    public function testCheckWithNoInputUsage()
    {
        $content = "<?php\n\n\$name = 'static value';\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 5]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithSanitizationAfterUsage()
    {
        $content = "<?php\n\n\$name = \$_POST['name'];\n\$sanitized_name = sanitize_text_field(\$name);\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 6]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithSanitizationBeforeUsage()
    {
        $content = "<?php\n\n\$sanitized_name = sanitize_text_field(\$_POST['name']);\n\$name = \$sanitized_name;\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 6]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithComplexSanitizationPatterns()
    {
        $content = "<?php\n\n\$name = sanitize_text_field(trim(\$_POST['name']));\n\$email = sanitize_email(strtolower(\$_POST['email']));\n\$content = wp_kses_post(stripslashes(\$_POST['content']));\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 7]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithWhitespaceInSanitization()
    {
        $content = "<?php\n\n\$name = sanitize_text_field ( \$_POST['name'] );\n\$id = intval ( \$_GET['id'] );\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 6]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithMultipleUnsanitizedUsages()
    {
        $content = "<?php\n\n\$name = \$_POST['name'];\n\$email = \$_POST['email'];\n\$id = \$_GET['id'];\n\$page = \$_GET['page'];\n\nclass TestClass {\n}";
        $parsed = [
            'functions' => [],
            'classes' => [
                ['line' => 8]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(4, $issues);
    }
}