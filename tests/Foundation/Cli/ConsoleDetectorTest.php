<?php

namespace Tests\Foundation\Cli;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Cli\ConsoleDetector;
use ReflectionClass;

class ConsoleDetectorTest extends TestCase
{
    public function testConsoleDetectorCanBeInstantiated()
    {
        $detector = new ConsoleDetector();
        $this->assertInstanceOf(ConsoleDetector::class, $detector);
    }

    public function testConsoleDetectorCanDetectWpCli()
    {
        // Test with WP_CLI defined
        if (!defined('WP_CLI')) {
            define('WP_CLI', true);
        }

        $reflection = new ReflectionClass(ConsoleDetector::class);
        $method = $reflection->getMethod('isWpCli');
        $method->setAccessible(true);

        $result = $method->invoke(null, []);
        $this->assertTrue($result);
    }

    public function testConsoleDetectorCanDetectWpCron()
    {
        // Test with DOING_CRON defined
        if (!defined('DOING_CRON')) {
            define('DOING_CRON', true);
        }

        $reflection = new ReflectionClass(ConsoleDetector::class);
        $method = $reflection->getMethod('isWpCron');
        $method->setAccessible(true);

        $result = $method->invoke(null, []);
        $this->assertTrue($result);
    }

    public function testConsoleDetectorCanDetect()
    {
        $result = ConsoleDetector::detect([]);
        $this->assertIsString($result);
    }
}
