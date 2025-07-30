<?php

require_once __DIR__ . '/../vendor/autoload.php';

use PHPUnit\Framework\TestCase;
use Brain\Monkey\Functions;

class BrainMonkeyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testBasic()
    {
        $this->assertTrue(true);
    }
}