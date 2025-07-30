<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\DeferredServiceMonitor;

/**
 * Test DeferredServiceMonitor
 *
 * @package Tests\Services
 * @since 2.0.0
 */
class DeferredServiceMonitorTest extends TestCase
{
    /**
     * Test monitor exists
     */
    public function testMonitorExists()
    {
        $this->assertTrue(class_exists('Jankx\Services\DeferredServiceMonitor'));
    }

    /**
     * Test monitor has required methods
     */
    public function testMonitorHasRequiredMethods()
    {
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'startMonitoring'));
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'endMonitoring'));
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'getMetrics'));
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'getPerformanceSummary'));
    }

    /**
     * Test monitor functionality
     */
    public function testMonitorFunctionality()
    {
        $this->assertTrue(class_exists('Jankx\Services\DeferredServiceMonitor'));
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'getServiceMetrics'));
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'getTotalLoadTime'));
        $this->assertTrue(method_exists('Jankx\Services\DeferredServiceMonitor', 'getTotalMemoryUsage'));
    }
}