<?php

namespace Tests\Admin\Handlers;

use Jankx\Admin\Handlers\FormHandler;
use Jankx\Foundation\Application;
use Jankx\Facades\Facade;
use Tests\Helpers\TestCase;
use Mockery;

class FormHandlerTest extends TestCase
{
    protected $app;
    protected $formHandler;
    protected $originalServer;
    protected $originalPost;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();

        // Set facade root for Log and other facades to work
        Facade::setFacadeApplication($this->app);

        $this->formHandler = new FormHandler($this->app);

        // Backup original superglobals
        $this->originalServer = $_SERVER;
        $this->originalPost = $_POST;

        // Reset admin notices global
        $GLOBALS['admin_notices'] = [];
        $GLOBALS['mock_actions'] = [];
        $GLOBALS['actions'] = [];
        $GLOBALS['mock_wp_verify_nonce'] = false;
        $GLOBALS['mock_current_user_can'] = false;
    }

    protected function tearDown(): void
    {
        // Restore superglobals
        $_SERVER = $this->originalServer;
        $_POST = $this->originalPost;

        parent::tearDown();
    }

    public function testConstructorSetsApplication()
    {
        $reflection = new \ReflectionClass($this->formHandler);
        $appProperty = $reflection->getProperty('app');
        $appProperty->setAccessible(true);

        $this->assertSame($this->app, $appProperty->getValue($this->formHandler));
    }

    public function testHandleRequestsReturnsEarlyWhenNotPostRequest()
    {
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $_POST = [];

        // Should return early without error
        $this->formHandler->handleRequests();

        // No assertions needed - just verifying no exception is thrown
        $this->assertTrue(true);
    }

    public function testHandleRequestsReturnsEarlyWhenNoJankxAction()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = ['other_field' => 'value'];

        // Should return early without error
        $this->formHandler->handleRequests();

        $this->assertTrue(true);
    }

    public function testHandleRequestsCallsActionHandlerForSaveImageSizes()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'save_image_sizes',
            'jankx_utilities_nonce' => 'valid_nonce',
            'enabled_sizes' => ['thumbnail', 'medium', 'large']
        ];

        // Mock wp_verify_nonce to return true
        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        try {
            $this->formHandler->handleRequests();
        } catch (\Exception $e) {
            $this->fail('Exception thrown: ' . $e->getMessage());
        }

        // Verify admin notice callback was added and works
        $this->assertNotEmpty($GLOBALS['admin_notices'] ?? [], 'admin_notices array should not be empty');
        // Execute the callback to verify it produces output
        $callback = $GLOBALS['admin_notices'][0];
        $output = $this->captureCallbackOutput($callback);
        $this->assertStringContainsString('Image size settings saved', $output);
    }

    public function testHandleRequestsCallsActionHandlerForClearDebugLog()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'clear_debug_log',
            'jankx_debug_nonce' => 'valid_nonce'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        $this->formHandler->handleRequests();

        $this->assertNotEmpty($GLOBALS['admin_notices'] ?? []);
        $callback = $GLOBALS['admin_notices'][0];
        $output = $this->captureCallbackOutput($callback);
        $this->assertStringContainsString('Debug log cleared', $output);
    }

    public function testHandleRequestsCallsActionHandlerForClearImageCache()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'clear_image_cache',
            'jankx_utilities_nonce' => 'valid_nonce'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        // Mock wpdb
        global $wpdb;
        $queryCalled = false;
        $wpdb = new class($queryCalled) {
            public $options = 'wp_options';
            private $queryCalledRef;
            
            public function __construct(&$queryCalled) {
                $this->queryCalledRef = &$queryCalled;
            }
            
            public function query($sql) {
                if (strpos($sql, 'DELETE FROM') !== false) {
                    $this->queryCalledRef = true;
                }
            }
        };

        $this->formHandler->handleRequests();

        $this->assertTrue($queryCalled, 'wpdb->query should be called to delete transients');

        $this->assertNotEmpty($GLOBALS['admin_notices'] ?? []);
        $callback = end($GLOBALS['admin_notices']);
        $output = $this->captureCallbackOutput($callback);
        $this->assertStringContainsString('cleared successfully', $output);
    }

    public function testHandleRequestsCallsActionHandlerForExportSettings()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'export_settings',
            'jankx_utilities_nonce' => 'valid_nonce'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        global $wpdb;
        $wpdb = new class {
            public $options = 'wp_options';
            public function get_results($sql) {
                $obj1 = new \stdClass();
                $obj1->option_name = 'jankx_setting1';
                $obj1->option_value = 'value1';
                
                $obj2 = new \stdClass();
                $obj2->option_name = 'jankx_setting2';
                $obj2->option_value = serialize(['arr' => 1]);
                return [$obj1, $obj2];
            }
        };

        // Use partial mock to prevent exit
        $formHandlerMock = $this->getMockBuilder(\Jankx\Admin\Handlers\FormHandler::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['terminate', 'setHeader'])
            ->getMock();

        // Capture output
        ob_start();
        $formHandlerMock->handleRequests();
        $output = ob_get_clean();

        $this->assertStringContainsString('"jankx_setting1":"value1"', $output);
        $this->assertStringContainsString('"jankx_setting2":{"arr":1}', $output);
    }

    public function testHandleRequestsCallsActionHandlerForActivateLicense()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'activate_license',
            'jankx_license_nonce' => 'valid_nonce',
            'license_key' => 'test-key',
            'email' => 'test@example.com'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        // Mock license service
        $mockLicenseService = Mockery::mock('LicenseService');
        $mockLicenseService->shouldReceive('verify')
            ->with('test-key', 'test@example.com')
            ->andReturn(['success' => true, 'message' => 'Activated']);

        $this->app->instance('license', $mockLicenseService);

        $this->formHandler->handleRequests();

        $this->assertNotEmpty($GLOBALS['admin_notices'] ?? []);
        $callback = $GLOBALS['admin_notices'][0];
        $output = $this->captureCallbackOutput($callback);
        $this->assertStringContainsString('success', $output);
    }

    public function testHandleRequestsCallsActionHandlerForDeactivateLicense()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'deactivate_license',
            'jankx_license_nonce' => 'valid_nonce'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        $mockLicenseService = Mockery::mock('LicenseService');
        $mockLicenseService->shouldReceive('deactivate')->andReturn(true);

        $this->app->instance('license', $mockLicenseService);

        $this->formHandler->handleRequests();

        $this->assertNotEmpty($GLOBALS['admin_notices'] ?? []);
        $callback = $GLOBALS['admin_notices'][0];
        $output = $this->captureCallbackOutput($callback);
        $this->assertStringContainsString('License deactivated', $output);
    }

    public function testHandleRequestsCallsActionHandlerForDisconnectMembership()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'disconnect_membership',
            'jankx_membership_nonce' => 'valid_nonce'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        $mockMembershipService = Mockery::mock('MembershipService');
        $mockMembershipService->shouldReceive('disconnect')->once();

        $this->app->instance('membership', $mockMembershipService);

        $this->formHandler->handleRequests();

        $this->assertNotEmpty($GLOBALS['admin_notices'] ?? []);
        $callback = $GLOBALS['admin_notices'][0];
        $output = $this->captureCallbackOutput($callback);
        $this->assertStringContainsString('Membership disconnected', $output);
    }

    public function testHandleRequestsTriggersCustomActionForUnknownAction()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'custom_action',
            'custom_data' => 'value'
        ];

        $actionTriggered = false;
        $GLOBALS['mock_actions']['jankx/admin/handle_action/custom_action'] = function() use (&$actionTriggered) {
            $actionTriggered = true;
        };

        $this->formHandler->handleRequests();

        $this->assertTrue($actionTriggered);
    }

    public function testHandleActivateLicenseFailsWithInvalidNonce()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'activate_license',
            'jankx_license_nonce' => 'invalid_nonce',
            'license_key' => 'test-key'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = false;

        $this->expectException(\Exception::class);
        // Exception is caught and re-thrown with generic message
        $this->expectExceptionMessage('An error occurred');

        $this->formHandler->handleRequests();
    }

    public function testHandleActivateLicenseFailsWithoutPermission()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'activate_license',
            'jankx_license_nonce' => 'valid_nonce',
            'license_key' => 'test-key'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = false;

        $this->expectException(\Exception::class);
        // Exception is caught and re-thrown with generic message
        $this->expectExceptionMessage('An error occurred');

        $this->formHandler->handleRequests();
    }

    /**
     * Helper to capture output from a callback
     */
    protected function captureCallbackOutput(callable $callback): string
    {
        ob_start();
        $callback();
        return ob_get_clean();
    }

    public function testSanitizeRequestDataSanitizesStringValues()
    {
        $reflection = new \ReflectionClass($this->formHandler);
        $method = $reflection->getMethod('sanitizeRequestData');
        $method->setAccessible(true);

        $input = [
            'string_field' => '<script>alert("xss")</script>',
            'nested' => [
                'nested_string' => '  test value  '
            ]
        ];

        $result = $method->invoke($this->formHandler, $input);

        // Should be sanitized (script tags removed, trimmed)
        $this->assertStringNotContainsString('<script>', $result['string_field']);
        $this->assertEquals('test value', $result['nested']['nested_string']);
    }

    public function testHandleSaveImageSizesFailsWithInvalidNonce()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'save_image_sizes',
            'jankx_utilities_nonce' => 'invalid_nonce',
            'enabled_sizes' => ['thumbnail']
        ];

        $GLOBALS['mock_wp_verify_nonce'] = false;

        $this->expectException(\Exception::class);
        // Exception is caught and re-thrown with generic message
        $this->expectExceptionMessage('An error occurred');

        $this->formHandler->handleRequests();
    }

    public function testHandleClearDebugLogFailsWithInvalidNonce()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'clear_debug_log',
            'jankx_debug_nonce' => 'invalid_nonce'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = false;

        $this->expectException(\Exception::class);
        // Exception is caught and re-thrown with generic message
        $this->expectExceptionMessage('An error occurred');

        $this->formHandler->handleRequests();
    }

    public function testHandleBulkExtensions()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'bulk_extensions',
            'jankx_bulk_nonce' => 'valid_nonce',
            'action' => 'activate-selected',
            'checked' => ['extension-1', 'extension-2']
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        // Mock extension service
        $mockExtensionService = Mockery::mock('ExtensionService');
        $mockExtensionService->shouldReceive('enableExtension')->twice()->andReturn(true);

        $this->app->instance('extension.service', $mockExtensionService);

        // Mock terminate and redirect
        $formHandlerMock = $this->getMockBuilder(\Jankx\Admin\Handlers\FormHandler::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['terminate', 'terminateWithRedirect'])
            ->getMock();

        $formHandlerMock->expects($this->once())
            ->method('terminateWithRedirect')
            ->with(2, 0, 'activate-selected');

        $formHandlerMock->handleRequests();
    }

    public function testHandleRequestsCatchesExceptions()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [
            'jankx_action' => 'activate_license',
            'jankx_license_nonce' => 'valid_nonce',
            'license_key' => 'test-key'
        ];

        $GLOBALS['mock_wp_verify_nonce'] = true;
        $GLOBALS['mock_current_user_can'] = true;

        // Mock license service to throw exception
        $mockLicenseService = Mockery::mock('LicenseService');
        $mockLicenseService->shouldReceive('verify')
            ->andThrow(new \Exception('Service unavailable'));

        $this->app->instance('license', $mockLicenseService);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('An error occurred');

        $this->formHandler->handleRequests();
    }
}
