<?php

namespace Tests\Admin;

use PHPUnit\Framework\TestCase;

/**
 * Test Admin Dashboard
 *
 * @package Tests\Admin
 * @since 2.0.0
 */
class DashboardTest extends TestCase
{
    /**
     * Test dashboard exists
     */
    public function testDashboardExists()
    {
        $this->assertTrue(class_exists('Jankx\Admin\Dashboard'));
    }

    /**
     * Test dashboard has required methods
     */
    public function testDashboardHasRequiredMethods()
    {
        $this->assertTrue(method_exists('Jankx\Admin\Dashboard', 'initialize'));
        $this->assertTrue(method_exists('Jankx\Admin\Dashboard', 'registerHooks'));
    }

    /**
     * Test dashboard functionality
     */
    public function testDashboardFunctionality()
    {
        $this->assertTrue(class_exists('Jankx\Admin\Dashboard'));
        $this->assertTrue(method_exists('Jankx\Admin\Dashboard', 'addMenuPages'));
    }
}