<?php

use PHPUnit\Framework\TestCase;

/**
 * Standalone test that doesn't depend on the framework
 */
class StandaloneTest extends TestCase
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

    public function testObjectCreation()
    {
        $object = new stdClass();
        $object->property = 'value';
        $this->assertEquals('value', $object->property);
    }

    public function testExceptionHandling()
    {
        $this->expectException(Exception::class);
        throw new Exception('Test exception');
    }

    public function testArrayAccess()
    {
        $array = ['key' => 'value'];
        $this->assertArrayHasKey('key', $array);
        $this->assertEquals('value', $array['key']);
    }
}