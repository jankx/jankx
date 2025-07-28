<?php

namespace Tests\CLI\Checkers;

use Jankx\CLI\Checkers\MissingSinceTagChecker;
use Tests\TestCase;

/**
 * MissingSinceTagChecker Test
 *
 * @package Tests\CLI\Checkers
 * @since 2.0.0
 */
class MissingSinceTagCheckerTest extends TestCase
{
    protected MissingSinceTagChecker $checker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->checker = new MissingSinceTagChecker();
    }

    public function testMissingSinceTagCheckerExtendsAbstractIssueChecker()
    {
        $this->assertInstanceOf(\Jankx\CLI\Checkers\AbstractIssueChecker::class, $this->checker);
    }

    public function testCheckWithValidSinceTagInClass()
    {
        $content = "<?php\n\n/**\n * Test Class\n *\n * @since 2.0.0\n */\nclass TestClass {\n}";
        $parsed = [
            'classes' => [
                [
                    'name' => 'TestClass',
                    'line' => 7,
                    'docblock' => "/**\n * Test Class\n *\n * @since 2.0.0\n */"
                ]
            ],
            'methods' => []
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithMissingSinceTagInClass()
    {
        $content = "<?php\n\n/**\n * Test Class\n */\nclass TestClass {\n}";
        $parsed = [
            'classes' => [
                [
                    'name' => 'TestClass',
                    'line' => 5,
                    'docblock' => "/**\n * Test Class\n */"
                ]
            ],
            'methods' => []
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);

        $issue = $issues[0];
        $this->assertEquals('missing_since_tag', $issue['type']);
        $this->assertEquals('warning', $issue['severity']);
        $this->assertEquals("Class 'TestClass' is missing @since tag", $issue['message']);
        $this->assertTrue($issue['fixable']);
        $this->assertEquals('class', $issue['target']);
        $this->assertEquals('TestClass', $issue['name']);
    }

    public function testCheckWithValidSinceTagInMethod()
    {
        $content = "<?php\n\nclass TestClass {\n    /**\n     * Test method\n     *\n     * @since 2.0.0\n     */\n    public function testMethod() {\n    }\n}";
        $parsed = [
            'classes' => [],
            'methods' => [
                [
                    'name' => 'testMethod',
                    'class' => 'TestClass',
                    'line' => 8,
                    'docblock' => "/**\n     * Test method\n     *\n     * @since 2.0.0\n     */"
                ]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithMissingSinceTagInMethod()
    {
        $content = "<?php\n\nclass TestClass {\n    /**\n     * Test method\n     */\n    public function testMethod() {\n    }\n}";
        $parsed = [
            'classes' => [],
            'methods' => [
                [
                    'name' => 'testMethod',
                    'class' => 'TestClass',
                    'line' => 6,
                    'docblock' => "/**\n     * Test method\n     */"
                ]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);

        $issue = $issues[0];
        $this->assertEquals('missing_since_tag', $issue['type']);
        $this->assertEquals('warning', $issue['severity']);
        $this->assertEquals("Method 'testMethod' in class 'TestClass' is missing @since tag", $issue['message']);
        $this->assertTrue($issue['fixable']);
        $this->assertEquals('method', $issue['target']);
        $this->assertEquals('testMethod', $issue['name']);
        $this->assertEquals('TestClass', $issue['class']);
    }

    public function testCheckWithMultipleClasses()
    {
        $content = "<?php\n\n/**\n * First Class\n */\nclass FirstClass {\n}\n\n/**\n * Second Class\n *\n * @since 2.0.0\n */\nclass SecondClass {\n}";
        $parsed = [
            'classes' => [
                [
                    'name' => 'FirstClass',
                    'line' => 5,
                    'docblock' => "/**\n * First Class\n */"
                ],
                [
                    'name' => 'SecondClass',
                    'line' => 12,
                    'docblock' => "/**\n * Second Class\n *\n * @since 2.0.0\n */"
                ]
            ],
            'methods' => []
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);

        $issue = $issues[0];
        $this->assertEquals('FirstClass', $issue['name']);
    }

    public function testCheckWithMultipleMethods()
    {
        $content = "<?php\n\nclass TestClass {\n    /**\n     * First method\n     */\n    public function firstMethod() {\n    }\n\n    /**\n     * Second method\n     *\n     * @since 2.0.0\n     */\n    public function secondMethod() {\n    }\n}";
        $parsed = [
            'classes' => [],
            'methods' => [
                [
                    'name' => 'firstMethod',
                    'class' => 'TestClass',
                    'line' => 6,
                    'docblock' => "/**\n     * First method\n     */"
                ],
                [
                    'name' => 'secondMethod',
                    'class' => 'TestClass',
                    'line' => 13,
                    'docblock' => "/**\n     * Second method\n     *\n     * @since 2.0.0\n     */"
                ]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);

        $issue = $issues[0];
        $this->assertEquals('firstMethod', $issue['name']);
    }

    public function testCheckWithNoClassesOrMethods()
    {
        $content = "<?php\n\necho 'Hello World';";
        $parsed = [
            'classes' => [],
            'methods' => []
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertEmpty($issues);
    }

    public function testCheckWithClassWithoutDocblock()
    {
        $content = "<?php\n\nclass TestClass {\n}";
        $parsed = [
            'classes' => [
                [
                    'name' => 'TestClass',
                    'line' => 3,
                    'docblock' => ''
                ]
            ],
            'methods' => []
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);
    }

    public function testCheckWithMethodWithoutDocblock()
    {
        $content = "<?php\n\nclass TestClass {\n    public function testMethod() {\n    }\n}";
        $parsed = [
            'classes' => [],
            'methods' => [
                [
                    'name' => 'testMethod',
                    'class' => 'TestClass',
                    'line' => 4,
                    'docblock' => ''
                ]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(1, $issues);
    }

    public function testCheckWithMixedIssues()
    {
        $content = "<?php\n\n/**\n * Test Class\n */\nclass TestClass {\n    /**\n     * Test method\n     *\n     * @since 2.0.0\n     */\n    public function validMethod() {\n    }\n\n    /**\n     * Another method\n     */\n    public function invalidMethod() {\n    }\n}";
        $parsed = [
            'classes' => [
                [
                    'name' => 'TestClass',
                    'line' => 5,
                    'docblock' => "/**\n * Test Class\n */"
                ]
            ],
            'methods' => [
                [
                    'name' => 'validMethod',
                    'class' => 'TestClass',
                    'line' => 10,
                    'docblock' => "/**\n     * Test method\n     *\n     * @since 2.0.0\n     */"
                ],
                [
                    'name' => 'invalidMethod',
                    'class' => 'TestClass',
                    'line' => 17,
                    'docblock' => "/**\n     * Another method\n     */"
                ]
            ]
        ];

        $issues = $this->checker->check($parsed, $content);

        $this->assertIsArray($issues);
        $this->assertNotEmpty($issues);
        $this->assertCount(2, $issues);

        $classIssue = $issues[0];
        $methodIssue = $issues[1];

        $this->assertEquals('class', $classIssue['target']);
        $this->assertEquals('method', $methodIssue['target']);
    }
}