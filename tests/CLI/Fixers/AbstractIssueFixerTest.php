<?php

namespace Tests\CLI\Fixers;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Fixers\IssueFixerInterface;

/**
 * Test AbstractIssueFixer
 *
 * @package Tests\CLI\Fixers
 * @since 2.0.0
 */
class AbstractIssueFixerTest extends TestCase
{
    /**
     * Test issue fixer interface exists
     */
    public function testIssueFixerInterfaceExists()
    {
        $this->assertTrue(interface_exists('Jankx\CLI\Fixers\IssueFixerInterface'));
    }

    /**
     * Test interface has required methods
     */
    public function testInterfaceHasRequiredMethods()
    {
        $reflection = new \ReflectionClass('Jankx\CLI\Fixers\IssueFixerInterface');
        $methods = $reflection->getMethods();

        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('fix', $methodNames);
        $this->assertContains('canFix', $methodNames);
        $this->assertContains('getFixType', $methodNames);
    }

    /**
     * Test concrete fixers exist
     */
    public function testConcreteFixersExist()
    {
        $fixers = [
            'Jankx\CLI\Fixers\ImproperExitFixer',
            'Jankx\CLI\Fixers\MissingSinceTagFixer',
            'Jankx\CLI\Fixers\UnsanitizedInputFixer',
            'Jankx\CLI\Fixers\ABSPATHCheckFixer'
        ];

        foreach ($fixers as $fixer) {
            $this->assertTrue(class_exists($fixer), "Fixer {$fixer} does not exist");
        }
    }

    /**
     * Test concrete fixers implement interface
     */
    public function testConcreteFixersImplementInterface()
    {
        $fixers = [
            'Jankx\CLI\Fixers\ImproperExitFixer',
            'Jankx\CLI\Fixers\MissingSinceTagFixer',
            'Jankx\CLI\Fixers\UnsanitizedInputFixer',
            'Jankx\CLI\Fixers\ABSPATHCheckFixer'
        ];

        foreach ($fixers as $fixer) {
            $reflection = new \ReflectionClass($fixer);
            $this->assertTrue($reflection->implementsInterface('Jankx\CLI\Fixers\IssueFixerInterface'),
                "Fixer {$fixer} does not implement IssueFixerInterface");
        }
    }
}