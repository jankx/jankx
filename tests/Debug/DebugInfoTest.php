<?php

namespace Tests\Debug;

use PHPUnit\Framework\TestCase;

/**
 * Test DebugInfo
 *
 * @package Tests\Debug
 * @since 2.0.0
 */
class DebugInfoTest extends TestCase
{
    /**
     * Test debug info exists
     */
    public function testDebugInfoExists()
    {
        $this->assertTrue(class_exists('Jankx\Debug\DebugInfo'));
    }

    /**
     * Test debug info has required methods
     */
    public function testDebugInfoHasRequiredMethods()
    {
        $this->assertTrue(method_exists('Jankx\Debug\DebugInfo', 'getSystemInfo'));
        $this->assertTrue(method_exists('Jankx\Debug\DebugInfo', 'getFrameworkInfo'));
        $this->assertTrue(method_exists('Jankx\Debug\DebugInfo', 'getWordPressInfo'));
    }

    /**
     * Test debug info functionality
     */
    public function testDebugInfoFunctionality()
    {
        $this->assertTrue(class_exists('Jankx\Debug\DebugInfo'));
        $this->assertTrue(method_exists('Jankx\Debug\DebugInfo', 'getPerformanceInfo'));
    }
}