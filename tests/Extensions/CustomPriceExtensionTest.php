<?php

namespace Tests\Extensions;

use PHPUnit\Framework\TestCase;
use Jankx\Extensions\CustomPriceExtension;
use Brain\Monkey;

class CustomPriceExtensionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function test_register_hooks_adds_init_action()
    {
        $extension = new CustomPriceExtension();

        Monkey\Functions\expect('add_action')
            ->atLeast()->once()
            ->with('init', [$extension, 'registerBlock']);

        $extension->register_hooks();
        $this->assertTrue(true);
    }

    public function test_register_block_calls_register_block_type()
    {
        $extension = $this->getMockBuilder(CustomPriceExtension::class)
            ->onlyMethods(['get_extension_path'])
            ->getMock();
        
        $extension->method('get_extension_path')->willReturn('/mock/path');

        Monkey\Functions\expect('register_block_type')
            ->once()
            ->with('/mock/path/block');

        $extension->registerBlock();
        $this->assertTrue(true);
    }
}
