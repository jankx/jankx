<?php

namespace Tests;

require_once __DIR__ . '/../vendor/autoload.php';

use Tests\TestCase;

class TestCaseTest extends TestCase
{
    public function testBasic()
    {
        $this->assertTrue(true);
    }
}