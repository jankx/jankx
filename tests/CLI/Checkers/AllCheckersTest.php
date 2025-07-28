<?php

namespace Tests\CLI\Checkers;

use PHPUnit\Framework\TestCase;

/**
 * Test all CLI Checkers
 *
 * @package Tests\CLI\Checkers
 * @since 2.0.0
 */
class AllCheckersTest extends TestCase
{
    /**
     * Test all checkers exist
     */
    public function testAllCheckersExist()
    {
        $checkers = [
            'Jankx\CLI\Checkers\AbstractIssueChecker',
            'Jankx\CLI\Checkers\ExitUsageChecker',
            'Jankx\CLI\Checkers\MissingSinceTagChecker',
            'Jankx\CLI\Checkers\SanitizationChecker'
        ];

        foreach ($checkers as $checker) {
            $this->assertTrue(class_exists($checker), "Checker {$checker} does not exist");
        }
    }

    /**
     * Test all checkers extend AbstractIssueChecker
     */
    public function testAllCheckersExtendAbstractIssueChecker()
    {
        $checkers = [
            'Jankx\CLI\Checkers\ExitUsageChecker',
            'Jankx\CLI\Checkers\MissingSinceTagChecker',
            'Jankx\CLI\Checkers\SanitizationChecker'
        ];

        foreach ($checkers as $checker) {
            $reflection = new \ReflectionClass($checker);
            $this->assertTrue($reflection->isSubclassOf('Jankx\CLI\Checkers\AbstractIssueChecker'),
                "Checker {$checker} does not extend AbstractIssueChecker");
        }
    }

    /**
     * Test all checkers implement IssueCheckerInterface
     */
    public function testAllCheckersImplementIssueCheckerInterface()
    {
        $checkers = [
            'Jankx\CLI\Checkers\AbstractIssueChecker',
            'Jankx\CLI\Checkers\ExitUsageChecker',
            'Jankx\CLI\Checkers\MissingSinceTagChecker',
            'Jankx\CLI\Checkers\SanitizationChecker'
        ];

        foreach ($checkers as $checker) {
            $reflection = new \ReflectionClass($checker);
            $this->assertTrue($reflection->implementsInterface('Jankx\CLI\Checkers\IssueCheckerInterface'),
                "Checker {$checker} does not implement IssueCheckerInterface");
        }
    }

    /**
     * Test all checkers have required methods
     */
    public function testAllCheckersHaveRequiredMethods()
    {
        $checkers = [
            'Jankx\CLI\Checkers\ExitUsageChecker',
            'Jankx\CLI\Checkers\MissingSinceTagChecker',
            'Jankx\CLI\Checkers\SanitizationChecker'
        ];

        foreach ($checkers as $checker) {
            $reflection = new \ReflectionClass($checker);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('check', $methodNames,
                "Checker {$checker} missing check method");
        }
    }
}