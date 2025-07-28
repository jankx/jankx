<?php

namespace Tests\CLI\Checkers;

use PHPUnit\Framework\TestCase;
use Jankx\CLI\Checkers\AbstractIssueChecker;

/**
 * Test AbstractIssueChecker
 *
 * @package Tests\CLI\Checkers
 * @since 2.0.0
 */
class AbstractIssueCheckerTest extends TestCase
{
    /**
     * Test abstract checker exists
     */
    public function testAbstractCheckerExists()
    {
        $this->assertTrue(class_exists('Jankx\CLI\Checkers\AbstractIssueChecker'));
    }

    /**
     * Test abstract checker implements interface
     */
    public function testAbstractCheckerImplementsInterface()
    {
        $this->assertTrue(interface_exists('Jankx\CLI\Checkers\IssueCheckerInterface'));
    }

    /**
     * Test abstract checker has required methods
     */
    public function testAbstractCheckerHasRequiredMethods()
    {
        $reflection = new \ReflectionClass('Jankx\CLI\Checkers\AbstractIssueChecker');
        $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('check', $methodNames);
        $this->assertContains('__construct', $methodNames);
    }

    /**
     * Test abstract checker is abstract
     */
    public function testAbstractCheckerIsAbstract()
    {
        $reflection = new \ReflectionClass('Jankx\CLI\Checkers\AbstractIssueChecker');
        $this->assertTrue($reflection->isAbstract());
    }
}