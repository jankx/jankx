<?php

namespace Tests;

use PHPUnit\Framework\TestCase as PHPUnitTestCase;

class SimpleTestCaseTest extends PHPUnitTestCase
{
    public function testBasic()
    {
        $this->assertTrue(true);
    }
}