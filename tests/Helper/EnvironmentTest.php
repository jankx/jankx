<?php

namespace Tests\Helper;

use PHPUnit\Framework\TestCase;
use Jankx\Helper\Environment;

class EnvironmentTest extends TestCase
{
        public function testEnvironmentCanDetectDebugMode()
    {
        // Test with WP_DEBUG defined
        if (!defined('WP_DEBUG')) {
            define('WP_DEBUG', true);
        }

        $this->assertTrue(Environment::isDebugLog());
    }

    public function testEnvironmentCanDetectWpCliMode()
    {
        // Test with WP_CLI defined
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
        }

        $this->assertTrue(Environment::isWpCli());
    }

    public function testEnvironmentCanDetectWpCronMode()
    {
        // Test with DOING_CRON defined
        if (!defined('DOING_CRON')) {
            define('DOING_CRON', true);
        }

        $this->assertTrue(Environment::isWpCron());
    }

    public function testEnvironmentCanDetectAdminMode()
    {
        // Mock is_admin function trả về true
        if (!function_exists('is_admin')) {
            function is_admin() {
                return true;
            }
        }
        $this->assertTrue(\Jankx\Helper\Environment::isAdmin());
    }

    public function testEnvironmentCanDetectFrontendMode()
    {
        // Mock is_admin function to return false for frontend test
        if (function_exists('is_admin')) {
            // Temporarily override the function
            $GLOBALS['mock_is_admin'] = false;
            function is_admin() {
                return $GLOBALS['mock_is_admin'] ?? true;
            }
        } else {
            function is_admin() {
                return $GLOBALS['mock_is_admin'] ?? true;
            }
        }

        $GLOBALS['mock_is_admin'] = false;
        $this->assertTrue(\Jankx\Helper\Environment::isFrontend());
    }

    public function testEnvironmentCanDetectDevelopmentMode()
    {
        // Test with WP_DEBUG defined
        if (!defined('WP_DEBUG')) {
            define('WP_DEBUG', true);
        }

        $this->assertTrue(Environment::isDevelopment());
    }

    public function testEnvironmentCanDetectProductionMode()
    {
        // Test with WP_DEBUG false
        if (defined('WP_DEBUG')) {
            $originalDebug = WP_DEBUG;
        }

        // Temporarily undefine WP_DEBUG to test production mode
        if (defined('WP_DEBUG')) {
            $this->assertFalse(Environment::isProduction());
        } else {
            $this->assertTrue(Environment::isProduction());
        }
    }
}