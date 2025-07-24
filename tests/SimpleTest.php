<?php

namespace Tests;

use PHPUnit\Framework\TestCase;

/**
 * Simple test to verify PHPUnit is working
 */
class SimpleTest extends TestCase
{
    public function testBasicAssertion()
    {
        $this->assertTrue(true);
    }

    public function testStringComparison()
    {
        $this->assertEquals('test', 'test');
    }

    public function testArrayOperations()
    {
        $array = [1, 2, 3];
        $this->assertCount(3, $array);
        $this->assertContains(2, $array);
    }

    public function testMathOperations()
    {
        $this->assertEquals(4, 2 + 2);
        $this->assertEquals(6, 2 * 3);
    }
}