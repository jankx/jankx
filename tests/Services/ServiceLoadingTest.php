<?php

namespace Tests\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;
use PHPUnit\Framework\TestCase;

class ServiceLoadingTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testServiceInitializesImmediatelyIfGlobalScope()
    {
        $service = new class ($this->app) extends AbstractService {
            public $booted = false;
            protected $scopes = ['global'];
            protected function boot(): void {
                $this->booted = true;
            }
        };

        $service->initialize();
        $this->assertTrue($service->isInitialized());
        $this->assertTrue($service->booted);
    }

    public function testServiceDoesNotInitializeIfShouldLoadReturnsFalse()
    {
        $service = new class ($this->app) extends AbstractService {
            public $booted = false;
            public function shouldLoad(): bool {
                return false;
            }
            protected function boot(): void {
                $this->booted = true;
            }
        };

        $service->initialize();
        $this->assertFalse($service->isInitialized());
        $this->assertFalse($service->booted);
    }

    public function testServiceDoesNotInitializeIfContextDoesNotMatchScope()
    {
        $service = new class ($this->app) extends AbstractService {
            public $booted = false;
            protected $scopes = ['frontend'];
            protected function boot(): void {
                $this->booted = true;
            }
            // Mock context as something else
            protected function getLoadingContext(): string {
                return 'admin';
            }
        };

        $service->initialize();
        $this->assertFalse($service->isInitialized());
        $this->assertFalse($service->booted);
    }

    public function testServiceSchedulesBootIfContextIsFrontendButNotWpParsed()
    {
        $service = new class ($this->app) extends AbstractService {
            public $booted = false;
            protected $scopes = ['frontend'];
            protected function boot(): void {
                $this->booted = true;
            }
            protected function getLoadingContext(): string {
                return 'frontend';
            }
            // Override registerContextBootHook to avoid add_action in test
            protected function registerContextBootHook(string $context): void {
                $this->bootScheduled = true;
            }
        };

        // Mock did_action('wp') to return 0
        if (!function_exists('did_action')) {
            function did_action($tag) { return 0; }
        }

        $service->initialize();
        $this->assertFalse($service->isInitialized());
        $this->assertFalse($service->booted);
        $this->assertTrue($service->isBootScheduled());
    }

    protected function tearDown(): void
    {
        if (class_exists('Brain\Monkey')) {
            \Brain\Monkey\tearDown();
        }
    }

    public function testServiceBootsImmediatelyIfContextMatchAndHookAlreadyPassed()
    {
        if (!class_exists('Brain\Monkey')) {
            $this->markTestSkipped('Brain Monkey is required for this test.');
        }
        \Brain\Monkey\setUp();

        \Brain\Monkey\Functions\expect('did_action')
            ->with('wp')
            ->andReturn(1);

        $service = new class ($this->app) extends AbstractService {
            public $booted = false;
            protected $scopes = ['frontend'];
            protected function boot(): void {
                $this->booted = true;
            }
            protected function getLoadingContext(): string {
                return 'frontend';
            }
        };

        $service->initialize();
        $this->assertTrue($service->isInitialized());
        $this->assertTrue($service->booted);
    }
}
