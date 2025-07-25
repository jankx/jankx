<?php

namespace Tests\CLI\Fixers;

use PHPUnit\Framework\TestCase;

/**
 * Test all CLI Fixers
 *
 * @package Tests\CLI\Fixers
 * @since 2.0.0
 */
class AllFixersTest extends TestCase
{
    /**
     * Test all fixers exist
     */
    public function testAllFixersExist()
    {
        $fixers = [
            'Jankx\CLI\Fixers\ImproperExitFixer',
            'Jankx\CLI\Fixers\MissingSinceTagFixer',
            'Jankx\CLI\Fixers\UnsanitizedInputFixer'
        ];

        foreach ($fixers as $fixer) {
            $this->assertTrue(class_exists($fixer), "Fixer {$fixer} does not exist");
        }
    }

    /**
     * Test all fixers implement IssueFixerInterface
     */
    public function testAllFixersImplementIssueFixerInterface()
    {
        $fixers = [
            'Jankx\CLI\Fixers\ImproperExitFixer',
            'Jankx\CLI\Fixers\MissingSinceTagFixer',
            'Jankx\CLI\Fixers\UnsanitizedInputFixer'
        ];

        foreach ($fixers as $fixer) {
            $reflection = new \ReflectionClass($fixer);
            $this->assertTrue($reflection->implementsInterface('Jankx\CLI\Fixers\IssueFixerInterface'),
                "Fixer {$fixer} does not implement IssueFixerInterface");
        }
    }

    /**
     * Test all fixers have required methods
     */
    public function testAllFixersHaveRequiredMethods()
    {
        $fixers = [
            'Jankx\CLI\Fixers\ImproperExitFixer',
            'Jankx\CLI\Fixers\MissingSinceTagFixer',
            'Jankx\CLI\Fixers\UnsanitizedInputFixer'
        ];

        foreach ($fixers as $fixer) {
            $reflection = new \ReflectionClass($fixer);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('fix', $methodNames,
                "Fixer {$fixer} missing fix method");
            $this->assertContains('getFixerName', $methodNames,
                "Fixer {$fixer} missing getFixerName method");
        }
    }
}